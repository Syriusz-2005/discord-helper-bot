import Discord from "discord.js";
import { Command } from "./command.js";

export class ArrestManager extends Command {
  /**
   *
   * @param {Discord.Client} client
   */
  constructor(client) {
    super({
      usage:
        "<add|remove> <@user> <time_in_minutes> <deleteMessages|leaveMessages> [message]",
      description:
        "Użyj tej komendy aby zaaresztować użytkownika jako kara ze złe zachowanie. Uwaga!!! Ta komenda ma DESTRUKCYJNE możliwości!",
    });
    this.name = "h!arrest";
    this.role = [
      { id: "949986677798084608", type: "admin" },
      { id: "919176352408674324", type: "alpha" },
    ];
    this.client = client;
  }

  /**
   *
   * @param {Array<string>} splitedMessage
   * @param {Discord.Message} message
   */
  async process(splitedMessage, message, commands) {
    const state = splitedMessage[1];

    if (state != "add" && state != "remove") throw new Error();

    const guild = message.guild;
    if (state == "add") {
      let msg = "";

      const user = message.mentions.users.at(0);
      const guildMember = await message.guild.members.fetch({ user });
      if (
        guildMember.roles.cache.some(
          (role) =>
            role.id == "949986677798084608" || role.id == "919176352408674324"
        )
      ) {
        return message.reply("This user cannot be sent to the arrest!");
      }
      const minutes = Number(splitedMessage.at(3) ?? 3);
      await guildMember.timeout(minutes * 1000 * 60);
      msg += `
        User ${user.username} was succesfully added to the arrest. Will be back after ${minutes} minutes!
      `;

      if (splitedMessage[4] == "deleteMessages") {
        guild.channels.cache.each(async (channel) => {
          const messages = await channel?.messages?.fetch({ limit: 100 });
          const removedMessages = messages
            ?.filter((m) => m.author.id === message.mentions.users.at(0).id)
            .map(async (message) => await message.delete());
        });
      }

      message.reply(msg);
    }
  }
}
