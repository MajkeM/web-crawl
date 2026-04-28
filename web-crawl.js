import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
const rl = readline.createInterface({ input, output });
const url = await rl.question("Enter the URL (include the HTTP protocol) to crawl: ");
console.log(`Crawling ${url}...`);
const args = process.argv.slice(2);
const bruteforce = args.includes("--bruteforce");
const response = await axios.get(url);
const html = response.data;
// ----------------------- web-crawl -----------------------
if (!bruteforce) {
    const $ = cheerio.load(html);
    const links = [];
    function isDuplicatedLink(link) {
        if (link === "/") {
            return true;
        }
        return links?.includes(link) || false;
    }
    $("a").each((index, element) => {
        const link = ($(element).attr("href"));
        if (link && !isDuplicatedLink(link)) {
            links.push(link);
        }
    });
    links.map((link) => {
        console.log(link);
    });
}
// ----------------------- brute force -----------------------
if (bruteforce) {
    const words = fs.readFileSync("common.txt", "utf-8").split("\n");
    for (const word of words) {
        try {
            const res = await axios.get(`${url}/${word}`);
            console.log(`[FOUND]: ${url}/${word} (Status: ${res.status})`);
        }
        catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status !== 404) {
                    console.log(`[INTERESTING]: ${url}/${word} (Status: ${err.response.status})`);
                }
            }
        }
    }
}
