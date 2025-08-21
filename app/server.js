const fs = require("node:fs");
const path = require("node:path");
const { Client, Events, GatewayIntentBits } = require("discord.js");
const TOKEN = `${process.env['TOKEN']}`;

http.createServer((req, res) => {
  res.write("I'm alive");
  res.end();
}).listen(3000);

const client = new Client({
  intents: Object.keys(GatewayIntentBits).map((a) => {
    return GatewayIntentBits[a];
  }),
});

// トークンを使ってログイン
client.login(TOKEN).catch(error => {
  console.log(TOKEN);
  console.error("ログインに失敗しました: ", error);
});

// BOTが稼働できる状態にあるかの確認
client.once(Events.ClientReady, () => {
  console.log("Ready!");
});

// ボイスステートの更新時に実行
client.on("voiceStateUpdate", async (oldState, newState) => {
  if (newState && oldState) {
    console.log(`voiceStateUpdate: ${oldState.channelId} | ${newState.channelId}`);

    try {
      if (oldState.channelId === null && newState.channelId !== null) {
        // ユーザーがボイスチャンネルに参加したとき
        const channel = await client.channels.fetch("1150108584361861210");
        if (channel) {
          channel.send(newState.member.displayName + "、ピザもってきた？");
        } else {
          console.log("チャンネルが見つかりませんでした。");
        }
      }

      if (oldState.channelId !== null && newState.channelId === null) {
        // ユーザーがボイスチャンネルから退出したとき
        console.log(`disconnect`);
      }
    } catch (error) {
      console.error("voiceStateUpdateエラー: ", error);
    }
  }
});

// メッセージ送信関数
async function sendMsg(channelId, text, option = {}) {
  try {
    const channel = await client.channels.fetch(channelId);
    await channel.send(text, option);
    console.log("メッセージ送信: " + text + JSON.stringify(option));
  } catch (error) {
    console.error("メッセージ送信エラー: ", error);
  }
}
