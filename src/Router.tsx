import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/Root";
import Home from "./pages/Calendar";
import Event from "./pages/Event";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      children: [
        {
            path: "/",
            element: <Home />,
            index: true
        },
        {
          path: "/event",
          element: <Event />,
          index: true
        },      
      ]
    }
  ]
);

export default router