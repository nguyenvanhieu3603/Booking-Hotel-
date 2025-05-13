import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [locale, setLocale] = useState("vi"); // Thêm state locale

  const accountLogIn = [
    {
      tk: "admin",
      mk: "1234",
    },
  ];

  return (
    <AppContext.Provider
      value={{
        isAuth,
        setIsAuth,
        accountLogIn,
        locale,
        setLocale, // Thêm vào context
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
