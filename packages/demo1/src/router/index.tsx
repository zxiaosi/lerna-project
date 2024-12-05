import { createBrowserRouter } from 'react-router-dom';

/** 路由配置 */
const router = createBrowserRouter([
  {
    path: '/demo1/temp1',
    element: <>temp1</>,
  },
  {
    path: '/demo1/temp2',
    element: <>temp2</>,
  },
]);

export default router;
