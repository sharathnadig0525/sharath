import React, { createContext, useContext, useMemo, useState } from "react";
import {
  Category,
  SubCategory,
  ShoppingItem,
  ShoppingContextType,
} from "../types";
import { categories, subCategories, mockItems } from "../data/data";

const ShoppingContext = createContext<ShoppingContextType | undefined>(
  undefined
);

export function ShoppingProvider(props: { children: any }) {
  const { children } = props;

  const [items, setItems] = useState<ShoppingItem[]>(mockItems);

  function addItem(
    item: Omit<ShoppingItem, "id" | "createdAt">
  ): void {
    const newItem: ShoppingItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };

    setItems((prev) => [newItem, ...prev]);
  }


  const totalSpending = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  }, [items]);

  const highestCostItem = useMemo(() => {
    if (items.length === 0) return null;

    return items.reduce((prev, current) =>
      prev.price > current.price ? prev : current
    );
  }, [items]);

  const averageCost = useMemo(() => {
    if (items.length === 0) return 0;

    const total = items.reduce(
      (sum, item) => sum + item.price,
      0
    );

    return total / items.length;
  }, [items]);

  const value: ShoppingContextType = {
    categories: categories as Category[],
    subCategories: subCategories as SubCategory[],
    items,
    addItem,
    totalSpending,
    highestCostItem,
    averageCost,
  };

  return (
    <ShoppingContext.Provider value={value}>
      {children}
    </ShoppingContext.Provider>
  );
}

export function useShopping(): ShoppingContextType {
  const context = useContext(ShoppingContext);

  if (!context) {
    throw new Error("useShopping must be used inside ShoppingProvider");
  }

  return context;
}