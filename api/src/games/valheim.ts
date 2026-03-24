import Docker from 'dockerode';
import { PrismaClient } from '@prisma/client';

export class ValheimServer {
  private docker: Docker;
  private portStart = parseInt(process.env.VALHEIM_SERVER_PORT_START || '2456', 10);

  constructor(docker: Docker, private prisma: PrismaClient) {
    this.docker = docker;
  }

  async start(server: any, allocationId: string) {
    // Find available port
    const port = await this.findAvailablePort();

    // Get server password from config or env
    const password = server.password || process.env.VALHEIM_SERVER_PASSWORD || 'changeme';

    // Create container
    const container = await this.docker.createContainer({
      Image: 'lloesche/valheim-server:latest',
      name: `valheim-${server.id}`,
      Env: [
        `SERVER_NAME=${server.name}`,
        `WORLD_NAME=${server.name}`,
        `SERVER_PASS=${password}`,
        `PUBLIC=1`,
      ],
      ExposedPorts: {
        '2456/udp': {},
        '2457/udp': {},
      },
      HostConfig: {
        PortBindings: {
          '2456/udp': [{ HostPort: port.toString() }],
          '2457/udp': [{ HostPort: (port + 1).toString() }],
        },
        Memory: 4 * 1024 * 1024 * 1024, // 4GB
        CpuShares: 2048, // 2 CPU cores
        RestartPolicy: { Name: 'unless-stopped' },
      },
      Labels: {
        'velocitydrop.serverId': server.id,
        'velocitydrop.allocationId': allocationId,
      },
    });

    await container.start();

    return {
      containerId: container.id,
      port: parseInt(port.toString(), 10),
    };
  }

  private async findAvailablePort(): Promise<number> {
    // Get all running containers
    const containers = await this.docker.listContainers({ all: true });
    
    // Get used ports
    const usedPorts = new Set<number>();
    for (const container of containers) {
      if (container.Ports) {
        for (const port of container.Ports) {
          if (port.PublicPort) {
            usedPorts.add(port.PublicPort);
          }
        }
      }
    }

    // Find first available port starting from portStart
    let port = this.portStart;
    while (usedPorts.has(port) || usedPorts.has(port + 1)) {
      port += 2; // Valheim uses 2 consecutive ports
    }

    return port;
  }
}

