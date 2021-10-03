

import express, { Request, Response } from "express";
import { Errors } from "../constants/errors";
import { auth } from "../middleware/auth";
import RequestModel, { RequestStatus } from "../db/models/request"
import UserModel from "../db/models/user";

const router = express.Router();

// send request 
router.post("/", auth, async (req: Request, res: Response) => {
	try {
		const { to } = req.body;

		if (!to) {
			return res.status(400).send({
				error: Errors.INVALID_REQUEST
			})
		}

		const doesUserExist = await UserModel.findOne({ username: to });
		if (!doesUserExist) {
			return res.status(400).send({
				error: Errors.USER_NOT_FOUND
			})
		}

		if (to === req.username) {
			return res.status(400).send({
				error: Errors.SAME_USER
			})
		}

		const totalRequestsToSendingUser = await RequestModel.countDocuments({ to, status: RequestStatus.PENDING });
		if (totalRequestsToSendingUser > 5) {
			return res.status(403).send({
				error: Errors.ENOUGH_PENDING_REQUESTS
			});
		}

		const prevRequest = await RequestModel.findOne({
			from: req.username,
			to,
		});

		if (prevRequest) {
			return res.status(400).send({
				error: Errors.ALREADY_EXISTS
			})
		}
		const newRequest = new RequestModel({
			from: req.username,
			to,
		});

		const request = await newRequest.save()

		return res.send({
			data: request,
			error: ""
		})
	}
	catch (err: any) {
		return res.status(400).send({

			error: err.message
		});
	}
});


router.put("/:id", auth, async (req: Request, res: Response) => {

	try {
		const { id } = req.params;
		const { status } = req.body;

		if (![RequestStatus.ACCEPTED, RequestStatus.DECLINED].includes(status)) {
			return res.status(400).send({
				error: Errors.INVALID_REQUEST
			});
		}

		const prevRequest = await RequestModel.findById(id);
		if (prevRequest) {
			if (prevRequest.to !== req.username) {
				return res.status(403).send({
					error: Errors.UNAUTHORIZED
				})
			}
			if (prevRequest.status === RequestStatus.PENDING) {
				prevRequest.status = status;
				await prevRequest.save();

				return res.send({
					data: prevRequest,
					error: ""
				})
			}
			console.log("HERE");

			return res.status(400).send({
				error: Errors.INVALID_REQUEST
			})

		}
		return res.status(400).send({
			error: Errors.FOUR_O_FOUR_ERROR
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

		const { page = 1 } = req.query;
		const options = {
			page: typeof page === "string" ? parseInt(page) : 1,
			limit: 5
		}

		const requests = await RequestModel.paginate({
			to: req.username,
			status: RequestStatus.PENDING,
		}, options);

		return res.send({
			error: "",
			data: requests,

		})

	}
	catch (err: any) {
		return res.status(400).send({

			error: err.message
		});
	}
})

export default router;






