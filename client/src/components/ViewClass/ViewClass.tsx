import { IViewClass } from "../../interfaces/props";
import Button from "../Button/Button";




const ViewClass = ({id_class, class_name, description, max_number_member, photo, status_name, type_user, handleBack} : IViewClass) => {

    return(
        <>

            <Button
                id = 'goBackAllClasses'
                text = 'Volver'
                type = 'buttom'
                classes = {['clase']}
                onClick = {handleBack}
            />

            <h1>VISTA INTERNA, esta es su id = {id_class} </h1>
            <div>
                <h2>Clase: {class_name}</h2>
                <h3>{max_number_member}</h3>
            </div>

            
            <div>
                <h4>{status_name}</h4>
            </div>

            <div>
                <p>{description}</p>
                <img src={photo} alt={class_name} />
            </div>

            {
                type_user == 2 ? (
                    <button>Unirse jeje</button>
                ) : null
            }
        </>
    )
};

export default ViewClass;