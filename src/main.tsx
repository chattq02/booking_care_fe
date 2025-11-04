import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { Provider as JotaiProvider } from "jotai";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <JotaiProvider>
        <App />
        <Toaster position="top-center" />
      </JotaiProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
