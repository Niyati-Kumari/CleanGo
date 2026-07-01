import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function DeliveryDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAvailableDeliveries()
      .then(setDeliveries)
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = async (orderId) => {
    try {
      await api.acceptDelivery(orderId);
      window.location.reload();
    } catch (err) {
      alert(err.message || 'Failed to accept delivery');
    }
  };

  const handleUpdateStatus = async (orderId, status, otp) => {
    try {
      await api.updateDeliveryStatus(orderId, { status, otp });
      window.location.reload();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  if (loading) {
    return <p className="text-slate-500">Loading deliveries...</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Available Deliveries</h1>

      {deliveries.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-500">No deliveries available right now.</p>
          <p className="mt-2 text-sm text-slate-400">Check back later for new orders.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {deliveries.map((order) => (
            <div
              key={order._id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="font-semibold">Order #{order.orderNumber}</p>
                  <p className="text-sm text-slate-500">
                    {order.cleaner?.shopName} → {order.customer?.name}
                  </p>
                </div>
                <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700">
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="mb-4 text-sm text-slate-600">
                <p>📍 Pickup: {order.cleaner?.address?.line1}</p>
                <p>🏠 Delivery: {order.deliveryAddress?.line1}</p>
                <p>💰 Earning: ₹{Math.round(order.deliveryFee * 0.4)}</p>
              </div>

              {!order.assignedDeliveryPartner && (
                <button
                  type="button"
                  onClick={() => handleAccept(order._id)}
                  className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700"
                >
                  Accept Delivery
                </button>
              )}

              {order.assignedDeliveryPartner && (
                <div className="space-y-2">
                  {order.status === 'picked_up' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(order._id, 'cleaning_started')}
                      className="w-full rounded-xl bg-green-600 py-2 font-semibold text-white hover:bg-green-700"
                    >
                      Mark as Picked Up (at Cleaner)
                    </button>
                  )}
                  {order.status === 'quality_check' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(order._id, 'out_for_delivery')}
                      className="w-full rounded-xl bg-brand-600 py-2 font-semibold text-white hover:bg-brand-700"
                    >
                      Start Delivery
                    </button>
                  )}
                  {order.status === 'out_for_delivery' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Enter OTP from customer"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-brand-500 focus:outline-none"
                        id={`otp-${order._id}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const otp = document.getElementById(`otp-${order._id}`).value;
                          handleUpdateStatus(order._id, 'delivered', otp);
                        }}
                        className="w-full rounded-xl bg-green-600 py-2 font-semibold text-white hover:bg-green-700"
                      >
                        Complete Delivery (with OTP)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
