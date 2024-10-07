import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoutes'; 
import NavBar from './components/NavBar/NavBar';
import { useAuthContext } from './hooks/authContext';
import { useModal } from './utils/UseModal.ts';
import Modal from './components/Modal/Modal.tsx';
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const ProfileUser = lazy(() => import('./pages/ProfileUser/ProfileUser'));
const RegisterUser = lazy(() => import('./pages/RegisterUser/RegisterUser'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

function App() {
  const {isLoadingLogout} = useAuthContext();
  const { closeModal } = useModal();

  return (
    <>
      <NavBar/>

      <Modal
        id = 'loadingLogout'
        type = 'loader'
        title = 'Cerrando sesion..'
        isOpen = {isLoadingLogout}
        classes = {['modal-infomative-grey']}
        onClose = {closeModal}
      />

      
    <Suspense fallback={<div>LOADING CLIENT PAGE</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<HomePage />} />
          <Route path='/login-user' element={<LoginPage />} />
          <Route path='/register-user' element={<RegisterUser />} />
          
          {/* Private Routes */}
          <Route path='/profile-user' element={<PrivateRoute element={<ProfileUser />} />} />
          
          {/* 404 */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
      
      
      
    </>
    
  )
}

export default App
