import { ColorResolvable, GuildMember, MessageEmbed, Permissions, User } from "discord.js";

export default class Util {
	public embedFormat(embeds: MessageEmbed | MessageEmbed[]) {
		if(!Array.isArray(embeds)) embeds = [embeds];

		return { embeds };
	}

	public defaultEmbed(user: User, colour: ColorResolvable = "GREEN") {
		return new MessageEmbed()
			.setTimestamp()
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }) || user.defaultAvatarURL)
			.setColor(colour);
	}

	public hasReqPerms(member: GuildMember | null) {
		return member && (member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR));
	}
};