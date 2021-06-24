import { stripIndents } from "common-tags";
import { Message } from "discord.js";
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

		const PingEmbed = this.client.util.defaultEmbed(message.author)
			.setTitle("API Latency")
			.setDescription(stripIndents`
				🏓 Websocket Ping : ${this.client.ws.ping} ms
				💞 Discord API Latency: ${(msg.createdTimestamp - message.createdTimestamp)} ms
			`)
			.setThumbnail("https://images-ext-2.discordapp.net/external/m5vn5WxGhkXL2o14JXz1jRkp0a15FrmkJkllpZ9f0fI/https/i.giphy.com/media/fvA1ieS8rEV8Y/200.gif?width=240&height=180");

		return message.channel.send(this.client.util.embedFormat(PingEmbed))
			.then(() => msg.delete());
	}
};