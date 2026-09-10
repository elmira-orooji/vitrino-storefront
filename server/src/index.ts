import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import categoryRoutes from './routes/categories.js';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));

// Health check
app.get('/api/health', (c) => {
    return c.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '0.1.0',
    });
});

// Routes
app.route('/api/auth', authRoutes);
app.route('/api/products', productRoutes);
app.route('/api/categories', categoryRoutes);

// 404 handler
app.notFound((c) => {
    return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
    console.error('Unhandled error:', err);
    return c.json({ error: 'Internal Server Error' }, 500);
});

const port = parseInt(process.env.PORT || '3001', 10);

console.log(`🚀 Vitrino API server starting on http://localhost:${port}`);

serve({ fetch: app.fetch, port });
