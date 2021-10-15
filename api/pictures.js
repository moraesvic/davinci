const fsPromises = require('fs').promises;
const path = require('path');
const Multer  = require('multer');

const DB = require("./db");
const chpr = require('./ChildProcess.js');

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function uploadFactory(filename, sizeLimit)
{
    const storage = Multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            const name = Date.now()
                + '-' + pad(Math.round(Math.random() * 1E9), 9);
            
            /* We cannot simply count with original file extension, because
             * user could simply rename an executable as .jpeg 
             * We will deal with this matter outside of Multer middleware */

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
        /* Reserved for future use */
        return cb(null, true);        
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

function storePicture(fileStatus, allowRedundant = true)
{
    /* The option allowRedundant will allow a new picture into the database
     * even if there is already an identical picture.
     * This can be useful if many products have the same display image */

    return new Promise( async (resolve, reject) => {
        if (!fileStatus) {
            reject();
            return;
        }
        try {
            /* Get REAL mime-type. Multer's implementation is not correct */
            /* This will output something like image/png, image/jpeg, text/plain */
            const [mimetype, _] = await chpr(
                `file --mime-type "${fileStatus.path}" | sed -rn "s/^.+[[:space:]]+(.*)$/\\1/p"`);
            const [type, subtype] = mimetype.replace("\n" , "").split("/");

            if (type !== "image")
                throw "This is not an image!";
            
            /* rename to extension "subtype" */
            const newPath = `${fileStatus.path}.${subtype.toLowerCase()}`;
            await fsPromises.rename(fileStatus.path, newPath);
            fileStatus.path = newPath;
            
            /* Let's process the file, stripping metadata and getting MD5 hash */
            
            const [md5sum, __] = await chpr(`./api/process_img "${fileStatus.path}"`);
            const origName = fileStatus.originalname;

            if (!allowRedundant) {
                let isPicAlreadyInDB = await DB.query(`
                SELECT pic_id FROM pics WHERE pic_md5 = $1 LIMIT 1
                `, [md5sum]);
    
                if (isPicAlreadyInDB.rows.length) {
                    deletePicture({ path: fileStatus.path });
                    resolve(isPicAlreadyInDB.rows[0].pic_id);
                    return;
                }
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

            resolve(responseDB.rows[0].pic_id);

        } catch (err) {
            deletePicture({ path: fileStatus.path });
            reject(err);
        }
    });
}

async function deletePicture(kwargs)
{
    /* Accepted kwargs are id (pic_id) and path (pic_path) */
    if (!kwargs)
        return;

    const {id, path} = kwargs;
    
    try {
        let responseDB = await DB.query(`
        DELETE FROM pics
        WHERE
            ($1::bigint IS NULL OR pic_id = $1::bigint)
            AND ($2::text IS NULL OR pic_path = $2::text)
        RETURNING pic_path;`,
        [ id, path ]);
    
        if (responseDB.rows.length)
            fsPromises.unlink(responseDB.rows[0].pic_path);
        else if (path)
            fsPromises.unlink(path);
    } catch (err) {
        throw `Failed to delete ${kwargs}`;
    }
    
}

module.exports = {
    processPicture,
    storePicture,
    deletePicture
};