import jwt from "jsonwebtoken";

const generateToken = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET_ACCESS, {
		expiresIn: "15m",
	});
	const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET_REFRESH, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken };
};

export default generateToken;
