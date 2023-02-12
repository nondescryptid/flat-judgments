// The Flat Data postprocessing libraries can be found at https://deno.land/x/flat/mod.ts
// Replace 'x' with latest library version
import { readTXT, readJSON, writeJSON, writeTXT } from 'https://deno.land/x/flat/mod.ts'
import { parseFeed } from "https://deno.land/x/rss/mod.ts"
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12"

const DATA_XML = "data.xml"
const DATA_JSON = "data.json"

const readXML = async (xmlFile = DATA_XML): Promise<string> => {
  // Gets contents xmlFile as a string. We need this because parseFeed accepts a string as input. 
  const xml:string = await readTXT(xmlfile);
  const parsedFeed = await parseFeed(xml)
  writeJSON(DATA_JSON, parsed_feed)
  return parsedFeed
}

const processHTML = (html: string): string => {
  const $ = cheerio.load(html)
  return html
}

const writeHTML = async (item: { id: string|URL|Request; title: { value: string; }; }) => {
  // Get links
  const response = await fetch(item.id);
  const responseHTML = await response.text();
  // Trims everything after the last '-' - thanks OGP
  const blacklistChars = /[^A-Za-z0-9-()_+&@,\s]/g
  const itemTitle: string[] = item.title.value.split('-')
  let fileName = itemTitle?.pop()?.trim().replace(/ /g, '_')
  fileName = fileName?.replace(blacklistChars, '')

  const fileContent = processHTML(responseHTML)

  // Check if file already exists
  try {
    const fileInfo = await Deno.stat(`./cases/${fileName}.html`)
    assert(fileInfo.isFile)
  } catch(e) {
    if (e instanceof Deno.errors.NotFound) {
        writeTXT(`./cases/${fileName}.html`, responseHTML)
    } else {
      throw e
    }
  }
}

try {
  const data = await readXML()

  await Promise.all(data.entries.map(writeHTML))
    
} catch (error) {
  console.log(error)
}