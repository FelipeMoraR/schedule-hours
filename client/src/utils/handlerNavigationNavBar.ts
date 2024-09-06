
function handlerNavigationNavBar(id:string, navigate: (path: string) => void) {
    
    switch (id){
        case 'irLogin':
            navigate('/login-user');
            return
        default:
            navigate('/');
            return
    }
}

export default handlerNavigationNavBar;