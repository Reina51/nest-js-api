import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    const existing = await this.prisma.category.findFirst({
      where: { name: data.name, domainId: data.domainId },
    });
    if (existing) throw new BadRequestException('Category already exists in this domain');

    return this.prisma.category.create({ data });
  }

  async findAll() {
    return this.prisma.category.findMany({ include: { domain: true } });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id }, include: { domain: true } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: number, data: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    if (data.name && data.domainId) {
      const existing = await this.prisma.category.findFirst({
        where: { name: data.name, domainId: data.domainId },
      });
      if (existing) throw new BadRequestException('Category already exists in this domain');
    }

    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return this.prisma.category.delete({ where: { id } });
  }
}
