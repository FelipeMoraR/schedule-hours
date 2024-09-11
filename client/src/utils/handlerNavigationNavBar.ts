
function handlerNavigationNavBar(id:string, navigate: (path: string) => void) {
    
    switch (id){
        case 'goLogin':
            navigate('/login-user');
            return
        case 'goRegister':
            navigate('/register-user');
            return
        case 'goProfile':
            navigate('/profile-user');
            return
        default:
            navigate('/');
            return
    }
}

export default handlerNavigationNavBar;