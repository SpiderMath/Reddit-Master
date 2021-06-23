import BaseEvent from "../Base/BaseEvent";
import RedditMasterClient from "../Base/Client";

export default class ReadyEvent extends BaseEvent {
	constructor(client: RedditMasterClient) {
		super(client, "ready");
	}

	async run() {
		this.client.logger.success("client", `Logged in as ${this.client.user?.tag}`);
	}
}