const ChildProcess = require("child_process");

function callback(err, stdout, stderr)
{
	if(err) {
		console.log(`Error. Process returned code ${err.code}`);
		throw "Process exited with error code!";
	}

	return [err, stdout, stderr];
}

function chpr(cmd, args)
{
	return new Promise( (resolve, reject) => {
		ChildProcess.exec(cmd, args, function(err, stdout, stderr) {

			if(err) {
				console.log(`Error. Process returned code ${err.code}`);
				reject(err);
			}

			resolve([stdout, stderr]);
		});
	});
}


module.exports = chpr;
