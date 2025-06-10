import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [appStatus, setAppStatus] = useState('initializing');

  useEffect(() => {
    console.log('[App] Component mounted');
    setAppStatus('mounted');
    
    return () => {
      console.log('[App] Component will unmount');
    };
  }, []);

  useEffect(() => {
    console.log('[App] Status changed:', appStatus);
  }, [appStatus]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>Current status: {appStatus}</p>
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
