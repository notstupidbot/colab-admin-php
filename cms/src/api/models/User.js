
class User {
    constructor(id, username, passwd, email, firstName, lastName, displayName, avatarUrl, groupId, createdBy, createDate, lastUpdated){
        this.id = id
		this.username = username
		this.passwd = passwd
		this.email = email
		this.firstName = firstName
		this.lastName = lastName
		this.displayName = displayName
		this.avatarUrl = avatarUrl
		this.groupId = groupId
		this.createdBy = createdBy
		this.createDate = createDate
		this.lastUpdated = lastUpdated
    }
}

export default User
    