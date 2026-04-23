import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { CurrentUser } from '@/common/guards/current-user.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import type { AuthenticatedUser } from '@/common/guards/auth.guard';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { CategoriesService } from '@/modules/categories/categories.service';
import {
  categoriesQuerySchema,
  categoryIdParamsSchema,
  createCategorySchema,
  updateCategorySchema,
} from '@/modules/categories/categories.schemas';

@Controller('categories')
@UseGuards(AuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(createCategorySchema)) body: unknown,
  ) {
    return this.categoriesService.create(user.id, body as never);
  }

  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(categoriesQuerySchema.partial()))
    query: unknown,
  ) {
    return this.categoriesService.list(user.id, query as never);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param(new ZodValidationPipe(categoryIdParamsSchema)) params: unknown,
    @Body(new ZodValidationPipe(updateCategorySchema)) body: unknown,
  ) {
    const { id } = params as { id: string };
    return this.categoriesService.update(user.id, id, body as never);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param(new ZodValidationPipe(categoryIdParamsSchema)) params: unknown,
  ): Promise<void> {
    const { id } = params as { id: string };
    await this.categoriesService.remove(user.id, id);
  }
}
