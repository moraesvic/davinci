import React from 'react';
import './styles.css';
import "./ProductForm.css";

function ProductForm(props) {
    
    /* TO DO: include fields such as accept, limiting what kind
    of files are accepted */

    const fieldName = props.fieldName || "file";

    let formDict = {};

    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      formDict[name] = value;
    }

    const handleFile = (e) => {
        const MAX_FILE_SIZE = 5 * 1024 * 1024 ; // 5 megabytes
        const file = e.target.files[0];
        if (file.size > MAX_FILE_SIZE) {
            alert("Your file is too large! We accept up to 5 megabytes.")
            return;
        }
        formDict[`${fieldName}`] = file;
    }
  
    const handleSubmit = async (e) => {
        e.preventDefault();

        let data = new FormData();
        for (let [key, value] of Object.entries(formDict))
            data.append(key, value);
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
        <div className="product-form">
        <h1>Enter a new product!</h1>
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
                min="0.01"
                step="0.01"
                onChange={handleChange}
                />
            </td>
        </tr>
        <tr>
            <td>How many do you have in stock?</td>
            <td>
                <input type="number"
                name="prodInStock"
                min="0"
                step="1"
                onChange={handleChange}
                />
            </td>
        </tr>
        <tr>
            <td>
                Product image<br/>
                <span className="small">
                    (up to 5 MiB)
                </span>
            </td>
            <td>
                <label for="file-upload" className="form-button" type="button">
                    Choose file
                </label>
                <input type="file"
                name={fieldName}
                onChange={handleFile}
                accept="image/*"
                id="file-upload"
                />
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <button
                type="submit"
                className="submit-button">
                    Submit
                </button>
            </td>
        </tr>
        </tbody>
        </table>
        </form>
        </div>
    );
}

export default ProductForm;