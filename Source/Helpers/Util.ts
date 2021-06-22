import { Message, MessageEmbed } from "discord.js";

export class Util {
	sendEmbed(message: Message, embeds: MessageEmbed[]) {
		message.channel.send({
			embeds,
		});
	}
};