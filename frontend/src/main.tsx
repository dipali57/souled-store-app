import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes.tsx";
import { AuthProvider } from "./auth/AuthContext.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
      <Provider store={store}>
    <AuthProvider>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: "red",
              color: "white",
              zIndex: 9999,
              marginTop: "60px"
            },
            success: {
              duration: 3000,
              style: {
                background: "#b91010",
              },
            },
          }}
        />
        <AppRoutes />
    </AuthProvider>
      </Provider>
  </BrowserRouter>,
);
