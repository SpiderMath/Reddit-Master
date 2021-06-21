import { config } from "dotenv";
config();
import RedditMasterClient from "./Base/Client";

new RedditMasterClient()
	.start({
		prefix: [
			"`"
		],
	});