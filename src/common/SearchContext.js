import { createContext, useContext, useState } from "react";
const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);  // counter trigger

  const triggerSearch = () => setSearchTrigger((prev) => prev + 1);  //  call manually

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, searchTrigger, triggerSearch }}>
      {children}
    </SearchContext.Provider>
  );
};
export const useSearch = () => useContext(SearchContext);