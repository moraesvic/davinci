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
            const name = Date.now()
                + '-' + Math.round(Math.random() * 1E9);
            
            /* We cannot simply count with original file extension, because
             * user could simply rename an executable as .jpeg */
            /*{
                + path.extname(file.originalname).toLowerCase();
            }*/

            /* Unix allows up to 255 characters in file names
             * This does not include path. With path, it can go up to 4096
             * Anyway, let's leave a fat margin */

            if (name.length > 192)
                cb("File name is too long!")
            else
                cb(null, name);
        }
        
    });

    function checkFileType(file, cb){
        console.log(file);
        console.log("MIMETYPE IS" + file.mimetype);
        
        
        // Allowed ext
        const filetypes = /jpeg|jpg|png|gif/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        /* The implementation for mimetype is wrong. Better to use Unix's "file" later on */
        /*{
        
        // Check mime
        const mimetype = filetypes.test(file.mimetype);

        }*/

        if(mimetype && extname){
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        
    }

	const upload = Multer({
		storage: storage,
        limits: {
            /* renamed filename will be checked by fileFilter as well */
            fieldNameSize: 192,
            fileSize: sizeLimit
        },
        fileFilter: function(req, file, cb){
            checkFileType(file, cb);
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
            /* Get REAL mime-type. Multer's implementation is not correct */
            /* This will output something like image/png, image/jpeg, text/plain */
            const [mimetype, _] = await chpr(
                `file --mime-type "${fileStatus.path}" | sed -rn "s/^.+[[:space:]]+(.*)$/\1/p"`);
            const [type, subtype] = mimetype.replace("\n" , "").split("/");
            if (type !== "image")
            { /* */ }
            /* rename to extension "subtype" */
            
            /* Let's process the file, stripping metadata and getting MD5 hash */
            
            const [md5sum, __] = await chpr(`./api/process_img "${fileStatus.path}"`);
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