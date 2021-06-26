import { Collection, Message } from "discord.js";
import BaseCommand from "../../Base/BaseCommand";
import RedditMasterClient from "../../Base/Client";
import { GuildModelInterface } from "../../Models/GuildSchema";

export default class SetChannelCommand extends BaseCommand {
	constructor(client: RedditMasterClient) {
		super(client, {
			name: "setchannel",
			description: "Sets the Discord channel in which the reddit updates shall be sent",
		});
	}

	async run(message: Message, args: `${bigint}`[]) {
		if(!this.client.util.hasReqPerms(message.member)) return message.channel.send(`${this.client.emotes.error} You need \`Manage Server\` or \`Administrator\` permission to use this command!`);

		if(!args[0]) return message.channel.send(`${this.client.emotes.error} Channel name was not provided`);

		let channel = message.mentions.channels.first() || message.guild?.channels.cache.get(args[0]) || message.guild?.channels.cache.filter(ch => new RegExp(args[0], "i").test(ch.name));

		if(channel instanceof Collection) {
			if(channel.size > 1) return message.channel.send(`${this.client.emotes.error} Multiple channels found of that name. Please mention the channel, or provide the ID of the channel`);
			else if(channel.size === 0) return message.channel.send(`${this.client.emotes.error} No channels of that name found`);
			else channel = channel.first();
		}

		if(!channel) return message.channel.send(`${this.client.emotes.error} Invalid channel provided`);

		// @ts-ignore
		const info: GuildModelInterface = this.client.dbCache.get(message.guild?.id);

		if(info.updateChannel === channel.id) return message.channel.send(`${this.client.emotes.error} The requested channel is the one which is already listed!`);

		info.updateChannel = channel.id;

		this.client.db.findOneAndUpdate({ _id: message.guild?.id }, info, { upsert: true }, (err, data) => {
			data.save();
		});

		this.client.dbCache.delete(message.guild?.id);
		this.client.dbCache.set(message.guild?.id, info);

		return message.channel.send(`${this.client.emotes.success} Updated the reddit posting channel to <#${channel.id}>`);
	}
};