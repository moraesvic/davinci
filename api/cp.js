const chpr = require("child_process");

function callback(err, stdout, stderr)
{
	if(err)
		console.log(`Error. Process returned code ${err.code}`);

	console.log(`STDOUT ${stdout}`);
	console.log(`STDERR ${stderr}`);

}

function subproc(cmd, args)
{
	return chpr.exec(cmd, args, callback);
}


module.exports = subproc;
