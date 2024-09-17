import React, { createContext, useContext } from "react";
import { useFonts } from "expo-font";

const FontContext = createContext({ fontsLoaded: false });

export const FontProvider = ({ children }) => {
  const [fontsLoaded] = useFonts({
    Title: require("../assets/fonts/title.ttf"),
    Other: require("../assets/fonts/sss.ttf"),
    Details: require("../assets/fonts/details.ttf"),
  });

  return (
    <FontContext.Provider value={{ fontsLoaded }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => useContext(FontContext);
