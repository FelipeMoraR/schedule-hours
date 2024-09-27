import React from "react";

export interface IAuthContextType {
    errorLoged: string;
    isLoadingLogin: boolean;
    isAuthenticated: boolean;
    isLoadingLogout: boolean;
    isLoadingVerifyCookie: boolean;
    login: (username: string, password:string) => void;
    logout: () => void;
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