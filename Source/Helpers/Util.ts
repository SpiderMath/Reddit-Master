import { Message, MessageEmbed } from "discord.js";
import { readFileSync } from "fs";

export class Util {
	sendEmbed(message: Message, embeds: MessageEmbed[]) {
		message.channel.send({
			embeds,
		});
	}

	capitaliseEveryFirstLetter(string: string) {
		return string
			.split(" ")
			.map(word => {
				const characters = word.split("");

				return characters[0].toUpperCase() + characters.slice(1).join("").toLowerCase();
			})
			.join(" ");
	}

	readJSON(path: string) {
		return JSON.parse(readFileSync(path).toString());
	}
};