// const h1 = React.createElement('h1', null, 'Hello World')
class HelloWorld extends React.Component{
    render(){
        // console.log(this.props.ok)
        // var specialChars = {__html : '&copy;&mdash;&ldquo;'}

        // ...object is named as ellipses in terminology of es2015
        return <h1 {...this.props}><i className="bi bi-code"/> {`Hello ${this.props.frameworkname} world!!!`} 
        {/* <span dangerouslySetInnerHTML={specialChars}></span> */}
        </h1>
        // return React.createElement('h1', this.props, )
    }
}

class HelloWorld2 extends React.Component{
    render(){
        return <div className="dark:text-slate-400 p-4"> 
            <HelloWorld id="ember" frameworkname="Ember.js" title="A framework for creating ambitius web applications"/>
            <HelloWorld id='backbone' frameworkname='Backbone.js' title='Backbone.js gives structure to web applications...'/>
            <HelloWorld id='angular' frameworkname='Angular.js' title='Superheroic Java Script MVW Framework'/>
            </div>
    }
}


/*
<HelloWorld id='backbone' frameworkname='Backbone.js' title='Backbone.js gives structure to web applications...'/>,
<HelloWorld id='angular' frameworkname='Angular.js' title='Superheroic Java Script MVW Framework'/>,
*/

const contentEl = document.getElementById('content')
ReactDOM.render(
    <HelloWorld2/>,
    contentEl
)
// root.render(container)