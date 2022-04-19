const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = `5303481244:AAGOW8lk6atND2ZFsH4OzHMob0F1LJSSB8g`

const bot = new TelegramApi(token, {polling: true})

const chat = {}

const playGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Now i will come up with random number from 0 to 9 and you will need to guess it')
    const randomNumber = Math.floor(Math.random() * 10)
    chat[chatId] = randomNumber
    return bot.sendMessage(chatId, 'guess)', gameOptions)
}

const start = () => {
    bot.setMyCommands([{command: '/start', description: 'Start bot'}, {
        command: '/info', description: 'Info about user'
    }, {command: '/game', description: 'Play game'}])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/43e/8a1/43e8a160-545c-3eb9-963a-2e47765b34b2/192/39.webp')
            return bot.sendMessage(chatId, `Hi)`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Your name is ${msg.from.first_name}, and surname is ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return await playGame(chatId)
        }
        return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/e65/38d/e6538d88-ed55-39d9-a67f-ad97feea9c01/192/14.webp')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if (data === '/again') {
            return playGame(chatId)
        }
        if (data === '/endgame') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/e65/38d/e6538d88-ed55-39d9-a67f-ad97feea9c01/192/42.webp')
            return bot.sendMessage(chatId, 'Ok(')
        }
        if (+data === chat[chatId]) {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/e65/38d/e6538d88-ed55-39d9-a67f-ad97feea9c01/192/62.webp')
            await bot.sendMessage(chatId, `Congratulations, you won`)
            return bot.sendMessage(chatId, 'Try again?', againOptions)
        } else {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/e65/38d/e6538d88-ed55-39d9-a67f-ad97feea9c01/192/61.webp')
            await bot.sendMessage(chatId, `Hahah, looser!!!`)
            await bot.sendMessage(chatId, `I guessed the number ${chat[chatId]}`)
            return bot.sendMessage(chatId, 'Try again?', againOptions)
        }
    })
}

start()