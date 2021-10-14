const fsPromises = require('fs').promises;
const path = require('path');
const Multer  = require('multer');

const DB = require("./db");
const chpr = require('./ChildProcess.js');

function uploadFactory(filename, sizeLimit)
{
    const storage = Multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            //Appending extension
            cb(null, Date.now()
                + '-' + Math.round(Math.random() * 1E9)
                + path.extname(file.originalname));
        }
        
    });

	const upload = Multer({
		storage: storage,
        limits:{
            fileSize: sizeLimit
        }
	});

	return upload.single(filename);
}

function processPicture(req, res, fieldName)
{
    return new Promise( (resolve, reject) => {
        uploadFactory(fieldName, 1024 * 1024)(req, res, async function(err) {
            if (err)
                reject(err);
            else
                resolve(req.file);
        });
    }); 
}

function storePicture(fileStatus)
{
    return new Promise( async (resolve, reject) => {
        if (!fileStatus) {
            fsPromises.unlink(`${fileStatus.path}`);
            reject();
            return;
        }
        try {
            /* Let's process the file, stripping metadata and getting MD5 hash */
            const [md5sum, _] = await chpr(`./api/process_img "${fileStatus.path}"`);
            const origName = fileStatus.originalname;

            console.log(`
            Now we will try to insert data into DB.
            Original name is ${origName}, md5sum is ${md5sum}, path is ${fileStatus.path}`);

            let isPicAlreadyInDB = await DB.query(`
            SELECT pic_id FROM pics WHERE pic_md5 = $1 LIMIT 1
            `, [md5sum]);

            console.log(isPicAlreadyInDB);
            if (isPicAlreadyInDB.rows.length > 0) {
                resolve(isPicAlreadyInDB.rows[0].pic_id);
                return;
            }

            let responseDB = await DB.query(`
            INSERT INTO pics (
                pic_orig_name,
                pic_md5,
                pic_path
            ) VALUES (
                $1::text,
                $2::text,
                $3::text
            ) RETURNING pic_id;`, [origName, md5sum, fileStatus.path]);
            console.log(responseDB);

            resolve(responseDB.rows[0].pic_id);

        } catch (err) {

            console.log(err);
            fsPromises.unlink(`${fileStatus.path}`);
            reject(err);

        }
    });
}

module.exports = {
    processPicture,
    storePicture
};