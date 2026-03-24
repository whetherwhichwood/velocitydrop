import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import type { SlashCommand } from './types';
import { apiClient } from '../services/api-client';

export default {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Manage your game servers')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Create a new game server')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Server name')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('game')
            .setDescription('Game type')
            .setRequired(true)
            .addChoices(
              { name: 'Valheim', value: 'valheim' }
            )
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('start')
        .setDescription('Start a server')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Server name')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('stop')
        .setDescription('Stop a server')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Server name')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('status')
        .setDescription('Check server status')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Server name')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List all your servers')
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const discordId = interaction.user.id;

    try {
      switch (subcommand) {
        case 'create': {
          const name = interaction.options.getString('name', true);
          const gameType = interaction.options.getString('game', true);

          await interaction.deferReply();

          const server = await apiClient.createServer(discordId, name, gameType);

          const embed = new EmbedBuilder()
            .setTitle('Server Created')
            .setDescription(`Server "${name}" has been created successfully!`)
            .addFields(
              { name: 'Server ID', value: server.id, inline: true },
              { name: 'Game Type', value: gameType, inline: true },
              { name: 'Status', value: server.status, inline: true }
            )
            .setColor(0x00ff00);

          await interaction.editReply({ embeds: [embed] });
          break;
        }

        case 'start': {
          const name = interaction.options.getString('name', true);

          await interaction.deferReply();

          const servers = await apiClient.listServers(discordId);
          const server = servers.find((s: any) => s.name === name);

          if (!server) {
            await interaction.editReply(`Server "${name}" not found.`);
            return;
          }

          const result = await apiClient.startServer(discordId, server.id);

          const embed = new EmbedBuilder()
            .setTitle('Server Starting')
            .setDescription(result.message || `Server "${name}" is starting...`)
            .setColor(0xffff00);

          await interaction.editReply({ embeds: [embed] });
          break;
        }

        case 'stop': {
          const name = interaction.options.getString('name', true);

          await interaction.deferReply();

          const servers = await apiClient.listServers(discordId);
          const server = servers.find((s: any) => s.name === name);

          if (!server) {
            await interaction.editReply(`Server "${name}" not found.`);
            return;
          }

          const result = await apiClient.stopServer(discordId, server.id);

          const embed = new EmbedBuilder()
            .setTitle('Server Stopping')
            .setDescription(result.message || `Server "${name}" is stopping...`)
            .setColor(0xff9900);

          await interaction.editReply({ embeds: [embed] });
          break;
        }

        case 'status': {
          const name = interaction.options.getString('name', true);

          await interaction.deferReply();

          const servers = await apiClient.listServers(discordId);
          const server = servers.find((s: any) => s.name === name);

          if (!server) {
            await interaction.editReply(`Server "${name}" not found.`);
            return;
          }

          const status = await apiClient.getServerStatus(discordId, server.id);

          const embed = new EmbedBuilder()
            .setTitle(`Server Status: ${name}`)
            .addFields(
              { name: 'Status', value: status.status, inline: true },
              { name: 'Game Type', value: status.gameType, inline: true },
              { name: 'Port', value: status.port?.toString() || 'N/A', inline: true }
            )
            .setColor(
              status.status === 'running' ? 0x00ff00 :
              status.status === 'stopped' ? 0xff0000 :
              0xffff00
            );

          if (status.instance) {
            embed.addFields(
              { name: 'Started At', value: new Date(status.instance.startedAt).toLocaleString(), inline: true }
            );
          }

          await interaction.editReply({ embeds: [embed] });
          break;
        }

        case 'list': {
          await interaction.deferReply();

          const servers = await apiClient.listServers(discordId);

          if (servers.length === 0) {
            await interaction.editReply('You have no servers. Use `/server create` to create one!');
            return;
          }

          const embed = new EmbedBuilder()
            .setTitle('Your Servers')
            .setDescription(
              servers.map((s: any) => 
                `**${s.name}** (${s.gameType}) - ${s.status}`
              ).join('\n')
            )
            .setColor(0x0099ff);

          await interaction.editReply({ embeds: [embed] });
          break;
        }
      }
    } catch (error: any) {
      console.error('Error in server command:', error);
      const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
      
      if (interaction.deferred) {
        await interaction.editReply(`Error: ${errorMessage}`);
      } else {
        await interaction.reply({ content: `Error: ${errorMessage}`, ephemeral: true });
      }
    }
  },
} as SlashCommand;

