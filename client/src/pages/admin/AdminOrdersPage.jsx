import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = () => {
    setLoading(true);
    api.adminOrders(filter ? { status: filter } : {})
      .then((data) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  };

  const getStatusColor = (status) => {
    const colors = {
      pickup_scheduled: 'bg-blue-100 text-blue-700',
      picked_up: 'bg-purple-100 text-purple-700',
      cleaning_started: 'bg-amber-100 text-amber-700',
      quality_check: 'bg-orange-100 text-orange-700',
      out_for_delivery: 'bg-teal-100 text-teal-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Orders</h1>

      <div className="mb-4 flex gap-2">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-4 py-2 focus:border-brand-500 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="pickup_scheduled">Pickup Scheduled</option>
          <option value="picked_up">Picked Up</option>
          <option value="cleaning_started">Cleaning</option>
          <option value="quality_check">Quality Check</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Order</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Cleaner</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium">#{order.orderNumber}</td>
                  <td className="px-4 py-3">{order.customer?.name}</td>
                  <td className="px-4 py-3">{order.cleaner?.shopName}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">₹{order.total}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="px-4 py-8 text-center text-slate-500">No orders found</p>
          )}
        </div>
      )}
    </div>
  );
}
