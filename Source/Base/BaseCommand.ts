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
	public category: string = "";

	constructor(client: RedditMasterClient, config: CommandConfig) {
		this.client = client;

		Object.defineProperty(this, "client", {
			configurable: true,
			writable: true,
			enumerable: false,
		});

		Object.assign(this, config);
	}

	// eslint-disable-next-line no-unused-vars
	abstract run(message: Message, args: string[]): Promise<any>
};