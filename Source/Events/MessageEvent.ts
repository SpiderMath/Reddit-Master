import { Message } from "discord.js";
import Event from "../Types/Event";

const MessageEvent: Event = {
	name: "message",
	async run(client, message: Message) {
		if(message.author.bot || !message.guild || message.webhookID) return;

		let prefix = "";

		for(const pref of client.prefixes) {
			if(message.content.toLowerCase().startsWith((pref.toLowerCase()))) {
				prefix = pref;
				break;
			}
		}

		if(prefix === "") return;
		console.log("I am out");
		const args = message.content.slice(prefix.length).trim().split(/ +/g);

		const commandName = args.shift();
		const command = client.commands.get(commandName);

		if(!command) return;

		try {
			command.run(client, message, args);
		}
		catch(err) {
			client.logger.error("client/commands", `
				Error on command ${command.name}
				Error Message: ${err.message}
			`, err.stack);
			return message.channel.send("Something went wrong while running the command, please try again later");
		}
	},
};

export default MessageEvent;