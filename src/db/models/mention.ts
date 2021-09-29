
import mongoose, { Schema, model, SchemaDefinitionProperty, PaginateModel, Document } from 'mongoose';

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
	date: Date,
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
	},
	link: {
		type: String,
		required: true,
		trim: true,
	},
	date: {
		type: Date,
		required: true,
		default: new Date()
	}
});

mentionSchema.plugin(mongoosePaginate);

export interface IMentionModel<T extends Document> extends PaginateModel<T> { }

const Mention: IMentionModel<IUserMention> = model<IUserMention>('Mention', mentionSchema) as IMentionModel<IUserMention>;

export default Mention;
