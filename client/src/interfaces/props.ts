import React from "react";



export interface IPrivateRouteProps {
    element: React.ReactElement;
}

export interface IModuleCss { 
    [key: string]: string //This is an index signature to allow iterations in an object.
}

export interface IButton{
    text: string;
    type: any;
    classes: Array<string>;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IInputFieldProps {
    label: string;
    type: string;
    name: string;
    required: boolean | undefined;
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    classes: Array<string>;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; //This allow the access to the event property.
    //onChange is a property of react that waits a fuction to handle the change event.
    //React.ChangeEvent this is an interface that describes a change event. 
}