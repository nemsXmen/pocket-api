import { Module } from '@nestjs/common';
import { CategoriesModule } from '@/modules/categories/categories.module';
import { TransactionsController } from '@/modules/transactions/transactions.controller';
import { TransactionsRepository } from '@/modules/transactions/transactions.repository';
import { TransactionsService } from '@/modules/transactions/transactions.service';

@Module({
  imports: [CategoriesModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository],
  exports: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule {}
