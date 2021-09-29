import dotenv from "dotenv";

dotenv.config()
import express, { Request, Response, Application, Express } from "express";
import initializeDb from "./db";
import userRouter from "./routes/user"
import mentionRouter from "./routes/mention"
import requestRouter from "./routes/request"

const app: Application = express();
const PORT = process.env.PORT || 8000;

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			username: string
		}
	}
}

app.use(express.json());
app.use("/user", userRouter);
app.use("/mention", mentionRouter);
app.use("/request", requestRouter);


app.get("/", (req: Request, res: Response): Response => {

	return res.send({
		msgs: "server started running"
	})
});

app.listen(PORT, async () => {
	console.log(`started listening on port ${PORT}`);
	await initializeDb();
})