import { Client, Intents } from "discord.js";
import { readdir } from "fs/promises";
import { join } from "path";
import BaseCommand from "./BaseCommand";
import BaseEvent from "./BaseEvent";

interface ClientStarterOptions {
	prefix: string[],
	commandDir: string,
	eventDir: string,
};

export default class RedditMasterClient extends Client {
	public prefixes: string[] = [];

	constructor() {
		super({
			intents: Intents.ALL,
			ws: {
				properties: { $browser: "Discord Android" },
			},
		});
	}

	async start(config: ClientStarterOptions) {
		this.prefixes = config.prefix;
		await this._loadCommands(config.commandDir);
		await this._loadEvents(config.eventDir);
	}

	public async _loadCommands(commandDir: string) {
		const subDirs = await readdir(commandDir);

		for(const subDir of subDirs) {
			const files = await readdir(join(commandDir, subDir));

			for(const file of files) {
				const pseudoPull = await import(join(commandDir, subDir, file));

				const pull: BaseCommand = new pseudoPull.default(this);
			}
		}
	}

	public async _loadEvents(eventDir: string) {
		const files = await readdir(eventDir);

		for(const file of files) {
			const pseudoPull = await import(join(eventDir, file));

			const pull: BaseEvent = new pseudoPull.default(this);

			this.on(pull.eventName, (...args: any[]) => pull.run(...args));
		}
	}
};