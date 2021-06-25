import { Client, Intents } from "discord.js";
import { readdir } from "fs/promises";
import { join } from "path";
import BaseCommand from "./BaseCommand";
import BaseEvent from "./BaseEvent";
import Logger from "../Helpers/Logger";
import CommandManager from "./CommandManager";
import Util from "../Helpers/Util";
import { connect, Model } from "mongoose";
import { GuildModel, GuildModelInterface } from "../Models/GuildSchema";

interface StartConfig {
	commandDir: string,
	eventDir: string,
	prefixes: string[],
};

export default class RedditMasterClient extends Client {
	public logger = new Logger();
	public commands = new CommandManager();
	public prefixes: string[] = [];
	public util = new Util();
	public db: Model<any, {}, {}> = GuildModel;
	public dbCache: GuildModelInterface[] = [];
	public emotes = {
		success: "<a:checkmark:840147155112165406>",
		error: "<a:error:840147176360378388>",
	};
	public slotcount: number = 3;

	constructor() {
		super({
			intents: Intents.NON_PRIVILEGED,
			ws: {
				properties: {
					$browser: "Discord Android",
					$os: "Android",
				},
			},
		});
	}

	public async start(config: StartConfig) {
		await this._loadCommands(config.commandDir);
		await this._loadEvents(config.eventDir);
		this.prefixes = config.prefixes;
		// @ts-ignore
		await connect(process.env.REDDITMONGO, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		}).then(() => this.logger.success("client/database", "Connected to the Database"));

		this.login(process.env.TOKEN);
	}

	private async _loadCommands(commandDir: string) {
		const subDirs = await readdir(commandDir);

		for(const subDir of subDirs) {
			this.logger.info("client/commands", `Loading command from Directory ${subDir}`);
			const files = await readdir(join(commandDir, subDir));

			for(const file of files) {
				const pseudoPull = await import(join(commandDir, subDir, file));
				const pull: BaseCommand = new pseudoPull.default(this);

				pull.category = subDir;
				this.commands.register(pull);
				this.logger.success("client/commands", `Loaded command ${pull.name}`);
			}
		}
	}

	private async _loadEvents(eventDir: string) {
		const files = await readdir(eventDir);

		for(const file of files) {
			const pseudoPull = await import(join(eventDir, file));
			const pull: BaseEvent = new pseudoPull.default(this);

			this.on(pull.name, async (...args: any[]) => await pull.run(...args));
			this.logger.success("client/events", `Loaded event ${pull.name} 👂`);
		}
	}
};