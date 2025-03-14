"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent],
});
client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user?.tag}`);
});
client.on("messageCreate", async (message) => {
    if (message.author.bot)
        return;
    if (message.content.toLowerCase() === "hello") {
        message.reply("Hello! How can I help you? 😊");
    }
    if (message.content.toLowerCase().startsWith("!ask")) {
        const userQuery = message.content.replace("!ask", "").trim();
        if (!userQuery)
            return message.reply("Please provide a question.");
        message.reply(`🤖 AI is thinking...`);
        try {
            const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1", {
                method: "POST",
                headers: { Authorization: `Bearer YOUR_HUGGINGFACE_API_KEY`, "Content-Type": "application/json" },
                body: JSON.stringify({ inputs: userQuery }),
            });
            const data = await response.json();
            const answer = data[0]?.generated_text || "I couldn't find an answer. 🤔";
            message.reply(`🧠 AI: ${answer}`);
        }
        catch (error) {
            console.error("AI API error:", error);
            message.reply("⚠️ AI service is down, please try again later.");
        }
    }
});
client.login(process.env.DISCORD_BOT_TOKEN);
