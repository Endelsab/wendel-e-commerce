import redis from "../lib/redis.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { setAccessTokenCookies } from "./setCookies.js";

//import storeRefreshTokenRedis from "../lib/storeRedis.js";

dotenv.config();

// if access token is expired get the refresh token
const refresh_Token = async (req, res) => {
	try {
		const getRefreshToken = req.cookies.userRefreshToken;

		if (!getRefreshToken) {
			return res
				.status(401)
				.json({ errorInGetRefreshToken: "no refreshToken" });
		}

		const refreshTokenVerify = jwt.verify(
			getRefreshToken,
			process.env.JWT_SECRET_REFRESH,
		);

		if (!refreshTokenVerify) {
			return res
				.status(401)
				.json({ errorInVerifytRefreshToken: "invalid refreshToken" });
		}

		const storedToken = await redis.get(
			`userRefreshToken : ${refreshTokenVerify.userId}`,
		);
		if (getRefreshToken !== storedToken) {
			res
				.status(401)
				.json({ errorInCompareRefreshToken: "invalid refreshToken" });
		}

		const newAccessToken = jwt.sign(
			{ userId: refreshTokenVerify.userId },
			process.env.JWT_SECRET_ACCESS,
			{ expiresIn: "15m" },
		);

		setAccessTokenCookies(res, newAccessToken);

		// await storeRefreshTokenRedis(
		// 	res,
		// 	refreshTokenVerify.userId,
		// 	newAccessToken,
		// );

		res.json({ message: "Token refreshed successfully" });
	} catch (error) {
		res.status(500).json({ errorInGetRefreshToken: error.message });
	}
};

export default refresh_Token;
