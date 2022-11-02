import { Command } from "../command.js";
import Discord from "discord.js";
import Coordinate from 'tic-tac-toe-3d/lib/lib/Coordinate.js';
import TicTacToe3DGameManager from "tic-tac-toe-3d/lib/lib/Game.js";
import { roles } from "../../roles.js";

export class TicTacToe3dCommand extends Command {
  constructor() {
    super({
      usage: "<@secondPlayer>",
      description:
        "Użyj tej komendy aby utworzyć nową grę w kółko i krzyzyk 3d",
    });
    this.name = "h!ticTacToe3d";
    this.role = [
      { id: roles.get("delta") },
      { id: roles.get("admin") },
      { id: roles.get("alpha") },
      { id: roles.get("yt") },
      { id: roles.get("moderator") },
    ];
  }

  /**
   *
   * @param {Array<string>} splitedMessage
   * @param {Discord.Message} message
   */
  async process(splitedMessage, message, commands) {
    const playerOne = message.author;
    const playerTwo = message.mentions.users.at(0);
    const players = [playerOne, playerTwo];

    await message.reply(
      `Creating new TicTacToe 3D game: ${playerOne.username} vs ${playerTwo.username} \n Type field id in wchich you want to place the mark`
    );

    const { controller, displayer } = new TicTacToe3DGameManager();

    displayer.update();

    const gameMessage = await message.channel.send({
      content: `Turn: ${
        players[controller.CurrentPlayer.playerIndex].username
      }`,
      files: [
        {
          attachment: displayer.getBuffer(),
          name: "board.png",
        },
      ],
    });

    function getCurrentPlayer() {
      return players[controller.CurrentPlayer.playerIndex];
    }

    function updateMsg(winner) {
      displayer.update(winner);
      gameMessage.edit({
        content: `Turn ${players[controller.CurrentPlayer.playerIndex].username}`,
        files: [
          {
            attachment: displayer.getBuffer(),
            name: 'board.png',
          }
        ]
      })
    }

    const collector = message.channel.createMessageCollector({
      filter: (m) => m.author.id === getCurrentPlayer().id,
    });

    controller.on('win', event => {
      const winner = players[event.player.playerIndex];
      
      updateMsg(winner.username);
      collector.stop();
    });

    collector.on("collect", async (m) => {
      const { content } = m;
      const [gridIndexS, fieldIndexS] = content
        .trim()
        .replace(/ /g, ".")
        .replace(/\-/g, ".")
        .split(".");
        console.log('went');
      if (!gridIndexS || !fieldIndexS) return;
      if (gridIndexS !== "0" && gridIndexS !== "1" && gridIndexS != "2") return;
      if (
        fieldIndexS !== "0" &&
        fieldIndexS !== "1" &&
        fieldIndexS != "2" &&
        fieldIndexS != "3" &&
        fieldIndexS != "4" &&
        fieldIndexS != "5" &&
        fieldIndexS != "6" &&
        fieldIndexS != "7" &&
        fieldIndexS != "8"
      )
        return;
      await m.delete().catch();
      const gridIndex = Number(gridIndexS);
      const fieldIndex = Number(fieldIndexS);

      let x;
      let y;
      switch (fieldIndex) {
        case 0:
          x = 0;
          y = 0;
        break;
        case 1:
          x = 1;
          y = 0;
        break;
        case 2:
          x = 2;
          y = 0;
        break;
        case 3:
          x = 0;
          y = 1;
        break;
        case 4:
          x = 1;
          y = 1;
        break;
        case 5:
          x = 2;
          y = 1;
        break;
        case 6:
          x = 0;
          y = 2;
        break;
        case 7:
          x = 1;
          y = 2;
        break;
        case 8:
          x = 2;
          y = 2;
        break;
      }

      if (x == 1 && y == 1 && z == 1) return;

      console.log(x, y, gridIndex);

      const accepted = controller.makeMove(new Coordinate(x, y, gridIndex));
      if (!accepted) return console.log('Invalid coordinates');
      updateMsg();
    });
  }
}
