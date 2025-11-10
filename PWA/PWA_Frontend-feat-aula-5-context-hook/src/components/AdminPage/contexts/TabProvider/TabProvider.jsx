import React, { useMemo, useState } from "react";
import { TabContext } from "./TabContext";

export const TabProvider = ({ children }) => {
  const [gamesCount, setGamesCount] = useState(0);

  const value = useMemo(
    () => ({ setGamesCount, countGames: gamesCount }),
    [gamesCount]
  );

  return (
    <TabContext.Provider value={value}>
      {children}
    </TabContext.Provider>
  );
};
