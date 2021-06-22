import { Collection } from "discord.js";
import Command from "../Types/Command";

export default class CommandManager {
	private commandCache: Collection<string, Command> = new Collection();
	private aliases: Collection<string, string> = new Collection();

	public register(cmd: Command) {
		this.commandCache.set(cmd.name.toLowerCase(), cmd);

		cmd.aliases.forEach(alias => this.aliases.set(alias.toLowerCase(), cmd.name.toLowerCase()));
	}

	public get(name: string) {
		// @ts-ignore
		return this.commandCache.get(name.toLowerCase()) || this.commandCache.get(this.aliases.get(name.toLowerCase()));
	}
};