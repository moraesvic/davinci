const Multer  = require('multer');
const path = require('path');

const DB = require("./db");
const pictures = require("./pictures");
const Exceptions = require("./exceptions");

module.exports = function(app){

    /* PRODUCTS */
	app.get(`/products/all`, async function(req,res) {
		const PRODUCTS_PER_PAGE = 10;
		const offset = 	req.query.page ?
						PRODUCTS_PER_PAGE * req.query.page :
						0;
		let result = await DB.query(
			`SELECT * FROM products
			OFFSET $1
			LIMIT ${PRODUCTS_PER_PAGE};`,
			[offset]);
		if (!result.rows)
			res.send(Exceptions.InternalServerError.name);
		else
			res.send(result.rows);
	});

	app.get(`/products/count`, async function(req,res) {
		let result = await DB.query(
			`SELECT COUNT(*) FROM products;`);
		if (!result.rows)
			res.send(Exceptions.InternalServerError.name);
		else
			res.send(result.rows[0].count);
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
			res.send(Exceptions.InternalServerError.name);
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
			res.send(Exceptions.InternalServerError.name);
		else
			res.send(result.rows[0]);
	});
	
	app.post(`/products`, async function(req,res){
		let picId = null;
		try {
			const fileStatus = await pictures.processPicture(req, res, "picture");
			picId = fileStatus ? 
					await pictures.storePicture(fileStatus) :
					null;

			/* req.body is only populated after Multer runs. Which is unfortunate,
			 * because we would be able to reduce server load by not processing
			 * pictures if the rest of the form presents a bad request */
			console.log(req.body);

			const prodName = req.body.prodName,
				prodDescr = req.body.prodDescr,
				prodPrice = Math.floor ( parseFloat(req.body.prodPrice) * 100),
				prodInStock = parseInt(req.body.prodInStock);

			const query = `
			INSERT INTO products (
				prod_name,
				prod_descr,
				prod_img,
				prod_price,
				prod_instock
			) VALUES (
				$1::text,
				$2::text,
				$3::bigint,
				$4::bigint,
				$5::bigint
			) RETURNING * ;
			`;

			try {
				let responseDB = await DB.query(query, [
					prodName, prodDescr, picId, prodPrice, prodInStock
				]);
			} catch {
				throw Exceptions.InvalidInput;
			}

			res.send({
				success: true,
				picId: picId
			});
		} catch(err) {
			console.log(err);

			/* In case picture was already saved, we need to delete it */
			if (picId)
					pictures.deletePicture({ id: picId });
						
			return res.status(400).send({
				success: false,
				code: err.name
			});
		}
	});

	/* PICTURES */

	app.get(`/pictures/:id`, async function(req,res){
		let result = await DB.query(
			`SELECT * FROM pics
			WHERE pic_id = $1
			LIMIT 1;`,
			[req.params.id]
			);

		if (result.rows.length === 0)
			res.status(404).send("404 NOT FOUND");
		else
			res.sendFile(path.join(app.get('root'), result.rows[0].pic_path));
	});

	app.delete(`/pictures/all`, async function(req, res){
		let result = await DB.query(`SELECT * FROM pics;`);
		try {
			result.rows.forEach( row => pictures.deletePicture({id: row.pic_id}) );
			res.send(`deleted ${result.rows.length} pictures`);
		} catch (err) {
			console.log(err);
			res.send(`failed to delete all pictures`);
		}
		
	})

	app.post(`/pictures`, async function(req, res){
		/* This is useful for testing, but is probably not going to be in the final API */
		try {
			const fileStatus = await pictures.processPicture(req, res, "picture");
			const picId = await pictures.storePicture(fileStatus);

			res.send({
				success: true,
				picId: picId
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

