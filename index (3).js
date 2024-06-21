const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Token bot Telegram dari BotFather
const TELEGRAM_BOT_TOKEN = '7175972011:AAGxMWjDPtPQ1zCmQNRJHE1BO5hU8RUmhUs'; // Ganti dengan token bot Anda

// Array sumber berita
const newsSources = [ 
    { name: 'CNN News', endpoint: 'cnn-news' },
    { name: 'Antara News', endpoint: 'antara-news/terkini' },
    { name: 'CNBC News', endpoint: 'cnbc-news' },
    { name: 'Republika News', endpoint: 'republika-news' },
    { name: 'Tempo News', endpoint: 'tempo-news' },
    { name: 'Okezone News', endpoint: 'okezone-news' },
    { name: 'Kumparan News', endpoint: 'kumparan-news' },
    { name: 'Vice News', endpoint: 'vice-news' },
    { name: 'Voa News', endpoint: 'voa-news' }
];

// ID grup channel yang akan menerima berita
const CHANNEL_ID = '@feednewsid'; // Ganti dengan nama pengguna (username) grup channel Anda

// Inisialisasi bot Telegram
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Handler untuk perintah /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const message = "Halo! Selamat datang di Feed News Bot Indonesia.\n"
                    + "Silakan gunakan perintah:\n"
                    + "/berita - untuk melihat berita terbaru dari semua sumber\n"
                    + "/help - untuk bantuan";

    bot.sendMessage(chatId, message);
});

// Handler untuk perintah /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const message = "Fitur yang tersedia:\n"
                    + "/berita - melihat berita terbaru dari semua sumber\n"
                    + "/help - menampilkan pesan bantuan";

    bot.sendMessage(chatId, message);
});

// Fungsi untuk mengirim berita ke grup channel
async function sendNewsToChannel() {
    try {
        let message = "Berita terbaru dari beberapa sumber berita:\n\n";

        // Looping untuk setiap sumber berita
        for (const source of newsSources) {
            const response = await axios.get(`https://feed-news-bot-api.vercel.app/api/${source.endpoint}`);
            const articles = response.data.data;

            if (articles.length > 0) {
                message += `*${source.name}*\n`;
                articles.slice(0, 5).forEach((article) => {
                    message += `📰 ${article.title} 
[🔗Link](${article.link})\n\n`;
                });
            } else {
                message += `*${source.name}*\nTidak ada berita terbaru\n\n`;
            }
        }

        // Tambahkan informasi tentang creator dan link ke bot
        message += "\n\n©2024 Bot Feed News Bot Indonesia dikembangkan oleh [Nixie](https://t.me/salamduajari).\n";

        // Kirim satu pesan ke grup channel dengan menggunakan username
        bot.sendMessage(CHANNEL_ID, message, { parse_mode: "Markdown" });
    } catch (error) {
        console.error('Error sending news to channel:', error);
    }
}

// Handler untuk perintah /berita
bot.onText(/\/berita/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        let message = "Berita terbaru dari beberapa sumber berita:\n\n";

        // Looping untuk setiap sumber berita
        for (const source of newsSources) {
            const response = await axios.get(`https://feed-news-bot-api.vercel.app/api/${source.endpoint}`);
            const articles = response.data.data;

            if (articles.length > 0) {
                message += `*${source.name}*\n`;
                articles.slice(0, 5).forEach((article) => {
                    message += `📰 ${article.title} 
[🔗Link](${article.link})\n\n`;
                });
            } else {
                message += `*${source.name}*\nTidak ada berita terbaru\n\n`;
            }
        }

        // Tambahkan informasi tentang creator dan link ke bot
        message += "\n\n©2024 Feed News Bot Indonesia dikembangkan oleh [Nixie](https://t.me/salamduajari).\n";
        bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
    } catch (error) {
        console.error('Error fetching news:', error);
        bot.sendMessage(chatId, "Maaf, terjadi kesalahan dalam mengambil berita.");
    }
});

// Jalankan fungsi sendNewsToChannel setiap 5 menit
setInterval(() => {
    sendNewsToChannel();
}, 300000); // 300000 ms = 5 menit

// Jalankan bot
console.log('Bot sedang berjalan...');