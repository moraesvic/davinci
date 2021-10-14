const Multer  = require('multer');
const path = require('path');

const DB = require("./db");
const Message = require("./message");
const pictures = require("./pictures");

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
			WHERE prod_id = $1
			LIMIT 1;`,
			[req.params.id]
			);
		if (result.rows.length === 0)
			res.send(Message.genericError);
		else
			res.send(result.rows[0]);
	});
	
	app.post(`/products`, async function(req,res){
		console.log(req.body);

		res.send({status: "ok"});
	});

	/* PICTURES */

	app.get(`/pictures/:id`, async function(req,res){
		let result = await DB.query(
			`SELECT * FROM pics
			WHERE pic_id = $1
			LIMIT 1;`,
			[req.params.id]
			);
		console.log(result);
		if (result.rows.length === 0)
			res.send(Message.genericError);
		else
			res.sendFile(path.join(app.get('root'), result.rows[0].pic_path));
	});

	app.post(`/pictures`, async function(req, res){
		try {
			const fileStatus = await pictures.processPicture(req, res, "picture");
			const picId = await pictures.storePicture(fileStatus);

			console.log(req.body);
			console.log(req.file);

			res.send({
				success: true,
				message: `Your file was received and named internally as ${picId}`
			});
		} catch(err) {
			let errCode = err instanceof Multer.MulterError ?
						err.code :
						"INTERNAL_SERVER_ERROR";
						
			return res.status(400).send({
				success: false,
				code: errCode
			});
		}
	});
}

