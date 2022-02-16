import Discord from "discord.js";

export class AddGuild {
	/**
	 *
	 * @param {Discord.Client} client
	 */
	constructor(client) {
		this.name = "!createGuild";
		this.role = "Respect +";
		this.client = client;
	}

	/**
	 *
	 * @param {Array<string>} splitedMessage
	 * @param {Discord.Message} message
	 */
	async process(splitedMessage, message) {
    if ( !splitedMessage[2] ) {
      message.reply('command usage: !createGuild <guild_name> <guild_color>');
      return;
    }

    const user = message.guild.members.cache.find(
			(member) => member.user.username == message.author.username
		);

    if ( user.roles.cache.some( role => role.name.startsWith('guild-') ) ) {
      message.reply('You already created a guild!');
      return;
    }

    const newGuild = await message.guild.roles.create({
      name: 'guild-' + splitedMessage[1],
      color: splitedMessage[2],
      mentionable: true,
      permissions: [],
      reason: 'New guild'
    });
    
    user.roles.add( newGuild );
    message.reply(`New guild was created: ${newGuild.name}`);
  }
}