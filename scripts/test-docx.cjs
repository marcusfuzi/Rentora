const docx = require('docx');
const fs = require('fs');

const { Document, Packer, Paragraph, TextRun } = docx;

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      new Paragraph({
        children: [
          new TextRun({ text: "RENTORA Test Document", bold: true, size: 32 })
        ]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('C:/Users/bisht/.gemini/antigravity/scratch/rentora/test.docx', buffer);
  console.log('Saved test.docx successfully');
}).catch(err => {
  console.error('Error saving docx:', err);
});
