const { Client } = require('pg')
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'sejati86',
});
 // await client.connect();
async function pgquery(a,b,c,d){
	
	const res = await client.query(a,b,c,d);
	await client.end()
	return res;
} 


const m_socket = {
	client : client,
	init : async()=>{
		await m_socket.client.connect();
	},
	getAll : async ()=>{
		const res = await pgquery(`SELECT * FROM socket_session`);
		return res;
		//console.log(res.rows[0].message) // Hello world!

	},
	getById : async (id)=>{
		const res = await pgquery(`SELECT * FROM socket_session WHERE id='${id}'`);
		return res;
	},
	getByUuid : async (uuid)=>{
		const res = await pgquery(`SELECT * FROM socket_session WHERE uuid='${uuid}'`);
		return res;
	},
	getByIpAddr : async (ipAddr)=>{
		const res = await pgquery(`SELECT * FROM socket_session WHERE ip_addr='${ipAddr}'`);
		return res;
	},

	delete : async (id)=>{

	},
	update: async(id,data)=>{

	},
	create: async(id,ip_addr,uuid,connected)=>{
		
		const text = 'INSERT INTO socket_session (id, ip_addr, uuid, connected) VALUES($1, $2, $3, $4) RETURNING *'
		const values = [id,ip_addr,uuid,connected]

		// async/await
		try {
		  const res = await client.query(text, values)
		  console.log(res.rows[0])
		  // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
		} catch (err) {
		  console.log(err.stack)
		}
	}

}
m_socket.init().then(r=>{console.log(r)});
module.exports = {
	m_socket
}