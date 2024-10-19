import express from "express";
import { protectRoutes } from "../middleware/auth.middleware.js";
import {
	getCoupons,
	validateCoupon,
} from "../controllers/couponControllers.js";

const router = express.Router();

router.get("/getCoupon", protectRoutes, getCoupons);
router.post("/validateCoupon", protectRoutes, validateCoupon);

export default router;
