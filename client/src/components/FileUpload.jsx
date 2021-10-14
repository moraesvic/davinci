function submit(e) {
    //e.preventDefault();
    alert("You clicked submit!!!")
}

function FileUpload(props) {
    
    /* TO DO: include fields such as accept, limiting what kind
    of files are accepted */
    const action = props.action;
    const method = props.method || "POST";
    const fieldName = props.fieldName || "file";

    return (
        <form action={action} method={method} enctype="multipart/form-data">
        {/* // <form onSubmit={submit} enctype="multipart/form-data"> */}
            <input type="file" name={fieldName} />

            <input type="text" placeholder="just type something" name="text-input" />
            <textarea placeholder="type a long text" name="long-text" />

            <button type="submit">Send!</button>
        </form>
    );
}

export default FileUpload;