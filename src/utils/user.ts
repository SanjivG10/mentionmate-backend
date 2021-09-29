
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export interface ITokenPayload {
	username: string
}

export const generateHash = async (plainPassword: string): Promise<string> => {
	const hashRound = 10;
	return await bcrypt.hash(plainPassword, hashRound)
}

export const isPasswordSame = async (plainPassword: string, encryptedPassword: string): Promise<boolean> => {
	return bcrypt.compare(plainPassword, encryptedPassword);
}

export const generateToken = (username: string): string => {
	return jwt.sign(
		{ username } as ITokenPayload,
		process.env.AUTH_TOKEN_KEY || "",
		{
			expiresIn: "30d",
		}
	);
}

export const checkEveryElementString = (x: string[]) => {
	return x.every(i => (typeof i === "string"));
}


