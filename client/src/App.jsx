import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import PartnerLayout from './components/PartnerLayout';
import DeliveryLayout from './components/DeliveryLayout';
import AdminLayout from './components/AdminLayout';
import { useAuth } from './context/AuthContext';
import CheckoutPage from './pages/CheckoutPage';
import CleanersPage from './pages/CleanersPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import OrdersPage from './pages/OrdersPage';
import SchedulePage from './pages/SchedulePage';
import SelectItemsPage from './pages/SelectItemsPage';
import PartnerDashboardPage from './pages/partner/PartnerDashboardPage';
import PartnerEarningsPage from './pages/partner/PartnerEarningsPage';
import PartnerLoginPage from './pages/partner/PartnerLoginPage';
import PartnerOrderDetailPage from './pages/partner/PartnerOrderDetailPage';
import PartnerOrdersPage from './pages/partner/PartnerOrdersPage';
import PartnerPricesPage from './pages/partner/PartnerPricesPage';
import PartnerRegisterPage from './pages/partner/PartnerRegisterPage';
import DeliveryRegisterPage from './pages/delivery/DeliveryRegisterPage';
import DeliveryLoginPage from './pages/delivery/DeliveryLoginPage';
import DeliveryDashboardPage from './pages/delivery/DeliveryDashboardPage';
import DeliveryDeliveriesPage from './pages/delivery/DeliveryDeliveriesPage';
import DeliveryEarningsPage from './pages/delivery/DeliveryEarningsPage';
import DeliveryProfilePage from './pages/delivery/DeliveryProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCleanersPage from './pages/admin/AdminCleanersPage';
import AdminDeliveryPartnersPage from './pages/admin/AdminDeliveryPartnersPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PartnerRoute({ children }) {
  const { isAuthenticated, isCleaner, loading } = useAuth();
  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (!isAuthenticated) return <Navigate to="/partner/login" replace />;
  if (!isCleaner) return <Navigate to="/" replace />;
  return children;
}

function DeliveryRoute({ children }) {
  const { isAuthenticated, isDelivery, loading } = useAuth();
  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (!isAuthenticated) return <Navigate to="/delivery/login" replace />;
  if (!isDelivery) return <Navigate to="/" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/partner/register"
        element={
          <Layout>
            <PartnerRegisterPage />
          </Layout>
        }
      />
      <Route
        path="/partner/login"
        element={
          <Layout>
            <PartnerLoginPage />
          </Layout>
        }
      />

      <Route
        path="/partner"
        element={
          <PartnerRoute>
            <PartnerLayout />
          </PartnerRoute>
        }
      >
        <Route index element={<PartnerDashboardPage />} />
        <Route path="orders" element={<PartnerOrdersPage />} />
        <Route path="orders/:id" element={<PartnerOrderDetailPage />} />
        <Route path="prices" element={<PartnerPricesPage />} />
        <Route path="earnings" element={<PartnerEarningsPage />} />
      </Route>

      <Route
        path="/delivery/register"
        element={
          <Layout>
            <DeliveryRegisterPage />
          </Layout>
        }
      />
      <Route
        path="/delivery/login"
        element={
          <Layout>
            <DeliveryLoginPage />
          </Layout>
        }
      />

      <Route
        path="/delivery"
        element={
          <DeliveryRoute>
            <DeliveryLayout />
          </DeliveryRoute>
        }
      >
        <Route index element={<DeliveryDashboardPage />} />
        <Route path="deliveries" element={<DeliveryDeliveriesPage />} />
        <Route path="earnings" element={<DeliveryEarningsPage />} />
        <Route path="profile" element={<DeliveryProfilePage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="cleaners" element={<AdminCleanersPage />} />
        <Route path="delivery-partners" element={<AdminDeliveryPartnersPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
      </Route>

      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services/:categoryId" element={<SelectItemsPage />} />
              <Route path="/cleaners" element={<CleanersPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderTrackingPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}
