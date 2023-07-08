
class TtsSentence {
    constructor(id, project_id, order, title, slug, content, sentences, content_ttf, output_file, user_id, create_date, last_updated){
        this.id = id
		this.project_id = project_id
		this.order = order
		this.title = title
		this.slug = slug
		this.content = content
		this.sentences = sentences
		this.content_ttf = content_ttf
		this.output_file = output_file
		this.user_id = user_id
		this.create_date = create_date
		this.last_updated = last_updated
    }
}

export default TtsSentence
    