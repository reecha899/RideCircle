import { User } from '@/types/user';

const STORAGE_KEY = 'ridecircle_user';
const USERS_STORAGE_KEY = 'ridecircle_all_users';

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveCurrentUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  
  const allUsers = getAllUsers();
  const existingIndex = allUsers.findIndex(u => u.id === user.id);
  if (existingIndex >= 0) {
    allUsers[existingIndex] = user;
  } else {
    allUsers.push(user);
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers));
}

export function getAllUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function clearCurrentUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

