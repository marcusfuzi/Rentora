const docx = require('docx');
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle, ImageRun } = docx;

const imgBuffer = fs.readFileSync('C:/Users/bisht/.gemini/antigravity/scratch/rentora/presentation_assets/step_2.png');

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "Image Test", bold: true, size: 28 })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            data: imgBuffer,
            transformation: {
              width: 500,
              height: 312
            }
          })
        ]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('C:/Users/bisht/.gemini/antigravity/scratch/rentora/test_img.docx', buffer);
  console.log('Saved test_img.docx successfully, bytes:', buffer.length);
}).catch(err => {
  console.error('Error saving docx with image:', err);
});
