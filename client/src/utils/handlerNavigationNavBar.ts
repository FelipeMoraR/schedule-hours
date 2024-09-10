
function handlerNavigationNavBar(id:string, navigate: (path: string) => void) {
    
    switch (id){
        case 'irLogin':
            navigate('/login-user');
            return
        case 'irRegister':
            navigate('/register-user');
            return
        default:
            navigate('/');
            return
    }
}

export default handlerNavigationNavBar;