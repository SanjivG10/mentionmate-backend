
import mongoose, { Schema, model, SchemaDefinitionProperty, PaginateModel, Document } from 'mongoose';
import moment from "moment";

import mongoosePaginate from "mongoose-paginate-v2"

export enum MentionStatus {
	SEEN = "SEEN",
	UNSEEN = "UNSEEN",
}

export interface IUserMention extends Document {
	from: SchemaDefinitionProperty<string>;
	to: {
		user: string,
		status: MentionStatus
	}[];
	text: string,
	date: number,
	link: string,
}

const mentionSchema = new Schema<IUserMention>({
	from: {
		type: String,
		required: true
	},
	to: [{
		user: {
			type: String,
			required: true
		},
		status: {
			type: String,
			enum: MentionStatus,
			default: MentionStatus.UNSEEN,
			required: true,
		},
	}],
	text: {
		type: String,
		required: true,
		trim: true,
		maxlength: 250,
	},
	link: {
		type: String,
		required: true,
		trim: true,
		maxLength: 500,
	},
	date: {
		type: Number,
		required: true,
		default: moment.now()
	}
});

mentionSchema.plugin(mongoosePaginate);

export interface IMentionModel<T extends Document> extends PaginateModel<T> { }

const Mention: IMentionModel<IUserMention> = model<IUserMention>('Mention', mentionSchema) as IMentionModel<IUserMention>;

export default Mention;
