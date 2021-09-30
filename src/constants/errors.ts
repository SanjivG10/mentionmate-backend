export enum Errors {
	INCORRECT_PASSWORD = "The given password is not correct",
	GENERAL_ERROR = "Something went wrong",
	USER_NOT_FOUND = "User not found",
	TOKEN_REQUIRED = "Token required",
	INVALID_TOKEN = "Invalid token",
	UNAUTHORIZED = "You are not authorized for this action",
	FOUR_O_FOUR_ERROR = "Data not found",
	ALREADY_EXISTS = "Entry already exists",
	ENOUGH_PENDING_REQUESTS = "User already has enough pending requests",
	SEARCH_PARAM_REQUIRED = "Search key is required",
	SAME_USER = "Cannot do this operation to same user",
	INVALID_REQUEST = "Invalid request",
	NOT_ALL_USERS_PRESENT = "Not all users exists or not all users have accpeted your requests"
}