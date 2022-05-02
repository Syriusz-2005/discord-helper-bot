import fetch from "node-fetch";
import Discord, { Intents } from "discord.js";
import express from "express";

import dotenv from "dotenv";
dotenv.config();

import { AddThread, AddUser, RemoveUser } from "./commands.js";
import { DisplayHelp } from "./commands/help.js";
import { UseFilter } from "./commands/filter.js";
import { EventManager, ScheduledEvent } from "./events/eventManager.js";
import { AlertsManager } from "./commands/alerts.js";
import { ArrestManager } from "./commands/arrest.js";
import { TicTacToeGame } from "./commands/ticTacToe/index.js";
import { Say } from "./commands/say.js";

const client = new Discord.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    "GUILDS",
    "DIRECT_MESSAGES",
    "GUILD_MESSAGES",
    "GUILD_INTEGRATIONS",
    "DIRECT_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_REACTIONS",
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
    new DisplayHelp(client),
    new UseFilter(client),
    new AlertsManager(client),
    new ArrestManager(client),
    new TicTacToeGame(client),
    new Say(),
  ];

  client.on("message", async (message) => {
    const splitedMessage = message.content.split(" ");

    const rightCommands = commands.filter(
      (command) => command.name == splitedMessage[0] || command.name == "any"
    );
    rightCommands.forEach(async (rightCommand) => {
      if (rightCommand) {
        if (rightCommand.requiredChannelId)
          if (
            !rightCommand.requiredChannelId.some(
              (channelId) => channelId == message.channel.id
            )
          ) {
            return message.reply("This command does not work here!");
          }

        const correctRole = message.member.roles.cache.some((role) =>
          rightCommand.role.some((r) => r == role.name || r?.id == role.id)
        );
        if (!correctRole)
          return message.reply("You don't have permission to use this command");
        try {
          await rightCommand.process(splitedMessage, message, commands);
        } catch (err) {
          console.log(err);
          message.reply("invalid command usage");
        }
      }
    });
  });

  client.guilds.cache.each((guild) => {
    if (guild.id === "919174974978273350") {
      const eventManager = new EventManager();
      eventManager.insertEvent(
        new ScheduledEvent({
          day: undefined,
          weekDay: undefined,
          hour: 21,
          minute: 37,
          refreshTimeInMinutes: 1,
          callback: async () => {
            const channel = await guild.channels
              .fetch("949008251394089010", { force: true })
              .catch((err) => {});
            const date = new Date();
            const weekDay = date.getDay();

            switch (weekDay) {
              case 0:
                channel?.send?.(
                  `Pan kiedyś stanął nad brzegiem,
    Szukał ludzi gotowych pójść za Nim;
    By łowić serca
    Słów Bożych prawdą. 
    ...
    <:Trollpapaj:951219313333895288>`
                );
                break;
              case 1:
                channel?.send?.(
                  `O Panie, to Ty na mnie spojrzałeś,
    Twoje usta dziś wyrzekły me imię.
    Swoją barkę pozostawiam na brzegu,
    Razem z Tobą nowy zacznę dziś łów.
    ... <:Trollpapaj:951219313333895288>`
                );
                break;
              case 3:
                channel?.send?.(`2137... <:Trollpapaj:951219313333895288>`);
                break;
              case 4:
                channel?.send?.(
                  `Minuta ciszy dla największego z polaków... <:Trollpapaj:951219313333895288>`
                );
                break;
              case 5:
                channel?.send?.(
                  `Niech Pan was błogosławi! <:Trollpapaj:951219313333895288>`
                );
                break;
              case 6:
                channel?.send?.(
                  `Minuta ciszy dla największego z polaków... <:Trollpapaj:951219313333895288>`
                );
                break;
              case 7:
                channel?.send?.(
                  `Minuta ciszy dla największego z polaków... <:Trollpapaj:951219313333895288>`
                );
                break;
            }
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
