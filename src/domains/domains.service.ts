import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';

@Injectable()
export class DomainsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateDomainDto) {
    const existing = await this.prisma.domain.findUnique({ where: { name: data.name } });
    if (existing) throw new BadRequestException('Domain already exists');
    return this.prisma.domain.create({ data });
  }

  async findAll() {
    return this.prisma.domain.findMany({ include: { categories: true } });
  }

  async findOne(id: number) {
    const domain = await this.prisma.domain.findUnique({ where: { id }, include: { categories: true } });
    if (!domain) throw new NotFoundException('Domain not found');
    return domain;
  }

  async update(id: number, data: UpdateDomainDto) {
    const domain = await this.prisma.domain.findUnique({ where: { id } });
    if (!domain) throw new NotFoundException('Domain not found');
    if (data.name) {
      const existing = await this.prisma.domain.findUnique({ where: { name: data.name } });
      if (existing) throw new BadRequestException('Domain name already exists');
    }
    return this.prisma.domain.update({ where: { id }, data });
  }

  async remove(id: number) {
    const domain = await this.prisma.domain.findUnique({ where: { id } });
    if (!domain) throw new NotFoundException('Domain not found');
    return this.prisma.domain.delete({ where: { id } });
  }
}
