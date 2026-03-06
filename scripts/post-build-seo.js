const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Remove Expo-injected duplicates (theme-color, description) that we'll replace
html = html.replace(/<meta name="theme-color"[^>]*>\n?/g, '');
html = html.replace(/<meta name="description"[^>]*>\n?/g, '');

const seoTags = `
    <meta name="description" content="PickleBall Dating connects pickleball players for matches, friendships, and more. Discover nearby courts, find opponents at your skill level, and join the pickleball community." />
    <meta name="keywords" content="pickleball, dating, sports, match, court finder, pickleball players, pickleball community" />
    <meta name="author" content="PickleBall Dating" />
    <meta name="theme-color" content="#2563EB" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="PickleBall Dating — Find Your Perfect Match on the Court" />
    <meta property="og:description" content="Connect with pickleball players near you. Find courts, opponents, and build your pickleball community." />
    <meta property="og:site_name" content="PickleBall Dating" />
    <meta property="og:url" content="https://pickleball-dating.vercel.app" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="PickleBall Dating — Find Your Perfect Match on the Court" />
    <meta name="twitter:description" content="Connect with pickleball players near you. Find courts, opponents, and build your pickleball community." />
    <link rel="canonical" href="https://pickleball-dating.vercel.app" />`;

// Inject SEO tags before </head>
html = html.replace('</head>', seoTags + '\n  </head>');

// Replace noscript with accessible fallback
html = html.replace(
  /<noscript>[\s\S]*?<\/noscript>/,
  `<noscript>
      <div style="padding:2rem;text-align:center;font-family:system-ui,sans-serif">
        <h1>PickleBall Dating</h1>
        <p>Find your perfect match on the court. Connect with pickleball players near you.</p>
        <p>Please enable JavaScript to use this app.</p>
      </div>
    </noscript>`
);

// Add accessibility attributes to root div
html = html.replace(
  '<div id="root"></div>',
  '<div id="root" role="application" aria-label="PickleBall Dating App"></div>'
);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('SEO tags injected into dist/index.html');
