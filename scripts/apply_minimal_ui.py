from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')

link='<link rel="stylesheet" href="./minimal-ui.css?v=1">'
script='<script src="./minimal-ui.js?v=2" defer></script>'

if 'minimal-ui.css' not in s:
    s=s.replace('</head>',f'  {link}\n  {script}\n</head>',1)
else:
    s=s.replace('./minimal-ui.css?v=0','./minimal-ui.css?v=1')
    s=s.replace('./minimal-ui.js?v=1','./minimal-ui.js?v=2')
    if 'minimal-ui.js' not in s:
        s=s.replace('</head>',f'  {script}\n</head>',1)

s=s.replace('<meta name="theme-color" content="#171412">','<meta name="theme-color" content="#edf4fb" media="(prefers-color-scheme:light)">\n<meta name="theme-color" content="#191e24" media="(prefers-color-scheme:dark)">',1)
s=s.replace('<meta name="apple-mobile-web-app-title" content="AirFry Studio">','<meta name="apple-mobile-web-app-title" content="Ricette">',1)
s=s.replace('<link rel="manifest" href="manifest.webmanifest">','<link rel="manifest" href="manifest.webmanifest?v=2">',1)
s=s.replace('<link rel="apple-touch-icon" href="icon-180.png">','<link rel="apple-touch-icon" href="icon-180.png?v=2">',1)

p.write_text(s,encoding='utf-8')
