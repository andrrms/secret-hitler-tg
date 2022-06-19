import { POLICY } from '../types/policy';

interface IFillCards {
  liberal: number;
  fascist: number;
}

export default class Deck {
  pile: Array<POLICY>;
  discarded: Array<POLICY>;
  constructor(options: IFillCards) {
    this.pile = [];
    this.discarded = [];

    Deck.fill(this.pile, options.fascist, POLICY.Fascist);
    Deck.fill(this.pile, options.liberal, POLICY.Liberal);

    Deck.shuffle(this.pile);
  }

  static fill(deck: Array<POLICY>, quantity: number, type: POLICY) {
    for (let i = 0; i < quantity; i++) {
      deck.push(type);
    }
  }

  // Fisher-Yates shuffle algorithm
  static shuffle(deck: Array<POLICY>) {
    let currentIndex = deck.length;
    let randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [deck[currentIndex], deck[randomIndex]] = [
        deck[randomIndex],
        deck[currentIndex],
      ];
    }
  }

  pickCard(quantity: number = 1, index?: number) {
    const policies = this.pile.splice(index || 0, quantity);

    this.discarded.push(...policies);

    return policies;
  }

  pickFirstFromTop() {
    return this.pickCard(1, 0);
  }

  pickSecondFromTop() {
    return this.pickCard(1, 1);
  }

  pickThirdFromTop() {
    return this.pickCard(1, 2);
  }

  peekFromTop(quantity: number) {
    return this.pile.slice(0, quantity - 1);
  }

  cardsLeft(type: POLICY) {
    return this.pile.filter((card) => card === type).length;
  }
}
