import { Body, Controller, Post } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from 'src/modules/collection/dto/create.dto';
import { Collection } from '@prisma/client';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  createCollection(
    @Body() createCollectionDto: CreateCollectionDto,
  ): Promise<Collection> {
    return this.collectionService.createCollection(createCollectionDto);
  }
}
