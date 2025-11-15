import { createBrowserRouter } from "react-router-dom"
import Layout from "../pages/Layout/Layout"
import SearchPage from "../pages/SearchPage/SearchPage"
import WeatherDetails from "../pages/WeatherDetails/WeatherDetails"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <SearchPage />
            },
            {
                path: "weather/:date",
                element: <WeatherDetails />
            }
        ]
    }
])