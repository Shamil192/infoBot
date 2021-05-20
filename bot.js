const telegramApi = require("node-telegram-bot-api");
const token = "1809808815:AAGL7oaFybGbLnGaaD0tcmjuqEGBhF3yVcc";
const bot = new telegramApi(token, { polling: true });
const chats = {};
const { gameOptions, againOptions } = require("./options");

const startGame = async function (chatId) {
  await bot.sendMessage(chatId, `Ща загадаю число от 1 до 9, угадаешь?`);
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, `Угадывай пес`, gameOptions);
};

const start = () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Начальное приветствие",
    },
    {
      command: "/info",
      description: "Имя пользователя",
    },
    {
      command: "/game",
      description: "Игра 'Угадай число'",
    },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/e65/38d/e6538d88-ed55-39d9-a67f-ad97feea9c01/4.webp"
      );
      return bot.sendMessage(chatId, "Йоу брат как сам?");
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name}, больше ничего не знаю`
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, "Сам то понял че написал?");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data == chats[chatId]) {
      await bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chats[chatId]}`
      );
      return bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/e65/38d/e6538d88-ed55-39d9-a67f-ad97feea9c01/62.webp",
        againOptions
      );
    } else {
      await bot.sendMessage(chatId, `Не угадал, я загадал ${chats[chatId]}`);
      return bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/e65/38d/e6538d88-ed55-39d9-a67f-ad97feea9c01/61.webp",
        againOptions
      );
    }
  });
};

start();


