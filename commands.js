import Discord from "discord.js";
import { Command } from "./commands/command.js";
export class AddUser extends Command {
	/**
	 *
	 * @param {Discord.Client} client
	 */
	constructor(client) {
		super({
			description: "Dodaje użytkownika do strefy prywatnej 'z widzami'",
			usage: "...@<użytkownik> Kto zna js, wie co znaczą 3 kropki:)"
		})
		this.name = "h!approve";
		this.role = [ "Streamer" ];
		this.client = client;
	}

	/**
	 *
	 * @param {Array<string>} splitedMessage
	 * @param {Discord.Message} message
	 */
	async process(splitedMessage, message) {
		const mentions = message.mentions.users;
		if ( mentions.size == 0 )
			return message.reply("Valid command usage: !approve <@user>");

		try {
			const roleToAdd = message.member.guild.roles.cache.find(
				(role) => role.name == "streamer approved"
			);
			mentions.forEach( async user => (await message.guild.members.fetch({ user })).roles.add( roleToAdd ) );
		} catch (err) {
			return message.reply("Error, missing permissions");
		}

		message.reply(`Added role for: ${ mentions.map( mention => mention.username ).reduce( ( acc, curr ) => acc + ", " + curr, "" ) }`);
	}
}

export class RemoveUser extends Command {
	/**
	 *
	 * @param {Discord.Client} client
	 */
	constructor(client) {
		super({
			description: "Usuwa użytkownika ze strefy prywatnej 'z widzami'",
			usage: "...@<użytkownik>"
		})
		this.name = "h!degrade";
		this.role = [ "Streamer" ];
		this.client = client;
	}

	/**
	 *
	 * @param {Array<string>} splitedMessage
	 * @param {Discord.Message} message
	 */
	process(splitedMessage, message) {
		const mentions = message.mentions.users;
		if ( mentions.size == 0 )
			return message.reply("Valid command usage: !degrade <@user>");

		try {
			const roleToRemove = message.member.guild.roles.cache.find(
				(role) => role.name == "streamer approved"
			);
			
			mentions.forEach( async user => (await message.guild.members.fetch({ user })).roles.remove( roleToRemove ) );
		} catch (err) {
			return message.reply("Error, missing permissions");
		}

		message.reply(`Removed role from: ${ mentions.map( mention => mention.username ).reduce( ( acc, curr ) => acc + ", " + curr, "" ) }`);
	}
}

export class AddThread extends Command {
	/**
	 *
	 * @param {Discord.Client} client
	 */
	constructor(client) {
		super({
			usage: "brak argumentów",
			description: "Tworzy nowy wątek pomocy, dostępne tylko dla kanał #uzyskaj-pomoc",
			requiredChannelId: [ "949611000171233343" ]
		})
		this.name = "h!getHelp";
		this.role = [ "Respect +", "@everyone" ];
		this.client = client;
	}

	/**
	 *
	 * @param {Array<string>} splitedMessage
	 * @param {Discord.Message} message
	 */
	async process(splitedMessage, message) {
    const newThread = await message.startThread({
      name: `Wątek pomocy nr ${Math.floor( Math.random() * 90000 )}`,
      autoArchiveDuration: 60,
      reason: `Thread created by ${message.author.username}`
    });

		await newThread.send({
			content: `
Wątek pomocy został utworzony przez użytkownika: <@${message.author.id}>
<@&950062539448938606> zaraz ci pomoże!
			`,
			allowedMentions: {
				parse: [ "roles" ]
			}
		});
		message.delete();
  }
}
