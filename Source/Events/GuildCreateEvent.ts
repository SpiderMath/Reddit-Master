import { Guild } from "discord.js";
import BaseEvent from "../Base/BaseEvent";
import RedditMasterClient from "../Base/Client";
import { GuildModelInterface } from "../Models/GuildSchema";

export default class GuildCreateEvent extends BaseEvent {
	constructor(client: RedditMasterClient) {
		super(client, "guildCreate");
	}

	async run(guild: Guild) {
		const data: GuildModelInterface = await this.client.db.findOne({
			_id: guild.id,
		});

		if(!data) {
			const newData = new this.client.db({
				_id: guild.id,
				subReddits: [],
			});

			newData.save();

			return this.client.dbCache.set(guild.id, {
				_id: guild.id,
				subReddits: [],
			});
		}

		this.client.dbCache.set(guild.id, data);
	}
};