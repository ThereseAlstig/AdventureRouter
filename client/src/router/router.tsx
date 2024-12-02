import { createBrowserRouter } from 'react-router-dom';
import { NotFound } from "../error/notFound"
import { Layout } from "../layouts/layout"
import { Home } from "../pages/home"
import { TripPlanner } from "../pages/tripPlanner"
import { SharedAdventure } from '../pages/sharedAdventure';
import { Cart } from '../pages/cart';
import { Shop } from '../pages/shop';
import { MyPage } from '../pages/myPage';
import { Admin } from '../pages/admin';
import { CategoryPage } from '../pages/categoryPage';
import { SubcategoryPage } from '../pages/subcategoryPage';

const Router = createBrowserRouter([


{
path: "/",
element: <Layout/>,
errorElement: <NotFound/>,
children: [
    {
        index: true,
        element: <Home/>,
    },
{
        path: "/journey-planner",
        element: <TripPlanner/>,
},
{
    path: "/shared-adventure",
    element: <SharedAdventure/>
},
{   
    path: "/cart",
    element: <Cart/>
},
{   
    path: "/shop",
    element: <Shop/>
},{
path: "/my-page",
element: <MyPage/>

},{
    path: "/admin",
    element: <Admin/>,
},
{
    path: "/categories/:categoryId",
    element: <CategoryPage />,
},
{
    path: "/categories/:categoryId/subcategories/:subcategoryId",
    element: <SubcategoryPage />,
},

]

}
    
])

export default Router;