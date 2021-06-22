import { Message } from "discord.js";
import BaseCommand from "../../Base/BaseCommand";
import RedditMasterClient from "../../Base/Client";

export default class PingCommand extends BaseCommand {
	constructor(client: RedditMasterClient) {
		super(client, {
			name: "ping",
			description: "Gets the API Latency of the Bot",
		});
	}

	async run(message: Message) {
		return message.channel.send("I am alive");
	}
}