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
export {writeFile,camelToDashCase,excludeFields}