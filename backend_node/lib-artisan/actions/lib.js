import fs from 'fs'
import readline from 'readline'

function confirm(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase());
      rl.close();
    });
  });
}

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

const jsonParseFile = async(json_path, setDefaultChildKey = null, defaultChildKeyInfo = 'table', defaultKey = 'schema', checkFileExist=false) => {
    let jsonContent = `{${defaultKey}:{}}`
    let obj = {}
    obj[defaultKey] = {}
    try{
        jsonContent = await fs.readFileSync(json_path)
        jsonContent = jsonContent.toString()
        obj = JSON.parse(jsonContent)
    }catch(e){
        console.error(`Could not open input file ${json_path} error = ${e.errno}`)
        if(checkFileExist){
            return null
        }
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
async function renameFile(oldPath, newPath) {
    return new Promise((resolve, reject)=>{
        fs.rename(oldPath, newPath, (error) => {
            if (error) {
              console.error('An error occurred while renaming the file:', error)
              reject(error)
            } else {
                resolve(true)
              console.log(`Rename ${oldPath} --> ${newPath}.`)
            }
          });
    })
    
  }
export {writeFile,camelToDashCase,excludeFields, jsonParseFile , confirm, renameFile}