import { load } from "cheerio"

/**
 * TechFlow 深潮 - 7 * 24H 快讯
 */
const news = defineSource(async () => {
  const url = `https://www.techflowpost.com/newsletter/index.html`
  const html = await myFetch<any>(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
      "Referer": "https://www.techflowpost.com/",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    },
  })
  const results = parseNewsItems(html)
  return results.map((item) => {
    const correctPath = item.href
    const url = `https://www.techflowpost.com${correctPath}`
    return {
      id: correctPath,
      title: item.title,
      url,
    }
  })
})

/**
 * TechFlow 深潮 - 精选
 */
const depth = defineSource(async () => {
  const url = `https://www.techflowpost.com/article/index.html`
  const html = await myFetch<any>(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
      "Referer": "https://www.techflowpost.com/newsletter/index.html",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    },
  })
  const results = parseDepthItems(html)
  return results.map((item) => {
    const correctPath = item.href.replace("/article/", "/newsletter/")
    const url = `https://www.techflowpost.com${correctPath}`
    return {
      id: correctPath,
      title: item.title,
      // 直接在 newsletter 后加 /，再拼路径片段
      url,
    }
  })
})
/**
 * 解析7*24H快讯
 * @param html
 */
function parseNewsItems(html: string): Array<{ href: string, title: string }> {
  const $ = load(html)
  const results: Array<{ href: string, title: string }> = []

  $(".content").each((_, element) => {
    $(element).find("dd").each((_, ddElement) => {
      const link = $(ddElement).find("a")
      if (link.length > 0) {
        results.push({
          href: link.attr("href") || "",
          title: link.text().trim() || "",
        })
      }
    })
  })
  return results
}

/**
 * 解析深度文章
 * @param html
 */
function parseDepthItems(html: string): Array<{ href: string, title: string }> {
  const $ = load(html)
  const results: Array<{ href: string, title: string }> = []

  $(".content").each((_, element) => {
    const content = $(element).find(".tit.row1.fw.dfont")
    if (content.length > 0) {
      results.push({
        href: content.attr("href") || "",
        title: content.text().trim() || "",
      })
    }
  })
  return results
}

export default defineSource({
  "techflow": depth,
  "techflow-news": news,
  "techflow-depth": depth,
})
