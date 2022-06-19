export enum PLAYER_ROLE {
  Liberal = 'liberal',
  Fascist = 'fascist',
  Hitler = 'hitler',
  None = 'no-role-assigned',
}

export default class Player {
  readonly id: number;
  role: PLAYER_ROLE;
  constructor(playerId: number) {
    this.id = playerId;
    this.role = PLAYER_ROLE.None;
  }
}
