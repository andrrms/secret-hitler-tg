import Deck from './Deck';
import Player from './Player';
import ERR from '../types/errors';

export default class Game {
  readonly group_id: number;
  players: Map<number, Player>;
  cards: Deck;
  private _round: number;
  constructor(groupId: number) {
    this.group_id = groupId;
    this.players = new Map();
    this._round = 0;
    this.cards = new Deck({
      liberal: 5,
      fascist: 8,
    });
  }

  get round() {
    if (this._round === 0) return false;

    switch (this._round % 3) {
      case 0:
        return 'corruption';
      case 1:
        return 'election';
      case 2:
        return 'enaction';
      default:
        throw new Error(
          "Default statement on game round getter shouldn't be possible. Round value is " +
            this._round
        );
    }
  }

  addPlayer(player: Player) {
    if (this.players.has(player.id)) throw new Error(ERR.PlayerInGame);

    this.players.set(player.id, player);

    return player;
  }

  getPlayer(id: number) {
    if (!this.players.has(id)) throw new Error(ERR.PlayerNotFound);

    return this.players.get(id)!;
  }
}
