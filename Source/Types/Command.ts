import { Message } from "discord.js";
import RedditMasterClient from "../Base/Client";

interface Command {
	name: string,
	description: string,
	aliases: string[],
	run: RunFunction,
	category?: string,
}

interface RunFunction {
	// eslint-disable-next-line no-unused-vars
	(client: RedditMasterClient, message: Message, args: string[]): Promise<any>,
}

export default Command;