import express from "express";

import {protectRoutes} from "../middleware/auth.middleware.js"
import { getProfile, logIn, logOut, signUp } from "../controllers/authControllers.js";
import refresh_Token from "../generateTokenAndCookies/refresh_Token.js";

const router = express.Router();

router.post("/signUp", signUp);

router.post("/logIn", logIn);

router.post("/logout", logOut);

router.post("/refresh-token", refresh_Token);

router.get("/profile", protectRoutes, getProfile)

export default router;
