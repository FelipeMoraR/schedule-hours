const convertBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader(); //FileReader is async
        fileReader.readAsDataURL(file);
  
        fileReader.onload = () => {
          resolve(fileReader.result);
        };
  
        fileReader.onerror = (error) => {
          reject(error);
        };
      });
};

export default convertBase64;