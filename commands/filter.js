import Discord from "discord.js";
import { Command } from "./command.js";

export class UseFilter extends Command  {
	/**
	 *
	 * @param {Discord.Client} client
	 */
	constructor(client) {
    super({
      usage: "brak parametrów",
      description: "Użyj tej komendy aby twoja wiadopmość została przefiltrowana 🤪"
    })
		this.name = "any";
		this.role = [ "@everyone" ];
		this.client = client;
	}

	/**
	 *
	 * @param {Array<string>} splitedMessage
	 * @param {Discord.Message} message
	 */
	async process(splitedMessage, message, commands ) {
    if ( /kurwa|pierdol|fuck|huj|jebac|jebany|pizda|dziwka|hój|kurwe|kurwę|kurwą|kurw|cipa|kutas|jebnę/g.test( message.content.toLowerCase() ) ) {
      message.delete();
      message.channel.send('Gdy jestem aktywny, nie życzę sobie przeklinania! Z góry dziękuję.');
    }
	}
}