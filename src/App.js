import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const name = "Arnav";
  // let count = 0;

  let [countState, setCountState] = useState(0);

  const onClick = () => { 
    setTimeout( () => setCountState((c) => c + 1), 1000);
  }

  console.log("function running", countState);
  useEffect(() => {
    console.log("update", countState);

    window.addEventListener("scroll", () => console.log("scroll", countState));
  }, [countState]);

  return (<div style={{height: "2000px", backgroundColor : "red"}}>
     <button onClick={onClick}>{countState}</button>;
  </div>);
 

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello {name}!</p>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
