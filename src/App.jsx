import React, { useContext } from "react";
import { AppProvider, AppContext } from "./context/ContextData";
import RouterWrapper from "./routes/RouterWrapper";
import { IntlProvider } from "react-intl";
import vi from "./locales/vi.json";
import en from "./locales/en.json";

const messages = { vi, en };

function AppContent() {
  const { locale } = useContext(AppContext);

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <RouterWrapper />
    </IntlProvider>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;