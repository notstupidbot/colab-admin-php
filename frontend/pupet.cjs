const fetch = require("node-fetch");
const chalk = require("chalk");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { exit } = require("process");
const { resolve } = require("path");
const {Headers} = require('node-fetch');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);
//adding useragent to avoid ip bans
// const headers = new Headers();
// headers.append('User-Agent', 'TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet');
// const headersWm = new Headers();
// headersWm.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36');

const exampleBrowse = async()=>{
	const startDate = new Date
	var baseUrl = "https://www.tokopedia.com/"
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
    })
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0);

    page.setUserAgent(
    	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4182.0 Safari/537.36"
    );
    await page.goto(baseUrl)
    const selector = 'input[data-unify=Search]'
    const selector2 = `div[data-testid=tblHomeKategoriPilihan]`
    await page.screenshot({
    	path : `./UserData/tokopedia.png`
    })
    // const searchInput = await page.$(selector)
    // console.log(searchInput.placeholder)
    // const kategoriPilihan = await page.$(selector2)
    // console.log(kategoriPilihan.innerHTML)
    // var listVideo = []
    // console.log(chalk.green("[*] Getting list video from: " + username))
    // var loop = true
    // while(loop) {
    //     listVideo = await page.evaluate(() => {
    //         const listVideo = Array.from(document.querySelectorAll(".tiktok-yz6ijl-DivWrapper > a"));
    //         return listVideo.map(item => item.href);
    //     });
    //     console.log(chalk.green(`[*] ${listVideo.length} video found`))
    //     previousHeight = await page.evaluate("document.body.scrollHeight");
    //     await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    //     await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`, {timeout: 30000})
    //     .catch(() => {
    //         console.log(chalk.red("[X] No more video found"));
    //         console.log(chalk.green(`[*] Total video found: ${listVideo.length}`))
    //         loop = false
    //     });
    //     await new Promise((resolve) => setTimeout(resolve, 1000));
    // }
    await browser.close()
    const endDate = new Date
    const elapsedTime = Math.ceil((endDate - startDate) / 1000)
    console.log(`Elapsed time : ${elapsedTime} s`)
}

const main = async ()=>{
	await exampleBrowse()
	process.exit(0)
}

main()