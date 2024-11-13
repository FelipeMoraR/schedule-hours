import styles from './AllClassesView.module.css';
import { IViewAllClases } from '../../interfaces/props';
import Button from '../Button/Button';


const ViewAllClasses = ({allClasses, typeView, isEditable, handleViewClass, deleteClass} : IViewAllClases) => {
    
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
                                            {
                                                handleViewClass ? (
                                                    <p onClick={() => handleViewClass(element.id_class) }> 
                                                        Titulo Clickeable: {element.class_name}
                                                    </p>
                                                ) : (
                                                    <p>Titulo normal: {element.class_name}</p>
                                                )
                                            }
                                            

                                            <h2>status: {element.status_name}</h2>

                                            <p>max: {element.max_number_member}</p>

                                            <img src={element.photo} alt={element.class_name} className = {styles.imgClass} />

                                            {
                                                typeView != 2 && isEditable && deleteClass ? (
                                                    <div>
                                                        <Button
                                                            id = 'deleteClass'
                                                            text = 'Eliminar clase'
                                                            type = 'buttom'
                                                            classes = {['btn-delete']}
                                                            onClick = {() => {
                                                                deleteClass(element.id_class);
                                                            }}
                                                        />

                                                        <Button
                                                            id = 'modifyClass'
                                                            text = 'Modificar clase'
                                                            type = 'buttom'
                                                            classes = {['btn-modify']}
                                                            onClick = {() => {
                                                                handleViewClass ? (
                                                                    handleViewClass(element.id_class)
                                                                ) : null
                                                            }}
                                                        />
                                                    </div>
                                                ) : null
                                            }
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