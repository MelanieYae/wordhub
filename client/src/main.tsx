import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/Root.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Home from "./pages/Home.tsx";
import MyPosts from "./pages/MyPosts.tsx";
import Write from "./pages/Write.tsx";
import "./index.css";
import Profile from "./pages/Profile.tsx";
import Search from "./pages/Search.tsx";
import PostId from "./pages/PostId.tsx";
import Edit from "./pages/Edit.tsx";
import { UserProvider } from "./providers/UserProvider.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: 'post/:postId', element: <PostId /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "my-posts",
        element: <MyPosts />,
      },
      { path: "profile", element: <Profile /> },
      { path: "search", element: <Search /> },
    ],
  },
  { path: '/write', element: <UserProvider children={<Write />} /> },
  { path: '/edit/:postId', element: <Edit /> }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
