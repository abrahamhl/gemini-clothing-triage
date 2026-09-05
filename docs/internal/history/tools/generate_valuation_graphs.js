/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./docs/valuation_market_data.json', 'utf8'));

// Simple ASCII bar chart function
function asciiBar(label, value, maxValue, width = 40) {
  const barLength = Math.round((value / maxValue) * width);
  const bar = '█'.repeat(barLength) + ' '.repeat(width - barLength);
  return `${label.padEnd(25)} |${bar}| ${value} EUR`;
}

console.log('=== PRECIO BASE EUR POR MARCA/MODELO (Median Very Good Used NL) ===\n');

// Fashion vs Audio summary
const fashion = data.filter(d => !d.marca.includes('B&W') && !d.marca.includes('JBL') && !d.marca.includes('Magnat') && !d.marca.includes('Philips') && !d.marca.includes('Vintage') && !d.marca.includes('Premium') && !d.marca.includes('Life') && !d.marca.includes('Sony') && !d.marca.includes('Sound'));
const audio = data.filter(d => !fashion.includes(d));

const maxPrice = Math.max(...data.map(d => d.precio_base_EUR));

console.log('--- FASHION / CLOTHING ---');
fashion.forEach(item => {
  const key = `${item.marca} ${item.modelo} ${item.serie}`.trim();
  console.log(asciiBar(key.substring(0,24), item.precio_base_EUR, maxPrice));
});

console.log('\n--- AUDIO VINTAGE (detailed models) ---');
audio.forEach(item => {
  const key = `${item.marca} ${item.modelo} ${item.serie}`.trim();
  console.log(asciiBar(key.substring(0,24), item.precio_base_EUR, maxPrice));
});

// Summary stats
console.log('\n=== KEY STATISTICS ===');
const avgFashion = (fashion.reduce((sum, i) => sum + i.precio_base_EUR, 0) / fashion.length).toFixed(0);
const avgAudio = (audio.reduce((sum, i) => sum + i.precio_base_EUR, 0) / audio.length).toFixed(0);
const top = [...data].sort((a,b) => b.precio_base_EUR - a.precio_base_EUR).slice(0,3);
const bottom = [...data].sort((a,b) => a.precio_base_EUR - b.precio_base_EUR).slice(0,3);

console.log(`Average Fashion: ${avgFashion} EUR`);
console.log(`Average Audio Vintage: ${avgAudio} EUR`);
console.log(`Top 3 value: ${top.map(t => `${t.marca} ${t.modelo}: ${t.precio_base_EUR}`).join(', ')}`);
console.log(`Bottom 3 value: ${bottom.map(t => `${t.marca} ${t.modelo}: ${t.precio_base_EUR}`).join(', ')}`);

// Simple category comparison data for charts
console.log('\n=== DATA FOR CHARTS (JSON) ===');
const chartData = {
  labels: data.map(d => `${d.marca} ${d.modelo}`.substring(0,20)),
  prices: data.map(d => d.precio_base_EUR),
  categories: data.map(d => d.marca.includes('B&W') || d.marca.includes('JBL') || d.marca.includes('Magnat') || d.marca.includes('Philips') || d.marca.includes('Vintage') || d.marca.includes('Premium') || d.marca.includes('Life') || d.marca.includes('Sony') || d.marca.includes('Sound') ? 'Audio' : 'Fashion'),
  summary: { avgFashion: parseInt(avgFashion), avgAudio: parseInt(avgAudio) }
};
console.log(JSON.stringify(chartData, null, 2));

console.log('\nGraphs data also saved. Use this JSON in your app for bar/line charts (e.g. price by item, audio vs fashion pie or grouped bar).');
