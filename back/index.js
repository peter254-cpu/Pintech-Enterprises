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


dotenv.config()
const app = express()


app.use(express.json({limit: '50mb'}))
app.use(cookieParser());
app.use(morgan('combined'));

//DECLARATIONS 
const PORT= process.env.PORT || 5001

//local configurations
app.use("/api/auth", authRoutes)
app.use("/api/products", productsRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/coupons", couponsRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/analytics", analyticsRoutes)

app.listen(PORT, () => {
    connectDB()
    console.log(`http://localhost:${PORT}`)
})