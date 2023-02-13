import { readTXT, writeJSON, writeTXT } from 'https://deno.land/x/flat@0.0.15/mod.ts'
import { parseFeed, Feed } from "https://deno.land/x/rss@0.5.7/mod.ts"
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12"
import { assert } from "https://deno.land/std@0.177.0/testing/asserts.ts"

const DATA_XML = "data.xml"
const DATA_JSON = "data.json"

const readXML = async (xmlFile = DATA_XML): Promise<Feed> => {
  // Gets contents xmlFile as a string. We need this because parseFeed accepts a string as input. 
  const xml:string = await readTXT(xmlFile)
  const parsedFeed = await parseFeed(xml)
  writeJSON(DATA_JSON, parsedFeed)
  return parsedFeed
}

const processHTML = (html: string): string => {
  const $ = cheerio.load(html)
  const rootElement = $(`#mlContent > root`)
  // TODO: replace hrefs
  return `<html>${rootElement.html()}</html>`
}

interface Item {
  id: string|URL|Request,
  title: {
    value: string,
  },
}

const writeHTML = async (item: Item) => {
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
        writeTXT(`./cases/${fileName}.html`, fileContent)
    } else {
      throw e
    }
  }
}

try {
  const data = await readXML()
  await Promise.all(data.entries.map(feedItem => writeHTML(feedItem as Item)))    
} catch (error) {
  console.log(error)
}