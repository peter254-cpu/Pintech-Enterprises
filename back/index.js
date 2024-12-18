import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import couponsRoutes from "./routes/coupons.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import paymentRoutes from "./routes/payments.routes.js";
import { connectDB } from "./lib/db.js";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from "cors";
import helmet from 'helmet';
import xssClean from 'xss-clean';

// Load environment variables
dotenv.config();

const app = express();

// Middleware setup
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Security middleware
app.use(helmet());
app.use(xssClean());

// CORS options
const allowedOrigins = [
  'http://localhost:5173',
  'https://pintech-enterprises.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // Handle preflight requests

// Route declarations
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Start server after DB connection
const startServer = async () => {
  try {
    await connectDB(); // Ensure DB connection
    app.listen(process.env.PORT || 5001, () => {
      console.log(`Server running at http://localhost:${process.env.PORT || 5001}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the process if DB connection fails
  }
};

startServer();
