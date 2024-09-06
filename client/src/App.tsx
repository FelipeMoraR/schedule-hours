import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfileUser from './pages/ProfileUser/ProfileUser';
import NotFound from './pages/NotFound/NotFound';
import PrivateRoute from './routes/PrivateRoutes'; 
import NavBar from './components/NavBar/NavBar';

function App() {

  return (
    <>
      <NavBar/>
      
      <Routes>
        {/*Public Routes*/}
        <Route path = '/' element = {<HomePage/>}/>
        <Route path = '/login-user' element = {<LoginPage/>}/>
        
        {/*Private Routes*/}
        <Route path = '/profile-user' element = {<PrivateRoute element = {<ProfileUser/>}/>} />
        
        {/*404*/}
        <Route path = '*' element = {<NotFound/>}/>

      </Routes>
      
    </>
    
  )
}

export default App
