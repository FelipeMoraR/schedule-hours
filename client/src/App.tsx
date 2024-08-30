import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import ProfileUser from './pages/ProfileUser/ProfileUser';
import PrivateRoute from './routes/PrivateRoutes'; 


function App() {

  return (
    <Router>
      <Routes>
        {/*Public Routes*/}
        <Route path = "/" element = {<HomePage/>}/>


        {/*Private Routes*/}
        <Route path = '/profile-user' element = {<PrivateRoute element = {<ProfileUser/>}/>} />

      </Routes>
    </Router>
  )
}

export default App
