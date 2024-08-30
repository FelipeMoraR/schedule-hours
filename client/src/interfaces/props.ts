import React from "react";


export interface PrivateRouteProps {
    element: React.ReactElement;
}

export interface InputFieldProps {
    label: string;
    type: string;
    value?: string;
    defaultValue?: string;
    classes: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; //This allow the access to the event property.
    //onChange is a property of react that waits a fuction to handle the change event.
    //React.ChangeEvent this is an interface that describes a change event. 
}