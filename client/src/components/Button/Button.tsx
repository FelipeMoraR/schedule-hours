import styles from './Button.module.css';
import { IButton } from '../../interfaces/props';
import formatClass from '../../utils/formatClass';

function Button ({id, text, type, classes, onClick}: IButton){
    
    const { formatClasses } = formatClass(styles, classes);

    return(
        <button id = {id} type = {type} className = {formatClasses} onClick = {onClick}> {text} </button>
    )
    
}

export default Button;