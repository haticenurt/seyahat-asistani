import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../pages/mainLayout";
import Home from "../pages/home";
import Type from "../pages/type";
import Cheap from "../pages/cheap";
import Medium from "../pages/medium";
import Comfort from "../pages/comfort";
import Profile from "../pages/profile";
import NotFound from "../pages/notfound";   
const routes = createBrowserRouter([
    {
        path:'/',
        element:<MainLayout/>,
        children:[
            {
                index:true,
                element:<Home/>
            },
            {
                path:'type',
                element: <Type/>
            },
            {
                path:'cheap',
                element:<Cheap/>
            },
          
            {
                path:'medium',
                element:<Medium/>
            },
            {
                path:'comfort',
                element:<Comfort/>
            },
           
           
            {
                path:':slug',
                element:<Profile/>
            }, 
            
            {
                path:'*',
                element:<NotFound/>
            }
        ]
    }
    
])
export default routes
