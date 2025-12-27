
import  './styles/App.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Main from './main'
import Learn from './Flashcard/learn'
import Result from './Quiz/result'
import Flashcard from './Flashcard/Flashcard'
import Quiz from './Quiz/Quiz'
import QuizStart from './Quiz/QuizStart'
import FlashCardExample from './Flashcard/example'; 
import Signup from './account/signup'
import Login from './account/login'
import  ChangePass  from './account/change'
import Forgot from './account/forgot'
import  ResetPass  from './account/reset'
import QuizLayout from './Quiz/quiz_layout'
import Footer from './Footer'
import PublicRoute from './account/PublicRoute'
const router = createBrowserRouter([
  {
    path:'/',
    element: (
        <div className="main-layout"> 
            <Main /> 
            <Footer /> 
        </div>
    )
  },
  {
    path:'/signup',
    element: (
        <div className="main-layout"> 
        <PublicRoute>
            <Signup/>
            <Footer />
            </PublicRoute> 
        </div>
    )
  },
  {
    path:'/login',
    element:  (
        <div className="main-layout"> 
        <PublicRoute>
            <Login/>
            <Footer /> 
            </PublicRoute>
        </div>
    )
    
  },
  {
    path:'/reset-password/:token',
    element: (
        <div className="main-layout"> 
        <PublicRoute>
            <ResetPass/>
            <Footer /> 
            </PublicRoute>
        </div>
    )
  },
  {
    path:'/changePassword',
    element: (
        <div className="main-layout">
            <ChangePass/>
            <Footer />
             
        </div>
    )
  },
  {
    path:'/forgotPassword',
    element: (
        <div className="main-layout">
            <Forgot/>
            <Footer /> 
        </div>
    )
  },
   { element: <QuizLayout />,
   children: [
  {
    path: '/quiz/:topicId/:modes',
    element: <Quiz/>
  }]
},
  {
    path: '/quiz/start',
    element: <QuizStart/>
  },
  {
    path: '/result',
    element:(
        <div className="main-layout"> 
            <Result/>
            <Footer /> 
        </div>
    )
  },
  {
    path:'/learn/example',
    element: <FlashCardExample/>
  },
  
  {
    path:'/learn/:topicId',
    element: <FlashCardExample/>
  },
  {
    path:'/learn',
    element:<Learn/>
  }
  

])

function App() {
  return(
 <>
    <RouterProvider router={router} />
 </>);
}

export default App
