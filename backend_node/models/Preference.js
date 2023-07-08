
class Preference {
    constructor(id, key, val, type, group, editor, prop, desc, create_date, last_updated){
        this.id = id
		this.key = key
		this.val = val
		this.type = type
		this.group = group
		this.editor = editor
		this.prop = prop
		this.desc = desc
		this.create_date = create_date
		this.last_updated = last_updated
    }
}

export default Preference
    