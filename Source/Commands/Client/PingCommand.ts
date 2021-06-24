import { stripIndents } from "common-tags";
import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../Base/BaseCommand";
import RedditMasterClient from "../../Base/Client";

export default class PingCommand extends BaseCommand {
	constructor(client: RedditMasterClient) {
		super(client, {
			name: "ping",
			description: "Gets API Latency of the bot",
		});
	}

	async run(message: Message) {
		const msg = await message.channel.send("Pinging...");

		const PingEmbed = new MessageEmbed()
			.setTitle("API Latency")
			.setColor("GREEN")
			.setDescription(stripIndents`
				Websocket Ping: ${this.client.ws.ping} ms
				Discord API Latency: ${(msg.createdTimestamp - message.createdTimestamp)} ms
			`);

		return message.channel.send(this.client.util.embedFormat(PingEmbed))
			.then(() => msg.delete());
	}
};