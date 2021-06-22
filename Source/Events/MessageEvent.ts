import { Message } from "discord.js";
import BaseEvent from "../Base/BaseEvent";
import RedditMasterClient from "../Base/Client";

export default class MessageEvent extends BaseEvent {
	constructor(client: RedditMasterClient) {
		super(client, "message");
	}

	async run(message: Message) {
		console.log(message.content);
		console.log("I'm here!");
		if(message.author.bot || message.webhookID || !message.guild) return;
		console.log("I'm here! 2");

		let prefix: string = "";
		console.log("I'm here! 3");

		for(const pref of this.client.prefixes) {
			if(message.content.toLowerCase().startsWith(pref)) {
				prefix = pref;
				break;
			}
		}
		console.log("I'm here3");

		if(prefix.length === 0) return;

		console.log("I'm here! 4");
		const args = message.content.slice(prefix.length).trim().split(/ +/g);

		const commandName = args.shift();
		const command = this.client.commands.get(commandName);

		console.log("I'm reaching here...");
		if(!command) return;
		console.log("I'm reaching here 2");

		try {
			command.run(message, args);
		}
		catch(err) {
			this.client.logger.error("client/commands", `Error on command: ${command.name}\nError Message: ${err.message}\nError Stack: ${err.stack}`);
		}
	}
};