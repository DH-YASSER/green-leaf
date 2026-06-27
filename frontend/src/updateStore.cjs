const fs = require('fs');
const path = require('path');

const files = [
  'pages/Browse.jsx',
  'pages/Cart.jsx',
  'pages/FournisseurProfile.jsx',
  'pages/Home.jsx',
  'pages/Login.jsx',
  'pages/Register.jsx',
  'pages/admin/AdminApp.jsx',
  'pages/fournisseur/FournisseurApp.jsx',
  'pages/restaurant/RestaurantApp.jsx'
];

files.forEach(file => {
  const fullPath = path.join('C:/Users/HP/Desktop/markeat/frontend/src', file);
  let content = fs.readFileSync(fullPath, 'utf8');

  // Add import if not present
  const depth = file.includes('/') ? '../../' : '../';
  const importStr = `import { useAppStore } from '${depth}store/appStore';`;
  if (!content.includes('useAppStore')) {
    content = content.replace(/(import React.*?;\n)/, `$1${importStr}\n`);
  }

  // Remove state declarations
  content = content.replace(/const\s+\[theme,\s*setTheme\]\s*=\s*useState\([^)]+\);/g, '');
  content = content.replace(/const\s+\[lang,\s*setLang\]\s*=\s*useState\([^)]+\);/g, '');
  
  // Insert hook after Component declaration
  const hookStr = `\n  const { theme, lang, toggleTheme, toggleLang } = useAppStore();`;
  if (!content.includes('useAppStore();')) {
    // Attempt to find the main component declaration
    // It's usually `const ComponentName = () => {` or `function ComponentName() {`
    // We'll just look for the last function or const that matches the filename (excluding .jsx)
    const baseName = path.basename(file, '.jsx');
    const regex1 = new RegExp(`const\\s+${baseName}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*{`);
    const regex2 = new RegExp(`function\\s+${baseName}\\s*\\([^)]*\\)\\s*{`);
    
    if (regex1.test(content)) {
      content = content.replace(regex1, match => match + hookStr);
    } else if (regex2.test(content)) {
      content = content.replace(regex2, match => match + hookStr);
    } else {
      // Fallback for things like Browse which might have const Browse = () => {
      console.log('Could not find component declaration in', file);
    }
  }

  // Replace onClick handlers
  content = content.replace(/onClick=\{\(\) => setTheme\([^)]+\)\}/g, 'onClick={toggleTheme}');
  content = content.replace(/onClick=\{\(\) => setLang\([^)]+\)\}/g, 'onClick={toggleLang}');
  
  // Replace onTheme/onLang props
  content = content.replace(/onTheme=\{\(\) => setTheme\([^)]+\)\}/g, 'onTheme={toggleTheme}');
  content = content.replace(/onLang=\{\(\) => setLang\([^)]+\)\}/g, 'onLang={toggleLang}');
  
  // Specifically for Register.jsx and Login.jsx which have inline setters
  content = content.replace(/setTheme\(v => v === 'dark' \? 'light' : 'dark'\)/g, 'toggleTheme()');
  content = content.replace(/setLang\(v => v === 'fr' \? 'en' : 'fr'\)/g, 'toggleLang()');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Updated', file);
});
