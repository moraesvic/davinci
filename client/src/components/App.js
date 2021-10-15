import DynLink from './DynLink';
import ProductForm from './ProductForm';
import Products from './Products';

function App() {
  return (
    <div className="App">
        <Products />
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
