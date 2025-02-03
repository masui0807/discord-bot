const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const token = process.env.DISCORD_TOKEN;

// 🔹 コマンドを登録するための Collection を作成
client.commands = new Collection();

// 🔹 "commands" フォルダからすべてのコマンドを読み込む
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

// 🛠️ Bot の起動ログ
client.on('ready', () => {
    console.log(`${client.user.tag} がサーバーにログインしました！`);
});

// 🛠️ エラーハンドリングを追加
client.on('error', error => console.error('❌ Discord クライアントエラー:', error));
client.on('warn', warning => console.warn('⚠️ Discord クライアント警告:', warning));
client.on('debug', info => console.log(`🐛 DEBUG: ${info}`));

// 🛠️ interactionCreate にログを追加
client.on('interactionCreate', async interaction => {
    console.log("🚀 interactionCreate 発生！");

    if (!interaction.isCommand()) {
        console.log("⚠️ interaction はスラッシュコマンドではありません。");
        return;
    }

    console.log(`🟢 実行されたコマンド: ${interaction.commandName}`);

    const command = client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`❌ コマンド "${interaction.commandName}" が見つかりません。`);
        await interaction.reply({ content: '⚠️ このコマンドは無効です。', ephemeral: true });
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`❌ コマンド実行中にエラー発生: ${error}`);
        await interaction.reply({ content: '⚠️ コマンド実行中にエラーが発生しました。', ephemeral: true });
    }
});

// 🔹 Bot をログイン
client.login(token);
