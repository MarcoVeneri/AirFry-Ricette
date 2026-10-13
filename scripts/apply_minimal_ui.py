from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')

# Scollega definitivamente la PWA dai vecchi asset minimal-ui cacheabili.
s=s.replace('<link rel="stylesheet" href="./minimal-ui.css?v=1">','<link rel="stylesheet" href="./clean-ui-v4.css?v=4">')
s=s.replace('<script src="./minimal-ui.js?v=2" defer></script>','<script src="./clean-ui-v4.js?v=4" defer></script>')
s=s.replace('<link rel="stylesheet" href="./minimal-ui.css?v=3">','<link rel="stylesheet" href="./clean-ui-v4.css?v=4">')
s=s.replace('<script src="./minimal-ui.js?v=3" defer></script>','<script src="./clean-ui-v4.js?v=4" defer></script>')

# Se per qualche motivo gli asset non fossero presenti, li inserisce una sola volta.
if 'clean-ui-v4.css' not in s:
    s=s.replace('</head>','  <link rel="stylesheet" href="./clean-ui-v4.css?v=4">\n  <script src="./clean-ui-v4.js?v=4" defer></script>\n</head>',1)

s=s.replace('manifest.webmanifest?v=2','manifest.webmanifest?v=4')
s=s.replace('icon-180.png?v=2','icon-180.png?v=4')

# Build marker: URL diversa dall'installazione precedente, così iOS non riusa la vecchia pagina.
marker='''<script>
(function(){
  try{
    const BUILD='4';
    const u=new URL(location.href);
    if(u.searchParams.get('ui')!==BUILD){
      u.searchParams.set('ui',BUILD);
      location.replace(u.toString());
      return;
    }
  }catch(e){}
})();
</script>
'''
if "const BUILD='4'" not in s:
    s=s.replace('</head>',marker+'</head>',1)

p.write_text(s,encoding='utf-8')
