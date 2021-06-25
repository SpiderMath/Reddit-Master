import { Schema, model } from "mongoose";

const GuildSchema = new Schema({
	_id: {
		type: String,
	},
	latestPost: {
		type: String,
		default: "",
	},
	subReddits: {
		type: [String],
		default: [],
	},
});

export const GuildModel = model("subreddits", GuildSchema);

export interface GuildModelInterface {
	_id: string,
	latestPost?: string,
	subReddits: string[],
};