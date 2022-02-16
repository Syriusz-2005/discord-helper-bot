import Discord from "discord.js";

export class Guild {
	/**
	 *
	 * @param {Discord.Client} client
	 */
	constructor(client) {
		this.name = "!guild";
		this.role = "Respect +";
		this.client = client;
	}

  async add( guildRole, userName ) {
    const userToAdd = guildRole.guild.members.cache.find(
			(member) => member.user.username == userName
		);
    
    await userToAdd.roles.add( guildRole );
  }

	/**
	 *
	 * @param {Array<string>} splitedMessage
	 * @param {Discord.Message} message
	 */
	async process(splitedMessage, message) {
    if ( !splitedMessage[2] ) {
      message.reply('command usage: !guild add <userName>');
      return;
    }

    const user = message.guild.members.cache.find(
      (member) => member.user.username == message.author.username
    );
    const guildRole = user.roles.cache.find( role => role.name.startsWith('guild-') );

    switch (splitedMessage[1]) {
      case 'add':
        await this.add( guildRole, splitedMessage[2] );
        message.reply(`User ${splitedMessage[2]} was added to the guild`);
        break;
    
      default:
        break;
    }
  }
}