import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes.tsx";
import { AuthProvider } from "./auth/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
);
