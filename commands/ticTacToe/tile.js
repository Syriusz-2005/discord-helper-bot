

export class Tile {
  player = undefined;

  constructor( posX, posY ) {
    this.posX = posX;
    this.posY = posY;
  }

  /**
   * 
   * @param {number} player 
   */
  addPlayer( player ) {
    if ( this.player ) throw new Error();

    this.player = player;
  }
}