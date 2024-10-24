import styles from './RegisterClass.module.css';
import FormRegisterClass from '../../components/FormRegisterClass/FormRegisterClass';

function RegisterClass() {
    
    return (
        <>
            <div className={styles.container}>
                <h1>Esta es la landing register CLASS</h1>

                <FormRegisterClass
                    classes={['hola']}
                />
            </div>
        </>
        
    )
}

export default RegisterClass;