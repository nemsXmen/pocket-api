import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@/common/guards/auth.guard';
import type { AuthenticatedUser } from '@/common/guards/auth.guard';
import { CurrentUser } from '@/common/guards/current-user.decorator';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import {
  createTransactionSchema,
  transactionIdParamsSchema,
  transactionsQuerySchema,
  updateTransactionSchema,
} from '@/modules/transactions/transactions.schemas';
import { TransactionsService } from '@/modules/transactions/transactions.service';

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(createTransactionSchema)) body: unknown,
  ) {
    return this.transactionsService.create(user.id, body as never);
  }

  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(transactionsQuerySchema.partial()))
    query: unknown,
  ) {
    const normalizedQuery = transactionsQuerySchema.parse(query ?? {});
    return this.transactionsService.findAll(user.id, normalizedQuery);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param(new ZodValidationPipe(transactionIdParamsSchema)) params: unknown,
  ) {
    const { id } = params as { id: string };
    return this.transactionsService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param(new ZodValidationPipe(transactionIdParamsSchema)) params: unknown,
    @Body(new ZodValidationPipe(updateTransactionSchema)) body: unknown,
  ) {
    const { id } = params as { id: string };
    return this.transactionsService.update(user.id, id, body as never);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param(new ZodValidationPipe(transactionIdParamsSchema)) params: unknown,
  ): Promise<void> {
    const { id } = params as { id: string };
    await this.transactionsService.remove(user.id, id);
  }
}
