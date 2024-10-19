import dotenv from "dotenv";

dotenv.config();	

export const setAccessTokenCookies = (res, accessToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 15 * 60 * 1000,
	});

	
};

export const setRefreshTokenCookies = (res, refreshToken) => {
	res.cookie("userRefreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
};

