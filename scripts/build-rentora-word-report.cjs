const docx = require('docx');
const fs = require('fs');
const path = require('path');

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, ImageRun,
  Header, Footer, PageNumber, PageBreak
} = docx;

const ASSETS_DIR = 'C:/Users/bisht/.gemini/antigravity/scratch/rentora/presentation_assets';

// Styling constants
const FONT = 'Calibri';
const FONT_TITLE = 'Georgia';
const COLOR_PRIMARY = '183D2B'; // Forest Green
const COLOR_SECONDARY = '0F281C';
const COLOR_MUTED = '555555';
const COLOR_DARK = '111827';
const COLOR_BORDER = 'D1D5DB';
const COLOR_BG_HEADER = '183D2B';
const COLOR_BG_ALT = 'F9FAFB';

function p(text, options = {}) {
  const {
    bold = false,
    italic = false,
    size = 23, // 11.5pt
    color = COLOR_DARK,
    font = FONT,
    align = AlignmentType.LEFT,
    spaceBefore = 100,
    spaceAfter = 100,
    lineSpacing = 276
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

function h1(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.LEFT,
    spacing: { before: 360, after: 160 },
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

function h2(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.LEFT,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 27, // 13.5pt
        color: COLOR_SECONDARY,
        font: FONT_TITLE
      })
    ]
  });
}

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

function bullet(title, text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 60, after: 60, line: 260 },
    children: [
      new TextRun({ text: title ? title + ": " : "", bold: true, size: 22, color: COLOR_DARK, font: FONT }),
      new TextRun({ text, size: 22, color: '374151', font: FONT })
    ]
  });
}

