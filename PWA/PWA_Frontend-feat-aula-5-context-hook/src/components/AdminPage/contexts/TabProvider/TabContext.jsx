import React from 'react';

const context = {
  setGamesCount: () => {},
  countGames: 0
};

export const TabContext = React.createContext(context);
