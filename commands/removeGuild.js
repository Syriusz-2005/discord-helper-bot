import Discord from "discord.js";

export class RemoveGuild {
	/**
	 *
	 * @param {Discord.Client} client
	 */
	constructor(client) {
		this.name = "!removeGuild";
		this.role = "Guild master";
		this.client = client;
	}

	/**
	 *
	 * @param {Array<string>} splitedMessage
	 * @param {Discord.Message} message
	 */
	async process(splitedMessage, message) {

    const user = message.guild.members.cache.find(
			(member) => member.user.username == message.author.username
		);

    const guildRole = user.roles.cache.find( role => role.name.startsWith('guild-') );
    if ( !guildRole ) {
      message.reply('You are not in a guild!');
      return;
    }

		await message.guild.channels.cache
      .find( cahnnel => cahnnel.name == `Guild ${guildRole.name.replace('guild-', '')}` )
			?.delete?.('Guild deleted')
    

    await message.guild.roles.delete( await message.guild.roles.fetch( guildRole.id ) )
		await user.roles.remove( message.guild.roles.cache.find( role => role.name == 'Guild master' ) );

    message.reply(`Guild was removed.`);
  }
}