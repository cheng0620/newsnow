interface ResItem {
  id: string
  title: string
}

type Res = ResItem[]

interface NewsRes {
  data: {
    flashNews: Array<{
      date: string
      list: FlashNewsItem[]
    }>
  }
}

interface FlashNewsItem {
  id: string
  title: string
  type: number
  publishTime: number
}

/**
 * panews - 快讯
 */
const news = defineSource(async () => {
  const url = `https://api.panewslab.com/webapi/flashnews?rn=20&lid=1&apppush=0`
  const res: NewsRes = await myFetch(url)
  const allFlashNews = res.data.flashNews.reduce((total, item) => {
    return total.concat(item.list || [])
  }, [] as FlashNewsItem[])
  return allFlashNews.map((item) => {
    const url = `https://www.panewslab.com/zh/articles/${item.id}`
    return {
      id: item.id,
      title: item.title,
      url,
    }
  })
})

/**
 * panews-深度-精选
 */
const depth = defineSource(async () => {
  const url = `https://api-v2.panewslab.com/articles?take=20&sortOrder=desc&inDepth=true`
  const res: Res = await myFetch(url)
  return res.map((k) => {
    const url = `https://www.panewslab.com/zh/articles/${k.id}`
    return {
      id: k.id,
      title: k.title,
      url,
    }
  })
})

export default defineSource({
  "panews": news,
  "panews-news": news,
  "panews-depth": depth,
})
