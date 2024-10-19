import express from "express";
import {
	getAllProducts,
	getFeaturedProducts,
	createProduct,
	deleteProduct,
	getRecommendedProducts,
	getProductByCategory,
	toggleFeaturedProducts,
} from "../controllers/productsControllers.js";
import { adminRoute, protectRoutes } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/getAllProducts", protectRoutes, adminRoute, getAllProducts);

router.get("/featuredProducts", getFeaturedProducts);
router.get("/recommendedProducts", getRecommendedProducts);
router.get("/productsCategory/:category", getProductByCategory);

router.post("/createProduct", protectRoutes, adminRoute, createProduct);
router.delete("/deleteProduct/:id", protectRoutes, adminRoute, deleteProduct);
router.patch("/toggleFeaturedProducts/:id", protectRoutes, adminRoute, toggleFeaturedProducts);

export default router;
