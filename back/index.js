import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import productsRoutes from "./routes/products.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import couponsRoutes from "./routes/coupons.routes.js"
import analyticsRoutes from "./routes/analytics.routes.js"
import paymentRoutes from "./routes/payments.routes.js"
import { connectDB } from "./lib/db.js"
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from "cors"


// Load environment variables
dotenv.config();

const app = express();

// Middleware setup
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(morgan('combined'));

// CORS options
const allowedOrigins = [
  'http://localhost:5173',
  'https://pintech-enterprises.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH'
  ],
  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

// Enable CORS with specified options
app.use(cors(corsOptions));

// Explicitly set headers for every response
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Route declarations
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Server setup
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  connectDB();
  console.log(`http://localhost:${PORT}`);
});
