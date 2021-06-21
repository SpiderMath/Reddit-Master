import { ClientEvents } from "discord.js";
import RedditMasterClient from "./Client";

export default abstract class BaseEvent {
	public eventName: keyof ClientEvents;
	public client: RedditMasterClient;

	constructor(client: RedditMasterClient, eventName: keyof ClientEvents) {
		this.eventName = eventName;
		this.client = client;

		Object.defineProperty(
			this,
			"client",
			{
				enumerable: false,
				configurable: true,
				writable: true,
			},
		);
	}

	// eslint-disable-next-line no-unused-vars
	abstract run(...args: any[]): Promise<any>
};