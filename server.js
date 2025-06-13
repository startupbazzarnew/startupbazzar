import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import https from 'https';
import http from 'http';
import fs from 'fs';

console.log('Starting server...');

// Log environment variables (without sensitive data)
console.log('Environment check:', {
  hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
  hasSupabaseKey: !!process.env.VITE_SUPABASE_ANON_KEY,
  port: process.env.PORT || 8080
});

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

// Add CORS preflight handler
app.options('*', cors());

app.use(express.json());

// Initialize Supabase
let supabase;
try {
  supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  );
  console.log('Supabase initialized successfully');
} catch (error) {
  console.error('Failed to initialize Supabase:', error);
  process.exit(1);
}

// Root route
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.json({ message: 'Payment API is running' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check accessed');
  res.json({ 
    status: 'ok',
    services: {
      supabase: !!supabase
    }
  });
});

// Create order endpoint
app.post('/api/payment/create-order', async (req, res) => {
  console.log('Create order endpoint accessed');
  try {
    console.log('Received create order request:', req.body);
    const { amount, currency, receipt, notes } = req.body;

    if (!amount || !currency || !receipt || !notes) {
      console.log('Missing required fields:', { amount, currency, receipt, notes });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // TODO: Implement your preferred payment gateway integration here
    console.log('Creating order with amount:', amount);

    // For now, just return a mock order
    const order = {
      id: `order_${Date.now()}`,
      amount,
        currency,
        receipt,
      status: 'created',
      notes
    };

      console.log('Created order:', order);
    return res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ 
      error: 'Failed to create order',
      details: error.message || 'Unknown error occurred'
    });
  }
});

// Verify payment endpoint
app.post('/api/payment/verify', async (req, res) => {
  try {
    console.log('Received verify payment request:', req.body);
    const { paymentId, orderId, signature } = req.body;

    if (!paymentId || !orderId || !signature) {
      console.log('Missing required fields:', { paymentId, orderId, signature });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // TODO: Implement your preferred payment gateway verification here
    console.log('Verifying payment:', { paymentId, orderId, signature });

    // For now, just return success
    return res.json({ success: true });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ 
      error: 'Failed to verify payment',
      details: error.message || 'Unknown error occurred'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: err.message || 'An unexpected error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({ error: 'Not found' });
});

// Start HTTP server
const httpServer = http.createServer(app);
httpServer.listen(port, '0.0.0.0', () => {
  console.log(`HTTP Server running at http://localhost:${port}`);
  console.log('Server is ready to accept connections');
});

// Try to start HTTPS server if certificates exist
try {
  const httpsOptions = {
    key: fs.readFileSync('./.cert/key.pem'),
    cert: fs.readFileSync('./.cert/cert.pem')
  };

  const httpsServer = https.createServer(httpsOptions, app);
  httpsServer.listen(port + 1, '0.0.0.0', () => {
    console.log(`HTTPS Server running at https://localhost:${port + 1}`);
  });
} catch (error) {
  console.log('HTTPS server not started - certificates not found');
}

// Handle server shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
}); 