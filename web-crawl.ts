import axios from "axios";
import * as cheerio from "cheerio";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });
const url = await rl.question("Enter the URL (include the HTTP protocol) to crawl: ");
console.log(`Crawling ${url}...`);


const response = await axios.get(url);
const html = response.data;

const $ = cheerio.load(html);
const links:Array<string>|undefined = [];

function isDuplicatedLink(link:string) : boolean {
    if (link === "/"){
        return true;
    }
    return links?.includes(link) || false;
}


$("a").each((index, element) => {

    const link = ($(element).attr("href"));

    if (link && !isDuplicatedLink(link)){
        links.push(link);
    }
});


links.map((link) => {
    console.log(link);
});


