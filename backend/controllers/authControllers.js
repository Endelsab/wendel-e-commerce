import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import generateToken from "../generateTokenAndCookies/generateToken.js";

import redis from "../lib/redis.js";
import storeRefreshTokenRedis from "../lib/storeRedis.js";
import User from "../Models/userModel.js";
import {
	setAccessTokenCookies,
	setRefreshTokenCookies,
} from "../generateTokenAndCookies/setCookies.js";

dotenv.config();

export const signUp = async (req, res) => {
	const { name, email, password } = req.body;
	const userExists = await User.findOne({ email });

	if (!name || !email || !password) {
		return res.status(400).json({ message: "All fields are required!" });
	}

	if (userExists) {
		return res.status(400).json({ message: "User already exists!" });
	}

	try {
		const newUser = await User.create({ name, email, password });

		//authenticate user and generate token and set cookies
		const { accessToken, refreshToken } = generateToken(newUser._id);

		setAccessTokenCookies(res, accessToken);
		setRefreshTokenCookies(res, refreshToken);

		await storeRefreshTokenRedis(res, newUser._id, refreshToken);

		res.status(201).json({
			_id: newUser._id,
			name: newUser.name,
			email: newUser.email,
			role: newUser.role,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const logIn = async (req, res) => {
	const { email, password } = req.body;

	try {
		if (!email || !password) {
			return res.status(400).json({ message: "All fields are required!" });
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ message: "User does not exist!" });
		}

		const isMatch = await user.matchPassword(password);

		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials!" });
		}

		const { accessToken, refreshToken } = generateToken(user._id);

		setAccessTokenCookies(res, accessToken);
		setRefreshTokenCookies(res, refreshToken);

		await storeRefreshTokenRedis(res, user._id, refreshToken);

		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		});
	} catch (error) {
		res.status(500).json({ logInError: error.message });
	}
};

export const logOut = async (req, res) => {
	try {
		const refreshToken = req.cookies.userRefreshToken;
		if (refreshToken) {
			const verifyToken = jwt.verify(
				refreshToken,
				process.env.JWT_SECRET_REFRESH,
			);
			await redis.del(`userRefreshToken : ${verifyToken.userId}`);

			res.clearCookie("accessToken");
			res.clearCookie("userRefreshToken");

			res.json({ message: "Logged out successfully" });
		} else {
			res.status(401).json({ message: "Unauthorized" });
		}
	} catch (error) {
		res.status(500).json({ logOutError: error.message });
	}
};

export const getProfile = async (req, res) => {
	try {
		const user = req.user;

		if (!user) {
			res.status(404).json({ message: "No user found" });
		}
		res.json(user);
	} catch (error) {
		console.log("Error in getting profile:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
