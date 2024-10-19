import mongoose from "mongoose";

export const connectDB = () => {
	try {
		mongoose.connect(process.env.MONGO_URI);
		console.log(`mongodb connected :  `);
	} catch (error) {
		console.log("can't connect to db : ", error.message);
		process.exit(1);
	}
};
