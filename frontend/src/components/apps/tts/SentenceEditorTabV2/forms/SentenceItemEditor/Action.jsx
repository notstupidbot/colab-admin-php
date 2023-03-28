import React from "react"
import Helper from "../../../../../lib/Helper"

export default class Action extends React.Component {
    items = []
	constructor(props){
		super(props)
        this.state = {
            items : []
        }

        this.buildItems()

	}
    buildItems(){
        let items;
        try {
            items = JSON.parse(this.props.sentences)
        } catch (error) {
            items = []
        }
        const itemCounts = items.length
        // let iter = itemCounts - 1
        if(itemCounts > 0){
            items = items.filter(item => {
                let passed = 0
                if(item.text){
                    passed += 1
                }

                if(item.ttf){
                    passed += 1
                }

                return passed != 0
            })
        }
        console.log(items)
        this.items = items

        
    }
    componentDidMount(){
        this.setState({items : this.items})
    }
}