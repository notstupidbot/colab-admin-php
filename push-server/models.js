const { Client } = require('pg');
const {v4 } = require('uuid');
const uuidv4 = v4;
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'sejati86',
});

async function init_db(){
	await m_socket.client.connect();
		client.on('error', (err) => {
			console.log(err);
		})
}

const m_socket = {
	client : client,
	getAll : async ()=>{
		const res = await client.query(`SELECT * FROM socket_session`);
		return res;
		//console.log(res.rows[0].message) // Hello world!

	},
	getById : async (id)=>{
		try{
			const res = await client.query(`SELECT * FROM socket_session WHERE id='${id}'`);
			if(res.rows){
				return res.rows[0];
			}
		}catch(e){

		}
		return null;
		
	},
	getByUuid : async (uuid)=>{
		const text = `SELECT * FROM socket_session WHERE uuid='${uuid}'`;
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
			const res = await client.query(`SELECT * FROM socket_session WHERE ip_addr='${ipAddr}'`);
			if(res.rows){
				return res.rows[0];
			}
		}catch(e){

		}
		return null;
	},

	delete : async (id)=>{
		const text = `DELETE FROM socket_session WHERE id ='${id}'`;
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

const m_jobs = {
	client : client,
	getAll : async ()=>{
		try{
			const res = await client.query(`SELECT * FROM jobs`);
			return res.rows;
		}catch(e){

		}
		return []
	},
	getById : async (id)=>{
		try{
			const res = await client.query(`SELECT * FROM jobs WHERE id='${id}'`);
			if(res.rows){
				return res.rows[0];
			}
		}catch(e){

		}
		return null;
		
	},
	
	delete : async (id)=>{
		const text = `DELETE FROM jobs WHERE id ='${id}'`;
		try {
		  const res = await client.query(text);
		  return res;
		} catch (err) {
		  console.log(err.stack)
		}		
		return null;
	},
	
	create: async(job_name,cmdline,params)=>{
		const id = uuidv4();
		const text = 'INSERT INTO jobs (id, job_name, cmdline, params, status) VALUES($1, $2, $3, $4, $5) RETURNING *'
		const values = [id,job_name,cmdline,params,0]

		try {
		  const res = await client.query(text, values);
		  if(res.rows){
		  	const row = res.rows[0];
		  }
		  console.log(res.rows);
		  return res.rows;
		} catch (err) {
		  console.log(err.stack)
		}
		return null;
	},

	getTtsJob : async(project_id)=>{
		// console.log(project_id)
		try{
			const res = await client.query(`SELECT * FROM jobs WHERE params->>'project_id' = '${project_id}'`);
			if(res.rows){
				return res.rows[0];
			}
		}catch(e){
			console.log(e);

		}
		return null;
	},
	update: async(pk,obj)=>{
		let query = "UPDATE jobs ";
		for(let k in obj){
			query += `SET ${k} = '${obj[k]}' `
		}
		try{
			const res = await client.query(query);
			if(res.rows){
				return res.rows[0];
			}
		}catch(e){
			console.log(e);

		}
		return null;
	},
	updateTtsJobParams : async(id, params)=>{
		// console.log(`Updating job pid job_id ${id} ${params}`)
		try{
			const res = await client.query(`UPDATE jobs SET params='${params}' WHERE id = '${id}'`);
			if(res.rows){
				return res.rows[0];
			}
		}catch(e){
			console.log(e);

		}
		return null;
	},
	updateTtsJobStatus: async(id,status)=>{
		console.log(`Updating job status job_id ${id} ${status}`)
		try{
			const res = await client.query(`UPDATE jobs SET status='${status}' WHERE id = '${id}'`);
			if(res.rows){
				return res.rows[0];
			}
		}catch(e){
			console.log(e);

		}
		return null;
	}
}
module.exports = {
	init_db,
	m_socket,
	m_jobs
}