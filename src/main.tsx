import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "@/routes";
import App from "@/App";
import "@/global";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from "react-dnd";
import { AppProvider } from "./context";
import IndexRefactor from "./refactor";
import { RefactorProvider } from "./refactor/context/context";

const container = document.getElementById("root") as HTMLElement;

const root = createRoot(container);

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexRefactor />,
    children: routes,
    errorElement: <div>error</div>,
  },
]);

root.render(
  <StrictMode>
    <DndProvider backend={HTML5Backend}>
      <RefactorProvider>
        <AppProvider>
          <RouterProvider router={router} fallbackElement={<div>loading...</div>} />
        </AppProvider>
      </RefactorProvider>
    </DndProvider>
  </StrictMode>,
);
