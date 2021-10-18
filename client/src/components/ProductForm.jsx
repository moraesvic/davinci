import React from 'react';
import './styles.css';

function ProductForm(props) {
    
    /* TO DO: include fields such as accept, limiting what kind
    of files are accepted */

    const fieldName = props.fieldName || "file";

    let data = new FormData();

    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      data.append(name, value);
    }

    const handleFile = (e) => {
        const file = e.target.files[0];
        console.log(`file is ${file}`);
        data.append(`${fieldName}`, file);
    }
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(data);
        const action = `${process.env.PUBLIC_URL}/${props.action}`.replace(/\/\//g, "/");
        const method = props.method || "POST";
        const ret = await fetch(
            action, {
                method: method,
                body: data,
        });
        if (!ret) {
            alert("response inexistent!")
            return;
        }
        const parsed = await ret.json();
        console.log(`parsed is`);
        console.log(parsed);
        if (!parsed.success) {
            alert("response indicates failure...");
            return;
        }
        alert(`request succeeded! picture id is ${parsed.picId}`);
             
    }

    return (
        <form 
        onSubmit={handleSubmit}>
        <table className="center">
        <tbody>
        <tr>
            <td>Product name</td>
            <td>
                <input type="text"
                name="prodName"
                onChange={handleChange}
                required
                />
            </td>
        </tr>
        <tr>
            <td>Product description</td>
            <td>
                <textarea
                name="prodDescr"
                onChange={handleChange} />
            </td>
        </tr>
        <tr>
            <td>Price</td>
            <td>
                <input type="number"
                name="prodPrice"
                onChange={handleChange}
                />
            </td>
        </tr>
        <tr>
            <td>How many do you have in stock?</td>
            <td>
                <input type="number"
                name="prodInStock"
                onChange={handleChange}
                />
            </td>
        </tr>
        <tr>
            <td>Choose an image</td>
            <td>
                <input type="file"
                name={fieldName}
                onChange={handleFile}
                />
            </td>
        </tr>
        <tr>
            <td>
                <button type="submit">Submit</button>
            </td>
        </tr>
        </tbody>
        </table>
        </form>
    );
}

export default ProductForm;