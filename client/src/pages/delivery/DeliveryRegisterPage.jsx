import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';

export default function DeliveryRegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    vehicleType: 'bike',
    vehicleNumber: '',
    area: '',
    address: {
      line1: '',
      city: 'Delhi',
      pincode: '',
    },
    documents: {
      aadharNumber: '',
      drivingLicense: '',
      vehicleRC: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.registerDeliveryPartner(formData);
      navigate('/delivery/login', {
        state: { message: 'Registration submitted. Awaiting admin approval.' },
      });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <Link to="/" className="mb-4 inline-block text-sm text-brand-600">
        ← Back to home
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">Become a Delivery Partner</h1>
        <p className="mb-6 text-sm text-slate-500">
          Earn money delivering clothes for CleanGo
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Vehicle Type</label>
            <select
              value={formData.vehicleType}
              onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            >
              <option value="bike">Bike</option>
              <option value="scooter">Scooter</option>
              <option value="cycle">Cycle</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Vehicle Number</label>
            <input
              type="text"
              required
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Service Area</label>
            <input
              type="text"
              required
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              placeholder="e.g., South Delhi"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Address</label>
            <input
              type="text"
              required
              value={formData.address.line1}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, line1: e.target.value },
                })
              }
              placeholder="House / flat / street"
              className="mb-2 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
            <input
              type="text"
              value={formData.address.pincode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, pincode: e.target.value },
                })
              }
              placeholder="Pincode"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Aadhar Number</label>
            <input
              type="text"
              required
              value={formData.documents.aadharNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  documents: { ...formData.documents, aadharNumber: e.target.value },
                })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Driving License Number</label>
            <input
              type="text"
              required
              value={formData.documents.drivingLicense}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  documents: { ...formData.documents, drivingLicense: e.target.value },
                })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Vehicle RC Number</label>
            <input
              type="text"
              required
              value={formData.documents.vehicleRC}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  documents: { ...formData.documents, vehicleRC: e.target.value },
                })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-brand-700"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already a partner?{' '}
          <Link to="/delivery/login" className="text-brand-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
