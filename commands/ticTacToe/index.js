import Discord from "discord.js";
import { Command } from "../command.js";
import CanvasApi from "@napi-rs/canvas";
import { TurnManager } from "./turnManager.js";
import { TileManager } from "./tileManager.js";
import { roles } from "../../roles.js";

export class TicTacToeGame extends Command {
  /**
   *
   * @param {Discord.Client} client
   */
  constructor(client) {
    super({
      usage: "<@secondPlayer>",
      description: "Użyj tej komendy aby utworzyć nową grę w kółko i krzyzyk",
    });
    this.name = "h!ticTacToe";
    this.role = [
      { id: roles.get("delta") },
      { id: roles.get("admin") },
      { id: roles.get("alpha") },
      { id: roles.get("yt") },
      { id: roles.get("moderator") },
      "@everyone"
    ];
  }

  renderGrid(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(100, 0, 5, 300);
    ctx.fillRect(200, 0, 5, 300);

    ctx.fillRect(0, 100, 300, 5);
    ctx.fillRect(0, 200, 300, 5);
  }

  update(gameMessage, canvas, currentUserName) {
    
    gameMessage.edit({
      content: `tura: ${currentUserName}`,
      files: [
        {
          attachment: canvas.toBuffer(),
          name: "board.png",
        },
      ],
    });
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
      `Creating new TicTacToe game: ${playerOne.username} vs ${playerTwo.username}`
    );

    const canvas = CanvasApi.createCanvas(300, 300);
    const ctx = canvas.getContext("2d");
    this.renderGrid(ctx);
    const turnManager = new TurnManager();
    const tileManager = new TileManager();

    const gameMessage = await message.channel.send({
      content: `tura: ${players[turnManager.currentPlayer].username}`,
      files: [
        {
          attachment: canvas.toBuffer(),
          name: "board.png",
        },
      ],
    });

    const topLeft = await gameMessage.react("↖");
    const top = await gameMessage.react("⬆");
    const topRight = await gameMessage.react("↗");
    const middleLeft = await gameMessage.react("⬅");
    const middle = await gameMessage.react("🔄");
    const middleRight = await gameMessage.react("➡");
    const bottomLeft = await gameMessage.react("↙");
    const bottom = await gameMessage.react("⬇");
    const bottomRight = await gameMessage.react("↘");

    const all = [
      { x: 0, y: 0, r: topLeft },
      { x: 1, y: 0, r: top },
      { x: 2, y: 0, r: topRight },
      { x: 0, y: 1, r: middleLeft },
      { x: 1, y: 1, r: middle },
      { x: 2, y: 1, r: middleRight },
      { x: 0, y: 2, r: bottomLeft },
      { x: 1, y: 2, r: bottom },
      { x: 2, y: 2, r: bottomRight },
    ];

    const reactionCollector = gameMessage.createReactionCollector({
      filter: (reaction, user) => true,
      dispose: true,
    });

    reactionCollector.on("collect", (reaction) => {
      reaction.users.cache.map((user) => {
        if (user.bot) return;
        reaction.users.remove(user);

        const playerIndex = players.findIndex((p) => p.id === user.id);
        if (playerIndex == -1) return;
        if (turnManager.currentPlayer != playerIndex) return;
        const player = players[playerIndex];
        const tileData = all.find(
          (emoji) => emoji.r.emoji.identifier === reaction.emoji.identifier
        );

        try {
          tileManager.tiles[tileData.y][tileData.x].addPlayer(playerIndex);
          tileManager.renderTiles(ctx);
          this.renderGrid(ctx);
          turnManager.nextTurn();
          this.update(gameMessage, canvas, players[turnManager.currentPlayer]);
          const winner = tileManager.checkWin();
          if (winner != undefined) {
            message.reply(`${players[winner].username} won the game!`);
            reactionCollector.stop();
            return;
          }
        } catch (e) {
          // console.log( e )
        }
      });
    });
  }
}
