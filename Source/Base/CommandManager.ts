import BaseCommand from "./BaseCommand";
import { Collection } from "discord.js";

export class CommandManager {
	private commandCache: Collection<string, BaseCommand> = new Collection();
	private aliasCache: Collection<string, string> = new Collection();

	public register(command: BaseCommand) {
		this.commandCache.set(command.name.toLowerCase(), command);

		command.aliases.forEach((alias) => this.aliasCache.set(alias.toLowerCase(), command.name.toLowerCase()));
	}

	public get(name: string | undefined) {
		// @ts-ignore
		return this.commandCache.get(name.toLowerCase()) || this.commandCache.get(this.aliasCache.get(name.toLowerCase()));
	}
}