import { Bot, InlineKeyboard } from 'grammy';

import env from './src/env';
import Manager from './src/game/Manager';
import { translateError } from './src/utils/errorTranslator';
import Base64 from './src/utils/Base64';

const bot = new Bot(env['TOKEN']);

bot.on('message').command('start', async (ctx) => {
  const [_, ...action] = ctx.message.text.split(' ');

  if (!action) {
    await ctx.reply('Hello, world!');
  } else {
    const [payload, ...data] = decodeURIComponent(
      Base64.decode(action.join(''))
    ).split(':');

    switch (payload) {
      case 'join': {
        try {
          // TODO: remove type assertion
          Manager.joinPlayer(ctx.from!, +data[0]);

          const group = await ctx.api.getChat(+data[0]);
          const groupName = 'title' in group && group.title;

          await ctx.reply(`Você entrou na partida em <b>${groupName}</b>`, {
            parse_mode: 'HTML',
          });

          await ctx.api.sendMessage(
            +data[0],
            `<b>${ctx.from.first_name}</b> entrou na partida.`,
            { parse_mode: 'HTML' }
          );
        } catch (error: any) {
          await ctx.reply(translateError(error));
        }
      }
    }
  }
});

bot.on('message').command('new', async (ctx) => {
  try {
    Manager.newGame(ctx.chat.id);

    await ctx.reply(
      'Partida criada com sucesso! Use o botão abaixo para entrar.',
      {
        reply_markup: new InlineKeyboard().url(
          'Entrar na partida',
          `https://t.me/${ctx.me.username}?start=${encodeURIComponent(
            Base64.encode(`join:${ctx.chat.id}`)
          )}`
        ),
      }
    );
  } catch (error: any) {
    await ctx.reply(translateError(error));
  }
});

bot.on('message').command('join', async (ctx) => {
  try {
    // TODO: remove type assertion
    Manager.joinPlayer(ctx.from!, ctx.chat.id);

    await ctx.reply('Você entrou na partida!');
  } catch (error: any) {
    await ctx.reply(translateError(error));
  }
});

bot.start({
  onStart: (me) => {
    console.log(`[BOT] Started at @${me.username}`);
  },
});
