import mongoose, { Schema, model, Document, PaginateModel } from 'mongoose';

import mongoosePaginate from "mongoose-paginate-v2"


export interface IUser extends Document {
	username: string;
	password: string;
	mates: string[]
}

const userSchema = new Schema<IUser>({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	mates: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}]
});

userSchema.set("toJSON", {
	transform: (doc: any, ret: any) => {
		delete ret.password
	}
})


userSchema.plugin(mongoosePaginate);


export interface IUserModel<T extends Document> extends PaginateModel<T> { }
const UserModel: IUserModel<IUser> = model<IUser>('User', userSchema) as IUserModel<IUser>;

export default UserModel;
