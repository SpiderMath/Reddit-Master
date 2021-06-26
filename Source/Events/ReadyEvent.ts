import BaseEvent from "../Base/BaseEvent";
import RedditMasterClient from "../Base/Client";
import { GuildModelInterface } from "../Models/GuildSchema";

export default class ReadyEvent extends BaseEvent {
	constructor(client: RedditMasterClient) {
		super(client, "ready");
	}

	async run() {
		this.client.logger.success("client", `Logged in as ${this.client.user?.tag} in ${this.client.guilds.cache.size} guild(s)!`);

		this.client.prefixes.push(`<@${this.client.user?.id}>`);
		this.client.prefixes.push(`<@!${this.client.user?.id}>`);

		this.client.guilds.cache.forEach(async (guild, key) => {
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
			if(this.client.guilds.cache.last()?.id === key) this.client.logger.success("client/database", `DB Cache size: ${this.client.dbCache.size}`);
		});
	}
}