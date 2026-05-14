import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService implements OnModuleInit {
  private logger = new Logger('Products Service');

  constructor(private prisma: PrismaService) {}
  onModuleInit() {
    this.logger.log('Init');
  }

  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({ data: createProductDto });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalPages = await this.prisma.product.count({
      where: { available: true },
    });

    return {
      data: await this.prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true },
      }),
      metadata: {
        totalPages,
        page,
      },
    };
  }

  async findOne(id: number) {
    const productFound = await this.prisma.product.findUnique({
      where: { id, available: true },
    });

    if (!productFound) {
      throw new NotFoundException('Product not found');
    }

    return productFound;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _id, ...data } = updateProductDto;
    void _id;
    await this.findOne(id);

    return await this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: { available: false },
    });
  }
}
