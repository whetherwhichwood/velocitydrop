import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import { join } from 'path';
import type { SlashCommand } from './commands/types';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Load commands
const commands: Collection<string, SlashCommand> = new Collection();
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => 
  file.endsWith('.ts') || file.endsWith('.js')
);

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = require(filePath).default as SlashCommand;
  if ('data' in command && 'execute' in command) {
    commands.set(command.data.name, command);
  }
}

// Register slash commands
async function registerCommands() {
  const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN!);
  const commandsData = commands.map(cmd => cmd.data.toJSON());

  try {
    console.log('Started refreshing application (/) commands.');

    if (process.env.DISCORD_GUILD_ID) {
      // Guild commands (faster for development)
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.DISCORD_CLIENT_ID!,
          process.env.DISCORD_GUILD_ID
        ),
        { body: commandsData }
      );
    } else {
      // Global commands (takes up to 1 hour to propagate)
      await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
        { body: commandsData }
      );
    }

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

// Event handlers
client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  registerCommands();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Error executing command:', error);
    const reply = {
      content: 'There was an error while executing this command!',
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

