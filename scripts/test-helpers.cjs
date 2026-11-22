const docx = require('docx');
const fs = require('fs');
const path = require('path');

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, ImageRun,
  Header, Footer, PageNumber, PageBreak
} = docx;

const ASSETS_DIR = 'C:/Users/bisht/.gemini/antigravity/scratch/rentora/presentation_assets';

// Helper styles
const FONT = 'Calibri';
const FONT_TITLE = 'Georgia';
const COLOR_PRIMARY = '183D2B'; // Forest Green
const COLOR_SECONDARY = '0F281C';
const COLOR_MUTED = '555555';
const COLOR_DARK = '111827';
const COLOR_BORDER = 'D1D5DB';
const COLOR_BG_HEADER = '183D2B';
const COLOR_BG_ALT = 'F9FAFB';

// Helper for paragraphs
function p(text, options = {}) {
  const {
    bold = false,
    italic = false,
    size = 24, // in half-points (24 = 12pt)
    color = COLOR_DARK,
    font = FONT,
    align = AlignmentType.LEFT,
    spaceBefore = 120,
    spaceAfter = 120,
    lineSpacing = 276 // 1.15 line spacing
  } = options;

  let children = [];
  if (typeof text === 'string') {
    children = [new TextRun({ text, bold, italic, size, color, font })];
  } else if (Array.isArray(text)) {
    children = text.map(t => {
      if (typeof t === 'string') return new TextRun({ text: t, size, color, font });
      return new TextRun({
        text: t.text || '',
        bold: t.bold !== undefined ? t.bold : bold,
        italic: t.italic !== undefined ? t.italic : italic,
        size: t.size || size,
        color: t.color || color,
        font: t.font || font
      });
    });
  }

  return new Paragraph({
    alignment: align,
    spacing: { before: spaceBefore, after: spaceAfter, line: lineSpacing },
    children
  });
}

// Heading 1
function h1(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.LEFT,
    spacing: { before: 360, after: 180 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 32, // 16pt
        color: COLOR_PRIMARY,
        font: FONT_TITLE
      })
    ]
  });
}

// Heading 2
function h2(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.LEFT,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 28, // 14pt
        color: COLOR_SECONDARY,
        font: FONT_TITLE
      })
    ]
  });
}

// Heading 3
function h3(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    alignment: AlignmentType.LEFT,
    spacing: { before: 180, after: 80 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 24, // 12pt
        color: COLOR_PRIMARY,
        font: FONT
      })
    ]
  });
}

// Bullet point
function bullet(title, text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 60, after: 60, line: 260 },
    children: [
      new TextRun({ text: title ? title + ": " : "", bold: true, size: 23, color: COLOR_DARK, font: FONT }),
      new TextRun({ text, size: 23, color: '374151', font: FONT })
    ]
  });
}

// Table helper
function createStyledTable(headers, rows, colWidths = []) {
  const tableRows = [];

  // Header row
  const headerCells = headers.map((h, i) => {
    return new TableCell({
      width: colWidths[i] ? { size: colWidths[i], type: WidthType.DXA } : undefined,
      shading: { fill: COLOR_BG_HEADER },
      margins: { top: 120, bottom: 120, left: 140, right: 140 },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: h, bold: true, size: 21, color: 'FFFFFF', font: FONT })
          ]
        })
      ]
    });
  });
  tableRows.push(new TableRow({ children: headerCells, tableHeader: true }));

  // Data rows
  rows.forEach((r, rowIdx) => {
    const isAlt = rowIdx % 2 === 1;
    const cells = r.map((c, i) => {
      const cellText = typeof c === 'string' ? c : (c.text || '');
      const cellBold = c.bold || false;
      const cellColor = c.color || COLOR_DARK;
      const cellAlign = c.align || AlignmentType.LEFT;

      return new TableCell({
        width: colWidths[i] ? { size: colWidths[i], type: WidthType.DXA } : undefined,
        shading: isAlt ? { fill: COLOR_BG_ALT } : undefined,
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        children: [
          new Paragraph({
            alignment: cellAlign,
            children: [
              new TextRun({ text: cellText, bold: cellBold, size: 21, color: cellColor, font: FONT })
            ]
          })
        ]
      });
    });
    tableRows.push(new TableRow({ children: cells }));
  });

  return new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
      left: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
      right: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: COLOR_BORDER },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: COLOR_BORDER }
    }
  });
}

// Image helper
function createImageSection(imgPath, caption, width = 540, height = 338) {
  if (!fs.existsSync(imgPath)) return [];
  const buffer = fs.readFileSync(imgPath);
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new ImageRun({
          data: buffer,
          transformation: { width, height }
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 200 },
      children: [
        new TextRun({ text: caption, italic: true, bold: true, size: 20, color: COLOR_MUTED, font: FONT })
      ]
    })
  ];
}

console.log("Helper functions defined successfully.");
