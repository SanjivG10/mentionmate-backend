
import express, { Request, Response } from "express";
import { Errors } from "../constants/errors";
import { auth } from "../middleware/auth";
import Mention, { MentionStatus } from "../db/models/mention";
import { checkEveryElementString } from "../utils/user";
import UserModel from "../db/models/user";
import RequestModel, { RequestStatus } from "../db/models/request";

const router = express.Router();

// create mention
router.post("/", auth, async (req: Request, res: Response) => {
	try {
		const { to, text, link } = req.body;
		if (!text || !Array.isArray(to) || !link) {
			return res.status(400).send({
				error: Errors.INVALID_REQUEST
			});
		}

		if (!checkEveryElementString(to)) {
			return res.status(400).send({
				error: Errors.INVALID_REQUEST
			});
		}

		if (to.length > 5) {
			return res.status(400).send({
				error: Errors.INVALID_REQUEST
			});
		}

		const mentionedUsersLength = await UserModel.countDocuments({
			username: {
				$in: to
			},
		});


		const currentUserRequestedAcceptedUsersLength = await RequestModel.countDocuments({
			from: req.username,
			to: {
				$in: to
			},
			status: RequestStatus.ACCEPTED,
		});

		if (mentionedUsersLength !== to.length || currentUserRequestedAcceptedUsersLength !== to.length) {
			return res.status(400).send({
				error: Errors.NOT_ALL_USERS_PRESENT
			});
		}

		const toUsers = to.filter((user) => user !== req.username);

		const newMention = new Mention({
			from: req.username,
			to: toUsers.map((user) => { return { user } }),
			text,
			link,
		});

		const mention = await newMention.save()

		return res.send({

			data: mention,
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

		if (status !== MentionStatus.SEEN) {
			return res.status(400).send({
				error: Errors.INVALID_REQUEST
			})
		}

		const prevMention = await Mention.findById(id);
		if (prevMention) {
			const allMentionUsers = prevMention.to;
			const currentUserMention = allMentionUsers.find((mentionStatus) => mentionStatus.user === req.username);

			if (!currentUserMention) {
				return res.status(403).send({
					error: Errors.UNAUTHORIZED
				})
			}

			currentUserMention.status = MentionStatus.SEEN;
			const allMentionsOtherThanCurrentUserMention = allMentionUsers.filter((mention) => mention.user !== req.username);
			prevMention.to = [...allMentionsOtherThanCurrentUserMention, currentUserMention];
			await prevMention.save();

			return res.send({

				data: prevMention,
				error: ""
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
});

router.get("/", auth, async (req: Request, res: Response) => {
	try {
		const { page = 1 } = req.query;
		const options = {
			page: typeof page === "string" ? parseInt(page) : 1,
			limit: 7
		}

		const currentUserMentions = await Mention.paginate({
			to: {
				$elemMatch: {
					user: req.username,
					status: MentionStatus.UNSEEN
				}
			}
		}, options);


		return res.send({
			data: currentUserMentions,
			error: ""
		});
	}
	catch (err: any) {

		return res.status(400).send({

			error: err.message
		});
	}
})

export default router;






