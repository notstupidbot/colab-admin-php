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
		client.on('error', (err) => {
			console.log(err);
		})

	},
	getAll : async ()=>{
		const res = await pgquery(`SELECT * FROM socket_session`);
		return res;
		//console.log(res.rows[0].message) // Hello world!

	},
	getById : async (id)=>{
		try{
			const res = await pgquery(`SELECT * FROM socket_session WHERE id='${id}'`);
			if(res.rows){
				return res.rows[0];
			}
		}catch(e){

		}
		return null;
		
	},
	getByUuid : async (uuid, connectedOnly)=>{
		const connected = connectedOnly ? 1 : 0;
		const text = `SELECT * FROM socket_session WHERE uuid='${uuid}' AND connected=${connected}`;
		try {
		  const res = await client.query(text);
		  return res.rows;
		} catch (err) {
		  console.log(err.stack)
		}	
		return [];
	},
	getIdsByUuid : async(uuid, connectedOnly)=>{
		const connected = connectedOnly ? 1 : 0;
		const text = `SELECT id FROM socket_session WHERE uuid='${uuid}' AND connected=${connected}`;
		try {
		  const res = await client.query(text);
		  return res.rows;
		} catch (err) {
		  console.log(err.stack)
		}	
		return [];
	},
	getByIpAddr : async (ipAddr)=>{
		try{
			const res = await pgquery(`SELECT * FROM socket_session WHERE ip_addr='${ipAddr}'`);
			if(res.rows){
				return res.rows[0];
			}
		}catch(e){

		}
		return null;
	},

	delete : async (id)=>{
		const text = `DELETE  socket_session WHERE id ='${id}'`;
		try {
		  const res = await client.query(text);
		  return res;
		} catch (err) {
		  console.log(err.stack)
		}		
		return null;
	},
	setDiconnectedExcept: async(id, uuid)=>{
		const text = `UPDATE socket_session SET connected=0 WHERE id !='${id}' AND uuid='${uuid}'`;
		try {
		  const res = await client.query(text);
		  return res;
		} catch (err) {
		  console.log(err.stack)
		}		
		return null;
	},
	create: async(id,ip_addr,uuid)=>{
		
		const text = 'INSERT INTO socket_session (id, ip_addr, uuid, connected) VALUES($1, $2, $3, $4) RETURNING *'
		const values = [id,ip_addr,uuid,1]

		try {
		  const res = await client.query(text, values);
		  if(res.rows){
		  	const row = res.rows[0];
		  	m_socket.setDiconnectedExcept(row.id, row.uuid);
		  }
		  console.log(res.rows);
		  return res.rows;
		} catch (err) {
		  console.log(err.stack)
		}
		return null;
	}

}
module.exports = {
	m_socket
}