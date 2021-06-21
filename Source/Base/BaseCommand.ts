import { Message } from "discord.js";
import RedditMasterClient from "./Client";

interface CommandConfig {
	name: string,
	description: string,
	aliases?: string[],
};

export default abstract class BaseCommand {
	public client: RedditMasterClient;
	public name: string = "";
	public description: string = "";
	public aliases: string[] = [];

	constructor(client: RedditMasterClient, config: CommandConfig) {
		this.client = client;

		Object.assign(
			this,
			config,
		);

		Object.defineProperty(
			this,
			"client",
			{
				configurable: true,
				enumerable: false,
				writable: true,
			},
		);
	}

	// eslint-disable-next-line no-unused-vars
	abstract run(message: Message, args: string[]): Promise<any>
};