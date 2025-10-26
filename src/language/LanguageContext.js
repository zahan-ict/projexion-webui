import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    welcome: "Welcome",
    search: "Search...",
     // ---------------------------------Dashboard--------------------------------------------
    systemOverview : "System Overview",
    totalNode:"Total Node",
    totalEpaper:"Total Epaper",
    totalStation:"Total Station",
    totalTemplate:"Total Template",
    totalRack:"Total Rack",
    totalUser:"Total User",
    totalBranch:"Total Branch",
    role:"Roles",
    setting:"Settings",
  },
  de: {
    welcome: "Willkommen",
    search: "Suchen...",
    // ---------------------------------Dashboard---------------------------------------------
    systemOverview : "Systemübersicht",
    totalNode:"Gesamter Knoten",
    totalEpaper:"Gesamtes Epaper",
    totalStation:"Gesamte Station",
    totalTemplate:"Gesamte Vorlage",
    totalRack:"Gesamtes Rack",
    totalUser:"Gesamter Benutzer",
    totalBranch:"Gesamtes Filialen",
    role:"Rolle",
    setting:"Einstellung",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("de");

  const switchLanguage = (lang) => setLanguage(lang);

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
