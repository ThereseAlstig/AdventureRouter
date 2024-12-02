import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import Router from "./router/router.tsx";
import "./index.scss";
import { AuthProvider } from "./context/authContext.tsx";




ReactDOM.createRoot(document.getElementById("root")!).render(
<AuthProvider>
  <RouterProvider router={Router}>
   
  </RouterProvider>
 </AuthProvider>
);
