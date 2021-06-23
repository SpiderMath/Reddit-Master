import Event from "../Types/Event";

const ReadyEvent: Event = {
	name: "ready",
	async run(client) {
		client.logger.success("client", `Logged in as ${client.user?.tag}`);

		client.prefixes.push(`<@!${client.user?.id}>`);
		client.prefixes.push(`<@${client.user?.id}>`);
	},
};

export default ReadyEvent;