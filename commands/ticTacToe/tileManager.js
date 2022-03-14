import { Tile } from "./tile.js";
import { CanvasRenderingContext2D } from "canvas";

const angleToRadian = function(angle) {
  return Math.PI/180 * angle;
}

export class TileManager {
  tiles = [
    [ new Tile( 0, 0 ), new Tile( 1, 0 ), new Tile( 2, 0 ) ],
    [ new Tile( 0, 1 ), new Tile( 1, 1 ), new Tile( 2, 1 ) ],
    [ new Tile( 0, 2 ), new Tile( 1, 2 ), new Tile( 2, 2 ) ]
  ]
  
  constructor() {

  }
  
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  renderTiles( ctx ) {
    ctx.clearRect( 0, 300, 300 );
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 8;
    
    this.tiles.forEach( tileRow => {
      tileRow.forEach( tile => {
        console.log( tile );
        if ( tile.player == 0 ) {
          ctx.beginPath();
          ctx.arc( tile.posX * 100 + 55, tile.posY * 100 + 55, 38, 0, angleToRadian(360));
          ctx.stroke();
        } else if ( tile.player == 1 ) {
          ctx.beginPath();
          ctx.moveTo( tile.posX * 100 + 10, tile.posY * 100 + 10 );
          ctx.lineTo( tile.posX * 100 + 90, tile.posY * 100 + 90);
          ctx.moveTo( tile.posX * 100 + 10, tile.posY * 100 + 90 );
          ctx.lineTo( tile.posX * 100 + 90, tile.posY * 100 + 10);
          ctx.stroke();
        }
      })
    })
  }
}