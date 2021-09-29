
import { Schema, model, PaginateModel, Document } from 'mongoose';

import mongoosePaginate from "mongoose-paginate-v2"

export enum RequestStatus {
	ACCEPTED = "ACCEPTED",
	PENDING = "PENDING",
	DECLINED = "DECLINED"
}

interface IUserRequest extends Document {
	from: string;
	to: string;
	status: RequestStatus;
}

const requestSchema = new Schema<IUserRequest>({
	from: {
		type: String,
		ref: 'User',
		required: true
	},
	to: {
		type: String,
		required: true
	},
	status: {
		type: String,
		enum: RequestStatus,
		default: RequestStatus.PENDING,
		required: true
	}
});

requestSchema.plugin(mongoosePaginate);

export interface IRequestModel<T extends Document> extends PaginateModel<T> { }


const Request: IRequestModel<IUserRequest> = model<IUserRequest>('Request', requestSchema) as IRequestModel<IUserRequest>;

export default Request;