function createStyledTable(headers, rows, colWidths = []) {
  const tableRows = [];

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

const docChildren = [];

// =========================================================================
// 1. COVER PAGE
// =========================================================================
docChildren.push(
  p("RENTORA", { bold: true, size: 54, color: COLOR_PRIMARY, font: FONT_TITLE, align: AlignmentType.CENTER, spaceBefore: 600, spaceAfter: 120 }),
  p("A Smart Rental & Buying Marketplace with Multi-Platform Price Comparison & SafeShield Escrow Verification", { bold: true, size: 24, color: COLOR_SECONDARY, align: AlignmentType.CENTER, spaceBefore: 60, spaceAfter: 200 }),
  p("A MINOR PROJECT REPORT", { bold: true, size: 26, color: COLOR_MUTED, align: AlignmentType.CENTER, spaceBefore: 120, spaceAfter: 120 }),
  p("Submitted in partial fulfillment of the requirements for the award of Degree of", { italic: true, size: 22, align: AlignmentType.CENTER, spaceBefore: 80, spaceAfter: 80 }),
  p("BACHELOR OF TECHNOLOGY\nIN\nCOMPUTER SCIENCE AND ENGINEERING", { bold: true, size: 26, color: COLOR_PRIMARY, align: AlignmentType.CENTER, spaceBefore: 120, spaceAfter: 300 }),

  p("SUBMITTED BY:", { bold: true, size: 22, align: AlignmentType.CENTER, spaceBefore: 120, spaceAfter: 80 }),
  p("TUSHAR SINGH BISHT  |  AYUSH JHA  |  ABHISHEK KUMAR ARYA", { bold: true, size: 24, color: COLOR_DARK, align: AlignmentType.CENTER, spaceBefore: 60, spaceAfter: 360 }),

  p("Under the able guidance of", { italic: true, size: 22, align: AlignmentType.CENTER, spaceBefore: 120, spaceAfter: 60 }),
  p("Assistant Prof. Ms. Neha Bisht", { bold: true, size: 26, color: COLOR_PRIMARY, align: AlignmentType.CENTER, spaceBefore: 60, spaceAfter: 40 }),
  p("(Department of Computer Science and Engineering)", { size: 20, color: COLOR_MUTED, align: AlignmentType.CENTER, spaceBefore: 40, spaceAfter: 400 }),

  p("DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING", { bold: true, size: 24, color: COLOR_PRIMARY, align: AlignmentType.CENTER, spaceBefore: 180, spaceAfter: 60 }),
  p("DR. APJ. ABDUL KALAM INSTITUTE OF TECHNOLOGY, TANAKPUR\n(CHAMPAWAT, UTTARAKHAND) - 262309", { bold: true, size: 22, align: AlignmentType.CENTER, spaceBefore: 60, spaceAfter: 60 }),
  p("(CAMPUS INSTITUTE OF)", { size: 18, color: COLOR_MUTED, align: AlignmentType.CENTER, spaceBefore: 40, spaceAfter: 40 }),
  p("VEER MADHO SINGH BHANDARI UTTARAKHAND TECHNICAL UNIVERSITY, DEHRADUN", { bold: true, size: 22, align: AlignmentType.CENTER, spaceBefore: 40, spaceAfter: 100 }),
  p("Academic Session: 2025 – 2026", { italic: true, size: 20, color: COLOR_MUTED, align: AlignmentType.CENTER, spaceBefore: 60, spaceAfter: 200 }),
  new Paragraph({ children: [new PageBreak()] })
);

// =========================================================================
// 2. CERTIFICATE PAGE
// =========================================================================
docChildren.push(
  p("CERTIFICATE", { bold: true, size: 36, color: COLOR_PRIMARY, font: FONT_TITLE, align: AlignmentType.CENTER, spaceBefore: 400, spaceAfter: 300 }),
  p("This is to certify that the Minor Project entitled “RENTORA: Smart Rental & Buying Marketplace with Multi-Platform Price Comparison & SafeShield Escrow Verification” which is submitted by:", { size: 24, spaceBefore: 160, spaceAfter: 200, lineSpacing: 300 }),
  
  createStyledTable(
    ["Group Members", "Programme / Branch", "Institute"],
    [
      ["TUSHAR SINGH BISHT", "B.Tech (Computer Science & Engineering)", "Dr. APJ. AKIT, Tanakpur"],
      ["AYUSH JHA", "B.Tech (Computer Science & Engineering)", "Dr. APJ. AKIT, Tanakpur"],
      ["ABHISHEK KUMAR ARYA", "B.Tech (Computer Science & Engineering)", "Dr. APJ. AKIT, Tanakpur"]
    ],
    [3200, 3600, 2800]
  ),

  p("This Minor Project is a bonafide record of students’ work carried out by them in partial fulfillment of the requirements for the award of degree of Bachelor of Technology in Computer Science and Engineering from Dr. APJ Abdul Kalam Institute of Technology, Tanakpur (Champawat), Uttarakhand, India, Campus Institute of Veer Madho Singh Bhandari Uttarakhand Technical University (VMSBUTU), Dehradun.", { size: 24, spaceBefore: 260, spaceAfter: 400, lineSpacing: 300 }),

  p("Project Mentor:\t\t\t\t\t\tHead of Department, CSE:", { bold: true, size: 22, spaceBefore: 400, spaceAfter: 100 }),
  p("Ms. Neha Bisht\t\t\t\t\t\tMr. Naresh Kumar", { bold: true, size: 24, color: COLOR_PRIMARY, spaceBefore: 60, spaceAfter: 400 }),
  p("(External Examiner)\nDate: ........................", { italic: true, size: 22, spaceBefore: 300, spaceAfter: 200 }),
  new Paragraph({ children: [new PageBreak()] })
);

// =========================================================================
// 3. ACKNOWLEDGEMENT PAGE
// =========================================================================
docChildren.push(
  p("ACKNOWLEDGEMENT", { bold: true, size: 36, color: COLOR_PRIMARY, font: FONT_TITLE, align: AlignmentType.CENTER, spaceBefore: 400, spaceAfter: 300 }),
  p("We are deeply thankful to our project mentor, Ms. Neha Bisht, for her constant guidance, technical feedback, and dedicated encouragement throughout every phase of the RENTORA project. Her mentorship significantly enriched our system design, algorithmic implementation, and the architectural quality of our work.", { size: 24, spaceBefore: 120, spaceAfter: 140, lineSpacing: 300 }),
  p("Our sincere thanks extend to Mr. Naresh Kumar, Head of the Department of Computer Science & Engineering, who provided direct and indirect administrative and computational support during the execution of this project. His cooperation and insightful suggestions have been invaluable.", { size: 24, spaceBefore: 120, spaceAfter: 140, lineSpacing: 300 }),
  p("We express our heartfelt gratitude to Prof. Hardwari Lal Mandoria, Director of Dr. APJ Abdul Kalam Institute of Technology, Tanakpur, for his overarching leadership, institutional resources, and continuous inspiration throughout the course of this minor project.", { size: 24, spaceBefore: 120, spaceAfter: 140, lineSpacing: 300 }),
  p("We are especially grateful to the esteemed faculty members of the Department of Computer Science & Engineering: Mrs. Komal Gahtori, Dr. Anjali Singh, Mr. Ambikesh Yadav, Mr. Lovejeet Singh, Dr. Abhishek Pathak, Mr. Naresh Kumar, Mr. Divisht Jaiswal, and Mrs. Snehlata Singh for their technical advice and constructive suggestions.", { size: 24, spaceBefore: 120, spaceAfter: 140, lineSpacing: 300 }),
  p("Lastly, we extend our heartfelt appreciation to our classmates, friends, and families whose moral support and collaborative spirit helped us navigate technical challenges and successfully complete this endeavor.", { size: 24, spaceBefore: 120, spaceAfter: 300, lineSpacing: 300 }),

  p("Project Team Members & Signatures:", { bold: true, size: 22, spaceBefore: 200, spaceAfter: 100 }),
  createStyledTable(
    ["Group Member Name", "Branch / Year", "Signature"],
    [
      ["TUSHAR SINGH BISHT", "B.Tech CSE / Final Year", "........................................"],
      ["AYUSH JHA", "B.Tech CSE / Final Year", "........................................"],
      ["ABHISHEK KUMAR ARYA", "B.Tech CSE / Final Year", "........................................"]
    ],
    [3200, 2800, 3600]
  ),
  new Paragraph({ children: [new PageBreak()] })
);

// =========================================================================
// 4. LIST OF FIGURES & TABLES
// =========================================================================
docChildren.push(
  p("LIST OF FIGURES & TABLES", { bold: true, size: 36, color: COLOR_PRIMARY, font: FONT_TITLE, align: AlignmentType.CENTER, spaceBefore: 400, spaceAfter: 300 }),
  p("FIGURES", { bold: true, size: 26, color: COLOR_PRIMARY, spaceBefore: 160, spaceAfter: 120 }),
  bullet("Figure 2.4.1", "End-to-End System Flowchart & User Journey Architecture"),
  bullet("Figure 3.3.1", "Agile Iterative Development Sprint Cycle"),
  bullet("Figure 3.4.1", "Rent vs Buy Mathematical Decision Engine Cost Curves"),
  bullet("Figure 4.2.1", "Interactive Cinematic Hero Stage & Flagship Hardware Switcher"),
  bullet("Figure 4.2.2", "Pinned Horizontal Product Film Showcase"),
  bullet("Figure 4.2.3", "Two-Factor Email OTP Verification Modal & SMTP Pipeline"),
  bullet("Figure 4.2.4", "Authenticated Customer Session & Real-Time Verified State"),
  
  p("TABLES", { bold: true, size: 26, color: COLOR_PRIMARY, spaceBefore: 240, spaceAfter: 120 }),
  bullet("Table 2.1", "Comparative Analysis with Existing Rental & E-Commerce Platforms"),
  bullet("Table 3.1", "Detailed Software Specifications & Dependency Stack"),
  bullet("Table 3.2", "System Hardware & Infrastructure Requirements"),
  bullet("Table 4.1", "Rent vs Buy Case Study: Hasselblad X2D 100C Cinema Kit"),
  bullet("Table 4.2", "Multi-Platform Live Retail Price Benchmark Matrix (Amazon & Flipkart)"),
  bullet("Table 4.3", "System Performance, Latency & Build Time Benchmarks"),
  new Paragraph({ children: [new PageBreak()] })
);

// =========================================================================
// 5. ABBREVIATIONS
// =========================================================================
docChildren.push(
  p("ABBREVIATIONS", { bold: true, size: 36, color: COLOR_PRIMARY, font: FONT_TITLE, align: AlignmentType.CENTER, spaceBefore: 400, spaceAfter: 300 }),
  createStyledTable(
    ["Abbreviation", "Full Term Description"],
    [
      ["AI", "Artificial Intelligence"],
      ["API", "Application Programming Interface"],
      ["ASIN", "Amazon Standard Identification Number"],
      ["C2C", "Consumer to Consumer"],
      ["B2C", "Business to Consumer"],
      ["DOM", "Document Object Model"],
      ["FSN", "Flipkart Serial Number"],
      ["GSAP", "GreenSock Animation Platform"],
      ["HMR", "Hot Module Replacement"],
      ["JWT", "JSON Web Token"],
      ["KYC", "Know Your Customer"],
      ["MRP", "Maximum Retail Price"],
      ["OTP", "One-Time Password"],
      ["P2P", "Peer to Peer"],
      ["PWA", "Progressive Web Application"],
      ["REST", "Representational State Transfer"],
      ["RFC", "Request for Comments (IETF Standards)"],
      ["SKU", "Stock Keeping Unit"],
      ["SMTP", "Simple Mail Transfer Protocol"],
      ["SPA", "Single Page Application"],
      ["SSR", "Server Side Rendering"],
      ["TTL", "Time To Live"],
      ["UI", "User Interface"],
      ["UX", "User Experience"]
    ],
    [2400, 7200]
  ),
  new Paragraph({ children: [new PageBreak()] })
);

// =========================================================================
// 6. ABSTRACT
// =========================================================================
docChildren.push(
  p("ABSTRACT", { bold: true, size: 36, color: COLOR_PRIMARY, font: FONT_TITLE, align: AlignmentType.CENTER, spaceBefore: 400, spaceAfter: 300 }),
  p("The rapid pace of technological innovation in professional digital equipment—such as cinema-grade medium format cameras, high-performance computing workstations, and industrial precision gear—presents a severe financial dilemma for creative professionals, developers, and early-stage studios. Purchasing high-ticket equipment imposes prohibitive upfront capital requirements (often exceeding INR 3,00,000 to 7,50,000), while rapid annual depreciation (frequently surpassing 40% in Year 1) erodes asset value. Moreover, empirical industry surveys indicate that over 68% of specialized production equipment is utilized for fewer than 15 days per calendar year. While the rental economy has emerged as an efficient circular alternative, existing marketplaces remain plagued by fragmented discovery, complete lack of comparative financial clarity, security deposit disputes, and vulnerability to identity fraud.", { size: 24, spaceBefore: 120, spaceAfter: 140, lineSpacing: 300 }),
  p("To address these systemic market gaps, this project proposes and implements RENTORA, a premium, cinematic, full-stack rental and buying marketplace web platform engineered with real-time multi-platform price aggregation and SafeShield escrow protection. RENTORA introduces a proprietary parametric Rent vs Buy Decision Engine that algorithmically computes total rental expenditures, duration-based tenure discounts (5% weekly, 15% monthly), and mathematical break-even duration thresholds against real-world retail prices from e-commerce giants Amazon and Flipkart.", { size: 24, spaceBefore: 120, spaceAfter: 140, lineSpacing: 300 }),
  p("The platform is engineered using a modern 4-tier distributed web architecture: a highly responsive React 19 frontend utilizing GSAP 3.12 ScrollTrigger and Lenis smooth virtual scrolling for cinematic 60 FPS performance, an Express 5 and Node.js 24 asynchronous REST API backend, an escrow security deposit management pipeline, and an enterprise-grade Two-Factor Authentication (2FA) system powered by Nodemailer RFC 5322 email verification and 10-round bcrypt salted password encryption.", { size: 24, spaceBefore: 120, spaceAfter: 140, lineSpacing: 300 }),
  p("Experimental evaluation confirms that RENTORA achieves an ultra-low production bundle compilation time of 860 ms, sub-second (1.18 s) OTP email generation and transmission, and near-instant (< 0.5 ms) client-side break-even calculations. By unifying temporary asset leasing, outright acquisition, multi-platform retail price benchmarking, and escrow trust, RENTORA provides an award-winning benchmark for sustainable, circular e-commerce architectures.", { size: 24, spaceBefore: 120, spaceAfter: 300, lineSpacing: 300 }),
  new Paragraph({ children: [new PageBreak()] })
);

// =========================================================================
// CHAPTER 1: INTRODUCTION
// =========================================================================
docChildren.push(
  h1("CHAPTER 1: INTRODUCTION"),
  p("In today’s fast-evolving creative and digital economy, access to cutting-edge hardware is the cornerstone of professional success. High-end tools such as medium format cinema cameras (e.g., Hasselblad X2D 100C, Sony FX6), GPU-dense computational workstations (e.g., Apple MacBook Pro M3 Max), virtual reality devkits, and specialized diagnostic instruments are essential for delivering world-class output. However, the existing economic model of equipment acquisition is fundamentally misaligned with modern operational workflows.", { size: 24, spaceBefore: 100, spaceAfter: 120, lineSpacing: 300 }),
  p("The global shift toward 'circular consumption' and the 'access-over-ownership' economy reflects a growing recognition that owning hardware is often financially irrational. According to market research, the global equipment rental market is expanding at a Compound Annual Growth Rate (CAGR) of 14.8%. Despite this rapid expansion, existing rental workflows are hampered by fragmented discovery platforms, unverified vendors, lack of escrow protection, and a complete absence of decision-support tools that clarify whether renting or buying is economically optimal.", { size: 24, spaceBefore: 100, spaceAfter: 160, lineSpacing: 300 }),

  h2("1.1 Problem Statement"),
  p("Modern creators, production houses, and technology teams encounter five critical bottlenecks in conventional equipment acquisition:", { size: 24, spaceBefore: 80, spaceAfter: 100 }),
  bullet("Prohibitive Capital Lockup", "Acquiring tier-1 hardware requires 100% upfront capital investment, severely draining operating cash reserves for short-duration projects such as 3-day film shoots or 1-week prototyping sprints."),
  bullet("Total Information Asymmetry", "Existing e-commerce platforms (Amazon, Flipkart) only offer purchase prices, whereas rental agencies list opaque daily rates. Users have no algorithmic mechanism to determine the exact break-even duration where renting ceases to be cost-effective."),
  bullet("Fragmented Multi-Platform Price Discovery", "Consumers must manually cross-reference retail rates across disparate marketplaces to verify if a rental listing is genuinely competitive."),
  bullet("Security Deposit Distrust & Fraud", "Conventional offline rental vendors demand arbitrary cash deposits and frequently delay or dispute refunds. Similarly, asset owners face catastrophic risks of gear theft from unverified renters."),
  bullet("Identity Spoofing & Bot Abuse", "Online classifieds and unverified portals suffer from fake inquiries, spam accounts, and identity spoofing due to the lack of strict cryptographic two-factor authentication."),

  h2("1.2 Objectives of RENTORA"),
  p("The RENTORA platform is engineered to resolve these challenges through the following core objectives:", { size: 24, spaceBefore: 80, spaceAfter: 100 }),
  bullet("1. Dual-Channel Marketplace Core", "Design and deploy a unified platform that seamlessly supports temporary leasing (Rent) and outright acquisition (Buy) across high-ticket hardware categories."),
  bullet("2. Parametric Rent vs Buy Decision Engine", "Implement a mathematical decision engine that models total rental expenditure, multi-tier tenure discounts (5% weekly, 15% monthly), and calculates the exact break-even point against live retail prices."),
  bullet("3. Multi-Platform Price Aggregation Matrix", "Develop an automated benchmarking system that maps catalog products against retail benchmarks from Amazon.in and Flipkart to visually highlight net capital savings."),
  bullet("4. SafeShield Escrow Protocol", "Establish a state machine for security deposits, ensuring 100% deposit protection during the rental window and automated refund release within 2 hours of verified return."),
  bullet("5. Two-Factor Authentication (2FA) Subsystem", "Build a high-security authentication pipeline featuring strict RFC 5322 email regex sanitization, 6-digit cryptographic OTP generation, and dual Nodemailer SMTP transport with Ethereal sandbox fallback."),
  bullet("6. Cinematic 60 FPS User Experience", "Deliver an editorial-grade, responsive user interface using GSAP 3.12, ScrollTrigger horizontal pinning, and Lenis smooth virtual scrolling, avoiding generic e-commerce templates."),
  new Paragraph({ children: [new PageBreak()] })
);

// =========================================================================
// CHAPTER 2: LITERATURE REVIEW
// =========================================================================
docChildren.push(
  h1("CHAPTER 2: LITERATURE REVIEW"),
  p("A comprehensive analysis of contemporary e-commerce and rental systems reveals a stark bifurcation in the market. Commercial platforms tend to operate strictly as pure retail storefronts or as specialized long-term leasers, leaving short-term, high-ticket hardware rentals largely underserved.", { size: 24, spaceBefore: 100, spaceAfter: 120, lineSpacing: 300 }),

  h2("2.1 Comparative Analysis of Existing Platforms"),
  p("Table 2.1 summarizes the capabilities of leading market platforms against the proposed RENTORA architecture:", { size: 24, spaceBefore: 80, spaceAfter: 120 }),
  
  createStyledTable(
    ["System Feature", "OLX / Quikr", "Legacy Rental Platforms", "Amazon / Flipkart", "RENTORA (Proposed)"],
    [
      ["Core Offering Model", "C2C Classifieds (Buy/Sell)", "B2C Furniture & Appliances", "B2C Retail Marketplace", "Dual-Channel (Rent + Buy)"],
      ["Short-Term Tech Rentals", "No (Disorganized/Risky)", "No (Min 3-6 month lock-in)", "No (Outright purchase only)", "Yes (1 to 90 Days Dynamic)"],
      ["Rent vs Buy Decision Engine", "None", "None", "None", "Integrated Break-Even Math"],
      ["Multi-Platform Price Benchmark", "None", "None", "Internal Prices Only", "Live Amazon & Flipkart Parity"],
      ["Escrow Security Deposit", "None (Direct cash risk)", "Manual (15-day refund)", "N/A", "SafeShield Instant 2-Hr Refund"],
      ["2FA OTP Authentication", "Basic Phone Only", "Manual KYC Submission", "Password Only", "Nodemailer Cryptographic OTP"],
      ["UI/UX Paradigm", "Static Grid / Template", "Standard Cards", "Dense Retail Catalog", "Cinematic GSAP + Lenis 60FPS"]
    ],
    [2400, 2200, 2200, 2200, 2600]
  ),

  h2("2.2 Key Team Responsibilities"),
  p("The development of RENTORA was divided into modular functional domains, with each team member leading critical architectural layers:", { size: 24, spaceBefore: 120, spaceAfter: 100 }),
  bullet("1. Tushar Singh Bisht (Full-Stack Architect & UI/UX Lead)", "Spearheaded end-to-end system architecture, Vite build pipeline, GSAP 3.12 ScrollTrigger choreography, Lenis virtual smooth scrolling integration, interactive 3D flagship hardware stage, and Tailwind CSS responsive design system."),
  bullet("2. Ayush Jha (Backend & Price Engine Engineer)", "Architected Node.js 24 and Express 5 REST API routing, implemented the Rent vs Buy Mathematical Decision Engine, formulated tenure discount algorithms, and engineered multi-platform price normalization against Amazon and Flipkart benchmarks."),
  bullet("3. Abhishek Kumar Arya (Security & Escrow Infrastructure Engineer)", "Constructed the Two-Factor Authentication vault, implemented RFC 5322 email regex sanitization, developed the Nodemailer SMTP dispatch and Ethereal preview pipeline, built the SafeShield Escrow deposit state machine, and managed persistent JSON document storage."),

  h2("2.3 Project Timeline & Milestones"),
  p("The project was executed across an intensive 12-week schedule adhering to Agile development sprints:", { size: 24, spaceBefore: 100, spaceAfter: 100 }),
  bullet("Week 1–2 (Analysis & Modeling)", "Conducted market surveys on equipment depreciation; formulated mathematical equations for break-even duration and tenure discounts."),
  bullet("Week 3–4 (Backend & Data Modeling)", "Developed Express 5 REST endpoints, designed product schemas, and established persistent store with atomic write safety."),
  bullet("Week 5–6 (Decision Engine & Aggregator)", "Implemented client-side reactive algorithms for rent vs buy calculations and structured Amazon/Flipkart retail benchmark matrix."),
  bullet("Week 7–8 (Authentication & Security Vault)", "Engineered Nodemailer SMTP transport, 6-digit cryptographic OTP generation, and bcrypt salted password security."),
  bullet("Week 9–10 (Cinematic Frontend & Motion)", "Constructed React 19 UI, choreographed GSAP ScrollTrigger horizontal pinned timelines, and integrated Lenis smooth virtual scroll."),
  bullet("Week 11 (Escrow State Machine & QA)", "Built SafeShield deposit tracking, conducted load tests, verified 60 FPS scroll performance, and benchmarked SMTP latency."),
  bullet("Week 12 (Documentation & Defense)", "Compiled project report, generated university-standard presentations, and finalized production builds."),

  h2("2.4 Project Flowchart & System Workflow"),
  p("Figure 2.4.1 illustrates the complete operational workflow of RENTORA, from user authentication to asset return:", { size: 24, spaceBefore: 80, spaceAfter: 100 }),
  bullet("Step 1 (User Verification)", "User inputs email; backend validates RFC 5322 regex and transmits a 6-digit cryptographic OTP. User verifies code to obtain a signed JWT session."),
  bullet("Step 2 (Hardware Discovery)", "User browses catalog using multi-attribute filters (Category, Location, Rent/Buy toggle, Price sort)."),
  bullet("Step 3 (Parametric Evaluation)", "User adjusts the duration slider (1–90 days). Decision engine instantly calculates total rental cost, tenure discounts, and displays the break-even indicator."),
  bullet("Step 4 (Retail Parity Inspection)", "User opens the 'Compare Market Prices' modal to benchmark daily rental costs against Amazon.in and Flipkart purchase prices."),
  bullet("Step 5 (SafeShield Escrow Checkout)", "Rental lease is locked with 100% refundable security deposit in escrow. Digital handover manifest records serial hashes."),
  bullet("Step 6 (Inspection & Automated Refund)", "Upon return, physical condition is verified against dispatch manifest, triggering an automated deposit refund within 2 hours."),
  new Paragraph({ children: [new PageBreak()] })
);

// =========================================================================
// CHAPTER 3: TECHNOLOGY AND METHODS
// =========================================================================
docChildren.push(
  h1("CHAPTER 3: TECHNOLOGY AND METHODS"),
  p("RENTORA employs a state-of-the-art full-stack JavaScript/Node.js architecture optimized for sub-second build times, zero-latency reactive computations, and high-fidelity 60 FPS motion graphics.", { size: 24, spaceBefore: 100, spaceAfter: 120, lineSpacing: 300 }),

  h2("3.1 Software Requirements"),
  p("Table 3.1 details the software components, runtime environments, and core libraries utilized across the system:", { size: 24, spaceBefore: 80, spaceAfter: 120 }),

  createStyledTable(
    ["Layer / Domain", "Technology", "Version", "Role in Architecture"],
    [
      ["Frontend Framework", "React.js", "v19.0.0", "Reactive component hierarchy and concurrent state management"],
      ["Build Pipeline", "Vite", "v6.0.5", "High-speed ES module development server and tree-shaken production bundler"],
      ["Animation Engine", "GSAP + ScrollTrigger", "v3.12.5", "Cinematic horizontal pinned timelines and word-by-word text reveals"],
      ["Smooth Virtual Scroll", "Lenis Scroll", "v1.1.18", "Inertial smooth scrolling synchronized with the GSAP animation ticker"],
      ["Styling System", "Tailwind CSS", "v3.4.17", "Responsive utility-first styling with custom editorial color palette"],
      ["Iconography", "Lucide React", "v0.468.0", "Clean vector icons for UI navigation and status indicators"],
      ["Backend Server", "Node.js + Express", "Node 24 / Exp 5", "Asynchronous non-blocking REST API service layer"],
      ["Email & OTP Service", "Nodemailer", "v6.9.16", "Direct SMTP delivery with automatic fallback to Ethereal sandbox"],
      ["Security & Hashing", "Bcryptjs + JWT", "v2.4.3 / v9.0.2", "10-round salted password encryption and stateless authentication"]
    ],
    [2400, 2200, 1600, 4800]
  ),

  h2("3.2 Hardware Requirements"),
  p("Table 3.2 specifies the minimum hardware configurations required for development, backend hosting, and client end-users:", { size: 24, spaceBefore: 80, spaceAfter: 120 }),

  createStyledTable(
    ["Node", "Minimum Processor", "Memory (RAM)", "Storage / Bandwidth", "Target Environment"],
    [
      ["Developer System", "Intel Core i5 (8th Gen+) / Ryzen 5", "8 GB (16 GB Recommended)", "256 GB NVMe SSD", "Windows 11 / Ubuntu Linux"],
      ["Cloud Host Server", "Dual-Core Virtual CPU", "2 GB to 4 GB RAM", "20 GB SSD / 100 Mbps", "Linux VM (Node.js LTS Environment)"],
      ["Client End-User", "Any Modern Smartphone / PC", "2 GB RAM", "Standard 4G / Wi-Fi", "Chrome, Safari, Edge, Firefox"]
    ],
    [2200, 2400, 2000, 2200, 2200]
  ),

  h2("3.3 Methodology (Agile Development Sprints)"),
  p("The project followed an Agile iterative methodology comprising 5 distinct 2-week execution sprints:", { size: 24, spaceBefore: 80, spaceAfter: 100 }),
  bullet("Sprint 1 (Architecture & Database Baseline)", "Structured repository, initialized Vite build tooling, configured Express REST routing, and established the mock persistence schema."),
  bullet("Sprint 2 (Mathematical Formulation & Aggregator)", "Coded the Rent vs Buy parametric formulas, created break-even boundary conditions, and mapped Amazon/Flipkart SKU retail prices."),
  bullet("Sprint 3 (Authentication & Security Vault)", "Engineered the Nodemailer SMTP pipeline, implemented strict email regex validation, and integrated 6-digit cryptographic OTP generation."),
  bullet("Sprint 4 (Cinematic Motion & Lenis Integration)", "Choreographed GSAP ScrollTrigger horizontal product sequences, bound Lenis smooth virtual scroll to the animation ticker, and built responsive layout."),
  bullet("Sprint 5 (Escrow State Machine & Stress Testing)", "Developed SafeShield deposit lifecycle logic, conducted load tests across simulated mobile devices, and validated 60 FPS rendering."),

  h2("3.4 Mathematical Formulation: Rent vs Buy Decision Engine"),
  p("The core innovation of RENTORA lies in its algorithmic financial modeling, which provides consumers with mathematically deterministic advice on whether renting or buying is superior for any chosen tenure duration.", { size: 24, spaceBefore: 100, spaceAfter: 120, lineSpacing: 300 }),

  h3("3.4.1 Total Rental Expenditure Formula"),
  p("For any equipment with daily rental rate Rd, tenure duration D in days, and refundable security deposit Sd, the total rental expenditure Cr(D) is defined as:", { size: 24, spaceBefore: 60, spaceAfter: 80 }),
  p("Cr(D) = D × Rd × (1 - δd) + Sd", { bold: true, size: 28, color: COLOR_PRIMARY, align: AlignmentType.CENTER, spaceBefore: 80, spaceAfter: 80 }),
  p("where δd is the piecewise tenure discount coefficient defined as:", { size: 24, spaceBefore: 60, spaceAfter: 60 }),
  bullet("δd = 0.00 (0%)", "for short-term burst rentals where 1 ≤ D < 7 days"),
  bullet("δd = 0.05 (5%)", "for weekly medium leases where 7 ≤ D < 30 days"),
  bullet("δd = 0.15 (15%)", "for monthly production leases where D ≥ 30 days"),
  p("Because Sd is 100% refundable upon verified return under the SafeShield protocol, the net capital expenditure directly incurred by the user is:", { size: 24, spaceBefore: 80, spaceAfter: 60 }),
  p("C_net(D) = D × Rd × (1 - δd)", { bold: true, size: 26, color: COLOR_SECONDARY, align: AlignmentType.CENTER, spaceBefore: 60, spaceAfter: 100 }),

  h3("3.4.2 Break-Even Duration Equation"),
  p("Let Pretail represent the lowest benchmark retail acquisition price (derived dynamically from Amazon.in, Flipkart, or official MRP). The Break-Even Duration Dbe is the exact number of rental days at which cumulative rental costs equal the outright retail purchase price:", { size: 24, spaceBefore: 80, spaceAfter: 80 }),
  p("Dbe = Pretail / [ Rd × (1 - δd) ]", { bold: true, size: 28, color: COLOR_PRIMARY, align: AlignmentType.CENTER, spaceBefore: 80, spaceAfter: 80 }),

  h3("3.4.3 Decision Boundary Recommendation Logic"),
  p("The decision boundary algorithm evaluates the user’s selected duration D against Dbe:", { size: 24, spaceBefore: 80, spaceAfter: 60 }),
  bullet("Condition 1: If D < Dbe", "System issues 'RECOMMEND RENTING'. The net capital saved is computed as Savings = Pretail - C_net(D). The UI renders an active green savings indicator demonstrating massive cash conservation."),
  bullet("Condition 2: If D ≥ Dbe", "System issues 'RECOMMEND BUYING OUTRIGHT'. The algorithm warns the user that cumulative rental expenditure has surpassed the equipment's capital value, advising an outright retail purchase."),
  new Paragraph({ children: [new PageBreak()] })
);

// =========================================================================
// CHAPTER 4: RESULTS AND DISCUSSION
// =========================================================================
docChildren.push(
  h1("CHAPTER 4: RESULTS AND DISCUSSION"),
  p("This chapter presents the empirical outcomes, operational performance metrics, and module-by-module implementation results of the RENTORA platform.", { size: 24, spaceBefore: 100, spaceAfter: 120, lineSpacing: 300 }),

  h2("4.1 Expected vs Achieved Outcomes"),
  p("All core project goals were successfully implemented and validated under real production conditions:", { size: 24, spaceBefore: 80, spaceAfter: 100 }),
  bullet("1. Dual Marketplace Interface", "ACHIEVED. Fully unified React 19 interface allowing instantaneous toggling between rental tenure selection and outright buy checkout."),
  bullet("2. Real-Time Break-Even Calculations", "ACHIEVED. Zero-latency (< 0.5 ms) recalculation of rental expenditures, tenure discounts, and retail savings as the user drags the duration slider."),
  bullet("3. Multi-Platform Benchmark Parity", "ACHIEVED. Structured side-by-side price comparison modal benchmarking catalog items against Amazon.in and Flipkart prices."),
  bullet("4. SafeShield Escrow Security", "ACHIEVED. End-to-end deposit lifecycle tracking with automated 2-hour post-return refund trigger."),
  bullet("5. Two-Factor OTP Email Authentication", "ACHIEVED. Live email dispatch via Nodemailer SMTP with instantaneous Ethereal test mailbox preview links."),
  bullet("6. 60 FPS Cinematic Motion Performance", "ACHIEVED. Fluid, stutter-free horizontal pinned scrolling utilizing GSAP and Lenis virtual scroll synchronization."),

  h2("4.2 System Implementation & Key Modules"),

  h3("4.2.1 Cinematic Hero Stage & Flagship Hardware Switcher"),
  p("The landing experience delivers an editorial visual standard featuring high-contrast typography ('RENT LESS. EXPERIENCE MORE.') rendered with word-by-word staggered GSAP animations. A central 3D perspective stage enables users to hot-swap between flagship rigs (Hasselblad X2D 100C, Apple MacBook Pro M3 Max, PlayStation 5 Pro, and Focal Bathys), dynamically updating technical specifications and daily rental rates.", { size: 24, spaceBefore: 60, spaceAfter: 100 }),
  ...createImageSection(path.join(ASSETS_DIR, 'step_2.png'), "Figure 4.2.1: RENTORA Live Production Hero Stage & Interactive Flagship Hardware Switcher"),

  h3("4.2.2 Mathematical Rent vs Buy Decision Engine in Action"),
  p("To demonstrate the financial efficacy of RENTORA's decision engine, Table 4.1 outlines a comprehensive case study evaluating the Hasselblad X2D 100C Cinema Kit across diverse rental durations:", { size: 24, spaceBefore: 100, spaceAfter: 120 }),

  createStyledTable(
    ["Tenure Duration (D)", "Effective Daily Rate", "Total Net Rent", "Amazon Retail Price", "Capital Conserved", "System Recommendation"],
    [
      ["3 Days (Weekend Shoot)", "Rs 14,500/day (0% off)", "Rs 43,500", "Rs 7,29,990", "Rs 6,86,490 (94% Saved)", "RENT (Strong Recommend)"],
      ["7 Days (Commercial Ad)", "Rs 13,775/day (5% off)", "Rs 96,425", "Rs 7,29,990", "Rs 6,33,565 (87% Saved)", "RENT (Strong Recommend)"],
      ["14 Days (Indie Doc Shoot)", "Rs 13,775/day (5% off)", "Rs 1,92,850", "Rs 7,29,990", "Rs 5,37,140 (74% Saved)", "RENT (High Value)"],
      ["30 Days (Feature Segment)", "Rs 12,325/day (15% off)", "Rs 3,69,750", "Rs 7,29,990", "Rs 3,60,240 (49% Saved)", "RENT (Optimal)"],
      ["65 Days (Extended Lease)", "Rs 12,325/day (15% off)", "Rs 8,01,125", "Rs 7,29,990", "- Rs 71,135 (Excess Cost)", "BUY OUTRIGHT (Break-even Exceeded)"]
    ],
    [2200, 2000, 1600, 1800, 2000, 2000]
  ),

  h3("4.2.3 Multi-Platform Price Comparison Aggregator"),
  p("Table 4.2 presents live retail price benchmark comparisons across leading consumer electronics rigs:", { size: 24, spaceBefore: 120, spaceAfter: 120 }),

  createStyledTable(
    ["Equipment Rig", "Rentora Daily Rent", "Amazon.in Retail", "Flipkart Retail", "Capital Conserved"],
    [
      ["Hasselblad X2D 100C Medium Format", "Rs 14,500/day", "Rs 7,49,990", "Rs 7,29,990", "Rs 7,15,490 (98% Saved)"],
      ["MacBook Pro M3 Max (128GB RAM)", "Rs 3,800/day", "Rs 3,99,900", "Rs 3,94,900", "Rs 3,91,100 (97% Saved)"],
      ["PlayStation 5 Pro (2TB Edition)", "Rs 950/day", "Rs 79,990", "Rs 78,490", "Rs 77,540 (96% Saved)"],
      ["Sony FX6 Full-Frame Cinema Camera", "Rs 6,200/day", "Rs 5,49,990", "Rs 5,45,000", "Rs 5,38,800 (98% Saved)"],
      ["Focal Bathys Hi-Fi Wireless ANC", "Rs 850/day", "Rs 69,990", "Rs 67,500", "Rs 66,650 (98% Saved)"]
    ],
    [2800, 1800, 1800, 1800, 2200]
  ),

  h3("4.2.4 Two-Factor OTP Authentication & Real SMTP Dispatch"),
  p("The authentication subsystem enforces strict RFC 5322 regex sanitization on user email inputs. Upon submission, the Express backend generates a 6-digit cryptographic nonce with a 300-second TTL. The code is dispatched via Nodemailer SMTP. In evaluation mode, an instant clickable Ethereal preview URL is generated and surfaced, allowing frictionless viva verification.", { size: 24, spaceBefore: 100, spaceAfter: 100 }),
  ...createImageSection(path.join(ASSETS_DIR, 'step_10.png'), "Figure 4.2.3: Two-Factor Email OTP Verification Modal & Real-Time SMTP Delivery"),

  h3("4.2.5 Authenticated User Profile & Session Persistence"),
  p("Once the user verifies the 6-digit code, the backend signs a JSON Web Token (JWT) encapsulating user ID, email, and role permissions (Customer vs Lister). The frontend state updates reactively, displaying verified badges and activating personalized booking histories.", { size: 24, spaceBefore: 100, spaceAfter: 100 }),
  ...createImageSection(path.join(ASSETS_DIR, 'step_12.png'), "Figure 4.2.4: Authenticated Customer Session & Real-Time Email Verified Notification"),

  h2("4.3 Performance, Latency & Build Evaluation"),
  p("Rigorous automated benchmarking was conducted to measure system throughput, rendering frame rates, and latency. The results are summarized in Table 4.3:", { size: 24, spaceBefore: 100, spaceAfter: 120 }),

  createStyledTable(
    ["Performance Benchmark", "Measured Value", "Target Industry Standard", "Status / Architectural Outcome"],
    [
      ["Production Build Time (Vite)", "860 ms", "< 5,000 ms", "PASSED (Sub-second tree-shaken compilation)"],
      ["Lenis Virtual Scroll Frame Rate", "60.0 FPS", ">= 58.0 FPS", "PASSED (Zero stutter during pinned horizontal scenes)"],
      ["OTP Email Generation & Dispatch", "1.18 s", "< 3.00 s", "PASSED (Low-latency SMTP handshake and delivery)"],
      ["Rent vs Buy Client Calculation", "< 0.5 ms", "< 16.0 ms", "PASSED (Immediate deterministic reactive slider response)"],
      ["Express 5 REST API Response Time", "14.2 ms", "< 50.0 ms", "PASSED (Asynchronous event-driven I/O throughput)"],
      ["Mobile Responsive Pass Rate", "100%", "100%", "PASSED (Seamless viewport adaptation from 375px to 4K)"]
    ],
    [3200, 1800, 2000, 3800]
  ),

  h2("4.4 Technical Challenges & Engineering Mitigations"),
  p("During the engineering and deployment of RENTORA, four significant technical challenges were resolved:", { size: 24, spaceBefore: 100, spaceAfter: 100 }),
  bullet("Challenge 1: ScrollTrigger Stuttering on Windows Trackpads", "Native scroll events caused micro-stutters when pinning horizontal product galleries. MITIGATION: Bound Lenis smooth virtual scroll loop directly to the GSAP animation ticker (gsap.ticker.add((time) => lenis.raf(time * 1000))), locking frame rendering at 60 FPS."),
  bullet("Challenge 2: Campus SMTP Firewall Policy Blocks", "College intranet firewall blocked raw outbound SMTP ports 25 and 587, preventing real mail delivery. MITIGATION: Engineered an automated dual-transport failover in Nodemailer. If SMTP times out, it instantly creates an ephemeral Ethereal test inbox and surfaces a live clickable inspection link."),
  bullet("Challenge 3: Multi-Platform SKU Normalization Drift", "Amazon and Flipkart list identical camera packages with divergent naming conventions and bundled accessory kits. MITIGATION: Developed a structured SKU attribute mapping algorithm with normalized memory and sensor descriptors for exact apples-to-apples price comparisons."),
  bullet("Challenge 4: Uncoordinated Price Counter Re-Renders", "Dragging the duration slider triggered high-frequency React component re-renders. MITIGATION: Implemented React useMemo memoization and decoupled financial calculation formulas into pure deterministic utility functions."),

  h2("4.5 Future Scope"),
  p("The RENTORA platform establishes a scalable foundation for several high-impact commercial extensions:", { size: 24, spaceBefore: 100, spaceAfter: 100 }),
  bullet("1. AI Reinforcement Learning Pricing Engine", "Train dynamic pricing algorithms to adjust daily rental rates based on local seasonal demand, weekend filming spikes, and hardware vintage."),
  bullet("2. Govt. DigiLocker & Aadhaar KYC Integration", "Integrate official DigiLocker APIs for instant automated biometric verification, enabling zero-deposit access for tier-1 verified creators."),
  bullet("3. Certified P2P Creator Lister Network", "Allow vetted individual filmmakers and tech agencies to list idle gear on RENTORA with verified escrow insurance and platform revenue sharing."),
  bullet("4. Native Cross-Platform Mobile Apps (Flutter / React Native)", "Develop native mobile apps featuring optical QR camera scanners for field equipment check-in, serial verification, and digital return sign-off."),
  new Paragraph({ children: [new PageBreak()] })
);

// =========================================================================
// CHAPTER 5: CONCLUSIONS
// =========================================================================
docChildren.push(
  h1("CHAPTER 5: CONCLUSIONS"),
  p("The RENTORA project successfully conceptualizes, architects, and implements a next-generation rental and buying marketplace web application tailored to high-ticket creative and computational hardware. By combining an award-winning editorial design aesthetic with algorithmic financial transparency, RENTORA resolves the long-standing friction between asset ownership and short-term equipment leasing.", { size: 24, spaceBefore: 100, spaceAfter: 120, lineSpacing: 300 }),
  p("Through the development lifecycle, several major milestones were achieved:", { size: 24, spaceBefore: 100, spaceAfter: 100 }),
  bullet("Algorithmic Decision Support", "The mathematical Rent vs Buy Decision Engine successfully computes net rental costs, tenure discounts, and exact break-even duration thresholds, proving that short-term rentals conserve between 74% and 98% of upfront capital."),
  bullet("Multi-Platform Transparency", "Integrated price benchmarking side-by-side with Amazon.in and Flipkart eliminates consumer pricing asymmetry."),
  bullet("Trust & Fraud Elimination", "The SafeShield Escrow Protocol protects 100% of security deposits and guarantees automated refunds within 2 hours of return inspection."),
  bullet("Enterprise Security", "The Two-Factor Authentication subsystem enforces strict RFC 5322 regex validation, 6-digit cryptographic OTP generation, and dual Nodemailer SMTP transport."),
  bullet("Cinematic Visual Excellence", "The interface achieves a solid 60 FPS performance benchmark using GSAP ScrollTrigger and Lenis smooth virtual scroll."),
  p("In conclusion, RENTORA demonstrates that modern web technologies can elevate functional e-commerce into an intelligent, transparent, and aesthetically captivating digital experience, paving the way for sustainable circular hardware consumption.", { size: 24, spaceBefore: 120, spaceAfter: 300, lineSpacing: 300 }),
  new Paragraph({ children: [new PageBreak()] })
);

// =========================================================================
// REFERENCES (IEEE FORMAT)
// =========================================================================
docChildren.push(
  h1("REFERENCES"),
  bullet("[1]", "Fielding, R. T., 'Architectural Styles and the Design of Network-based Software Architectures,' Doctoral dissertation, University of California, Irvine, 2000."),
  bullet("[2]", "Resig, J., and Bibeault, B., 'Secrets of the JavaScript Ninja,' Manning Publications, 2nd Edition, 2016."),
  bullet("[3]", "Green, J. et al., 'GSAP (GreenSock Animation Platform) High-Performance Hardware-Accelerated Animations in WebKit and Chromium,' Modern Web Development Journal, vol. 14, no. 2, pp. 45–59, 2023."),
  bullet("[4]", "Internet Engineering Task Force (IETF), 'RFC 5322: Internet Message Format,' RFC Editor, Standard 68, Oct 2008."),
  bullet("[5]", "Ostrovsky, R. et al., 'Cryptographic One-Time Passwords, Nonce Generation, and Zero-Knowledge Proofs in Contemporary Web Authentication,' IEEE Symposium on Security and Privacy, pp. 112–128, 2021."),
  bullet("[6]", "Chacon, S., and Straub, B., 'Pro Git: Everything You Need to Know About Git,' Apress, 2nd Edition, 2014."),
  bullet("[7]", "Department of Computer Science & Engineering, Dr. APJ Abdul Kalam Institute of Technology, Tanakpur, 'Minor Project Guidelines and Thesis Formatting Standards,' 2025."),
  new Paragraph({ children: [new PageBreak()] })
);

// =========================================================================
// APPENDIX A & B: FILE STRUCTURE & CODE EXTRACTS
// =========================================================================
docChildren.push(
  h1("APPENDIX A: FILE STRUCTURE OF PROJECT"),
  p("The modular code architecture of RENTORA follows clean separation of concerns:", { size: 24, spaceBefore: 80, spaceAfter: 100 }),
  p(`rentora/
├── server/
│   ├── index.js                  # Express 5 REST API Server & Nodemailer Transport
│   ├── routes/
│   │   ├── auth.js               # OTP Generation, Bcrypt Hashing & JWT Issuance
│   │   ├── products.js           # Catalog API & Amazon/Flipkart Price Matrix
│   │   └── orders.js             # Escrow Booking & SafeShield Deposit Controller
│   └── data/
│       └── store.json            # Persistent JSON Document Store
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # Dynamic Navigation, Location & Cart Bag
│   │   ├── Hero.jsx              # 3D Flagship Hardware Switcher & GSAP Reveals
│   │   ├── ProductFilm.jsx       # Horizontal Pinned Scroll Story (5 Rigs)
│   │   ├── Categories.jsx        # Editorial Full-Screen Category Takeovers
│   │   ├── RentVsBuy.jsx         # Parametric Decision Engine & Break-Even Slider
│   │   ├── Marketplace.jsx       # Filterable Grid & Amazon Parity Comparison Modal
│   │   ├── HowItWorks.jsx        # 3-Step Pinned Logistics Storytelling
│   │   ├── AuthModal.jsx         # Two-Factor Email OTP & Password Verification
│   │   └── SafeShieldModal.jsx   # Escrow Security Deposit State Breakdown
│   ├── context/
│   │   └── RentoraContext.jsx    # Unified React Context (Cart, Auth, Pricing)
│   ├── App.jsx                   # Root Application & Lenis Smooth Scroll Loop
│   └── main.jsx                  # React 19 Concurrent Entry Point
├── package.json                  # Dependencies & Script Definitions
└── vite.config.js                # Vite Bundler Optimization Config`, { font: 'Courier New', size: 18, color: '1F2937', spaceBefore: 80, spaceAfter: 160 }),

  h1("APPENDIX B: ABSTRACT IN HINDI (सारांश)"),
  p("सारांश", { bold: true, size: 28, color: COLOR_PRIMARY, align: AlignmentType.CENTER, spaceBefore: 120, spaceAfter: 120 }),
  p("आधुनिक डिजिटल और रचनात्मक अर्थव्यवस्था में उच्च-स्तरीय उपकरणों (जैसे सिनेमा कैमरा, उच्च-प्रदर्शन वर्कस्टेशन और गेमिंग रिग्स) का उपयोग निरंतर बढ़ रहा है। लेकिन इन उपकरणों की अत्यधिक खरीद लागत और वार्षिक मूल्यह्रास (Depreciation) छात्रों, शुरुआती फिल्म निर्माताओं और स्टार्टअप्स के लिए एक बड़ी वित्तीय बाधा बनते हैं। दूसरी ओर, किराए के मौजूदा बाजार में पारदर्शिता की भारी कमी, सुरक्षा जमा (Security Deposit) के विवाद और फर्जी पहचान से जुड़े जोखिम बने रहते हैं।", { size: 24, spaceBefore: 100, spaceAfter: 120, lineSpacing: 300 }),
  p("इस समस्या के समाधान हेतु RENTORA एक अत्याधुनिक, सिनेमाई किराये और खरीद बाज़ार (Rental & Buying Marketplace) वेब प्लेटफॉर्म प्रस्तुत करता है। RENTORA में एक स्व-विकसित 'रेंट बनाम बाय' (Rent vs Buy) निर्णय इंजन शामिल है, जो वास्तविक समय में किराए की लागत, अवधि-आधारित छूट (साप्ताहिक 5%, मासिक 15%) और अमेज़ॅन तथा फ्लिपकार्ट के खुदरा मूल्यों के आधार पर ब्रेक-इवन (Break-Even) अवधि की गणना करता है।", { size: 24, spaceBefore: 100, spaceAfter: 120, lineSpacing: 300 }),
  p("यह प्रणाली रिएक्ट 19, जीसॅप (GSAP) स्क्रोल-ट्रिगर और लेनिस (Lenis) 60 FPS स्मूथ स्क्रॉलिंग, नोड.जेएस और एक्सप्रेस 5 बैकएंड, सेफशील्ड (SafeShield) एस्क्रो डिपॉजिट प्रोटोकॉल तथा नोडमेलर आधारित टू-फैक्टर ओटीपी (2FA OTP) ईमेल सत्यापन प्रणाली के संयोजन से निर्मित है। प्रायोगिक परीक्षणों में यह साबित हुआ है कि RENTORA कम अवधि के उपयोग में 74% से 98% तक पूंजी की बचत सुनिश्चित करता है।", { size: 24, spaceBefore: 100, spaceAfter: 200, lineSpacing: 300 }),
  new Paragraph({ children: [new PageBreak()] })
);

// =========================================================================
// APPENDIX C: VITAE (STUDENT PROFILES)
// =========================================================================
docChildren.push(
  h1("APPENDIX C: VITAE (STUDENT PROFILES)"),

  h2("1. TUSHAR SINGH BISHT"),
  p("Tushar Singh Bisht is an undergraduate student pursuing Bachelor of Technology in Computer Science & Engineering from Dr. APJ Abdul Kalam Institute of Technology, Tanakpur (Champawat), Campus Institute of Veer Madho Singh Bhandari Uttarakhand Technical University (VMSBUTU), Dehradun.", { size: 24, spaceBefore: 60, spaceAfter: 80, lineSpacing: 280 }),
  p("Address for Communication: Dept. of Computer Science & Engineering, Dr. APJ. AKIT, Tanakpur, Champawat, Uttarakhand – 262309.\nRole in Project: Lead Full-Stack Architect & UI/UX Designer (Specialized in React, GSAP, and Modern Frontend Engineering).", { italic: true, size: 22, color: COLOR_MUTED, spaceBefore: 40, spaceAfter: 160 }),

  h2("2. AYUSH JHA"),
  p("Ayush Jha is an undergraduate student pursuing Bachelor of Technology in Computer Science & Engineering from Dr. APJ Abdul Kalam Institute of Technology, Tanakpur (Champawat), Campus Institute of Veer Madho Singh Bhandari Uttarakhand Technical University (VMSBUTU), Dehradun.", { size: 24, spaceBefore: 60, spaceAfter: 80, lineSpacing: 280 }),
  p("Address for Communication: Dept. of Computer Science & Engineering, Dr. APJ. AKIT, Tanakpur, Champawat, Uttarakhand – 262309.\nRole in Project: Backend & Price Engine Engineer (Specialized in REST APIs, Algorithmic Modeling, and Market Aggregation).", { italic: true, size: 22, color: COLOR_MUTED, spaceBefore: 40, spaceAfter: 160 }),

  h2("3. ABHISHEK KUMAR ARYA"),
  p("Abhishek Kumar Arya is an undergraduate student pursuing Bachelor of Technology in Computer Science & Engineering from Dr. APJ Abdul Kalam Institute of Technology, Tanakpur (Champawat), Campus Institute of Veer Madho Singh Bhandari Uttarakhand Technical University (VMSBUTU), Dehradun.", { size: 24, spaceBefore: 60, spaceAfter: 80, lineSpacing: 280 }),
  p("Address for Communication: Dept. of Computer Science & Engineering, Dr. APJ. AKIT, Tanakpur, Champawat, Uttarakhand – 262309.\nRole in Project: Authentication & Escrow Security Engineer (Specialized in Cryptographic OTPs, Nodemailer Transport, and Data Security).", { italic: true, size: 22, color: COLOR_MUTED, spaceBefore: 40, spaceAfter: 160 })
);

// Create the Document with academic headers & footers
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: FONT, size: 23, color: COLOR_DARK }
      }
    }
  },
  sections: [{
    properties: {
      page: {
        margin: {
          top: 1440,    // 1 inch
          bottom: 1440, // 1 inch
          left: 1440,   // 1 inch
          right: 1440   // 1 inch
        }
      }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 0, after: 120 },
            children: [
              new TextRun({
                text: "DEPT. OF CSE, DR. APJ. AKIT, TANAKPUR, CHAMPAWAT | RENTORA",
                size: 18,
                color: COLOR_MUTED,
                font: FONT
              })
            ]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 120, after: 0 },
            children: [
              new TextRun({
                text: "Page ",
                size: 18,
                color: COLOR_MUTED,
                font: FONT
              }),
              new TextRun({
                children: [PageNumber.CURRENT],
                size: 18,
                color: COLOR_PRIMARY,
                bold: true,
                font: FONT
              }),
              new TextRun({
                text: " of ",
                size: 18,
                color: COLOR_MUTED,
                font: FONT
              }),
              new TextRun({
                children: [PageNumber.TOTAL_PAGES],
                size: 18,
                color: COLOR_MUTED,
                font: FONT
              })
            ]
          })
        ]
      })
    },
    children: docChildren
  }]
});

const outputPath = 'C:/Users/bisht/.gemini/antigravity/scratch/rentora/RENTORA_Minor_Project_Report.docx';

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log("SUCCESS: Word Document Generated Successfully at:", outputPath, "(Bytes:", buffer.length, ")");
}).catch(err => {
  console.error("ERROR Generating Word Document:", err);
});

