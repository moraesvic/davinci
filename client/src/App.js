import logo from './logo.svg';
import './App.css';

let mode;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    mode = "development";
} else {
    mode = "production";
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Hello world! We are running in {mode} mode.</h1>
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
        <a href="/davinci/products/all">See our products (JSON version)</a>
      </header>
    </div>
  );
}

export default App;
