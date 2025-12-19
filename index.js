import { 
  Client, 
  GatewayIntentBits, 
  SlashCommandBuilder, 
  EmbedBuilder 
} from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const command = new SlashCommandBuilder()
    .setName("botmsg")
    .setDescription("Send a message or embed")
    .addStringOption(o =>
      o.setName("text").setDescription("Message text").setRequired(true)
    )
    .addBooleanOption(o =>
      o.setName("embed").setDescription("Use embed").setRequired(true)
    )
    .addStringOption(o =>
      o.setName("image").setDescription("Optional image URL")
    );

  await client.application.commands.set([command]);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "botmsg") return;

  const text = interaction.options.getString("text");
  const embedEnabled = interaction.options.getBoolean("embed");
  const image = interaction.options.getString("image");

  if (!embedEnabled) {
    return interaction.reply(text);
  }

  const embed = new EmbedBuilder()
    .setDescription(text)
    .setColor(0x5865F2);

  if (image) embed.setImage(image);

  interaction.reply({ embeds: [embed] });
});

client.login(process.env.TOKEN);
