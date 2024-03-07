const fs = require('fs-extra');
const path = require('path');

const downloadDir = path.join(__dirname, '../html')
const outputDir = path.join(__dirname, '../output')
const rawJsDir = path.join(outputDir, 'rawJs')
const dataDir = path.join(outputDir, 'data')

fs.ensureDirSync(rawJsDir)
fs.ensureDirSync(dataDir)

// Iterate over HTML files in the year directory
fs.readdirSync(downloadDir).forEach((file) => {
  if (path.extname(file) === '.html') {
    const name = path.basename(file, '.html');
    const [year, city] = name.split('-');

    if (!year || !city) return;
    
    // Read the HTML file
    const htmlContent = fs.readFileSync(path.join(downloadDir, file), 'utf-8');

    // Extract the content of function markerBind
    const markerBindContent = htmlContent.match(/function markerBind\(\)\{(.*?)\}/s);
    if (markerBindContent && markerBindContent[1]) {
      // Write the content to a .js file
      fs.writeFileSync(path.join(rawJsDir, `${path.basename(file, '.html')}.js`), markerBindContent[1]);
    }
  }
});


let currentFile;
let cityData = {};
// Define setMarkers function
global.setMarkers = (lat, long, htmlString, icon) => {
  const city = currentFile.split('-')[1].replace('.js', '');  // Extract city name from file name
  if (!city) return;
  if (!cityData[city]) cityData[city] = [];

  // Extract 變異點編號 as id
  const idMatch = htmlString.match(/變異點編號：(.*?)<br\/>/);
  const id = idMatch ? idMatch[1] : '';

  cityData[city].push({
    id,
    lat,
    long,
    details: htmlString,
    icon,
  });
};

const filenameByYear = fs.readdirSync(rawJsDir).reduce((acc, file) => {
  if (path.extname(file) === '.js') {
    const [year] = file.split('-');

    return {
      ...acc,
      [year]: [...(acc[year] || []), file],
    }
  }
}, {});

Object.entries(filenameByYear).forEach(([year, fileNames]) => {
  cityData = {};

 fileNames.forEach(file => {
  currentFile = file
  const script = fs.readFileSync(path.join(rawJsDir, file), 'utf-8') 
  eval(script)
 })

 fs.writeFileSync(path.join(dataDir, `${year}.json`), JSON.stringify(cityData, null, 2));
})

