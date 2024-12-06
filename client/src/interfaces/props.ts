
export interface IAuthContextType {
    errorLoged: string;
    isLoadingLogin: boolean;
    isAuthenticated: boolean;
    isLoadingLogout: boolean;
    isLoadingVerifyCookie: boolean;
    userData: any;
    login: (username: string, password:string) => void;
    logout: () => void;
    handleIsFromOtherPage: () => void;
    handleErrorLoged: (value: string) => void;
}

export interface IPublicRouteProps {
    element: React.ReactElement;
}

export interface IPrivateRouteProps {
    element: React.ReactElement;
}

export interface IModuleCss { 
    [key: string]: string //This is an index signature to allow iterations in an object.
}

export interface IRegisterForm {
    classes: Array<string>;
}

export interface IButton{
    id: string;
    text: string;
    type: any;
    classes: Array<string>;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IInputFieldProps {
    id: string;
    label: string;
    type: string;
    name: string;
    required: boolean | undefined;
    placeholder?: string;
    value?: any;
    hidden?: boolean;
    max?:number;
    min?:number;
    maxLength?: number;
    minLength?: number;
    defaultValue?: string;
    classes: Array<string>;
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; //This allow the access to the event property.
    //onChange is a property of react that waits a fuction to handle the change event.
    //React.ChangeEvent this is an interface that describes a change event. 
}


export interface IModal {
    id: string;
    type: string;
    title: string;
    paragraph?: string;
    isOpen: boolean;
    onClose: () => void;
    classes: Array<string>;
}

export interface IErrorResponse {
    status: number;
    message: string;
}

export interface IRegisterClass { 
    classes: Array<string>;
}

export interface ITextArea { 
    id: string;
    name: string;
    label: string;
    value?: string;
    placeholder?: string;
    maxlength?: number;
    rows: number;
    cols: number;
    required: boolean | undefined;
    classes: Array<string>;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface IAllCategoryClass { 
    id_category: number;
    category_name: string;
}

export interface ICategoryClass {
    id_category: number;
    category_name: string;
}

export interface IStatusClass {
    id_status: number;
    name: string;
}

export interface IAllClasses { 
    id_class: number;
    class_name: string;
    description: string;
    max_number_member: number;
    photo: string;
    status_name: string;
    time_class: string;
    date_class: string;
    categories: Array<ICategoryClass>;
}

export interface IMember {
    id_type_class_user: number;
    username: string;  
    id_status_class_user: number;
    id_user: number; 
}

export interface IClass {
    id_class: number;
    class_name: string;
    description: string;
    max_number_member: number;
    photo: string;
    status_name: string;
    type_user?: number;
    categories: Array<ICategoryClass>;
    allCategories?: Array<ICategoryClass>;
    allStatus? : Array<IStatusClass>;
    members?: Array<IMember>;
    time_class?: string;
    date_class?: string;
    deleteClass? : (id_class: number, nameFolder: string, nameImg: string) => void;
    handleCancellClass? : (id_class: number) => void;
    hendleUploadMembers? : (id_user: number) => void;
}

export interface IViewClass {
    id_class: number;
    class_name: string;
    description: string;
    max_number_member: number;
    photo: string;
    status_name: string;
    type_user?: number;
    time_class?: string;
    date_class?: string;
    isEditable: boolean;
    categories: Array<ICategoryClass>;
    allCategories?: Array<ICategoryClass>;
    allStatus? : Array<IStatusClass>;
    handleBack?: () => void;
    deleteClass? : (id_class: number, nameFolder: string, nameImg: string) => void;
    handleCancellClass?: (id_class: number) => void;
}

export interface IViewAllClases{
    allClasses: IAllClasses[],
    type_user: number;
    isEditable: boolean;
    handleViewClass?: (id_class: any) => void
    deleteClass? : (id_class: number, nameFolder: string, nameImg: string) => void;
}

export interface INavBarBtn{
    isAuthenticated: boolean;
    handleButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
    logout?: () => void;
    typeUser?: number;
}

export interface IOptionSelect {
    value: string;
    name: string;
}

export interface ISelect<T> { //<T> Allow any type of obj
    id: string;
    name: string;
    values: T[];
    keyValue: keyof T;
    keyName: keyof T;
    selectedValue?: string | number;  // DefaultValue
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface IBodyCreateClass {
    id_class: number;
    new_name?: string; 
    new_description?: string;
    new_max_number_member?: string;
    new_photo?: string;
    new_id_status?: string,
    new_categories?: Array<string>;
    new_date?: string;
    new_time?: string;
}