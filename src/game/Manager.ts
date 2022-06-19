import { User } from '@grammyjs/types';

import Game from './Game';
import Player from './Player';
import ERR from '../types/errors';
import { debug } from '../utils';

export default class Manager {
  static readonly lobby: Map<number, Game> = new Map();
  static readonly validCallbacks: Set<number> = new Set();

  static newGame(groupId: number) {
    if (this.lobby.has(groupId)) throw new Error(ERR.ExistentGame);

    this.lobby.set(groupId, new Game(groupId));
    debug(`Uma nova partida foi iniciada em ${groupId}`);
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

  static removePlayer(playerId: number, gameId: number) {
    const game = this.getGame(gameId);
    if (!game) throw new Error(ERR.GameNotFound);

    game.removePlayer(playerId);
    debug(`Um player foi removido da partida de ${gameId}`);
  }

  static addValidCallback(id: number) {
    this.validCallbacks.add(id);
    return id;
  }

  static isValidCallback(id: number) {
    if (this.validCallbacks.has(id)) return true;
    else return false;
  }

  static consumeCallback(id: number) {
    if (!this.validCallbacks.has(id)) throw new Error(ERR.InvalidCallback);

    this.validCallbacks.delete(id);
  }
}
