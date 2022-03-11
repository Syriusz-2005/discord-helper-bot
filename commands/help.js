import Discord from "discord.js";
import { Command } from "./command.js";

export class DisplayHelp extends Command  {
	/**
	 *
	 * @param {Discord.Client} client
	 */
	constructor(client) {
    super({
      usage: "brak parametrów",
      description: "Użyj tej komendy aby uzyskać pomoc"
    })
		this.name = "h!help";
		this.role = [ "@everyone" ];
		this.client = client;
	}

	/**
	 *
	 * @param {Array<string>} splitedMessage
	 * @param {Discord.Message} message
	 */
	async process(splitedMessage, message, commands ) {
    let mes = 'Lista komend:';
    commands.forEach(command => {
      mes += `
      ${command.name}, użycie: ${command.usage} - ${command.description}`;
    })
    message.reply( mes );
	}
}