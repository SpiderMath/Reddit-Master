import { Client } from "discord.js";
import { readdir } from "fs/promises";
import { join } from "path";
import Command from "../Types/Command";
import CommandManager from "./CommandManager";
import Logger from "../Helpers/Logger";
import Event from "../Types/Event";
import { Util } from "../Helpers/Util";

interface StartConfig {
	eventDir: string,
	commandDir: string,
	prefixes: string[],
	developers: `${bigint}`[],
}

export default class RedditMasterClient extends Client {
	public prefixes: string[] = [];
	public commands = new CommandManager();
	public logger = new Logger();
	public util = new Util();

	constructor() {
		super({
			intents: ["GUILD_MESSAGES", "GUILD_WEBHOOKS", "GUILDS"],
			ws: {
				properties: { $browser: "Discord Android" },
			},
		});
	}

	public async start(config: StartConfig) {
		await this._loadCommands(config.commandDir);
		await this._loadEvents(config.eventDir);
		this.prefixes = config.prefixes;
		this.login(process.env.TOKEN);
	}

	private async _loadCommands(commandDir: string) {
		const subDirs = await readdir(commandDir);

		for(const subDir of subDirs) {
			const files = await readdir(join(commandDir, subDir));
			this.logger.info("client/commands", `Loading commands from ${subDir}`);

			for(const file of files) {
				const pseudoPull = await import(join(commandDir, subDir, file));
				const pull: Command = pseudoPull.default;
				pull.category = subDir;

				this.commands.register(pull);

				this.logger.success("client/commands", `Loaded command: ${pull.name}`);
			}
		}
	}

	private async _loadEvents(eventDir: string) {
		const files = await readdir(eventDir);

		for(const file of files) {
			const pseudoPull = await import(join(eventDir, file));
			const pull: Event = pseudoPull.default;

			this.on(pull.name, await pull.run.bind(null, this));
			this.logger.success("client/events", `Listening for Event: ${pull.name}`);
		}
	}
}