import { ClientEvents } from "discord.js";
import RedditMasterClient from "../Base/Client";

interface Event {
	name: keyof ClientEvents,
	run: RunFunction,
};

interface RunFunction {
	// eslint-disable-next-line no-unused-vars
	(client: RedditMasterClient, ...args: any[]): Promise<any>
}

export default Event;