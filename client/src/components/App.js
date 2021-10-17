import NavBar from "./NavBar";
import ProductForm from './ProductForm';
import Products from './Products';

const dropdowns = 
  [
    {title: "View", endpoint: "view"},
    {title: "Insert", endpoint: "insert"}
  ];

function App() {
  return (
    <div className="App">
        <NavBar dropdowns={dropdowns} title="DA VINCI" />
        <Products />
        <hr />
        dot env is ... {process.env.PUBLIC_URL}
        <h1>Enter a new product!</h1>
        <ProductForm
            action="/products"
            fieldName="picture"
        />
    </div>
  );
}

export default App;
