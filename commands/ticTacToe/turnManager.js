
function getRandomInt( min, max ) {
  return Math.floor( Math.random() * ( max - min ) + min );
}

export class TurnManager {
  currentPlayer = getRandomInt( 0, 2 );
  
  constructor() {
    console.log( this );
  }

  nextTurn() {
    this.currentPlayer = this.currentPlayer == 0 ? 1 : 0;
  }
}