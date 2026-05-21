import { createContext, useContext } from 'react';
import type { Poem } from './poems';

export interface AdminContextValue {
  isAdmin: boolean;
  openPin: () => void;
  closeAdmin: () => void;
  editPoem: (poem: Poem, tab?: 'poem' | 'verses' | 'video') => void;
}

export const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
  openPin: () => {},
  closeAdmin: () => {},
  editPoem: () => {},
});

export const useAdmin = () => useContext(AdminContext);
