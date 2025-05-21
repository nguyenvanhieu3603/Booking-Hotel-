import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth") === "true" ? true : false);
  const [locale, setLocale] = useState("vi"); // Thêm state locale


  return (
    <AppContext.Provider
      value={{
        isAuth,
        setIsAuth,
        locale,
        setLocale, // Thêm vào context
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
