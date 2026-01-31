import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: string[];
  isLoading: boolean;
  isFavorite: (carId: string) => boolean;
  toggleFavorite: (carId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }

    setIsLoading(true);
    const response = await api.user.getFavorites();
    if (response.data) {
      setFavorites(response.data.favorites);
    }
    setIsLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const isFavorite = useCallback((carId: string) => {
    return favorites.includes(carId);
  }, [favorites]);

  const toggleFavorite = useCallback(async (carId: string) => {
    if (!isAuthenticated) {
      return;
    }

    // Optimistic update
    const wasFavorite = favorites.includes(carId);
    if (wasFavorite) {
      setFavorites(prev => prev.filter(id => id !== carId));
    } else {
      setFavorites(prev => [...prev, carId]);
    }

    const response = await api.user.toggleFavorite(carId);
    if (response.error) {
      // Revert on error
      if (wasFavorite) {
        setFavorites(prev => [...prev, carId]);
      } else {
        setFavorites(prev => prev.filter(id => id !== carId));
      }
    }
  }, [isAuthenticated, favorites]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        isFavorite,
        toggleFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
