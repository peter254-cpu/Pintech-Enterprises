import express from "express"
import { addToCart, getCartProducts, removeAllFromCart, updateQuanity } from "../controllers/cart.controllers.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()
router.post("/add-to-cart", protectRoute, addToCart)
router.get("/", protectRoute, getCartProducts)
router.delete("/delete-from-cart/:id", protectRoute, removeAllFromCart)
router.put("/update/:id", protectRoute, updateQuanity)


export default router