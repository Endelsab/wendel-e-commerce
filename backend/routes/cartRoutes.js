import express from "express";
import { protectRoutes } from "../middleware/auth.middleware.js";
import {
	getCartProducts,
	addToCart,
	removeAllFromCart,
	updateQuantity,
} from "../controllers/cartsControllers.js";

const router = express.Router();

router.post("/", protectRoutes, addToCart);

router.get("/", protectRoutes, getCartProducts);

router.delete("/", protectRoutes, removeAllFromCart);

router.put("/updateQuantity/:id", protectRoutes, updateQuantity);

export default router;
