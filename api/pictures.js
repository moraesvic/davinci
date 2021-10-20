const fsPromises = require('fs').promises;
const Path = require('path');
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
        const MAX_FILE_SIZE = 5 * 1024 * 1024 ; // 5 megabytes
        uploadFactory(fieldName, MAX_FILE_SIZE)(req, res, async function(err) {
            if (err)
                reject(err);
            else
                resolve(req.file);
        });
    }); 
}

async function getMimeType(path)
{
    /* (fileStatus) -> [type, subtype] */
    /* Get REAL mime-type. Multer's implementation is not correct */

    /* This will output something like image/png, image/jpeg, text/plain */
    const [mimetype, _] = await chpr(
        `file --mime-type "${path}" | sed -rn "s/^.+[[:space:]]+(.*)$/\\1/p"`);
    const [type, subtype] = mimetype.replace("\n" , "").split("/");

    return [type, subtype];
}

async function testMimeType(path, allowed)
{
    /* (fileStatus, string / list) -> [type, subtype] */
    const [type, subtype] = await getMimeType(path);

    if (typeof(allowed) === "string")
        allowed = [allowed];

    if (!allowed.includes(type))
        throw `"${type}" is not an allowed type!`;

    return [type, subtype];
}

async function renameMimeType(path, subtype = null)
{
    if (!subtype)
        [, subtype] = await getMimeType(path);

    const newPath = appendExtension(path, subtype);
    return newPath;
}

async function stripPicMetadata(path)
{
    await chpr(`
    exiftool -overwrite_original -all= "${path}"
    `);
}

async function md5File(path)
{
    const cmd = `md5sum "${path}" | cut -d" " -f1 | tr -d "\n"`;
    const [md5sum, ] = await chpr(cmd);
    return md5sum;
}

async function getPicResolution(path)
{
    const [resolution, ] = await chpr(`
    exiftool "${path}" | \
	sed -rn "s/^Image Size[^0-9]*([0-9]+x[0-9]+)$/\\1/p" | \
    tr -d "\n"
    `);
    return resolution;
}

function calculateProportion(strResolution, maxSize)
{
    /* Returns resize proportion, in percentage */
    const resRegex = /^(\d+)x(\d+)$/;
    const match = resRegex.exec(strResolution);
    if (!match)
        throw `Bad input ${strResolution}!`

    const [width, height] = [ match[1], match[2] ];
    const biggest = Math.max(width, height);
    const factor = biggest <= maxSize ? 1.0 : maxSize / biggest;

    return Math.floor(factor * 100);
}

async function resizePicBenchmark(oldPath, newPath)
{
    const promises = [ fsPromises.stat(oldPath) , fsPromises.stat(newPath) ];
    const [ oldStat, newStat ] = await Promise.all(promises);
    const [ oldSize, newSize ] = [ oldStat.size, newStat.size ];
    const reduction = (100.0 * (1.0 - newSize / oldSize)).toFixed(2);
    const savedSpace = oldSize - newSize;
    console.log(
    `Old size was ${oldSize}, new size is ${newSize} (${reduction}% reduction).
    Saved space: ${savedSpace} bytes.
    `
    );
}

async function resizePic(path, maxSize, convertToJPEG = true, benchmark = true)
{
    /* Will always overwrite original */
    /* Please note that sometimes JPEG can be larger than PNG,
     * this is not a bug, although it is annoying */
    const resolution = await getPicResolution(path);
    const proportion = calculateProportion(resolution, maxSize);
    const [, subtype] = await getMimeType(path);
    const needsConversion = convertToJPEG && subtype !== "jpeg";

    let oldSize, newSize;
    if (benchmark)
        oldSize = (await fsPromises.stat(path)).size;

    console.log(
    `Path ${path}
    Current resolution is ${resolution}.
    Dimensions must be reduced to ${proportion} % of original
    Needs conversion : ${needsConversion}`
    );

    const resizeOption =    proportion < 100 ?
                            `-resize ${proportion}%` :
                            "";
    let newPath =           convertToJPEG ?
                            `${path}.jpeg` :
                            path;
    
    /* Check if there is actually anything to be done */
    if (proportion < 100 || needsConversion) {
        await chpr(`convert ${resizeOption} "${path}" "${newPath}"`);
        await fsPromises.rename(newPath, path);
    }

    if (benchmark) {
        newSize = (await fsPromises.stat(path)).size;
        const reduction = (100.0 * (1.0 - newSize / oldSize)).toFixed(2);
        const savedSpace = oldSize - newSize;
        console.log(
        `Old size was ${oldSize}, new size is ${newSize} (${reduction}% reduction).
        Saved space: ${savedSpace} bytes.
        `
        );
    }
}

async function appendExtension(path, extension)
{
    /* appends an extension to a file, if it does not already have it */
    let newPath;
    const currentExt = Path.extname(path);

    if (currentExt !== extension) {
        const dir = Path.dirname(path);
        const fileWithoutExtension = Path.basename(path, currentExt);
        newPath = `${dir}/${fileWithoutExtension}.${extension}`;
    } else
        newPath = path;

    await fsPromises.rename(path, newPath);
    return newPath;
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
            const MAX_PIC_RESOLUTION = 600; // pixels
            /* Let's process the file, stripping metadata, resizing
             * and getting MD5 hash */
            await testMimeType(fileStatus.path, "image");
            await stripPicMetadata(fileStatus.path);
            await resizePic(fileStatus.path, MAX_PIC_RESOLUTION);
            fileStatus.path = await renameMimeType(fileStatus.path);
            const md5sum = await md5File(fileStatus.path);

            console.log(`md5sum is ${md5sum}`)

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