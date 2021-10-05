import dotenv from "dotenv";

dotenv.config()
import express, { Request, Response, Application } from "express";
import initializeDb from "./db";
import userRouter from "./routes/user"
import mentionRouter from "./routes/mention"
import requestRouter from "./routes/request"
import cors from "cors";
import { Server } from "socket.io";
import { getUsernamefromSocket } from "./utils/user";
import { getActiveSocketUserNameWithSocketIds } from "./utils/socket";




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


app.use(cors())
app.use(express.json())
app.use("/user", userRouter);
app.use("/mention", mentionRouter);
app.use("/request", requestRouter);


app.get("/", (req: Request, res: Response): Response => {

	return res.send({
		msgs: "server started running"
	})
});

const server = app.listen(PORT, async () => {
	console.log(`started listening on port ${PORT}`);
	await initializeDb();
})


export const io = new Server(server, {
	cors: {
		origin: '*',
	}
});



io.on("connection", async (socket) => {
	const { token } = socket.handshake.query;
	let username = "";
	if (typeof token === "string") {
		username = await getUsernamefromSocket(token);
	}
	if (username) {
		socket.data.username = username;
	}
});
