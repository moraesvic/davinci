const DB = require("./db");
const Message = require("./message");

const fs = require('fs');

const Multer  = require('multer');


function uploadFactory(filename, sizeLimit)
{
	const upload = Multer({
		dest: 'uploads/',
		limits:
			{
				fileSize: sizeLimit
			}
	});

	return upload.single(filename);
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

	app.post(`/pictures`, async function(req, res){
		uploadFactory("picture", 1000)(req, res, async function(err) {
			if (err) {
				let errCode;
				errCode = err instanceof Multer.MulterError ?
							err.code :
							"INTERNAL_SERVER_ERROR";
				return res.status(400).send({
					success: false,
					code: errCode
				});
			}

			try {

			} catch {
				return res.status(400).send({
					success: false,
					code: "FILE_PROCESSING_ERROR"
				});
			}
			const fileStatus = req.file;
			
			const origName = fileStatus.originalname;
			const data = fs.readFileSync(fileStatus.path);
			const hexData = data.toString('hex');
			let responseDB = await DB.query(`
				INSERT INTO test_pics (image)
				VALUES (
					$1::bytea
				);
				`, [hexData]
			);
			console.log(responseDB);

			res.send({
				success: true,
				message: `Your file was received and named internally as ${fileStatus.filename}`
			});
		})

	});
}

