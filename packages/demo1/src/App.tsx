import router from './router';
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <>
      <h1>子应用 demo1</h1>
      <RouterProvider router={router} />
    </>
  );
}

export default App;