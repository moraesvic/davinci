const DB = require("./db");
const Message = require("./message");

const fs = require('fs');

const Multer  = require('multer');
const upload = Multer({
		dest: 'uploads/',
		limits:
			{
				fileSize: 1000
			}
});

function uploadFile(filename) {
	const middleware = upload.single(filename);

	const wrapper = (req, res) => {
		middleware(req, res, function (err) {
			if (err instanceof multer.MulterError) {
				// A Multer error occurred when uploading.
			} else if (err) {
				// An unknown error occurred when uploading.
			}
	
			if (err) {
				console.log(err);
				res.send({
					status: false,
					message: `An error occurred: ${err.name}`
				});
			}
			// Everything went fine. 
			next()
		});
	}

	return wrapper;
}

module.exports = function(app){

	/* Prefix does not change dynamically here, only in front-end */
	// const mode = app.get("env");
	// const prefix = mode === "production" ? "" : "";

    /* PRODUCTS */
	app.get(`/products/all`, async function(req,res) {
		let result = await DB.query(
			"SELECT * FROM products;"
			);
		if (!result.rows)
			res.send(Message.genericError);
		else
			res.send(result.rows);
	});

	app.get(`/products`, async function(req,res) {
		let result = await DB.query(
			`
			SELECT * FROM products
			WHERE
				($1::text IS NULL OR prod_name ILIKE '%' || $1::text || '%')
				AND ($2::bigint IS NULL OR prod_id = $2::bigint);`,
			[req.query.name, req.query.id]
			);
		if (!result.rows)
			res.send(Message.genericError);
		else
			res.send(result.rows);
	});

	app.get(`/products/:id`, async function(req,res) {
		let result = await DB.query(
			`SELECT * FROM products
				WHERE prod_id = $1;`,
			[req.params.id]
			);
		if (!result.rows)
			res.send(Message.genericError);
		else
			res.send(result.rows);
	});
	
	app.post(`/products`, async function(req,res){
		console.log(req.body);

		res.send({status: "ok"});
	});

	/* PICTURES */

	app.get(`/pictures`, async function(req,res){
		
		res.send("You are here to see pictures");
	});

	app.post(`/pictures`, uploadFile("picture"), async function(req,res){
		const fileStatus = console.log(req.body.file)
		res.send({
			status: true,
			message: `Your file was received and named internally as ${fileStatus.filename}`
		});
	});
}

