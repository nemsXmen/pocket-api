export type TransactionRow = {
  id: string;
  user_id: string;
  title: string;
  amount_minor: number;
  type: 'INCOME' | 'OUTCOME';
  category_id: string;
  category_name: string;
  date: string;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type CategoryRow = {
  id: string;
  user_id: string;
  name: string;
  type: 'INCOME' | 'OUTCOME';
  icon: string;
  color: string;
  created_at: string;
  updated_at: string;
};

export type SettingsRow = {
  user_id: string;
  user_name: string;
  email: string;
  currency: string;
  theme: string;
  notifications: boolean;
  updated_at: string;
};

export type SupabaseDatabase = {
  public: {
    Tables: {
      transactions: {
        Row: TransactionRow;
        Insert: Omit<TransactionRow, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TransactionRow, 'created_at' | 'updated_at'>>;
      };
      categories: {
        Row: CategoryRow;
        Insert: Omit<CategoryRow, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CategoryRow, 'created_at' | 'updated_at'>>;
      };
      settings: {
        Row: SettingsRow;
        Insert: SettingsRow;
        Update: Partial<SettingsRow>;
      };
    };
  };
};
