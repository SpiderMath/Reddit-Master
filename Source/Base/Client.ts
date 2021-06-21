import { Client } from "discord.js";

interface ClientStarterOptions {
	prefix: string[],
};

export default class RedditMasterClient extends Client {
	public prefixes: string[] = [];

	async start(config: ClientStarterOptions) {
		this.prefixes = config.prefix;
	}
};