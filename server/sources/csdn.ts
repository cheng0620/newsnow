interface Res {
  data: {
    "www-selected-article-tag": {
      info: {
        list: Array<{
          id: string
          title: string
          url: string
        }>
      }
    }
  }
}

interface BackRes {
  data: {
    "silkroad-pre-home-list": {
      info: Array<{
        extend: {
          product_id: string
          title: string
          url: string
        }
      }>
    }
  }
}

/**
 * CSDN-资讯
 */
const hot = defineSource(async () => {
  const url = `https://cms-api.csdn.net/v1/web_home/select_content?componentIds=www-selected-article-tag&channel=0&page=1`
  const res: Res = await myFetch(url)
  return res.data["www-selected-article-tag"].info.list.map((k) => {
    return {
      id: k.id,
      title: k.title,
      url: k.url,
    }
  })
})

/**
 * CSDN-后端
 */
const java = defineSource(async () => {
  const url = `https://cms-api.csdn.net/v1/web_home/select_content?componentIds=silkroad-pre-home-list&cate1=java`
  const res: BackRes = await myFetch(url)
  const list = res?.data?.["silkroad-pre-home-list"]?.info ?? []
  return list.map(k => ({
    id: k.extend.product_id,
    title: k.extend.title,
    url: k.extend.url,
  }))
})

export default defineSource({
  "csdn": hot,
  "csdn-hot": hot,
  "csdn-java": java,
})
