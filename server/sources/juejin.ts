interface Res {
  data: {
    content: {
      title: string
      content_id: string
    }
  }[]
}

interface BackendLatestRes {
  data: {
    article_info: {
      article_id: string
      title: string
    }
  }[]
}

/**
 * 掘金-排行榜-后端
 */
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

/**
 * 掘金-首页-后端-最新
 */
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
  if (!res.data || !Array.isArray(res.data) || res.data.length === 0) {
    return []
  }
  return res.data.map((k) => {
    const articleId = k.article_info.article_id
    return {
      id: articleId,
      title: k.article_info.title,
      url: `https://juejin.cn/post/${articleId}`,
    }
  })
})

/**
 * 掘金-首页-后端-推荐
 */
const recommend = defineSource(async () => {
  const url = `https://api.juejin.cn/recommend_api/v1/article/recommend_cate_feed?aid=2608&uuid=7575191676932408882&spider=0`
  // &verifyFp=verify_mi8zc2vw_yvM6Uqlq_mlvf_4pKH_AojU_f5O4gRQzvhO2&fp=verify_mi8zc2vw_yvM6Uqlq_mlvf_4pKH_AojU_f5O4gRQzvhO2&msToken=LEAKWQGyFzEqunSrmdUqKprd-9LFjzMKWEBBw_b3wTODAUtTdjxpIqio4KvTvV46N5fiPMTT6909mI5-OAYNCBL2oESyQMjDcH9Iafg0T29Cgp9VS1rXDOePko5pCZT3Cg%3D%3D&a_bogus=xv4dvOhoMsm1QBpkthDz9C4hj9u0YW-TgZEz087Cqzot
  const res: BackendLatestRes = await myFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Referer": "https://juejin.cn/",
      "Origin": "https://juejin.cn",
      // "Cookie": "_tea_utm_cache_2608=undefined; __tea_cookie_tokens_2608=%257B%2522web_id%2522%253A%25227575191676932408882%2522%252C%2522user_unique_id%2522%253A%25227575191676932408882%2522%252C%2522timestamp%2522%253A1763736771808%257D; passport_csrf_token=e173336a1b94c49fab103a9fb48cf4e5; passport_csrf_token_default=e173336a1b94c49fab103a9fb48cf4e5; odin_tt=fb2c3e4955e41b8922f90921fa07c2aef4da184d9682f74e9e578c476fa078e6429b43a72094da79a7a0c754be4edb983997e58d1f1421b5e7000aef0cecd982; sid_guard=338645d49a9d7964005d3693ec89a3d2%7C1764340281%7C31536000%7CSat%2C+28-Nov-2026+14%3A31%3A21+GMT; uid_tt=c8feb1d347a01fd07f756b727f71bf4b; uid_tt_ss=c8feb1d347a01fd07f756b727f71bf4b; sid_tt=338645d49a9d7964005d3693ec89a3d2; sessionid=338645d49a9d7964005d3693ec89a3d2; sessionid_ss=338645d49a9d7964005d3693ec89a3d2; is_staff_user=false; sid_ucp_v1=1.0.0-KGMzMzI0MjUwZGFkYjhiZmEwMzc2ZjFkMTUyNDY0ZjhhYTdlMjU3ZDQKFgjqzrDZqayyBhC55KbJBhiwFDgIQAsaAmxmIiAzMzg2NDVkNDlhOWQ3OTY0MDA1ZDM2OTNlYzg5YTNkMg; ssid_ucp_v1=1.0.0-KGMzMzI0MjUwZGFkYjhiZmEwMzc2ZjFkMTUyNDY0ZjhhYTdlMjU3ZDQKFgjqzrDZqayyBhC55KbJBhiwFDgIQAsaAmxmIiAzMzg2NDVkNDlhOWQ3OTY0MDA1ZDM2OTNlYzg5YTNkMg; session_tlb_tag=sttt%7C17%7CM4ZF1JqdeWQAXTaT7Imj0v_________aKI01_ecan4UdmSfO2iKme93lIe3k4iUFWVfAx0h__bY%3D; session_tlb_tag_bk=sttt%7C17%7CM4ZF1JqdeWQAXTaT7Imj0v_________aKI01_ecan4UdmSfO2iKme93lIe3k4iUFWVfAx0h__bY%3D; _ga=GA1.2.1614230714.1764340281; _ga_S695FMNGPJ=GS2.2.s1764340281$o1$g0$t1764340281$j60$l0$h0; n_mh=YHRqBPC4PeH9FMfxo-9mbad6A8cs0O78f6Tthr8zNgs; _tea_utm_cache_576092=undefined; csrf_session_id=93393b3da99ddd7852dbe9e32a151b35",
    },
    body: JSON.stringify({
      cate_id: "6809637769959178254",
      cursor: "0",
      id_type: 2,
      limit: 30,
      sort_type: 200,
    }),
  })
  if (!res.data || !Array.isArray(res.data) || res.data.length === 0) {
    return []
  }
  return res.data.map((k) => {
    const articleId = k.article_info.article_id
    return {
      id: articleId,
      title: k.article_info.title,
      url: `https://juejin.cn/post/${articleId}`,
    }
  })
})

export default defineSource({
  "juejin": hot,
  "juejin-hot": hot,
  "juejin-news": news,
  "juejin-recommend": recommend,
})
