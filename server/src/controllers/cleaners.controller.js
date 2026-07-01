import Cleaner from '../models/Cleaner.js';
import { SERVICE_CATALOG, findCatalogItem } from '../data/catalog.js';

export function getCatalog(_req, res) {
  res.json({ catalog: SERVICE_CATALOG });
}

export async function listCleaners(req, res) {
  try {
    const { city = 'Delhi', items: itemsParam } = req.query;
    const itemIds = itemsParam ? itemsParam.split(',').filter(Boolean) : [];

    const cleaners = await Cleaner.find({ status: 'approved', 'address.city': city })
      .sort({ isFeatured: -1, rating: -1 })
      .lean();

    const enriched = cleaners.map((cleaner) => {
      let subtotal = 0;
      const pricedItems = itemIds.map((itemId) => {
        const catalogItem = findCatalogItem(itemId);
        if (!catalogItem) return null;

        const priceEntry = cleaner.prices.find((p) => p.itemId === itemId);
        const unitPrice = priceEntry?.price ?? catalogItem.basePrice;
        subtotal += unitPrice;
        return { itemId, name: catalogItem.name, unitPrice };
      }).filter(Boolean);

      return {
        ...cleaner,
        quote: {
          subtotal,
          deliveryFee: cleaner.deliveryFee,
          total: subtotal + cleaner.deliveryFee,
          items: pricedItems,
        },
      };
    });

    if (itemIds.length > 0) {
      enriched.sort((a, b) => a.quote.total - b.quote.total);
    }

    res.json({ cleaners: enriched });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getCleaner(req, res) {
  try {
    const cleaner = await Cleaner.findById(req.params.id);
    if (!cleaner || cleaner.status !== 'approved') {
      return res.status(404).json({ message: 'Cleaner not found' });
    }
    res.json({ cleaner });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
