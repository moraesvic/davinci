const DB = require("./db");
const Message = require("./message");

const fsPromises = require('fs').promises;

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
		uploadFactory("picture", 1024 * 1024)(req, res, async function(err) {
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
				const fileStatus = req.file;

				/* Let's process the file, stripping metadata and getting MD5 hash */
				
				const chpr = require('./ChildProcess.js');
				const [pwd, _] = await chpr("pwd -P");
				console.log(pwd);
				const [md5sum, stderr] = await chpr(`./api/process_img ${fileStatus.path}`);

				const origName = fileStatus.originalname;
				const data = await fsPromises.readFile(fileStatus.path)
				const hexData = data.toString('hex');
				
				console.log(`
				Now we will try to insert data into DB.
				Original name is ${origName}, md5sum is ${md5sum}, data is binary`);

				let responseDB = await DB.query(`
					INSERT INTO pics (
						pic_orig_name,
						pic_md5,
						pic_data
					) VALUES (
						$1::text,
						$2::text,
						$3::bytea
					);
					`, [origName, md5sum, hexData]
				);
				console.log(responseDB);

				res.send({
					success: true,
					message: `Your file was received and named internally as ${fileStatus.filename}`
				});

			} catch (err) {
				console.log(err);
				return res.status(400).send({
					success: false,
					code: "FILE_PROCESSING_ERROR"
				});
			}
			
		})

	});
}

