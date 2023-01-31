// The Flat Data postprocessing libraries can be found at https://deno.land/x/flat/mod.ts
// Replace 'x' with latest library version
import { readTXT, readJSON, writeJSON, writeTXT } from 'https://deno.land/x/flat/mod.ts';
import { parseFeed } from "https://deno.land/x/rss/mod.ts";

try {
    const xmlfile = "data.xml" //Deno.args[0] // equivalent to writing 'const filename = 'data.xml'. 
    if (xmlfile) {
        // Gets contents xmlfile as a string. We need this because parseFeed accepts a string as input. 
        const xml:string = await readTXT(xmlfile);
        const parsed_feed = await parseFeed(xml)
        writeJSON('data.json', parsed_feed)
    } 
    // check if data.json exists, then start parsing links
    if('data.json'){
        const data = await readJSON('data.json')
        // console.log(data.entries)
        await Promise.all(data.entries.map(async (item) => {
 // Get links
        const response = await fetch(item.id);
        const response_html = await response.text();
        // Trims everything after the last '-' - thanks OGP
        const blacklistChars = /[^A-Za-z0-9-()_+&@,\s]/g
        const itemTitle = item.title.value.split('-')
        let fileName = itemTitle.pop().trim().replace(/ /g, '_')
        fileName = fileName.replace(blacklistChars, '')

        // Check if file already exists
        try {
            const file = await Deno.open(`./cases/${fileName}.html`)
            Deno.close(file.rid)
        } catch(e) {
            if (e instanceof Deno.errors.NotFound) {
                writeTXT(`./cases/${fileName}.html`, response_html)
            }
        }
        }))
    }
} catch (error) {
    console.log(error)
}