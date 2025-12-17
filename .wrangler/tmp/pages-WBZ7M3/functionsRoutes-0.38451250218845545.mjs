import { onRequestPost as __api_template_create_ts_onRequestPost } from "D:\\codeToGit\\anime-role-grid\\functions\\api\\template\\create.ts"
import { onRequestGet as __api_template__id__ts_onRequestGet } from "D:\\codeToGit\\anime-role-grid\\functions\\api\\template\\[id].ts"
import { onRequestPost as __api_save_ts_onRequestPost } from "D:\\codeToGit\\anime-role-grid\\functions\\api\\save.ts"
import { onRequestPost as __api_search_ts_onRequestPost } from "D:\\codeToGit\\anime-role-grid\\functions\\api\\search.ts"
import { onRequestGet as __api_trending_ts_onRequestGet } from "D:\\codeToGit\\anime-role-grid\\functions\\api\\trending.ts"

export const routes = [
    {
      routePath: "/api/template/create",
      mountPath: "/api/template",
      method: "POST",
      middlewares: [],
      modules: [__api_template_create_ts_onRequestPost],
    },
  {
      routePath: "/api/template/:id",
      mountPath: "/api/template",
      method: "GET",
      middlewares: [],
      modules: [__api_template__id__ts_onRequestGet],
    },
  {
      routePath: "/api/save",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_save_ts_onRequestPost],
    },
  {
      routePath: "/api/search",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_search_ts_onRequestPost],
    },
  {
      routePath: "/api/trending",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_trending_ts_onRequestGet],
    },
  ]