import { MessageEmbed } from "discord.js";

export default class Util {
	public embedFormat(embeds: MessageEmbed | MessageEmbed[]) {
		if(!Array.isArray(embeds)) embeds = [embeds];

		return { embeds };
	}
};