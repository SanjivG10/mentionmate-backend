import express, { Request, Response } from "express";
import { isPasswordSame, generateHash, generateToken } from "../utils/user";
import User from "../db/models/user";
import { Errors } from "../constants/errors";
import { auth } from "../middleware/auth";
import RequestModel from "../db/models/request";

const router = express.Router();

// create user with username and password 
router.post("/", async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body;
		if (username && username.length < 3 || !password) {
			return res.status(400).send({
				error: Errors.INVALID_REQUEST
			})
		}
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(403).send({
				error: Errors.USER_EXISTS
			})
		}

		const hashedPassword = await generateHash(password);
		const newUser = new User({
			username,
			password: hashedPassword
		});

		const user = await newUser.save();

		return res.send({
			data: user.toJSON(),
			error: ""
		});
	}
	catch (err: any) {
		return res.status(400).send({
			error: err.message
		});
	}
})

router.post("/login", async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });

		if (!user) {
			return res.status(400).send({
				error: Errors.USER_NOT_FOUND
			})
		}

		const isPasswordCorrect = await isPasswordSame(password, user.password);
		if (isPasswordCorrect) {
			return res.send({
				error: "",
				data: generateToken(user.username)
			})
		}

		return res.status(400).send({

			error: Errors.INCORRECT_PASSWORD
		})
	}
	catch (err: any) {
		return res.status(400).send({

			error: err.message
		});
	}
})

router.get("/", auth, async (req: Request, res: Response) => {
	try {
		const { search, page = 1 } = req.query;

		const options = {
			page: typeof page === "string" ? parseInt(page) : 1,
			limit: 5
		}

		if (!search) {
			return res.status(400).send({
				error: Errors.SEARCH_PARAM_REQUIRED,
			})
		}

		const regexpForStartingWithSearchKey = new RegExp("^" + search, 'i');

		const users = await User.paginate({
			username: {
				$ne: req.username,
				$regex: regexpForStartingWithSearchKey,
			}
		}
			, options);

		const usernames = users.docs.map((user) => user.username);

		const requestsForGivenUsers = await RequestModel.find({
			from: req.username,
			to: {
				$in: usernames,
			}
		});


		const userDocsAgain = users.docs.map((eachUser) => {
			const requestForCurrentUser = requestsForGivenUsers.find((request) => request.to === eachUser.username);
			return { ...eachUser.toJSON(), status: requestForCurrentUser?.status || null }
		});


		return res.send({
			error: "",
			data: { ...users, docs: userDocsAgain }
		})
	}

	catch (err: any) {
		return res.status(400).send({
			error: err.message
		});
	}
})

export default router;





