import fs from 'fs'
function camelToDashCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
const writeFile = async(outputPath, outputContentBuffer, info) =>{
    try {
        const fileDescriptor = fs.openSync(outputPath, 'w'); // Open the file in write mode
        fs.writeSync(fileDescriptor, outputContentBuffer); // Write the data to the file
        fs.closeSync(fileDescriptor); // Close the file
        console.log(`${info} success.`)
    } catch (error) {
        console.error(`${info} failed.`)
    }
}
const excludeFields = (excludeFields, fields) =>{
    return fields.filter(f => !excludeFields.includes(f))
}

const jsonParseFile = async(json_path, setDefaultChildKey = null, defaultChildKeyInfo = 'table', defaultKey = 'schema') => {
    let jsonContent = `{${defaultKey}:{}}`
    let obj = {}
    obj[defaultKey] = {}
    try{
        jsonContent = await fs.readFileSync(json_path)
        jsonContent = jsonContent.toString()
        obj = JSON.parse(jsonContent)
    }catch(e){
        console.error(`Could not open input file ${json_path} error = ${e.errno}`)
    }

    if(setDefaultChildKey){
        if(!obj[defaultKey][setDefaultChildKey]){
            console.error(`No definition for ${defaultChildKeyInfo} "${setDefaultChildKey}" specified in ${json_path}`)
            return null
        }
        return obj[defaultKey][setDefaultChildKey]
    }
    return obj
    
}

export {writeFile,camelToDashCase,excludeFields, jsonParseFile }