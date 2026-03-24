import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import type { SlashCommand } from './types';
import { apiClient } from '../services/api-client';

export default {
  data: new SlashCommandBuilder()
    .setName('tokens')
    .setDescription('Manage your tokens')
    .addSubcommand(subcommand =>
      subcommand
        .setName('balance')
        .setDescription('Check your token balance')
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const discordId = interaction.user.id;

    try {
      if (subcommand === 'balance') {
        await interaction.deferReply();

        const balance = await apiClient.getTokenBalance(discordId);

        const embed = new EmbedBuilder()
          .setTitle('Token Balance')
          .setDescription(`You have **${balance.balance}** tokens`)
          .setColor(0x0099ff);

        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error: any) {
      console.error('Error in tokens command:', error);
      const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
      
      if (interaction.deferred) {
        await interaction.editReply(`Error: ${errorMessage}`);
      } else {
        await interaction.reply({ content: `Error: ${errorMessage}`, ephemeral: true });
      }
    }
  },
} as SlashCommand;

