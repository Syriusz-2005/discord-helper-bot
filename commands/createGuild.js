import Discord, { Permissions } from "discord.js";

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

    const guildRole = await message.guild.roles.create({
      name: 'guild-' + splitedMessage[1],
      color: splitedMessage[2],
      mentionable: true,
      permissions: [],
      reason: 'New guild'
    });
    
    user.roles.add( guildRole );
    user.roles.add( message.guild.roles.cache.find( role => role.name == 'Guild master' ) );


    const channel = await message.guild.channels.cache
      .find( cahnnel => cahnnel.id == '943800268884168725' )
      .createChannel(`Guild ${splitedMessage[1]} only`, {
        type: "GUILD_VOICE",
        permissionOverwrites: [
          {
            id: message.guild.roles.everyone,
            deny: [ Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CONNECT ],
          },
          {
            id: guildRole,
            allow: [ Permissions.FLAGS.CONNECT, Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SPEAK ],
          },
       ],
      })

    message.reply(`New guild was created: ${guildRole.name}`);
  }
}