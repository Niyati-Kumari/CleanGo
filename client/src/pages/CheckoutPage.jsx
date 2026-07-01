import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useBooking } from '../context/BookingContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    selectedCleaner,
    cart,
    pickupSlot,
    deliveryAddress,
    paymentMethod,
    reset,
  } = useBooking();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!selectedCleaner || !pickupSlot) {
    return (
      <div>
        <p className="text-slate-500">Incomplete booking details.</p>
        <button type="button" onClick={() => navigate('/')} className="text-brand-600">
          Start over
        </button>
      </div>
    );
  }

  async function placeOrder() {
    setLoading(true);
    setError('');

    try {
      const items = Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([itemId, quantity]) => ({ itemId, quantity }));

      const { order } = await api.createOrder({
        cleanerId: selectedCleaner._id,
        items,
        pickupSlot,
        deliveryAddress,
        paymentMethod,
      });

      reset();
      navigate(`/orders/${order._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Confirm your order</h1>

      <div className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-2 font-semibold">{selectedCleaner.shopName}</h2>
          <p className="text-sm text-slate-500">
            Pickup: {pickupSlot.date} · {pickupSlot.timeWindow}
          </p>
          <p className="text-sm text-slate-500">
            Deliver to: {deliveryAddress.line1}, {deliveryAddress.city} {deliveryAddress.pincode}
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 font-semibold">Items</h2>
          {Object.entries(cart)
            .filter(([, qty]) => qty > 0)
            .map(([itemId, qty]) => (
              <div key={itemId} className="flex justify-between py-1 text-sm">
                <span className="capitalize">{itemId.replace(/-/g, ' ')} × {qty}</span>
              </div>
            ))}
          <div className="mt-3 border-t border-slate-100 pt-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{selectedCleaner.quote.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>₹{selectedCleaner.deliveryFee}</span>
            </div>
            <div className="mt-2 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-brand-700">₹{selectedCleaner.quote.total}</span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm">
          <p>
            Payment: <strong>{paymentMethod === 'cod' ? 'Cash on delivery' : 'Online (demo)'}</strong>
          </p>
        </section>
      </div>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      <button
        type="button"
        disabled={loading}
        onClick={placeOrder}
        className="mt-6 w-full rounded-xl bg-brand-600 py-3 font-semibold text-white disabled:opacity-60 hover:bg-brand-700"
      >
        {loading ? 'Placing order…' : 'Place order'}
      </button>
    </div>
  );
}
