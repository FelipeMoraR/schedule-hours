import { InputFieldProps } from '../../interfaces/props'

function InputField({label, type, value, defaultValue, classes, onChange } : InputFieldProps) {
    return(
        <div className = {classes}>
            <label> {label} </label>
            <input 
                type = {type}
                value = {value}
                defaultValue= {defaultValue}
                onChange = {onChange} 
            />
        </div>
    )
}

export default InputField