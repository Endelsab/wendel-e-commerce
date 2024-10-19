import User from "../Models/userModel.js";
import jwt from "jsonwebtoken";

export const protectRoutes = async (req, res, next) => {
	try {
		const accessToken = req.cookies.accessToken;

		if (!accessToken) {
			return res.status(401).json({
				MessageInProtectRoutes: " Unauthorized no access token provided",
			});
		}

		try {
			const accessTokenVerify = jwt.verify(
				accessToken,
				process.env.JWT_SECRET_ACCESS,
			);

			if (!accessTokenVerify) {
				return res
					.status(401)
					.json({ errorInVerifyAccessToken: "invalid access token" });
			}

			const user = await User.findById(accessTokenVerify.userId).select(
				"-password",
			);

			if (!user) {
				return res.status(401).json({ errorInFindingUser: "user not found" });
			}

			req.user = user;
			next();
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({ message: "access token expired" });
			}
			throw error;
		}
	} catch (error) {
		console.log("error in protect routes : ", error.message);
		return res.status(401).json({
			MessageInProtectRoutes: "Unauthorized no access token provided",
		});
	}
};

export const adminRoute = async (request, respond, next) => {
	if (request.user && request.user.role === "admin") {
		next();
	} else {
		return respond.status(403).json({ message: "Admin only" });
	}
};
