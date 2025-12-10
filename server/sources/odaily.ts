import { XMLParser } from "fast-xml-parser"

const parser = new XMLParser({
  parseTagValue: true, // 解析节点文本为字符串
  ignoreAttributes: true, // 忽略XML属性（这里不需要）
  removeNSPrefix: true, // 移除命名空间前缀（如果有）
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
