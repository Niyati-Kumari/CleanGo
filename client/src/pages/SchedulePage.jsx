import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

const TIME_WINDOWS = ['10 AM - 12 PM', '12 PM - 2 PM', '4 PM - 6 PM', '6 PM - 8 PM'];

function nextDays(count = 5) {
  const days = [];
  for (let i = 0; i < count; i += 1) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      value: d.toISOString().slice(0, 10),
      label:
        i === 0
          ? 'Today'
          : i === 1
            ? 'Tomorrow'
            : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
    });
  }
  return days;
}

export default function SchedulePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    selectedCleaner,
    cart,
    setPickupSlot,
    setDeliveryAddress,
    deliveryAddress,
    setPaymentMethod,
    paymentMethod,
  } = useBooking();

  const days = useMemo(() => nextDays(), []);
  const [date, setDate] = useState(days[0].value);
  const [timeWindow, setTimeWindow] = useState(TIME_WINDOWS[3]);

  if (!selectedCleaner) {
    return (
      <div>
        <p className="text-slate-500">No cleaner selected.</p>
        <button type="button" onClick={() => navigate('/cleaners')} className="text-brand-600">
          Choose a cleaner
        </button>
      </div>
    );
  }

  function handleContinue() {
    setPickupSlot({ date, timeWindow });

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    navigate('/checkout');
  }

  return (
    <div>
      <button type="button" onClick={() => navigate(-1)} className="mb-4 text-sm text-brand-600">
        ← Back
      </button>

      <h1 className="mb-1 text-2xl font-bold">Schedule pickup</h1>
      <p className="mb-6 text-slate-500">{selectedCleaner.shopName}</p>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 font-semibold">Pickup date</h2>
        <div className="flex flex-wrap gap-2">
          {days.map((day) => (
            <button
              key={day.value}
              type="button"
              onClick={() => setDate(day.value)}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${
                date === day.value
                  ? 'bg-brand-600 text-white'
                  : 'border border-slate-200 bg-slate-50'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 font-semibold">Time window</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {TIME_WINDOWS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setTimeWindow(slot)}
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                timeWindow === slot
                  ? 'bg-brand-600 text-white'
                  : 'border border-slate-200 bg-slate-50'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 font-semibold">Delivery address</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="House / flat / street"
            value={deliveryAddress.line1}
            onChange={(e) => setDeliveryAddress({ line1: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="City"
              value={deliveryAddress.city}
              onChange={(e) => setDeliveryAddress({ city: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Pincode"
              value={deliveryAddress.pincode}
              onChange={(e) => setDeliveryAddress({ pincode: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 font-semibold">Payment</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { id: 'cod', label: 'Cash on delivery' },
            { id: 'online', label: 'Pay online (demo)' },
          ].map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setPaymentMethod(method.id)}
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                paymentMethod === method.id
                  ? 'bg-brand-600 text-white'
                  : 'border border-slate-200 bg-slate-50'
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm">
        <h2 className="mb-2 font-semibold">Order summary</h2>
        {Object.entries(cart)
          .filter(([, qty]) => qty > 0)
          .map(([itemId, qty]) => (
            <p key={itemId} className="text-slate-600">
              {itemId} × {qty}
            </p>
          ))}
        <p className="mt-2 font-bold text-brand-700">Total ₹{selectedCleaner.quote.total}</p>
      </section>

      <button
        type="button"
        onClick={handleContinue}
        className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700"
      >
        {isAuthenticated ? 'Review & place order' : 'Login to continue'}
      </button>
    </div>
  );
}
