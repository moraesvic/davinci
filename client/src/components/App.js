import "./App.css";

import NavBar from "./NavBar";
import ProductForm from './ProductForm';
import MainContent from './MainContent';
import Footer from "./Footer";

const dropdowns = 
  [
    {title: "View", endpoint: "view"},
    {title: "Insert", endpoint: "insert"}
  ];

function App() {
  return (
    <div className="App">
        <NavBar dropdowns={dropdowns} title="DA VINCI" />
        <MainContent />
        <hr />
        <ProductForm
            action="/products"
            fieldName="picture"
        />
        <Footer 
            author="Victor Moraes"
            madeWith="☕"
            gitHub="https://github.com/moraesvic/davinci"
        />
    </div>
  );
}

export default App;
