import { IModuleCss } from '../interfaces/props';


function formatClass(moduleCss: IModuleCss, classes: Array<string>){
    
    const formatClasses = classes.map(element => moduleCss[element] || '' ).join(' ');

    return { formatClasses }
}

export default formatClass
