const fetch = require("node-fetch");

async function testFetch() {
    const ip = "85.131.244.197"; // テストするIP
    try {
        console.log(`🚀 手動テスト: サーバーステータス取得`);
        const response = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(ip)}`);
        console.log(`📩 ステータスコード: ${response.status}`);
        if (!response.ok) {
            throw new Error(`⚠️ HTTPエラー！ステータスコード: ${response.status}`);
        }
        const data = await response.json();
        console.log("📜 APIレスポンス:", data);
    } catch (error) {
        console.error("❌ API取得エラー:", error);
    }
}

testFetch();
