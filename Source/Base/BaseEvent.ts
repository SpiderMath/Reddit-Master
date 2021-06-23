import { ClientEvents } from "discord.js";
import RedditMasterClient from "./Client";

export default abstract class BaseEvent {
	public name: keyof ClientEvents;
	public client: RedditMasterClient;

	constructor(client: RedditMasterClient, name: keyof ClientEvents) {
		this.client = client;
		this.name = name;

		Object.defineProperty(this, "client", {
			configurable: true,
			enumerable: false,
			writable: true,
		});
	}

	// eslint-disable-next-line no-unused-vars
	abstract run(...args: any[]): Promise<any>
};