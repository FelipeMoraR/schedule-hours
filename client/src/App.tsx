import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfileUser from './pages/ProfileUser/ProfileUser';
import NotFound from './pages/NotFound/NotFound';
import PrivateRoute from './routes/PrivateRoutes'; 


function App() {

  return (
    <Router>
      <Routes>
        {/*Public Routes*/}
        <Route path = '/' element = {<HomePage/>}/>
        <Route path = '/login-user' element = {<LoginPage/>}/>
        
        {/*Private Routes*/}
        <Route path = '/profile-user' element = {<PrivateRoute element = {<ProfileUser/>}/>} />
        
        {/*404*/}
        <Route path = '*' element = {<NotFound/>}/>

      </Routes>
    </Router>
  )
}

export default App
