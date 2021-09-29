import mongoose from "mongoose";

const DB_URL = process.env.DB_URL;

const initializeDb = async () => {
	try {
		await mongoose.connect(DB_URL || "", () => {
			console.log("Connected to DB");
		})
	}
	catch {
		console.log("error in db connection");
	}
}

export default initializeDb