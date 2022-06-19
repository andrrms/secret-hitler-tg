import { User } from '@grammyjs/types';

import Game from './Game';
import Player from './Player';
import ERR from '../types/errors';
import { debug } from '../utils/debug';

export default class Manager {
  static readonly lobby: Map<number, Game> = new Map();

  static newGame(groupId: number) {
    if (this.lobby.has(groupId)) throw new Error(ERR.ExistentGame);

    this.lobby.set(groupId, new Game(groupId));
  }

  static getGame(groupId: number) {
    return this.lobby.get(groupId) || null;
  }

  static joinPlayer(user: User, gameId: number) {
    const game = this.getGame(gameId);
    if (!game) throw new Error(ERR.GameNotFound);

    game.addPlayer(new Player(user.id));
    debug(`Um player ${user.first_name} se juntou em ${gameId}`);
  }
}
