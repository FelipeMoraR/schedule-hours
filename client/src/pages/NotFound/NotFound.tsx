import styles from './NotFound.module.css';

function NotFound() {
    return (
        <div className= {styles.container}>
            <h1>404</h1>
            <p>Pagina no encontrada</p>
        </div>
    )
}

export default NotFound;