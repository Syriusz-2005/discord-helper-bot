import Discord from "discord.js";
import { Command } from "./command.js";

export class AlertsManager extends Command  {
	/**
	 *
	 * @param {Discord.Client} client
	 */
	constructor(client) {
    super({
      usage: "<enable|disable>",
      description: "Użyj tej komendy aby włączyć/wyłączyć powiadomienia o streamach i odcinkach",
      requiredChannelId: [ "949009012156928001" ]
    })
		this.name = "h!alerts";
		this.role = [ "@everyone" ];
		this.client = client;
	}

	/**
	 *
	 * @param {Array<string>} splitedMessage
	 * @param {Discord.Message} message
	 */
	async process(splitedMessage, message, commands ) {
    const state = splitedMessage[1];
    
    if ( state != "enable" && state != "disable" ) throw new Error();
    const roleForAlerts = await message.guild.roles.fetch('951511632243200090');
    if ( state == "enable" ) {
      await message.member.roles.add( roleForAlerts );
      message.reply('Zostaniesz spingowany przy każdym ogłoszeniu o streamie/odcinku!');
    } else {
      await message.member.roles.remove(roleForAlerts);
      message.reply('Powiadomienia o stremach/odcinach zostały wyłączone, jednak niektóre ważne ogłoszenia mogą użyć pingu pomimo wyłączonych alertów.');
    }
	}
}