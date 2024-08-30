import { useState, useEffect } from "react";

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        
        setIsLoading(false);
        setIsAuthenticated(!!token);
    }, []); 

    
    return { isAuthenticated, isLoading };
}