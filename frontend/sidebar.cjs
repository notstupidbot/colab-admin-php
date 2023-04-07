const fs = require("fs")

// const bin = "npm run sidebar"
const bin = "sidebar.js"
const availableCmds = ["ls","add","rm","mv","help"]
const availableCmdsHelps = ["list current","add menu","rm remove menu","mv move menu","print this help"]
const jsonPath = "./src/components/side_menu.json"
let side_menu = require(jsonPath)





const executeCmd = async(cmd, argv) =>{
	if(cmd === 'ls'){
		console.log(side_menu)
		process.exit(0)
	}
}





const main = async ()=>{
	const cmd = process.argv[2] || null
	// console.log("\n")


	if(!availableCmds.includes(cmd)){
		console.log(`${bin} ${availableCmds.join('|')} [...opt]\n`)
		availableCmds.map((cmd, index)=>{
			console.log(`   ${cmd}\t\t${availableCmdsHelps[index]}`)
		})
		process.exit(1)
	}

	await executeCmd(cmd, process.argv)

}

main()