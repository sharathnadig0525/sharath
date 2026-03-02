export interface Category {
  id: string;
  name: string;
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  categoryId: string;
  subCategoryId: string;
  quantity: number;
  price: number;
  date: string; 
  createdAt: number; 
}

export interface FilterState {
  search: string;
  categoryId: string | "all";
  subCategoryId: string | "all";
}

export interface CategoryReport {
  categoryName: string;
  totalAmount: number;
}

export interface ShoppingContextType {
  categories: Category[];
  subCategories: SubCategory[];
  items: ShoppingItem[];

  addItem: (item: Omit<ShoppingItem, "id" | "createdAt">) => void;

  totalSpending: number;
  highestCostItem: ShoppingItem | null;
  averageCost: number;
}