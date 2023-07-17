import path from "path"
import fs from "fs"
import jsdom from "jsdom"
import jquery from "jquery"
import {writeFile} from "./lib.js"
import {Parser} from "htmlparser2"
import htmlEntities from 'html-entities'
const {AllHtmlEntities} = htmlEntities
const {JSDOM} = jsdom
async function convertToXHTML(html, tidy, entities) {
    return new Promise((resolve, reject) => {
      const parser = new Parser({
        onend: resolve,
        onerror: reject,
        onopentag: (name, attributes) => {
          let xhtml = `<${name}`;
          for (const attr in attributes) {
            xhtml += ` ${attr}="${entities.encode(attributes[attr])}"`;
          }
          xhtml += '>';
          tidy.push(xhtml);
        },
        ontext: (text) => {
          tidy.push(entities.encode(text));
        },
        onclosetag: (tagname) => {
          tidy.push(`</${tagname}>`);
        }
      });
      parser.write(html);
      parser.end();
    });
  }
  

const documentReady = async ($, document) => {
    return new Promise((resolve, reject)=>{
        $(document).ready(function() {
            // Your jQuery code here
            resolve($)
        })
    })
}
const html2React = async (input, output) => {
    let inputBuffer = await fs.readFileSync(input)
    

    const componentClass = path.basename(output).replace(/\..*$/,'')
    inputBuffer = inputBuffer.toString()
    const { window } = new JSDOM()
    const { document } = window 
    let $ = jquery(window)

    // $ = await documentReady($, document)
    const $rootEl = $(`<div>${inputBuffer}</div>`)

    let els = $rootEl.find("*[class]")
    let clsList = []
    let clsListBuffer = ""
    let clsIdx = 0
    els.map(elIdx=>{
        // console.log(els[el])
        let element = $(els[elIdx])
        let oldValue = element.attr('class')
        if(!clsList.includes(oldValue)){
            clsList.push(oldValue)
            clsListBuffer += `\tconst cls${clsIdx} = "cls-${clsIdx} ${oldValue}"\n`
            clsIdx += 1
        }
        const clsIndex = clsList.indexOf(oldValue)
        element.removeAttr('class')
        element.attr('className', `CLS_INDEX_${clsIndex}`)
    })
    // console.log(els)
    const tidy = []
    // console.log(htmlEntities)
    // return
    // const entities = new AllHtmlEntities()

    await convertToXHTML($rootEl.html(), tidy, htmlEntities)
    inputBuffer =  tidy.join(" ")
    inputBuffer = inputBuffer.replace(/classname/g,'className')
    inputBuffer = inputBuffer.replace(/(<!--.*-->)/g,"{/*$1*/}")
    inputBuffer = inputBuffer.replace(/(\"CLS_INDEX_)(\d+)(\")/g,"{cls$2}")
    inputBuffer = inputBuffer.replace(/clip-rule=/g,"clipRule=")
    inputBuffer = inputBuffer.replace(/fill-rule=/g,"fillRule=")
    inputBuffer = inputBuffer.replace(/viewbox=/g,"viewBox=")
    inputBuffer = inputBuffer.replace(/value=/g,"defaultValue=")
    inputBuffer = inputBuffer.replace(/for=/g,"htmlFor=")
    inputBuffer = inputBuffer.replace(/autocomplete=/g,"autoComplete=")
    inputBuffer = inputBuffer.replace(/\>\s*\<\/input\>/g,"\/>")
    inputBuffer = inputBuffer.replace(/\>\s*\<\/textarea\>/g,"\/>")
    inputBuffer = inputBuffer.replace(/stroke-width=/g,"strokeWidth=")
    inputBuffer = `
 const ${componentClass} = ({})=>{
    ${clsListBuffer}
    return <>
    ${inputBuffer}
    </>
 }   

 export default  ${componentClass}
    `
    await writeFile(output, inputBuffer,`writing ${output}`)
    // console.log(inputBuffer)

    // console.log(`html2React`)
}

export default html2React
    