export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  sku: string | null;
  brand: string | null;
  price: number | null;
  unit: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductWithCategory extends Product {
  categories?: {
    name: string;
  } | null;

  category?: Category | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BusinessSettings {
  id: number;
  business_name: string;
  whatsapp_number: string | null;
  phone_number: string | null;
  email: string | null;
  address: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;

        Insert: Partial<
          Omit<Category, "id" | "created_at" | "updated_at">
        > & {
          id?: string;
        };

        Update: Partial<
          Omit<Category, "id" | "created_at" | "updated_at">
        >;

        Relationships: [];
      };

      products: {
        Row: Product;

        Insert: Partial<
          Omit<Product, "id" | "created_at" | "updated_at">
        > & {
          id?: string;
          name: string;
        };

        Update: Partial<
          Omit<Product, "id" | "created_at" | "updated_at">
        >;

        Relationships: [];
      };

      business_settings: {
        Row: BusinessSettings;

        Insert: Partial<
          Omit<
            BusinessSettings,
            "created_at" | "updated_at"
          >
        > & {
          id?: number;
        };

        Update: Partial<
          Omit<
            BusinessSettings,
            "created_at" | "updated_at"
          >
        >;

        Relationships: [];
      };
    };

    Views: Record<string, never>;

    Functions: Record<string, never>;

    Enums: Record<string, never>;

    CompositeTypes: Record<string, never>;
  };
}