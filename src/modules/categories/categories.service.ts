import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '@/common/types/api-contracts';
import { CategoriesRepository } from '@/modules/categories/categories.repository';
import { mapCategoryRowToContract } from '@/modules/categories/categories.mapper';
import {
  CategoriesQueryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/modules/categories/categories.types';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async list(userId: string, query: CategoriesQueryDto): Promise<Category[]> {
    const rows = await this.categoriesRepository.findManyByUser(userId, query);
    return rows.map(mapCategoryRowToContract);
  }

  async getOrThrow(userId: string, id: string): Promise<Category> {
    const row = await this.categoriesRepository.findByIdForUser(userId, id);
    if (!row) {
      throw new NotFoundException('Category not found');
    }

    return mapCategoryRowToContract(row);
  }

  async create(userId: string, input: CreateCategoryDto): Promise<Category> {
    const row = await this.categoriesRepository.createForUser(userId, input);
    return mapCategoryRowToContract(row);
  }

  async update(
    userId: string,
    id: string,
    input: UpdateCategoryDto,
  ): Promise<Category> {
    const row = await this.categoriesRepository.updateForUser(
      userId,
      id,
      input,
    );
    return mapCategoryRowToContract(row);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.categoriesRepository.deleteForUser(userId, id);
  }
}
