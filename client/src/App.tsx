import './App.css'
import axios from "axios";
import { useEffect } from "react";

function App() {

  useEffect(() => {
    axios.get('http://localhost:5000/post').then((response) => {
      console.log(response);
    });
  }, []);

  return (
    <>
      <div className='sexito'> esto es algo nuevo </div>
    </>
  )
}

export default App
