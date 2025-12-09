import * as xml2js from "xml2js"

const parser = new xml2js.Parser()

const news = defineSource(async () => {
  const url = "https://rss.odaily.news/rss/newsflash"
  const xmlString: string = await myFetch(url, {
    headers: {
      Accept: "text/xml",
    },
  })

  const result: any = await parser.parseStringPromise(xmlString)

  return result.rss.channel.item.map((k: any) => ({
    id: k.link.split("/").pop() || "",
    title: k.title,
    url: k.link,
  }))
})

export default defineSource({
  "odaily": news,
  "odaily-news": news,
})
