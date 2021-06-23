import { config } from "dotenv";
import { join } from "path";
config();
import RedditMasterClient from "./Base/Client";

new RedditMasterClient()
	.start({
		commandDir: join(__dirname, "Commands"),
		eventDir: join(__dirname, "Events"),
		prefixes: ["`"],
	});