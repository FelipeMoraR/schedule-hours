import { useLocation } from 'react-router-dom';
import LoginForm  from '../../components/LoginForm/LoginForm';
import { useModal } from '../../utils/UseModal';
import Modal from '../../components/Modal/Modal';
import { useEffect } from 'react';

function LoginPage() {
    const location = useLocation();
    const from = location.state?.from?.pathname || false;
    const { showModal, closeModal, isModalOpen } = useModal();
    
    useEffect(() => {
        if(!!from) showModal('pageError'); 
    }, [])
    
    return(
        <>  
            <Modal
                id = 'modalInfoPage'
                type = 'informative'
                title = 'Autenticación'
                paragraph = 'Para acceder a la pagina debes iniciar sesión.'
                isOpen = {isModalOpen('pageError')}
                classes = {['modal-infomative-grey']}
                onClose={closeModal}
            />
            <div>
                Estas en la fkin loginPage
                <h1>Login</h1>
                <LoginForm/>
            </div>
        </>
    )
}   

export default LoginPage;