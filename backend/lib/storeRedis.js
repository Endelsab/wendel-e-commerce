import redis from "./redis.js";

const storeRefreshTokenRedis = async (res, userId, refreshToken) => {
	try {
		await redis.set(
			`userRefreshToken : ${userId}`,
			refreshToken,
			"EX",
			7 * 24 * 60 * 60,
		);
	} catch (error) {
		res.status(500).json({ errorInRedis: error.message });
	}
};

export default storeRefreshTokenRedis;
