import styles from './AllClassesView.module.css';
import { IViewAllClases } from '../../interfaces/props';
import Button from '../Button/Button';
import extractFolderNameImg from '../../utils/ExtractFolderNameImg';

const ViewAllClasses = ({allClasses, type_user, isEditable, handleViewClass, deleteClass} : IViewAllClases) => {
    return(
        <>
            <div className = {styles.container} >
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
                                                element.time_class && element.date_class ? (
                                                    <p>Fecha {element.date_class} - {element.time_class} </p>
                                                ) : (
                                                    <p>No tiene fechas</p>
                                                )
                                            }

                                            {
                                                element.categories && element.categories.length > 0 ? (
                                                    element.categories.map((cat) => (
                                                        <div key={cat.id_category}>
                                                            {cat.id_category} - {cat.category_name}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No categories available</p> // Para el caso en que no haya categorías
                                                )
                                            }

                                            {
                                                type_user != 2 && isEditable && deleteClass && handleViewClass ? (
                                                    <div>
                                                        <Button
                                                            id = 'deleteClass'
                                                            text = 'Eliminar clase'
                                                            type = 'buttom'
                                                            classes = {['btn-delete']}
                                                            onClick = {() => {
                                                                const infoImg = extractFolderNameImg(element.photo);
                                                                
                                                                deleteClass(element.id_class, infoImg.nameFolder, infoImg.nameImg);
                                                            }}
                                                        />
                                                    </div>
                                                ) : null
                                            }
                                        </div>
                                    ))
                                ) : null
                            }
                        </div>
                        
                    </div>
        </>
    )
}

export default ViewAllClasses;