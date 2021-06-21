import { Client } from "discord.js";
import { readdir } from "fs/promises";
import { join } from "path";
import BaseCommand from "./BaseCommand";
import BaseEvent from "./BaseEvent";
import Logger from "../Helpers/Logger";
import { CommandManager } from "./CommandManager";

interface ClientStarterOptions {
	prefix: string[],
	commandDir: string,
	eventDir: string,
};

export default class RedditMasterClient extends Client {
	public prefixes: string[] = [];
	public logger = new Logger();
	public commands = new CommandManager();

	constructor() {
		super({
			intents: ["GUILD_WEBHOOKS"],
			ws: {
				properties: { $browser: "Discord Android" },
			},
		});

		this.logger.start().then(log => this.logger = log);
	}

	async start(config: ClientStarterOptions) {
		this.prefixes = config.prefix;
		await this._loadCommands(config.commandDir);
		await this._loadEvents(config.eventDir);

		this.login(process.env.TOKEN);
	}

	public async _loadCommands(commandDir: string) {
		const subDirs = await readdir(commandDir);

		for(const subDir of subDirs) {
			this.logger.success("client/commands", `Loading command directory: ${subDir}`);

			const files = await readdir(join(commandDir, subDir));

			for(const file of files) {
				const pseudoPull = await import(join(commandDir, subDir, file));

				const pull: BaseCommand = new pseudoPull.default(this);
				pull.category = subDir;

				this.commands.register(pull);

				this.logger.success("client/commands", `Loaded command ${pull.name} 💪`);
			}
		}
	}

	public async _loadEvents(eventDir: string) {
		const files = await readdir(eventDir);

		for(const file of files) {
			const pseudoPull = await import(join(eventDir, file));

			const pull: BaseEvent = new pseudoPull.default(this);

			this.on(pull.eventName, (...args: any[]) => pull.run(...args));

			this.logger.success("client/events", `Listening for event ${pull.eventName} 👂`);
		}
	}
};