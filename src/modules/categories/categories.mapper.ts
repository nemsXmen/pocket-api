import { Category } from '@/common/types/api-contracts';
import { CategoryRow } from '@/infra/supabase/supabase.types';

export function mapCategoryRowToContract(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    icon: row.icon,
    color: row.color,
  };
}
