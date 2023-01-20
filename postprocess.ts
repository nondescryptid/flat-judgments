// The Flat Data postprocessing libraries can be found at https://deno.land/x/flat/mod.ts
// Replace 'x' with latest library version
import { readTXT, readJSON, writeJSON } from 'https://deno.land/x/flat/mod.ts';
import { parseFeed } from "https://deno.land/x/rss/mod.ts";

try {
    const xmlfile:string = Deno.args[0] // equivalent to writing 'const filename = 'data.xml'. 
    if (xmlfile) {
        // Gets contents xmlfile as a string. We need this because parseFeed accepts a string as input. 
        const xml:string = await readTXT(xmlfile);
        const parsed_feed = await parseFeed(xml)
        await writeJSON('data.json', parsed_feed
    }  
} catch (error) {
    console.log(error)
}
