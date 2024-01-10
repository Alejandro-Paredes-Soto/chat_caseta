import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Chat from './../pages/Chat'
import Login from './../pages/Login';

let router = createBrowserRouter([
    {
        path: '/',
        Component: Login
    },
    {
        path: '/chat',
        Component: Chat
    }
])

const MiRouter = () => <RouterProvider router={router} />
export default MiRouter;