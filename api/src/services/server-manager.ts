import { PrismaClient } from '@prisma/client';
import Docker from 'dockerode';
import { ResourceManager } from './resource-manager';
import { ValheimServer } from '../games/valheim';

export class ServerManager {
  private docker: Docker;
  private resourceManager: ResourceManager;

  constructor(private prisma: PrismaClient) {
    this.docker = new Docker();
    this.resourceManager = new ResourceManager(prisma);
  }

  async startServer(serverId: string, userId: string) {
    const server = await this.prisma.gameServer.findUnique({
      where: { id: serverId },
      include: { user: true, instance: true },
    });

    if (!server) {
      throw new Error('Server not found');
    }

    if (server.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (server.status === 'running') {
      throw new Error('Server is already running');
    }

    if (server.status === 'starting') {
      throw new Error('Server is already starting');
    }

    // Get resource requirements
    const requirements = await this.resourceManager.getGameResourceRequirements(server.gameType);

    // Check if user has enough tokens (1 token per hour, minimum 1 token)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.tokenBalance < 1) {
      throw new Error('Insufficient tokens. You need at least 1 token to start a server.');
    }

    // Allocate resources
    let allocation;
    try {
      allocation = await this.resourceManager.allocateResources(
        userId,
        requirements.cpu,
        requirements.ram,
        requirements.disk
      );
    } catch (error: any) {
      throw new Error(`Failed to allocate resources: ${error.message}`);
    }

    // Update server status
    await this.prisma.gameServer.update({
      where: { id: serverId },
      data: { status: 'starting' },
    });

    try {
      // Start game server based on type
      let containerId: string;
      let port: number;

      if (server.gameType === 'valheim') {
        const valheimServer = new ValheimServer(this.docker, this.prisma);
        const result = await valheimServer.start(server, allocation.id);
        containerId = result.containerId;
        port = result.port;
      } else {
        throw new Error(`Unsupported game type: ${server.gameType}`);
      }

      // Create server instance
      const instance = await this.prisma.serverInstance.create({
        data: {
          gameServerId: serverId,
          dockerContainerId: containerId,
          cpuCores: requirements.cpu,
          ramGB: requirements.ram,
          diskGB: requirements.disk,
          port,
        },
      });

      // Link allocation to instance
      await this.prisma.resourceAllocation.update({
        where: { id: allocation.id },
        data: { serverInstanceId: instance.id },
      });

      // Update server status
      await this.prisma.gameServer.update({
        where: { id: serverId },
        data: { status: 'running', port },
      });

      // Deduct 1 token
      await this.prisma.user.update({
        where: { id: userId },
        data: { tokenBalance: { decrement: 1 } },
      });

      await this.prisma.tokenTransaction.create({
        data: {
          userId,
          amount: -1,
          type: 'spend',
          description: `Started server: ${server.name}`,
        },
      });

      return { message: 'Server started successfully', instance };
    } catch (error: any) {
      // Release resources on error
      await this.resourceManager.releaseResources(allocation.id);
      
      await this.prisma.gameServer.update({
        where: { id: serverId },
        data: { status: 'error' },
      });

      throw error;
    }
  }

  async stopServer(serverId: string, userId: string) {
    const server = await this.prisma.gameServer.findUnique({
      where: { id: serverId },
      include: { 
        user: true, 
        instance: true
      },
    });

    if (!server) {
      throw new Error('Server not found');
    }

    if (server.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (server.status === 'stopped') {
      throw new Error('Server is already stopped');
    }

    if (!server.instance) {
      throw new Error('Server instance not found');
    }

    // Update status
    await this.prisma.gameServer.update({
      where: { id: serverId },
      data: { status: 'stopping' },
    });

    try {
      // Stop Docker container
      const docker = new Docker();
      const container = docker.getContainer(server.instance.dockerContainerId);
      
      try {
        await container.stop();
        await container.remove();
      } catch (error: any) {
        console.error('Error stopping container:', error);
        // Continue even if container is already stopped
      }

      // Release resources
      const allocation = await this.prisma.resourceAllocation.findUnique({
        where: { serverInstanceId: server.instance.id },
      });
      
      if (allocation) {
        await this.resourceManager.releaseResources(allocation.id);
      }

      // Update instance
      await this.prisma.serverInstance.update({
        where: { id: server.instance.id },
        data: { stoppedAt: new Date() },
      });

      // Update server status
      await this.prisma.gameServer.update({
        where: { id: serverId },
        data: { status: 'stopped' },
      });

      return { message: 'Server stopped successfully' };
    } catch (error: any) {
      await this.prisma.gameServer.update({
        where: { id: serverId },
        data: { status: 'error' },
      });
      throw error;
    }
  }
}

