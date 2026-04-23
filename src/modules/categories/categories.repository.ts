import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { SUPABASE_TABLES } from '@/common/constants/supabase.constants';
import { SupabaseService } from '@/infra/supabase/supabase.service';
import { CategoryRow } from '@/infra/supabase/supabase.types';
import {
  CategoriesQueryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/modules/categories/categories.types';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findManyByUser(
    userId: string,
    query: CategoriesQueryDto,
  ): Promise<CategoryRow[]> {
    let statement = (this.supabase.admin as any)
      .from(SUPABASE_TABLES.CATEGORIES)
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true });

    if (query.type) {
      statement = statement.eq('type', query.type);
    }

    const { data, error } = await statement;

    if (error) {
      throw error;
    }

    return (data ?? []) as CategoryRow[];
  }

  async findByIdForUser(
    userId: string,
    id: string,
  ): Promise<CategoryRow | null> {
    const { data, error } = await (this.supabase.admin as any)
      .from(SUPABASE_TABLES.CATEGORIES)
      .select('*')
      .eq('user_id', userId)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as CategoryRow | null) ?? null;
  }

  async createForUser(
    userId: string,
    input: CreateCategoryDto,
  ): Promise<CategoryRow> {
    const payload: CategoryRow = {
      id: randomUUID(),
      user_id: userId,
      name: input.name,
      type: input.type,
      icon: input.icon,
      color: input.color,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await (this.supabase.admin as any)
      .from(SUPABASE_TABLES.CATEGORIES)
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data as CategoryRow;
  }

  async updateForUser(
    userId: string,
    id: string,
    input: UpdateCategoryDto,
  ): Promise<CategoryRow> {
    const { data, error } = await (this.supabase.admin as any)
      .from(SUPABASE_TABLES.CATEGORIES)
      .update({
        ...(input.name ? { name: input.name } : {}),
        ...(input.type ? { type: input.type } : {}),
        ...(input.icon ? { icon: input.icon } : {}),
        ...(input.color ? { color: input.color } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new NotFoundException('Category not found');
    }

    return data as CategoryRow;
  }

  async deleteForUser(userId: string, id: string): Promise<void> {
    const { error } = await (this.supabase.admin as any)
      .from(SUPABASE_TABLES.CATEGORIES)
      .delete()
      .eq('user_id', userId)
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
}
