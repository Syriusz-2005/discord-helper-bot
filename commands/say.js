import Discord from "discord.js";
import { roles } from "../roles.js";
import { Command } from "./command.js";

export class Say extends Command  {
	/**
	 *
	 * @param {Discord.Client} client
	 */
	constructor() {
    super({
      usage: '<...#channel> <"message">',
      description: "Użyj tej komendy aby napisać coś na czacie"
    })
		this.name = "h!say";
		this.role = [ {id: roles.get('admin') } ];
	}

	/**
	 *
	 * @param {Array<string>} splitedMessage
	 * @param {Discord.Message} message
	 */
	async process(splitedMessage, message, commands ) {
    const channels = message.mentions.channels;
    const messageToSay = message.content.split('"')[1]
    channels.forEach( channelName => {
      channelName.send( messageToSay );
    })
	}
}