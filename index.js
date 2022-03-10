import fetch from "node-fetch";
import Discord, { Intents } from "discord.js";
import express from "express";

import dotenv from "dotenv";
dotenv.config();

import { AddThread, AddUser, RemoveUser } from "./commands.js";
import { AddGuild } from "./commands/createGuild.js";
import { RemoveGuild } from "./commands/removeGuild.js";
import { Guild } from "./commands/guild.js";
import { DisplayHelp } from "./commands/help.js";
import { UseFilter } from "./commands/filter.js";
import { EventManager, ScheduledEvent } from "./events/eventManager.js";

const client = new Discord.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    "GUILDS",
    "DIRECT_MESSAGES",
    "GUILD_MESSAGES",
    "GUILD_INTEGRATIONS",
  ],
  presence: {
    status: "online",
    activities: [
      {
        name: "h!help",
        type: "PLAYING",
      },
    ],
  },
});

client.on("ready", (cl) => {
  console.log("logged in");
  const commands = [
    new AddUser(client),
    new RemoveUser(client),
    new AddThread(client),
    new AddGuild(client),
    new RemoveGuild(client),
    new Guild(client),
    new DisplayHelp(client),
    new UseFilter(client),
  ];

  client.on("message", async (message) => {
    const splitedMessage = message.content.split(" ");

    const rightCommand = commands.find(
      (command) => command.name == splitedMessage[0] || command.name == "any"
    );
    if (rightCommand) {
      if (rightCommand.requiredChannelId)
        if (
          !rightCommand.requiredChannelId.some(
            (channelId) => channelId == message.channel.id
          )
        ) {
          return message.reply("This command does not work here!");
        }

      let correctRole = false;
      if (rightCommand.role instanceof Array) {
        correctRole = message.member.roles.cache.some((role) =>
          rightCommand.role.some((r) => r == role.name)
        );
      } else {
        correctRole = message.member.roles.cache.some(
          (role) => role.name === rightCommand.role
        );
      }

      if (!correctRole)
        return message.reply("You don't have permission to use this command");
      try {
        await rightCommand.process(splitedMessage, message, commands);
      } catch (err) {
        message.reply("invalid command usage");
      }
    }
  });

  client.guilds.cache.each((guild) => {
    if (guild.id === "919174974978273350") {
      const eventManager = new EventManager();
      eventManager.insertEvent(
        new ScheduledEvent({
          day: undefined,
          hour: undefined,
          minute: undefined,
          refreshTimeInMinutes: 1,
          callback: async () => {
            const channel = await guild.channels
              .fetch("950018342406750368", { force: true })
              .catch((err) => {});
            channel?.send?.("Ta wiadomość wywyła się co chwilę");
          },
        })
      );
    }
  });
});

client.login(process.env.TOKEN);

const app = express();
app.listen(process.env.PORT || 3000, () => {
  console.log("App is listening on port " + process.env.PORT || 3000);
});
app.get("/", (req, res) => {
  res.send("Bot is working");
});
