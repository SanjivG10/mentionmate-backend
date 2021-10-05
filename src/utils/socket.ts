import { Server } from "socket.io";

export const getActiveSocketUserNameWithSocketIds = (io: Server) => {
	const usernameWithSocketIds: {
		[key: string]: string[];
	} = {};
	for (const socket of io.sockets.sockets.values()) {
		const username = socket.data.username;
		if (username) {

			if (usernameWithSocketIds[username]) {
				usernameWithSocketIds[username].push(socket.id)
			}
			else {
				usernameWithSocketIds[username] = [socket.id];
			}
		}
	}
	return usernameWithSocketIds;
}