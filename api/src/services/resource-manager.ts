import { PrismaClient } from '@prisma/client';

export class ResourceManager {
  constructor(private prisma: PrismaClient) {}

  async initializeResourcePool() {
    const existing = await this.prisma.resourcePool.findFirst();
    
    if (existing) {
      return existing;
    }

    const totalCpuCores = parseFloat(process.env.RESOURCE_POOL_CPU_CORES || '4');
    const totalRamGB = parseFloat(process.env.RESOURCE_POOL_RAM_GB || '8');
    const totalDiskGB = parseFloat(process.env.RESOURCE_POOL_DISK_GB || '100');

    return await this.prisma.resourcePool.create({
      data: {
        totalCpuCores,
        totalRamGB,
        totalDiskGB,
        availableCpuCores: totalCpuCores,
        availableRamGB: totalRamGB,
        availableDiskGB: totalDiskGB,
      },
    });
  }

  async getResourcePool() {
    let pool = await this.prisma.resourcePool.findFirst();
    
    if (!pool) {
      pool = await this.initializeResourcePool();
    }

    // Recalculate available resources
    const allocations = await this.prisma.resourceAllocation.findMany({
      where: { releasedAt: null },
    });

    const usedCpu = allocations.reduce((sum, a) => sum + a.cpuCores, 0);
    const usedRam = allocations.reduce((sum, a) => sum + a.ramGB, 0);
    const usedDisk = allocations.reduce((sum, a) => sum + a.diskGB, 0);

    const availableCpuCores = pool.totalCpuCores - usedCpu;
    const availableRamGB = pool.totalRamGB - usedRam;
    const availableDiskGB = pool.totalDiskGB - usedDisk;

    // Update pool
    pool = await this.prisma.resourcePool.update({
      where: { id: pool.id },
      data: {
        availableCpuCores,
        availableRamGB,
        availableDiskGB,
      },
    });

    return pool;
  }

  async allocateResources(
    userId: string,
    cpuCores: number,
    ramGB: number,
    diskGB: number
  ) {
    const pool = await this.getResourcePool();

    if (
      pool.availableCpuCores < cpuCores ||
      pool.availableRamGB < ramGB ||
      pool.availableDiskGB < diskGB
    ) {
      throw new Error('Insufficient resources available');
    }

    const allocation = await this.prisma.resourceAllocation.create({
      data: {
        userId,
        cpuCores,
        ramGB,
        diskGB,
      },
    });

    // Update pool
    await this.getResourcePool();

    return allocation;
  }

  async releaseResources(allocationId: string) {
    await this.prisma.resourceAllocation.update({
      where: { id: allocationId },
      data: { releasedAt: new Date() },
    });

    // Update pool
    await this.getResourcePool();
  }

  async getGameResourceRequirements(gameType: string) {
    // Resource requirements per game
    const requirements: Record<string, { cpu: number; ram: number; disk: number }> = {
      valheim: {
        cpu: 2,
        ram: 4,
        disk: 5,
      },
    };

    return requirements[gameType] || { cpu: 2, ram: 4, disk: 5 };
  }
}

