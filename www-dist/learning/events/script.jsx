class Mouse extends React.Component {
    handleMouseOver(event) {
        console.log('mouse is over with event')
        window.e = event
        // Anti-pattern
        console.dir(event.target)
        setTimeout(()=>{
            console.table(event.target)
            console.table(window.e.target)
        }, 2345)
    }
    render() {
        return <div>
            <div style={{border: '1px solid red'}} onMouseOver={this.handleMouseOver.bind(this)}>
            Open DevTools and move your mouse cursor over here
            </div>
        </div>
    }
}
class App extends React.Component{
    render(){
        return <div className="dark:text-slate-400 p-4"> 
        <Mouse/>
            </div>
    }
}
const contentEl = document.getElementById('content')
ReactDOM.render(
    <App/>,
    contentEl
)