import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Chat from './../pages/Chat'

let router = createBrowserRouter([
    {
        path: '/',
        Component: Chat
    }
])

const MiRouter = () => <RouterProvider router={router} />
export default MiRouter;