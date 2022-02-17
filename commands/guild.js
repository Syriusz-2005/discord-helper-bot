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

  async remove( guildRole, userName ) {
    const userToRemove = guildRole.guild.members.cache.find(
			(member) => member.user.username == userName
		);

    await userToRemove.roles.remove( guildRole );
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

    const author = message.guild.members.cache.find(
      (member) => member.user.username == message.author.username
    );
    const guildRole = author.roles.cache.find( role => role.name.startsWith('guild-') );

    const user = splitedMessage[2].replace(/_/g, " ");
    switch (splitedMessage[1]) {
      case 'add':
        await this.add( guildRole, user );
        message.reply(`User ${splitedMessage[2]} was added to the guild`);
        break;
    
      case 'remove':
        await this.remove( guildRole, user );
        message.reply(`User ${splitedMessage[2]} is no longer in the guild`);
      
      default:
        break;
    }
  }
}