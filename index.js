import { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder } from "discord.js";

// Create client with DM support
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
  partials: ['CHANNEL'], // Required to receive DMs
});

// Replace this with your test server ID for instant command registration
const TEST_GUILD_ID = "YOUR_GUILD_ID"; // optional, can be empty

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const command = new SlashCommandBuilder()
    .setName("botmsg")
    .setDescription("Send a message or embed using the bot")
    .addStringOption(option =>
      option.setName("text")
        .setDescription("Message text")
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option.setName("embed")
        .setDescription("Send as embed?")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("image")
        .setDescription("Optional image URL")
        .setRequired(false)
    );

  // Register command
  try {
    if (TEST_GUILD_ID) {
      // Fast registration in a test server
      await client.guilds.cache.get(TEST_GUILD_ID)?.commands.set([command]);
      console.log("Command registered in test server for instant use");
    } else {
      // Global command registration (takes 1 hour to appear)
      await client.application.commands.set([command]);
      console.log("Command registered globally");
    }
  } catch (err) {
    console.error("Error registering command:", err);
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "botmsg") return;

  const text = interaction.options.getString("text");
  const embedEnabled = interaction.options.getBoolean("embed");
  const image = interaction.options.getString("image");

  try {
    if (!embedEnabled) {
      await interaction.reply({ content: text, ephemeral: false });
      return;
    }

    const embed = new EmbedBuilder()
      .setDescription(text)
      .setColor(0x5865F2);

    if (image) embed.setImage(image);

    await interaction.reply({ embeds: [embed] });
  } catch (err) {
    console.error("Failed to send message:", err);
    await interaction.reply({ content: "Failed to send message.", ephemeral: true });
  }
});

client.login(process.env.TOKEN);

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: ['CHANNEL'] // needed for DMs
});

client.on('ready', () => {
    console.log(`${client.user.tag} is online!`);
});

client.on('messageCreate', message => {
    // Ignore bot messages
    if (message.author.bot) return;

    // Check if it's a DM
    if (message.channel.type === 1) { // 1 = DMChannel
        message.reply('Hello! I can respond in DMs.');
    }

    // Check if it's a server message
    else {
        // your server command handling here
    }
});

client.login('YOUR_BOT_TOKEN');
