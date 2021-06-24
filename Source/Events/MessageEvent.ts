import { Message, Collection } from "discord.js";
import BaseEvent from "../Base/BaseEvent";
import RedditMasterClient from "../Base/Client";

const cooldowns: Collection<string, number> = new Collection();

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

		const timestamp = cooldowns.get(`${command.name}-${message.author.id}`);
		const now = Date.now();

		if(timestamp && now - timestamp <= 3000) return message.reply(`Please wait for ${((timestamp - now) / 1000).toFixed(2)} seconds to use this command again`);

		cooldowns.set(`${command.name}-${message.author.id}`, now + 3000);
		setTimeout(() => cooldowns.delete(`${command.name}-${message.author.id}`), 3000);

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