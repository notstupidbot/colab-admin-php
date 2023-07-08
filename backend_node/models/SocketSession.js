
class SocketSession {
    constructor(id, ip_addr, uuid, connected, create_date, last_updated){
        this.id = id
		this.ip_addr = ip_addr
		this.uuid = uuid
		this.connected = connected
		this.create_date = create_date
		this.last_updated = last_updated
    }
}

export default SocketSession
    