import React from 'react';

import * as Fetch from '../js/fetch';
import "./Products.css";

function Image(props)
{    
    return props.id ?
        <img src={`/pictures/${props.id}`} alt={props.alt} className="prod-img"/> :
        <img src={require('../img/no-icon.png').default} alt={props.alt} className="prod-img"/>;
}

function ProductList(props)
{
    const [products, setProducts] = React.useState([]);

    React.useEffect(() => {
        const wrapper = async () => {
            const response = await Fetch.get(`/products/all?page=${props.page}`);
            setProducts(response);
        }
        wrapper();
    }, [props.page]);

    return (
        <table>
        { products.map(prod => 
            <div key={prod.prod_id}>
                <tr>
                    <th>
                        <h2>{prod.prod_name}</h2>
                    </th>
                    <th>
                        <h3>{(prod.prod_price / 100).toFixed(2)} $</h3>
                        <h4>In stock: {prod.prod_instock}</h4>
                    </th>
                </tr>
                <tr>
                    <td>{prod.prod_descr}</td>
                    <td><Image id={prod.prod_img} alt={prod.prod_descr}/></td>
                </tr>
            </div>
        ) }
        </table>
    );
}

function Products(props)
{


    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        const wrapper = async () => {
            const response = await Fetch.get(`/products/count`);
            setCount(response);
        }
        wrapper();
    }, []);

    /* */

    const [currentPage, setCurrentPage] = React.useState(0);

    function decreasePage()
    {
        if (currentPage > 0)
            setCurrentPage(currentPage - 1);
    }

    function increasePage()
    {
        if (currentPage < count / 2)
            setCurrentPage(currentPage + 1);
    }

    /* */

    function Pager(props)
    {
        return (
            <div>
                <p>Total products: {count}</p>
                <p>Current page: {currentPage}</p>
                <button onClick={decreasePage}>&lt;</button>
                <button onClick={increasePage}>&gt;</button>
            </div>
        )
    }
    
    return (
        <div>
        <Pager maxCount={count} />
        <ProductList page={currentPage} />
        </div>
    );
}

export default Products;