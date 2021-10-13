require('dotenv').config();
const PG = require('pg').Pool;

const config = {
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	host: process.env.POSTGRES_HOST,
	database: process.env.POSTGRES_DATABASE,
	port: process.env.POSTGRES_PORT
};

class DB {
	constructor()
	{
		this.pool = new PG(config);
        this.initDatabase();
	}

	getPool()
	{
		if(!this.pool)
			this.pool = new PG(config);
		return this.pool;
	}

	async endPool()
	{
		if(this.pool)
			await this.pool.end();
		return true;
	}

	async query(q, params, options)
	{
		if (!this.pool)
			this.getPool();
		const client = await this.pool.connect();
		let ret = await client.query(q, params);
		client.release();
		return ret;
	}

    async initDatabase()
    {
        let result = await this.query(
            `SELECT EXISTS (
                SELECT FROM pg_tables
                WHERE
                    schemaname = 'public'
                    AND tablename = 'products'
            );`
        );
        
        if (!result.rows || !result.rows[0].exists) {
            console.lowg("Table `products` was not yet initialized...");

            const fs = require('fs');
            const path = require('path');

            const filename = path.join( process.cwd(), 'install/products.sql' );
            const data = fs.readFileSync(filename).toString();
            console.log(data);
            let init = await this.query(data);
            
        }
        
    }
}

const db = new DB();

module.exports = db;