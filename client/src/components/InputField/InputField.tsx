import { IInputFieldProps } from '../../interfaces/props'
import formatClass from '../../utils/FormatClass';
import styles from './InputField.module.css';

function InputField({id, label, type, name, required, placeholder, value, defaultValue, maxLength, minLength, hidden, max, min, classes, checked, onChange } : IInputFieldProps) {
    const { formatClasses } = formatClass(styles, classes);

    return(
        <div className = {formatClasses}>
            <label htmlFor={id}> {label} </label>
            <input 
                id = {id}
                type = {type}
                name = {name}
                value = {value}
                hidden = {hidden}
                max = {max}
                min = {min}
                maxLength = {maxLength}
                minLength = {minLength}
                required = {required}
                placeholder = {placeholder}
                defaultValue = {defaultValue}
                checked = {checked}
                onChange = {onChange} 
            />
        </div>
    )
}

export default InputField;