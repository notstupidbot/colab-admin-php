import Router from "./components/Router"
import AppConfig from "./components/lib/AppConfig"

import "./App.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "./components/apps/shared/default-theme.css"
function App() {
    const config = AppConfig.getInstance();
    return <Router config={config}/>
}

export default App