import { HttpException, Injectable } from '@nestjs/common';
import { Collection } from '@prisma/client';
import { CreateCollectionDto } from 'src/modules/collection/dto/create.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CollectionService {
  constructor(private db: PrismaService) {}

  async createCollection(
    createCollectionDto: CreateCollectionDto,
  ): Promise<Collection> {
    try {
      return await this.db.collection.create({
        data: { ...createCollectionDto },
      });
    } catch (error) {
      throw new HttpException(
        'Something went wrong while creating collection.',
        500,
      );
    }
  }
}
