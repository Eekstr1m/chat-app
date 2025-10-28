import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "./components/ui/provider.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import ReactQueryProvider from "./utils/ReactQueryProvider.tsx";
import { SocketProvider } from "./context/SocketContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { Router } from "./pages/router.tsx";

// react image crop css module
import "react-image-crop/dist/ReactCrop.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <Provider>
        <ReactQueryProvider>
          <SocketProvider>
            <Toaster />
            <Router />
          </SocketProvider>
        </ReactQueryProvider>
      </Provider>
    </AuthProvider>
  </StrictMode>
);
