#!/usr/bin/env python3
"""Check that every image configured in the recipe PWA is retrievable."""
import json, re, urllib.request, urllib.error, concurrent.futures
from pathlib import Path
root=Path(__file__).resolve().parents[1]
source=(root/"studio-recipes.js").read_text(encoding="utf-8")
recipes=json.loads(re.search(r"window\.STUDIO_RECIPES\s*=\s*(\[.*\])\s*;\s*$",source,re.S).group(1))
def check(r):
    url=r.get("image","")
    if not url:return {"id":r["id"],"title":r["title"],"ok":False,"status":"missing"}
    if url.startswith("ciambelle-"):
        return {"id":r["id"],"title":r["title"],"ok":(root/url).exists(),"status":"local"}
    req=urllib.request.Request(url,headers={"User-Agent":"Mozilla/5.0 (compatible; AirFryPhotoChecker/1.0)","Range":"bytes=0-127","Accept":"image/webp,image/avif,image/jpeg,image/png,image/*;q=0.8"})
    try:
        with urllib.request.urlopen(req,timeout=14) as response:
            kind=response.headers.get("Content-Type","").split(";")[0].strip().lower()
            response.read(64)
            return {"id":r["id"],"title":r["title"],"ok":kind.startswith("image/"),"status":str(response.status),"content_type":kind}
    except Exception as e:
        return {"id":r["id"],"title":r["title"],"ok":False,"status":str(e)[:200]}
with concurrent.futures.ThreadPoolExecutor(max_workers=7) as pool:
    out=list(pool.map(check,recipes))
report={"total":len(out),"okay":sum(x["ok"] for x in out),"broken":[x for x in out if not x["ok"]]}
(root/"photo-audit.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(json.dumps(report,ensure_ascii=False,indent=2))
