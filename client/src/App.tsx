import './App.css'
import axios from "axios";
import { useEffect } from "react";

function App() {

  useEffect(() => {
    axios.get('http://localhost:3001/post').then((response) => {
      console.log(response);
    });
  }, []);

  return (
    <>
      <div className='sexito'> </div>
    </>
  )
}

export default App
