const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  { match: /textMain/g, replace: 'slate-800' },
  { match: /textMuted/g, replace: 'slate-500' },
  { match: /accentPrimary/g, replace: 'blue-500' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.css') || filePath.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;
      
      replacements.forEach(rep => {
        content = content.replace(rep.match, rep.replace);
      });
      
      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated', filePath);
      }
    }
  });
}

processDirectory(directoryPath);

// Also fix index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/textMain/g, 'slate-800').replace(/accentPrimary/g, 'blue-500');
fs.writeFileSync('index.html', indexHtml, 'utf8');

console.log('Done');
