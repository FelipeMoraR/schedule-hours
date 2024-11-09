import styles from './AllClassesView.module.css';
import { IViewAllClases } from '../../interfaces/props';
import { useAuthContext } from '../../hooks/authContext';


const ViewAllClasses = ({allClasses, handleViewClass} : IViewAllClases) => {
    const { userData } = useAuthContext();
    console.log(userData)
    return(
        <>
            <div className = {styles.container} >
                        <h1>Mi loco tas en todas las clases :U</h1>

                        <div className = {styles.divitionGridClass + ' d-grid'}>
                            {
                                allClasses && allClasses.length > 0 ? (
                                    allClasses.map((element) => (
                                        <div key={element.id_class}>
                                            <p>id: {element.id_class}</p>
                                            <p onClick={() => handleViewClass(element.id_class) }> 
                                                Titulo: {element.class_name}
                                            </p>

                                            <h2>status: {element.status_name}</h2>

                                            <p>max: {element.max_number_member}</p>

                                            <img src={element.photo} alt={element.class_name} className = {styles.imgClass} />
                                            
                                        </div>
                                    ))
                                ) : (
                                    <p>No hay clases...</p>
                                )
                            }
                        </div>
                        
                    </div>
        </>
    )
}

export default ViewAllClasses;