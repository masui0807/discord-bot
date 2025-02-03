require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { CLIENT_ID, GUILD_ID, DISCORD_TOKEN } = process.env;
const fs = require('fs');

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
	try {
		console.log('💾 コマンドを Discord に登録中...');
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands }
		);
		console.log('✅ コマンドの登録が完了しました！');
	} catch (error) {
		console.error(error);
	}
})();
