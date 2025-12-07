interface Res {
  data: {
    content: {
      title: string
      content_id: string
    }
  }[]
}

interface BackendLatestRes {
  err_no: number
  err_msg: string
  data: {
    item_type: number
    item_info: {
      article_id: string
      article_info: {
        article_id: string
        title: string
      }
    }
  }[]
  cursor: string
  has_more: boolean
}

const hot = defineSource(async () => {
  const url = `https://api.juejin.cn/content_api/v1/content/article_rank?category_id=6809637769959178254&type=hot&spider=0`
  const res: Res = await myFetch(url)
  return res.data.map((k) => {
    const url = `https://juejin.cn/post/${k.content.content_id}`
    return {
      id: k.content.content_id,
      title: k.content.title,
      url,
    }
  })
})

const news = defineSource(async () => {
  const url = `https://api.juejin.cn/recommend_api/v1/article/recommend_cate_feed?spider=0`
  const res: BackendLatestRes = await myFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Referer": "https://juejin.cn/",
      "Origin": "https://juejin.cn",
    },
    body: JSON.stringify({
      id_type: 2,
      sort_type: 300,
      cate_id: "6809637769959178254",
      cursor: "0",
      limit: 20,
    }),
  })
  if (res.err_no !== 0) {
    throw new Error(`API error: ${res.err_msg}`)
  }
  if (!res.data || !Array.isArray(res.data) || res.data.length === 0) {
    return []
  }
  return res.data
    .filter(k => k.item_info?.article_info?.article_id && k.item_info?.article_info?.title)
    .map((k) => {
      const articleId = k.item_info.article_info.article_id
      return {
        id: articleId,
        title: k.item_info.article_info.title,
        url: `https://juejin.cn/post/${articleId}`,
      }
    })
})

export default defineSource({
  "juejin": hot,
  "juejin-hot": hot,
  "juejin-news": news,
})
