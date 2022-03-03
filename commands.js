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
		this.role = "Streamer";
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
		this.role = "Streamer";
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

export class AddThread {
	/**
	 *
	 * @param {Discord.Client} client
	 */
	constructor(client) {
		this.name = "!createThread";
		this.role = "Respect +";
		this.client = client;
	}

	/**
	 *
	 * @param {Array<string>} splitedMessage
	 * @param {Discord.Message} message
	 */
	async process(splitedMessage, message) {
    const newThread = await message.startThread({
      name: splitedMessage[1],
      autoArchiveDuration: 60,
      reason: `Thread created by ${message.author.username}`
    });
  }
}
