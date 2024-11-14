import { IClass } from "../../interfaces/props";



const ClassNotEditable = ({ id_class, class_name, description, max_number_member, photo, status_name, type_user, categories } : IClass) => {
    return (
        <>
            <h1>VISTA INTERNA clase normal, esta es su id = {id_class} </h1>
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
                    categories.map(el => (
                        <div key={el.id_category}>
                            {el.category_name}
                        </div>
                    ))
                }

                {
                    type_user == 2  ? (
                        <div>
                            <button>Unirme</button>
                        </div>
                    ) : null
                }
        </>
    )
}   

export default ClassNotEditable;