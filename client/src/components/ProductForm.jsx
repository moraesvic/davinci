import './styles.css';

function submit(e) {
    //e.preventDefault();
    alert("You clicked submit!!!")
}

function productForm(props) {
    
    /* TO DO: include fields such as accept, limiting what kind
    of files are accepted */
    const action = props.action;
    const method = props.method || "POST";
    const fieldName = props.fieldName || "file";

    return (
        <form 
            action={`${process.env.PUBLIC_URL}/${action}`}
            method={method}
            enctype="multipart/form-data">
        <table className="center">
        <tr>
            <td>Product name</td>
            <td><input type="text" name="prodName" required /></td>
        </tr>
        <tr>
            <td>Product description</td>
            <td><textarea name="prodDescr" /></td>
        </tr>
        <tr>
            <td>Price</td>
            <td><input type="number" name="prodPrice" /></td>
        </tr>
        <tr>
            <td>How many do you have in stock?</td>
            <td><input type="number" name="prodInStock" /></td>
        </tr>
        <tr>
            <td>Choose an image</td>
            <td><input type="file" name={fieldName} /></td>
        </tr>
        <tr>
            <td>
                <button type="submit">Submit</button>
            </td>
        </tr>
        </table>
        </form>
    );
}

export default productForm;