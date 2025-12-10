import { XMLParser } from "fast-xml-parser"

const parser = new XMLParser({
  parseTagValue: true,
  ignoreAttributes: true,
  removeNSPrefix: true,
})

const news = defineSource(async () => {
  const url = "https://api.theblockbeats.news/v1/open-api/open-flash?size=20&page=1&lang=cn"
  const xmlString: string = await myFetch(url, {
    headers: { Accept: "application/xml, text/xml" },
  })

  const result = parser.parse(xmlString)
  const items = result.response.data.data.item

  return items.map((k: any) => ({
    id: k.id || k.link.split("/").pop() || "",
    title: k.title,
    url: k.link,
  }))
})

const depth = defineSource(async () => {
  const url = "https://api.theblockbeats.news/v1/open-api/open-information?size=10&page=1&lang=cn"
  const xmlString: string = await myFetch(url, {
    headers: { Accept: "application/xml, text/xml" },
  })

  const result = parser.parse(xmlString)
  const items = result.response.data.data.item

  return items.map((k: any) => ({
    id: k.id || k.link.split("/").pop() || "",
    title: k.title,
    url: k.link,
  }))
})

export default defineSource({
  "blockbeats": news,
  "blockbeats-news": news,
  "blockbeats-depth": depth,
})
