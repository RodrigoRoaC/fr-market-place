import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [response, setResponse] = useState('');
  useEffect(() => {
    fetch('http://localhost:4000/health').then(res => res.json()).then(data => {
      setResponse(data.message);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>Estado del servicio:: { response }</p>
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
