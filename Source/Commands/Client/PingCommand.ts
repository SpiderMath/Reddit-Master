import Command from "../../Types/Command";

const PingCommand: Command = {
	name: "ping",
	aliases: [],
	description: "Gets the API Latency of the Bot",
	async run(client, message) {
		console.log(message.mentions.users);
		return message.channel.send(client.ws.ping.toString());
	},
};

export default PingCommand;