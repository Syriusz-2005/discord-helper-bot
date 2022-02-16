import Discord from "discord.js";

export class AddUser {
	/**
	 *
	 * @param {Discord.Client} client
	 */
	constructor(client) {
		this.name = "!approve";
		this.role = "Streamer";
		this.client = client;
	}

	/**
	 *
	 * @param {Array<string>} splitedMessage
	 * @param {Discord.Message} message
	 */
	process(splitedMessage, message) {
		if (!splitedMessage[1])
			return message.reply("Valid command usage: !add <username>");

		const userToAdd = splitedMessage[1].replace(/_/g, " ");
		const user = message.guild.members.cache.find(
			(member) => member.user.username == userToAdd
		);

		if (!user) return message.reply(`User ${userToAdd} not found`);

		try {
			const roleToAdd = message.member.guild.roles.cache.find(
				(role) => role.name == "streamer approved"
			);
			user.roles.add(roleToAdd);
		} catch (err) {
			return message.reply("Error, missing permissions");
		}

		message.reply(`Added role for: ${userToAdd}`);
	}
}

export class RemoveUser {
	/**
	 *
	 * @param {Discord.Client} client
	 */
	constructor(client) {
		this.name = "!degrade";
		this.role = "Streamer";
		this.client = client;
	}

	/**
	 *
	 * @param {Array<string>} splitedMessage
	 * @param {Discord.Message} message
	 */
	process(splitedMessage, message) {
		if (!splitedMessage[1])
			return message.reply(
				'Valid command usage: !remove <username> ( type "_" for space )'
			);

		const userToRemove = splitedMessage[1].replace(/_/g, " ");
		const user = message.guild.members.cache.find(
			(member) => member.user.username == userToRemove
		);

		if (!user) return message.reply(`User ${userToRemove} not found`);
		try {
			const roleToRemove = message.member.guild.roles.cache.find(
				(role) => role.name == "streamer approved"
			);
			user.roles.remove(roleToRemove);
		} catch (err) {
			return message.reply("Error, missing permissions");
		}

		message.reply(`Removed role for: ${userToRemove}`);
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
