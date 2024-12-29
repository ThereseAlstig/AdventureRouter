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
import GoogleCallbackHandler from '../api/googleCallbackHandler';
import GitHubCallbackHandler from '../api/gitHubCallbackHandler';
import ThankYouPage from '../pages/tankYouPage';
import { AboutUs } from '../pages/aboutUs';
import { TragvelJourney } from '../pages/travelJourney';
import { ProductPage } from '../pages/productPage';
import ProtectedRoute from './protectedRouter';
import { AdminSearchPage } from '../pages/AdminSearch';

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
    element: (
         <ProtectedRoute requiredRole="admin">
            <Admin />
        </ProtectedRoute>
    )
       
},{
    path: "/adminSearch",
    element: (
    <ProtectedRoute requiredRole='admin'>
        <AdminSearchPage/>
        </ProtectedRoute>
    )
},
        
{
    path: "/categories/:categoryId",
    element: <CategoryPage />,
},
{
    path: "/categories/:categoryId/subcategories/:subcategoryId",
    element: <SubcategoryPage />,
},{
    path: "/google/callback",
    element: <GoogleCallbackHandler/>,
},
{ 
    path: "github/callback", 
    element: <GitHubCallbackHandler />
},
{
    path: "/tank-you",
    element: <ThankYouPage/>
},{
    path: "/about-us",
    element: <AboutUs/>
},{
    path: "/travel-journal/:id",
    element: <TragvelJourney/>
},{
    path: "/shop/:id",
    element: <ProductPage/>
}


]

}
    
],
{

    //testar nya versonen som släpps v. 7 tas bort efter uppdatering
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
}
);

export default Router;