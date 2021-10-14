/* Let's process the file, stripping metadata and getting MD5 hash */

const chpr = require('./ChildProcess.js');
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