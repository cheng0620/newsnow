import { XMLParser } from "fast-xml-parser"

const parser = new XMLParser({
  parseTagValue: true,
  ignoreAttributes: true,
  removeNSPrefix: true,
})

const news = defineSource(async () => {
  const url = "https://rss.odaily.news/rss/newsflash"
  const xmlString: string = await myFetch(url, {
    headers: { Accept: "text/xml" },
  })

  const result = parser.parse(xmlString)
  const items = result.rss.channel.item

  return items.map((k: any) => ({
    id: k.link.split("/").pop() || "",
    title: k.title,
    url: k.link,
  }))
})

const essay = defineSource(async () => {
  const url = "https://rss.odaily.news/rss/post"
  const xmlString: string = await myFetch(url, {
    headers: { Accept: "text/xml" },
  })

  const result = parser.parse(xmlString)
  const items = result.rss.channel.item

  return items.map((k: any) => ({
    id: k.link.split("/").pop() || "",
    title: k.title,
    url: k.link,
  }))
})

export default defineSource({
  "odaily": news,
  "odaily-news": news,
  "odaily-essay": essay,
})
