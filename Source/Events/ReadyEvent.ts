import Event from "../Types/Event";

const ReadyEvent: Event = {
	name: "ready",
	async run(client) {
		client.logger.success("client", `Logged in as ${client.user?.tag}`);
	},
};

export default ReadyEvent;