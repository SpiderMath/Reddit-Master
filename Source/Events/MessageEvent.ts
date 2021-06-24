import { Message } from "discord.js";
import BaseEvent from "../Base/BaseEvent";
import RedditMasterClient from "../Base/Client";

export default class MessageEvent extends BaseEvent {
	constructor(client: RedditMasterClient) {
		super(client, "message");
	}

	async run(message: Message) {
		if(message.author.bot || message.webhookID || !message.guild) return;

		let prefix: string = "";

		for(const pref of this.client.prefixes) {
			if(message.content.toLowerCase().startsWith(pref)) {
				prefix = pref;
				break;
			}
		}

		if(prefix.length === 0) return;

		const args = message.content.slice(prefix.length).trim().split(/ +/g);

		const commandName: string | undefined = args.shift();
		const command = this.client.commands.get(commandName);

		if(!command) return;

		try {
			command.run(message, args);
		}
		catch(err) {
			this.client.logger.error("client/commands", `
				Error on command ${command.name}
				Error Message: ${err.message}
			`, err.stack);
		}
	}
};