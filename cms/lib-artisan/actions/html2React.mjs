import path from "path"
import fs from "fs"
// import jsdom from "jsdom"
// import jquery from "jquery"
import {writeFile} from "./lib.js"
import {Parser} from "htmlparser2"
// import htmlparser2 from 'htmlparser2'
import htmlEntities from 'html-entities'
import cheerio from 'cheerio'

// const {AllHtmlEntities} = htmlEntities
// const {JSDOM} = jsdom
async function convertToXHTML(html, tidy, entities) {
    return new Promise((resolve, reject) => {
      const parser = new Parser({
        onend: resolve,
        onerror: reject,
        oncomment: (data) => {
            // Handle comments as needed
            // console.log('Comment:', data);
            tidy.push(`{/*${data}*/}`);
        },
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
    

    inputBuffer = inputBuffer.toString()
   
    let tidy = []
    await convertToXHTML(inputBuffer, tidy, htmlEntities)
    inputBuffer =  tidy.join(" ")
    let $ = cheerio.load(inputBuffer, {xml: {xmlMode: true}}, false)

    const componentClass = path.basename(output).replace(/\..*$/,'')
    let els = $("*[class]")
    let clsList = []
    let clsListBuffer = ""
    let clsIdx = 0
    els.map(elIdx=>{
        // console.log(els[el])
        let element = $(els[elIdx])
        let oldValue = element.attr('class')
        if(!clsList.includes(oldValue)){
            clsList.push(oldValue)
            clsListBuffer += `${elIdx==0?"":"\t\t"}const cls${clsIdx} = "cls-${clsIdx} ${oldValue}"\n`
            clsIdx += 1
        }
        const clsIndex = clsList.indexOf(oldValue)
        element.removeAttr('class')
        element.attr('className', `CLS_INDEX_${clsIndex}`)
    })

   
    inputBuffer = $.html()
    const rgxRplcs = [
        [/classname/g,'className'],
        // [/(<!--.*-->)/g,"{/*$1*/}"],
        [/(\"CLS_INDEX_)(\d+)(\")/g,"{cls$2}"],
        [/clip-rule=/g,"clipRule="],
        [/fill-rule=/g,"fillRule="],
        [/viewbox=/g,"viewBox="],
        [/value=/g,"defaultValue="],
        [/for=/g,"htmlFor="],
        [/autocomplete=/g,"autoComplete="],
        [/stroke-width=/g,"strokeWidth="],
        [/\>\s*\<\/input\>/g,"\/>"],
        [/\>\s*\<\/img\>/g,"\/>"],
        [/\>\s*\<\/br\>/g,"\/>"]

    ]
    rgxRplcs.map((rgxRplc, index)=>{
        // console.log(rgxRplc)
        const [rgx,rplc] = rgxRplc
        inputBuffer = inputBuffer.replace(rgx,rplc)
    })
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
    