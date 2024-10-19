import express from "express";
import { protectRoutes } from "../middleware/auth.middleware.js";
import {
	checkoutSuccess,
	creatCheckoutSession,
} from "../controllers/paymentControllers.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoutes, creatCheckoutSession);
router.post("/checkout-success", protectRoutes, checkoutSuccess);

export default router;
