import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages],
  partials: ['CHANNEL'],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Check prefix for DM or server
  if (!message.content.startsWith("!botmsg")) return;

  // Split command: !botmsg [embed:true/false] [image(optional)] text
  const args = message.content.slice("!botmsg".length).trim().split(" ");
  const embedFlag = args.shift()?.toLowerCase() === "true"; // first argument
  const image = args[0]?.startsWith("http") ? args.shift() : null; // optional image
  const text = args.join(" ");

  if (!text) return message.reply("Please provide a message text.");

  if (!embedFlag) {
    return message.reply(text);
  }

  const embed = new EmbedBuilder()
    .setDescription(text)
    .setColor(0x5865F2);

  if (image) embed.setImage(image);

  await message.reply({ embeds: [embed] });
});

client.login(process.env.TOKEN);
