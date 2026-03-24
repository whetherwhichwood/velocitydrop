import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import type { SlashCommand } from './types';
import { apiClient } from '../services/api-client';

export default {
  data: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Admin commands')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('tokens')
        .setDescription('Add tokens to a user')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('User to add tokens to')
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option
            .setName('amount')
            .setDescription('Amount of tokens to add')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('description')
            .setDescription('Description for this transaction')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('servers')
        .setDescription('List all servers')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('resources')
        .setDescription('View resource pool status')
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    try {
      switch (subcommand) {
        case 'tokens': {
          const user = interaction.options.getUser('user', true);
          const amount = interaction.options.getInteger('amount', true);
          const description = interaction.options.getString('description') || 'Admin token addition';

          await interaction.deferReply();

          const result = await apiClient.addTokens(user.id, amount, description);

          const embed = new EmbedBuilder()
            .setTitle('Tokens Added')
            .setDescription(`Added ${amount} tokens to ${user.username}`)
            .addFields(
              { name: 'New Balance', value: result.balance.toString(), inline: true }
            )
            .setColor(0x00ff00);

          await interaction.editReply({ embeds: [embed] });
          break;
        }

        case 'servers': {
          await interaction.deferReply();

          const servers = await apiClient.listAllServers();

          if (servers.length === 0) {
            await interaction.editReply('No servers found.');
            return;
          }

          const embed = new EmbedBuilder()
            .setTitle('All Servers')
            .setDescription(
              servers.map((s: any) => 
                `**${s.name}** (${s.gameType}) - ${s.status} - User: <@${s.user.discordId}>`
              ).join('\n')
            )
            .setColor(0x0099ff);

          await interaction.editReply({ embeds: [embed] });
          break;
        }

        case 'resources': {
          await interaction.deferReply();

          const resources = await apiClient.getResourceStatus();

          const embed = new EmbedBuilder()
            .setTitle('Resource Pool Status')
            .addFields(
              { 
                name: 'CPU Cores', 
                value: `${resources.availableCpuCores} / ${resources.totalCpuCores}`, 
                inline: true 
              },
              { 
                name: 'RAM (GB)', 
                value: `${resources.availableRamGB} / ${resources.totalRamGB}`, 
                inline: true 
              },
              { 
                name: 'Disk (GB)', 
                value: `${resources.availableDiskGB} / ${resources.totalDiskGB}`, 
                inline: true 
              }
            )
            .setColor(0x0099ff);

          await interaction.editReply({ embeds: [embed] });
          break;
        }
      }
    } catch (error: any) {
      console.error('Error in admin command:', error);
      const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
      
      if (interaction.deferred) {
        await interaction.editReply(`Error: ${errorMessage}`);
      } else {
        await interaction.editReply({ content: `Error: ${errorMessage}`, ephemeral: true });
      }
    }
  },
} as SlashCommand;

