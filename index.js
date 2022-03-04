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

const client = new Discord.Client({
  intents: [ Intents.FLAGS.GUILDS, "GUILDS", "DIRECT_MESSAGES", "GUILD_MESSAGES", "GUILD_INTEGRATIONS" ],
  presence: {
    status: "online",
    activities: [
      {
        name: "Stworzony przez @_Syriusz_ (Pan Mateusz)",
        type: "PLAYING"
      }
    ]
  }
});

client.on('ready', () =>{
  console.log('logged in')
  const commands = [
    new AddUser( client ),
    new RemoveUser( client ),
    new AddThread( client ),
    new AddGuild( client ),
    new RemoveGuild( client ),
    new Guild( client ),
    new DisplayHelp( client ),
  ]

  client.on('message', async message => {
    const splitedMessage = message.content.split(' ');
    
    const rightCommand = commands.find( command => command.name == splitedMessage[0] );
    if ( rightCommand ) {
      const correctRole = message.member.roles.cache.some( role => role.name === rightCommand.role )
      if ( !correctRole ) return message.reply("You don't have permission to use this command");
      try {
        await rightCommand.process( splitedMessage, message, commands );
      } catch( err ) {
        message.reply('invalid command usage');
      }
    }
  });
});


client.login( process.env.TOKEN );

const app = express();
app.listen( process.env.PORT || 3000, () => {
  console.log('App is listening on port ' + process.env.PORT || 3000)
});
app.get('/', (req, res) =>{
  res.send('Bot is working');
})