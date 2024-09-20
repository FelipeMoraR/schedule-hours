import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfileUser from './pages/ProfileUser/ProfileUser';
import RegisterUser from './pages/RegisterUser/RegisterUser'
import NotFound from './pages/NotFound/NotFound';
import PrivateRoute from './routes/PrivateRoutes'; 
import NavBar from './components/NavBar/NavBar';
import { useAuthContext } from './hooks/authContext';
import { useModal } from './utils/UseModal.ts';
import Modal from './components/Modal/Modal.tsx';



function App() {
  const { isLoadingVerifyCookie, isLoadingLogout} = useAuthContext();
  const { closeModal } = useModal();

  return (
    <>
      <NavBar/>
      
      <Modal
        id = 'loadingPages'
        type = 'loader'
        title = 'Loading... cookie'
        isOpen = {isLoadingVerifyCookie}
        classes = {['modal-infomative-grey']}
        onClose = {closeModal}
      />

      <Modal
        id = 'loadingLogout'
        type = 'loader'
        title = 'Cerrando sesion..'
        isOpen = {isLoadingLogout}
        classes = {['modal-infomative-grey']}
        onClose = {closeModal}
      />

      
      <Routes>
        {/*Public Routes*/}
        <Route path = '/' element = {<HomePage/>}/>
        <Route path = '/login-user' element = {<LoginPage/>} />
        <Route path = '/register-user' element = {<RegisterUser/>} />
        
        {/*Private Routes*/}
        <Route path = '/profile-user' element = {<PrivateRoute element = {<ProfileUser/>}/>} />
        
        {/*404*/}
        <Route path = '*' element = {<NotFound/>}/>

      </Routes>
      
      
      
    </>
    
  )
}

export default App
