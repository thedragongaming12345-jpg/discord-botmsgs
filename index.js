const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: ['CHANNEL'] // needed for DMs
});

const TOKEN = 'YOUR_BOT_TOKEN';

// Optional: your test server ID (instant command registration)
const TEST_GUILD_ID = ''; // leave empty for global

client.once('ready', async () => {
    console.log(`${client.user.tag} is online!`);

    // Slash command definition
    const command = new SlashCommandBuilder()
        .setName('botmsg')
        .setDescription('Send a message or embed using the bot')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Message text')
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName('embed')
                .setDescription('Send as embed?')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('image')
                .setDescription('Optional image URL')
                .setRequired(false)
        );

    // Register the command
    try {
        if (TEST_GUILD_ID) {
            await client.guilds.cache.get(TEST_GUILD_ID)?.commands.set([command]);
            console.log('Command registered in test server.');
        } else {
            await client.application.commands.set([command]);
            console.log('Command registered globally (may take a few minutes to appear in DMs).');
        }
    } catch (err) {
        console.error('Error registering command:', err);
    }
});

// Handle slash command interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== 'botmsg') return;

    const text = interaction.options.getString('text');
    const embedEnabled = interaction.options.getBoolean('embed');
    const image = interaction.options.getString('image');

    try {
        if (!embedEnabled) {
            await interaction.reply({ content: text });
            return;
        }

        const embed = new EmbedBuilder()
            .setDescription(text)
            .setColor(0x5865F2);

        if (image) embed.setImage(image);

        await interaction.reply({ embeds: [embed] });
    } catch (err) {
        console.error('Failed to send message:', err);
        await interaction.reply({ content: 'Failed to send message.', ephemeral: true });
    }
});

// Optional: plain DM replies
client.on('messageCreate', message => {
    if (message.author.bot) return;

    if (message.channel.type === 1) { // DM
        message.reply('Hello! I can respond in DMs.');
    } else {
        // Server messages logic here
    }
});

client.login(TOKEN);
