import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Errors } from "../constants/errors";
import User from "../db/models/user";
import { ITokenPayload } from "../utils/user";


export const auth = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers["x-access-token"] as string;

	if (!token) {
		return res.status(403).send(Errors.TOKEN_REQUIRED);
	}
	try {
		const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN_KEY || "") as ITokenPayload;
		await User.findOne({ username: decodedToken.username });
		req.username = decodedToken.username;

	} catch {
		return res.status(401).send(Errors.INVALID_TOKEN);
	}

	return next();
};