// src/hooks/useUser.ts
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { storageService } from '@/utils/storage';
import { CryptoService } from '@/utils/crypto';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isTrial, setIsTrial] = useState(true);

  useEffect(() => {
    const savedUser = storageService.getUser();
    if (savedUser) {
      setUser(savedUser);
      setIsTrial(savedUser.isTrial);
    }
  }, []);

  const register = (email: string, password: string): User => {
    const passwordHash = CryptoService.hashPassword(password);
    const newUser = storageService.createUser(email, passwordHash);
    setUser(newUser);
    setIsTrial(false);
    return newUser;
  };

  const login = (email: string, password: string): boolean => {
    const savedUser = storageService.getUser();
    if (savedUser && savedUser.email === email) {
      const isValid = CryptoService.verifyPassword(password, savedUser.passwordHash);
      if (isValid) {
        setUser(savedUser);
        setIsTrial(savedUser.isTrial);
        storageService.updateUser({ lastLoginAt: Date.now() });
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsTrial(true);
  };

  const updateTrialGoodsCount = (count: number) => {
    if (user) {
      storageService.updateUser({ trialGoodsCount: count });
      setUser({ ...user, trialGoodsCount: count });
    }
  };

  return {
    user,
    isTrial,
    register,
    login,
    logout,
    updateTrialGoodsCount
  };
}