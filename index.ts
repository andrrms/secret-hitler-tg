import { Bot, InlineKeyboard } from 'grammy';

import env from './src/env';
import Manager from './src/game/Manager';
import Base64 from './src/utils/Base64';
import { randomId, debug } from './src/utils';
import { translateError } from './src/utils/errorTranslator';

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

          const callbackId = Manager.addValidCallback(randomId());

          await ctx.reply(`Você entrou na partida em <b>${groupName}</b>`, {
            parse_mode: 'HTML',
            reply_markup: new InlineKeyboard().text(
              'Fugir',
              `${callbackId}:flee:${ctx.from.id}:${+data[0]}`
            ),
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

bot.on('callback_query:data', async (ctx) => {
  const [callbackId, action, ...data] = ctx.callbackQuery.data.split(':');

  if (
    !Manager.isValidCallback(+callbackId) &&
    ctx.callbackQuery.message?.message_id
  ) {
    ctx.api.editMessageReplyMarkup(
      ctx.callbackQuery.from.id,
      ctx.callbackQuery.message.message_id,
      {
        reply_markup: {
          inline_keyboard: [],
        },
      }
    );
    debug(`Tratando callback inválido com id ${+callbackId}`);
    return ctx.answerCallbackQuery('Tempo esgotado');
  }

  switch (action) {
    case 'flee': {
      const [userId, chatId] = data;

      try {
        Manager.removePlayer(+userId, +chatId);

        const group = await ctx.api.getChat(+chatId);
        const groupName = 'title' in group && group.title;

        if (ctx.callbackQuery.message?.message_id)
          ctx.api.editMessageText(
            +userId,
            ctx.callbackQuery.message.message_id,
            `Você saiu da partida em <b>${groupName}</b>`,
            { reply_markup: { inline_keyboard: [] }, parse_mode: 'HTML' }
          );

        Manager.consumeCallback(+callbackId);
        ctx.answerCallbackQuery();
      } catch (error: any) {
        ctx.answerCallbackQuery({
          text: translateError(error),
          show_alert: true,
        });
      }

      break;
    }
  }
});

bot.start({
  onStart: (me) => {
    console.log(`[BOT] Started at @${me.username}`);
  },
});
