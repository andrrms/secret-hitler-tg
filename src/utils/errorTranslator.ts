import ERR from '../types/errors';

export function translateError(err: Error) {
  switch (err.message) {
    case ERR.ExistentGame: {
      return 'Já existe um jogo em andamento neste grupo!';
    }
    case ERR.PlayerInGame: {
      return 'Você já está na partida!';
    }
    default: {
      return 'Um erro fritou meu chip, contate @embriagado e informe o que aconteceu. Para a minha segurança, este jogo foi encerrado!';
    }
  }
}
