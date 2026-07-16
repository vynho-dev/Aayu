import { ClerkProvider } from "@clerk/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { ClerkApp, DevelopmentApp } from "./App";
import { store } from "./app/store";
import "./styles.css";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      {clerkKey ? <ClerkProvider publishableKey={clerkKey}><ClerkApp /></ClerkProvider> : <DevelopmentApp />}
    </Provider>
  </StrictMode>,
);
