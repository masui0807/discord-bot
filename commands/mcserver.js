const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mcserver')
		.setDescription('マイクラサーバーの状態を表示します')
		.addStringOption(option =>
			option.setName('ip')
				.setDescription('サーバーアドレスを指定')
				.setRequired(true)),
				async execute(interaction) {
					console.log("🟢 コマンド `/mcserver` が実行されました");
				
					try {
						console.log("🛠 interaction の全データ:", interaction);
						console.log("🛠 interaction.options の確認:", interaction.options);
				
						console.log("🛠 `interaction.options.getString('ip')` を実行前...");
                        const ip = interaction.options.getString("ip");
        				console.log("🛠 `interaction.options.getString('ip')` を実行後...");
        				console.log(`🔍 受け取った IP: ${ip}`);
				
						if (!ip) {
							console.error("❌ IP が取得できませんでした。");
							await interaction.reply({ content: "IP アドレスを指定してください。" });
							return;
						}
				
						// 🔴 ここでデバッグログを追加
						console.log("✅ IP の取得は成功しました。");
				
						// deferReply() のエラーチェック
						try {
							console.log("⏳ deferReply() を実行します..."); // ← ここが表示されないなら、その前にエラーが発生
							await interaction.deferReply();
							console.log("✅ `deferReply()` 完了！");
						} catch (error) {
							console.error("❌ `deferReply()` でエラー発生:", error);
							await interaction.reply({ content: "⚠️ `deferReply()` の実行中にエラーが発生しました。" });
							return;
						}
				
						console.log("⏳ サーバーステータスを取得中...");
						const getResult = await getServerStatus(ip);
						console.log("✅ APIレスポンス:", getResult);
				
						if (getResult.online) {
							const onlinePlayers = getResult.players?.online ?? 0;
							const maxPlayers = getResult.players?.max ?? "不明";
							const version = getResult.version ?? "情報なし";
				
							await interaction.editReply({
								content: `✅ **サーバーはオンラインです！**\n🎮 **現在のプレイヤー数**: ${onlinePlayers} / ${maxPlayers}\n🛠 **バージョン**: ${version}`
							});
						} else {
							await interaction.editReply({ content: "❌ **サーバーはオフラインです。**" });
						}
					} catch (error) {
						console.error("❌ `execute` 内でエラー発生:", error);
						await interaction.reply({
							content: `⚠️ **エラーが発生しました。**\n🛠 エラーメッセージ: ${error.message}`
						});
					}
				},
};

async function getServerStatus(ipAddress) {
    try {
        console.log(`🌐 APIリクエスト開始: ${ipAddress}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        console.log(`🛠 fetch 実行前: ${ipAddress}`);
        const response = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(ipAddress)}`, {
            signal: controller.signal
        });
        console.log(`📩 fetch 実行後, ステータスコード: ${response.status}`);

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`⚠️ HTTPエラー！ステータスコード: ${response.status}`);
        }

        const data = await response.json();
        console.log("📜 APIレスポンスデータ:", data);
        return data;
    } catch (error) {
        console.error("❌ API取得エラー:", error);
        return { online: false };
    }
}