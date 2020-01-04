const { Client } = require('pg');
const {
  USER, HOST, DB_NAME, PASSWORD, PORT,
} = require('./config/psql.config');

const client = new Client({
  user: USER,
  host: HOST,
  database: DB_NAME,
  password: PASSWORD,
  port: PORT,
});

client.connect()
  .catch(err => console.log(err));

client.query('SELECT NOW()', (err, res) => {
  console.log('there');
  console.log(err, res);
  client.end();
});
