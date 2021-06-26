import { Message } from "discord.js";
import BaseCommand from "../../Base/BaseCommand";
import RedditMasterClient from "../../Base/Client";
import { GuildModelInterface } from "../../Models/GuildSchema";

export default class AddSubRedditCommand extends BaseCommand {
	constructor(client: RedditMasterClient) {
		super(client, {
			name: "addsubreddit",
			aliases: ["addsub", "addreddit"],
			description: "Adds a Subreddit to listen to!",
		});
	}

	async run(message: Message, args: string[]) {
		if(!this.client.util.hasReqPerms(message.member)) return message.channel.send(`${this.client.emotes.error} You need \`Manage Server\` or \`Administrator\` permission to use this command!`);

		if(!args[0]) return message.channel.send(`${this.client.emotes.error} Subreddit not provided`);

		// @ts-ignore
		const data: GuildModelInterface = this.client.dbCache.get(message.guild?.id);

		if(!data.updateChannel || !this.client.channels.cache.get(data.updateChannel)) return message.channel.send(`${this.client.emotes.error} The guild does not have subreddit updates channel setup. Please set it up and then run this command!`);
		if(data.subReddits.includes(args[0].toLowerCase())) return message.channel.send(`${this.client.emotes.error} This subreddit is already in your subscription list!`);
		if(data.subReddits.length === this.client.slotcount) return message.channel.send(`${this.client.emotes.error} Maximum number of subreddits reached. Please remove one of the subreddits to add a new one`);

		data.subReddits.push(args[0].toLowerCase());
		this.client.dbCache.delete(message.guild?.id);
		this.client.dbCache.set(message.guild?.id, data);

		this.client.db.findOneAndUpdate({ _id: message.guild?.id }, data, { upsert: true }, (err, doc) => doc.save());

		return message.channel.send(`${this.client.emotes.success} Updated your slots. You have ${this.client.slotcount - data.subReddits.length} slots left`);
	}
};