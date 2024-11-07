// @ts-nocheck
const API_BASE_URL = 'http://localhost/api/v1';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Ingredients
  ingredients: {
    list: () => fetchApi('/ingredients'),
    get: (id: number) => fetchApi(`/ingredients/${id}`),
    create: (data: any) =>
      fetchApi('/ingredients', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) =>
      fetchApi(`/ingredients/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchApi(`/ingredients/${id}`, { method: 'DELETE' }),
  },

  // Subrecipes
  subrecipes: {
    list: () => fetchApi('/subrecipes'),
    get: (id: number) => fetchApi(`/subrecipes/${id}`),
    create: (data: any) =>
      fetchApi('/subrecipes', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) =>
      fetchApi(`/subrecipes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchApi(`/subrecipes/${id}`, { method: 'DELETE' }),
  },

  // Recipes
  recipes: {
    list: () => fetchApi('/recipes'),
    get: (id: number) => fetchApi(`/recipes/${id}`),
    create: (data: any) =>
      fetchApi('/recipes', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) =>
      fetchApi(`/recipes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchApi(`/recipes/${id}`, { method: 'DELETE' }),
  },

  // Products
  products: {
    list: () => fetchApi('/products'),
    get: (id: number) => fetchApi(`/products/${id}`),
    create: (data: any) =>
      fetchApi('/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) =>
      fetchApi(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchApi(`/products/${id}`, { method: 'DELETE' }),
  },

  // Expenses
  expenses: {
    list: () => fetchApi('/expenses'),
    get: (id: number) => fetchApi(`/expenses/${id}`),
    create: (data: any) =>
      fetchApi('/expenses', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) =>
      fetchApi(`/expenses/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchApi(`/expenses/${id}`, { method: 'DELETE' }),
  },

  // Income
  income: {
    list: () => fetchApi('/incomes'),
    get: (id: number) => fetchApi(`/incomes/${id}`),
    create: (data: any) =>
      fetchApi('/incomes', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) =>
      fetchApi(`/incomes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchApi(`/incomes/${id}`, { method: 'DELETE' }),
  },

  // Analytics
  analytics: {
    getTotalSales: (startDate?: string, endDate?: string) =>
      fetchApi('/analytics/total-sales', {
        method: 'GET',
        params: { startDate, endDate },
      }),
    getTotalExpenses: (startDate?: string, endDate?: string) =>
      fetchApi('/analytics/total-expenses', {
        method: 'GET',
        params: { startDate, endDate },
      }),
    getExpensesByType: (startDate?: string, endDate?: string) =>
      fetchApi('/analytics/expenses-by-type', {
        method: 'GET',
        params: { startDate, endDate },
      }),
    getExpensePercentages: (startDate?: string, endDate?: string) =>
      fetchApi('/analytics/expense-percentages', {
        method: 'GET',
        params: { startDate, endDate },
      }),
  },
};