const DB = require("./db");
const Message = require("./message");

module.exports = function(app){
    /* PRODUCTS */
	app.get('/products/all', async function(req,res) {
		let result = await DB.query(
			"SELECT * FROM products"
			);
		if (!result.rows)
			res.send(Message.genericError);
		else
			res.send(result.rows);
	});

	app.get('/products/:id', async function(req,res) {
		let result = await DB.query(
			`SELECT * FROM products
				WHERE prod_id = $1`,
			[req.params.id]
			);
		if (!result.rows)
			res.send(Message.genericError);
		else
			res.send(result.rows);
	});
	
	app.post('/products', async function(req,res){
		/* */
	});
}

