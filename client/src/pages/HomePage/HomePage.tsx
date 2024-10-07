import styles from './HomePage.module.css';
import { useAuthContext } from '../../hooks/authContext';

function HomePage() {
    const {userData, isAuthenticated} = useAuthContext();
    return (
        <>
        <div className= {styles.container}>
            <h1>Bienvenido al home</h1>
            {
                 isAuthenticated && userData ? (
                    <h2>Bienvenido = {userData.username}</h2>
                ) : null
            }
            <p>Este es el home</p>
        </div>
        </>
        
    )
}

export default HomePage;