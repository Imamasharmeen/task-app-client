import { createBrowserRouter } from "react-router-dom";
import AddTasks from "../components/task/AddTasks";
import EditTasks from "../components/task/EditTasks";
import Main from "../layouts/Main";
import Login from "../pages/Authentication/Login/Login";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: "/add-tasks",
        element: (
          <PrivateRoute>
            <AddTasks />
          </PrivateRoute>
        ),
      },
      {
        path: "/edit-tasks",
        element: (
          <PrivateRoute>
            <EditTasks />
          </PrivateRoute>
        ),
      },
      {
        index: true,
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
