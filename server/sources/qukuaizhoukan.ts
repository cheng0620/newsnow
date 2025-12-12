import { load } from "cheerio"

/**
 * 区块周刊 快讯
 */
const news = defineSource(async () => {
  const url = `https://blockweeks.com/wp-admin/admin-ajax.php`
  const html = await myFetch<any>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
      "Referer": "https://blockweeks.com/newsflash",
      "Origin": "https://blockweeks.com",
      "Accept": "text/html, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: new URLSearchParams(
      {
        action: "wpcom_load_kuaixun",
        page: "1",
      },
    ).toString(),
  })
  const results = parseNewsItems(html)
  return results.map(item => ({
    id: item.href.split("/").pop() || "",
    title: item.title,
    url: item.href,
  }))
})

/**
 * 区块周刊 深度
 */
const depth = defineSource(async () => {
  const url = `https://blockweeks.com/wp-admin/admin-ajax.php`
  const html = await myFetch<any>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
      "Referer": "https://blockweeks.com/newsflash",
      "Origin": "https://blockweeks.com",
      "Accept": "text/html, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: new URLSearchParams(
      {
        action: "wpcom_load_posts",
        page: "1",
        taxonomy: "category",
        id: "29",
        type: "default",
        attr: "",
        order: "",
      },
    ).toString(),
  })
  const results = parseDepthItems(html)
  return results.map(item => ({
    id: item.href.split("/").pop() || "",
    title: item.title,
    url: item.href,
  }))
})

/**
 * 解析快讯
 * @param html
 */
function parseNewsItems(html: string): Array<{ href: string, title: string }> {
  const $ = load(html)
  const results: Array<{ href: string, title: string }> = []

  $(".kx-item").each((_, element) => {
    const content = $(element).find(".kx-content")
    if (content.length > 0) {
      const h2 = content.find("h2")
      if (h2.length > 0) {
        const link = h2.find("a")
        if (link.length > 0) {
          results.push({
            href: link.attr("href") || "",
            title: link.text().trim() || "",
          })
        }
      }
    }
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

  $(".item").each((_, element) => {
    const content = $(element).find(".item-content")
    if (content.length > 0) {
      const h3 = content.find("h3")
      if (h3.length > 0) {
        const link = h3.find("a")
        if (link.length > 0) {
          results.push({
            href: link.attr("href") || "",
            title: link.text().trim() || "",
          })
        }
      }
    }
  })
  return results
}

export default defineSource({
  "qukuaizhoukan": news,
  "qukuaizhoukan-news": news,
  "qukuaizhoukan-depth": depth,
})
