const puppeteer = require('puppeteer');
const fs = require("fs");
const path = require('path')
const u = fs.readFileSync(path.resolve(process.execPath, '../url.json'),'utf-8')
const url_list = JSON.parse(u)
/**
 *
 * @param {string[]}url_list
 * @returns {Promise<*[]>}
 */
async function printPDF(url_list) {
	const pdf_list = []
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	let i = 0
	while (i < url_list.length){
		const url = url_list[i]
		await page.goto(url, {waitUntil: 'networkidle0'});
		const title = await page.title()
		const pdf = await page.pdf({ format: 'A4' });
		pdf_list.push({title,pdf})
		i++
	}
	await browser.close();
	return pdf_list;
}
printPDF(url_list).then(pdf_list =>{
	pdf_list.forEach(pdf=>{
		fs.writeFile(path.resolve(process.execPath, `../${pdf.title}.pdf`),pdf.pdf,()=>{})
	})
})
