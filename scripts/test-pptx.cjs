const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';

const slide = pres.addSlide();
slide.addText('RENTORA Test', { x: 1, y: 1, fontSize: 24, color: '183D2B' });

pres.writeFile({ fileName: 'C:/Users/bisht/.gemini/antigravity/scratch/rentora/test.pptx' })
  .then(f => console.log('Saved:', f))
  .catch(err => console.error('Error:', err));
