import React, { useContext } from "react";
import { AppProvider, AppContext } from "./context/ContextData";
import RouterWrapper from "./routes/RouterWrapper";
import { IntlProvider } from "react-intl";
import vi from "./locales/vi.json";
import en from "./locales/en.json";

const messages = { vi, en };

function AppContent() {
  const { locale } = useContext(AppContext);
  // Scroll to top button state
  const [showScroll, setShowScroll] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <IntlProvider locale={locale} messages={messages[locale]}>
        <RouterWrapper />
      </IntlProvider>
      {showScroll && (
        <button
          onClick={handleScrollTop}
          className="fixed bottom-6 cursor-pointer right-6 z-50 bg-[#febb02] hover:bg-[#e0a800] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition"
          aria-label="Scroll to top"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M12 8l6 6M12 8l-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>





      )}
    </>
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