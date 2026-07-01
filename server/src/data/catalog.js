export const SERVICE_CATALOG = [
  {
    id: 'clothes',
    name: 'Clothes',
    icon: '👔',
    items: [
      { id: 'shirt', name: 'Shirt', basePrice: 80 },
      { id: 'pant', name: 'Pant', basePrice: 100 },
      { id: 'coat', name: 'Coat', basePrice: 300 },
      { id: 'suit', name: 'Suit', basePrice: 450 },
      { id: 'saree', name: 'Saree', basePrice: 200 },
      { id: 'kurta', name: 'Kurta', basePrice: 120 },
    ],
  },
  {
    id: 'shoes',
    name: 'Shoes',
    icon: '👟',
    items: [
      { id: 'sneakers', name: 'Sneakers', basePrice: 250 },
      { id: 'formal-shoes', name: 'Formal Shoes', basePrice: 300 },
      { id: 'boots', name: 'Boots', basePrice: 350 },
    ],
  },
  {
    id: 'bags',
    name: 'Bags',
    icon: '👜',
    items: [
      { id: 'handbag', name: 'Handbag', basePrice: 400 },
      { id: 'backpack', name: 'Backpack', basePrice: 350 },
    ],
  },
  {
    id: 'sofa',
    name: 'Sofa',
    icon: '🛋',
    items: [
      { id: 'sofa-2-seater', name: '2-Seater Sofa', basePrice: 1200 },
      { id: 'sofa-3-seater', name: '3-Seater Sofa', basePrice: 1800 },
    ],
  },
  {
    id: 'curtains',
    name: 'Curtains',
    icon: '🪟',
    items: [
      { id: 'curtain-panel', name: 'Curtain Panel', basePrice: 150 },
      { id: 'heavy-curtain', name: 'Heavy Curtain', basePrice: 250 },
    ],
  },
];

export const ORDER_STATUSES = [
  { key: 'pickup_scheduled', label: 'Pickup scheduled' },
  { key: 'picked_up', label: 'Clothes picked' },
  { key: 'cleaning_started', label: 'Cleaning started' },
  { key: 'quality_check', label: 'Quality check' },
  { key: 'out_for_delivery', label: 'Out for delivery' },
  { key: 'delivered', label: 'Delivered' },
];

export function findCatalogItem(itemId) {
  for (const category of SERVICE_CATALOG) {
    const item = category.items.find((i) => i.id === itemId);
    if (item) return { ...item, category: category.id, categoryName: category.name };
  }
  return null;
}

export function generateOrderNumber() {
  const ts = Date.now().toString().slice(-8);
  const rand = Math.floor(Math.random() * 900 + 100);
  return `CG${ts}${rand}`;
}
