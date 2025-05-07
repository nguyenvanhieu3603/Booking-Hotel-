import React from "react";
import { AppProvider } from "./context/ContextData";
import RouterWrapper from "./routes/RouterWrapper";

function App() {
  return (
    <AppProvider>
      <RouterWrapper />
    </AppProvider>
  );
}

export default App;
