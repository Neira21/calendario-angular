import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}
  async create(createActivityDto: CreateActivityDto) {
    return this.prisma.activity.create({
      data: {
        title: createActivityDto.title,
        description: createActivityDto.description,
        date: new Date(createActivityDto.date),
      },
    });
  }

  async findAll() {
    return this.prisma.activity.findMany({
      orderBy: { date: 'asc' },
    });
  }

  async findByDateRange(startDate: string, endDate: string) {
    return this.prisma.activity.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: number) {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
    });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    return activity;
  }

  async update(id: number, updateActivityDto: UpdateActivityDto) {
    await this.findOne(id); // Verify activity exists

    return this.prisma.activity.update({
      where: { id },
      data: {
        ...(updateActivityDto.title && { title: updateActivityDto.title }),
        ...(updateActivityDto.description !== undefined && {
          description: updateActivityDto.description,
        }),
        ...(updateActivityDto.date && {
          date: new Date(updateActivityDto.date),
        }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Verify activity exists

    return this.prisma.activity.delete({
      where: { id },
    });
  }
}
