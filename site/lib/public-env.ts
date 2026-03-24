export function getDiscordInviteUrl(): string {
  return process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ?? '#demo';
}

export function getGithubRepoUrl(): string {
  return process.env.NEXT_PUBLIC_GITHUB_REPO ?? 'https://github.com';
}
