import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import BaseLayout from '../layout/index';

/** 路由配置 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace={true} />, // 重定向
  },
  {
    path: '/',
    element: <BaseLayout />,
    errorElement: <>BaseLayout Error</>,
    children: [
      {
        path: '/home',
        element: <>主应用 Home</>,
      },
      {
        path: '/docs',
        element: <Outlet />,
        children: [
          { path: '/docs/test1', element: <>主应用 Docs Test1</> },
          { path: '/docs/test2', element: <>主应用 Docs Test2</> },
        ],
      },
      {
        path: '/demo1',
        element: <Navigate to="/demo1/temp1" replace={true} />,
        errorElement: <>子应用 demo1 Error</>,
        children: [
          {
            path: '/demo1/temp1',
            element: <></>,
          },
          {
            path: '/demo1/temp2',
            element: <></>,
          },
        ],
      },
      {
        path: '/demo2',
        element: <></>,
        errorElement: <>子应用 demo2 Error</>,
      },
    ],
  },
  {
    path: '/login',
    element: <>Login</>,
  },
]);

export default router;
