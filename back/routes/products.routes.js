import express from "express";
import {
  createProduct,
  getAllProducts,
  getFeaturedProducts,
  deleteProduct,
  getRecommendendProducts,
  getProductsByCategory,
  toggleFeaturedProduct,
} from "../controllers/products.controllers.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendendProducts);
router.post("/create_product", protectRoute, adminRoute, createProduct);
router.delete("/delete_product/:id", protectRoute, adminRoute, deleteProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);

export default router;
