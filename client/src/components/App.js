import logo from './logo.svg';
import './App.css';

import DynLink from './DynLink';
import FileUpload from './FileUpload';

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
        <DynLink
            endpoint="/products/all"
            text="See our products (JSON version)"
        />
        <FileUpload
            action="/pictures"
            fieldName="picture"
        />
      </header>
    </div>
  );
}

export default App;
