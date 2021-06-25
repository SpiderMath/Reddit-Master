import { Message } from "discord.js";
import BaseCommand from "../../Base/BaseCommand";
import RedditMasterClient from "../../Base/Client";

export default class AddSubRedditCommand extends BaseCommand {
	constructor(client: RedditMasterClient) {
		super(client, {
			name: "addsubreddit",
			aliases: ["addsub", "addreddit"],
			description: "Adds a Subreddit to listen to!",
		});
	}

	async run(message: Message, args: string[]) {
		if(!args[0]) return message.channel.send(`${this.client.emotes.error} Subreddit not provided`);

		let index: number;
		const data = this.client.dbCache.filter((guild, pos) => {
			index = pos;
			return guild._id === message.guild?.id;
		})[0];

		if(!data.updateChannel || !this.client.channels.cache.get(data.updateChannel)) return message.channel.send(`${this.client.emotes.error} The guild does not have subreddit updates channel setup. Please set it up and then run this command!`);
		if(data.subReddits.length === this.client.slotcount) return message.channel.send(`${this.client.emotes.error} Maximum number of subreddits reached. Please remove one of the subreddits to add a new one`);

		data.subReddits.push(args[0].toLowerCase());
		// @ts-ignore
		this.client.dbCache[index] = data;

		this.client.db.findOneAndUpdate({ _id: message.guild?.id }, data, { upsert: true });

		return message.channel.send(`${this.client.emotes.success} Updated your slots. You have ${this.client.slotcount - data.subReddits.length} slots left`);
	}
};