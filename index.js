import { 
  Client, 
  GatewayIntentBits, 
  SlashCommandBuilder, 
  EmbedBuilder 
} from "discord.js";

// Client with DM support
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
  partials: ['CHANNEL'], // required to receive DMs
});

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  // Slash command registration (global)
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

  // Global commands work in both servers and DMs eventually
  await client.application.commands.set([command]);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "botmsg") return;

  const text = interaction.options.getString("text");
  const embedEnabled = interaction.options.getBoolean("embed");
  const image = interaction.options.getString("image");

  // Embed or normal message
  if (!embedEnabled) {
    await interaction.reply({ content: text, ephemeral: false });
    return;
  }

  const embed = new EmbedBuilder()
    .setDescription(text)
    .setColor(0x5865F2);

  if (image) embed.setImage(image);

  await interaction.reply({ embeds: [embed] });
});

client.login(process.env.TOKEN);
