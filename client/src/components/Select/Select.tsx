import { ISelect } from "../../interfaces/props";

const Select = <T,>({ id, name, values, selectedValue, keyValue, keyName, onChange}: ISelect<T>) => {
    
    return (
        <>
            <select 
                name = {name} 
                id = {id} 
                onChange = {onChange}
                value={selectedValue}
            >
                {values.map((val, index) => (
                    <option 
                        key={index} 
                        value={val[keyValue] as string} 
                    >
                        {val[keyName] as string}
                    </option>
                ))}
            </select>
        </>
    )
}

export default Select;