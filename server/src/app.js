import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import cleanerRoutes from './routes/cleaners.routes.js';
import orderRoutes from './routes/orders.routes.js';
import partnerRoutes from './routes/partner.routes.js';
import deliveryRoutes from './routes/delivery.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'CleanGo API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/cleaners', cleanerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/admin', adminRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
