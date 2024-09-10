import { IInputFieldProps } from '../../interfaces/props'
import formatClass from '../../utils/formatClass';
import styles from './InputField.module.css';

function InputField({label, type, name, required, placeholder, value, defaultValue, maxLength, minLength, hidden, max, min, classes, onChange } : IInputFieldProps) {
    const { formatClasses } = formatClass(styles, classes);

    return(
        <div className = {formatClasses}>
            <label> {label} </label>
            <input 
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
                defaultValue= {defaultValue}
                onChange = {onChange} 
            />
        </div>
    )
}

export default InputField;