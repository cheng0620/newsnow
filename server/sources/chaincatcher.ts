interface Res {
  data: {
    items: {
      id: string
      title: string
    }[]
  }
}

/**
 * ChainCatcher 链捕手-快讯
 */
const news = defineSource(async () => {
  const timestamp = generateTimestamp()
  const uuid = generateUUID()
  const url = `https://www.chaincatcher.com/pc/content/page?channel=PC&cversion=1.0.0&requestid=PC&${timestamp}&${uuid}`

  const res: Res = await myFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Ref": "https://www.chaincatcher.com/news",
      "Origin": "https://www.chaincatcher.com",
    },
    body: JSON.stringify({
      newFlashTypes: [2],
      pageNumber: 1,
      pageSize: 20,
      type: 2,
    }),
  })
  return res.data.items.map((k) => {
    const url = `https://www.chaincatcher.com/article/${k.id}`
    return {
      id: k.id,
      title: k.title,
      url,
    }
  })
})

/**
 * ChainCatcher 链捕手-文章
 */
const essay = defineSource(async () => {
  const timestamp = generateTimestamp()
  const uuid = generateUUID()
  const url = `https://www.chaincatcher.com/pc/content/page?channel=PC&cversion=1.0.0&requestid=PC&${timestamp}&${uuid}`
  const res: Res = await myFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Ref": "https://www.chaincatcher.com/news",
      "Origin": "https://www.chaincatcher.com",
    },
    body: JSON.stringify({
      articleTypes: [1, 2, 6],
      pageNumber: 1,
      pageSize: 30,
      type: 1,
    }),
  })
  return res.data.items.map((k) => {
    const url = `https://www.chaincatcher.com/article/${k.id}`
    return {
      id: k.id,
      title: k.title,
      url,
    }
  })
})

function generateTimestamp(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const hour = String(now.getHours()).padStart(2, "0")
  const minute = String(now.getMinutes()).padStart(2, "0")
  const second = String(now.getSeconds()).padStart(2, "0")
  const millisecond = String(now.getMilliseconds()).padStart(3, "0")

  return `${year}${month}${day}${hour}${minute}${second}${millisecond}`
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === "x" ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export default defineSource({
  "chaincatcher": news,
  "chaincatcher-news": news,
  "chaincatcher-essay": essay,
})
