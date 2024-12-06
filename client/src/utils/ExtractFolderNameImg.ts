const extractFolderNameImg = (urlImg: string) => {
    const urlDivided = urlImg.split('/');
    const nameFolder = urlDivided[urlDivided.length - 2]
    const nameImg = urlDivided[urlDivided.length - 1].split('.')[0];
    
    return { nameFolder, nameImg }
}

export default extractFolderNameImg;