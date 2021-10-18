import NavBar from "./NavBar";
import ProductForm from './ProductForm';
import MainContent from './MainContent';

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
        <h1>Enter a new product!</h1>
        <ProductForm
            action="/products"
            fieldName="picture"
        />
    </div>
  );
}

export default App;
