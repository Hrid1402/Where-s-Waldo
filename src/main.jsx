import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.jsx'
import './styles/index.css'
import Game from './pages/Game.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/game",
    element: <Game/>,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
