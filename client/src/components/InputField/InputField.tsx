import { IInputFieldProps } from '../../interfaces/props'
import formatClass from '../../utils/formatClass';
import styles from './InputField.module.css';

function InputField({label, type, name, required, placeholder, value, defaultValue, classes, onChange } : IInputFieldProps) {
    const { formatClasses } = formatClass(styles, classes);

    return(
        <div className = {formatClasses}>
            <label> {label} </label>
            <input 
                type = {type}
                name = {name}
                value = {value}
                required = {required}
                placeholder = {placeholder}
                defaultValue= {defaultValue}
                onChange = {onChange} 
            />
        </div>
    )
}

export default InputField;