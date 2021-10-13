function FileUpload(props) {
    
    const action = props.action;
    const method = props.method || "POST";
    const fieldName = props.fieldName || "file";

    return (
        <form action={action} method={method} enctype="multipart/form-data">
            <input type="file" name={fieldName} />
            <button type="submit">Send!</button>
        </form>
    );
}

export default FileUpload;