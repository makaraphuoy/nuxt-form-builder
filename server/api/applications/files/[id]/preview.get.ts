/**
 * GET /api/applications/files/:id/preview?download=false
 *
 * Static mock — returns a tiny sample PDF for any file ID.
 * Pass ?download=true to force attachment disposition (triggers browser download).
 * Pass ?type=image to get a sample PNG instead (used by avatar fields).
 */
export default defineEventHandler((event) => {
  const query = getQuery(event);
  const download = query.download === "true";
  const type = (query.type as string) ?? "pdf";

  if (type === "image") {
    // Static kumquat-branch SVG — used as the avatar preview placeholder
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <defs>
    <!-- Blurred background wash -->
    <filter id="blur"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="softBlur"><feGaussianBlur stdDeviation="2.5"/></filter>
    <filter id="fruitShadow">
      <feDropShadow dx="1" dy="2" stdDeviation="3" flood-color="#00000040"/>
    </filter>

    <!-- Fruit gradients -->
    <radialGradient id="f1" cx="35%" cy="30%" r="65%">
      <stop offset="0%"   stop-color="#FFE066"/>
      <stop offset="50%"  stop-color="#F5A623"/>
      <stop offset="100%" stop-color="#C96A00"/>
    </radialGradient>
    <radialGradient id="f2" cx="38%" cy="28%" r="60%">
      <stop offset="0%"   stop-color="#FFD45E"/>
      <stop offset="55%"  stop-color="#F09820"/>
      <stop offset="100%" stop-color="#B85E00"/>
    </radialGradient>
    <radialGradient id="f3" cx="40%" cy="35%" r="60%">
      <stop offset="0%"   stop-color="#FFCF55"/>
      <stop offset="50%"  stop-color="#E8901A"/>
      <stop offset="100%" stop-color="#A85200"/>
    </radialGradient>
    <radialGradient id="fBg" cx="35%" cy="30%" r="65%">
      <stop offset="0%"   stop-color="#FFD066" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#B06000" stop-opacity="0.5"/>
    </radialGradient>
    <radialGradient id="shine" cx="30%" cy="25%" r="55%">
      <stop offset="0%"   stop-color="#fff" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>

    <!-- Leaf gradients -->
    <linearGradient id="leaf1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#A8CC6A"/>
      <stop offset="100%" stop-color="#4A8A30"/>
    </linearGradient>
    <linearGradient id="leaf2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#8DC05A"/>
      <stop offset="100%" stop-color="#3D7A28"/>
    </linearGradient>
    <linearGradient id="leaf3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#B0D070"/>
      <stop offset="100%" stop-color="#557830"/>
    </linearGradient>
  </defs>

  <!-- ── Bokeh background ── -->
  <rect width="400" height="300" fill="#8BAA68"/>
  <!-- soft bokeh blobs -->
  <circle cx="30"  cy="60"  r="55" fill="#A8C870" opacity="0.6" filter="url(#blur)"/>
  <circle cx="360" cy="40"  r="60" fill="#C8E080" opacity="0.5" filter="url(#blur)"/>
  <circle cx="20"  cy="240" r="50" fill="#90B860" opacity="0.6" filter="url(#blur)"/>
  <circle cx="370" cy="260" r="65" fill="#B0C870" opacity="0.5" filter="url(#blur)"/>
  <circle cx="200" cy="280" r="45" fill="#98B860" opacity="0.4" filter="url(#blur)"/>
  <!-- far background fruits (blurred) -->
  <circle cx="340" cy="80"  r="28" fill="url(#fBg)" filter="url(#blur)"/>
  <circle cx="370" cy="130" r="22" fill="url(#fBg)" filter="url(#blur)"/>
  <circle cx="50"  cy="200" r="25" fill="url(#fBg)" filter="url(#blur)"/>

  <!-- ── Main branch ── -->
  <path d="M30 290 Q90 220 160 160 Q220 105 290 80 Q340 62 390 55"
        stroke="#5A3E28" stroke-width="9" stroke-linecap="round" fill="none"/>
  <path d="M160 160 Q180 130 175 90"
        stroke="#5A3E28" stroke-width="6" stroke-linecap="round" fill="none"/>
  <path d="M220 120 Q250 100 260 65"
        stroke="#5A3E28" stroke-width="5" stroke-linecap="round" fill="none"/>
  <path d="M130 200 Q100 185 80 195"
        stroke="#6B4A32" stroke-width="5" stroke-linecap="round" fill="none"/>

  <!-- ── Leaves ── -->
  <!-- Large leaves mid-branch -->
  <ellipse cx="195" cy="130" rx="38" ry="14" fill="url(#leaf1)"
           transform="rotate(-38 195 130)"/>
  <line x1="180" y1="118" x2="210" y2="142" stroke="#3A7020" stroke-width="1.2" opacity="0.7"/>

  <ellipse cx="155" cy="155" rx="34" ry="12" fill="url(#leaf2)"
           transform="rotate(20 155 155)"/>
  <line x1="138" y1="154" x2="172" y2="156" stroke="#336018" stroke-width="1.2" opacity="0.7"/>

  <ellipse cx="240" cy="105" rx="36" ry="13" fill="url(#leaf3)"
           transform="rotate(-50 240 105)"/>
  <line x1="223" y1="92" x2="257" y2="118" stroke="#406820" stroke-width="1.2" opacity="0.7"/>

  <ellipse cx="280" cy="88"  rx="30" ry="11" fill="url(#leaf1)"
           transform="rotate(-20 280 88)"/>
  <line x1="265" y1="84" x2="295" y2="92" stroke="#3A7020" stroke-width="1.2" opacity="0.7"/>

  <ellipse cx="175" cy="95"  rx="32" ry="11" fill="url(#leaf2)"
           transform="rotate(-60 175 95)"/>

  <ellipse cx="100" cy="195" rx="28" ry="10" fill="url(#leaf3)"
           transform="rotate(15 100 195)"/>
  <line x1="85" y1="194" x2="115" y2="196" stroke="#3A6820" stroke-width="1.2" opacity="0.7"/>

  <ellipse cx="120" cy="175" rx="26" ry="10" fill="url(#leaf1)"
           transform="rotate(-30 120 175)"/>

  <!-- Right-side leaves -->
  <ellipse cx="330" cy="70"  rx="28" ry="10" fill="url(#leaf2)"
           transform="rotate(-15 330 70)"/>
  <ellipse cx="355" cy="62"  rx="24" ry="9"  fill="url(#leaf3)"
           transform="rotate(10 355 62)"/>

  <!-- ── Fruit stems ── -->
  <line x1="210" y1="142" x2="215" y2="158" stroke="#6B4226" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="185" y1="148" x2="183" y2="163" stroke="#6B4226" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="245" y1="128" x2="252" y2="145" stroke="#6B4226" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="145" y1="185" x2="140" y2="200" stroke="#6B4226" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="115" y1="195" x2="112" y2="210" stroke="#6B4226" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="295" y1="95"  x2="298" y2="112" stroke="#6B4226" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="270" y1="100" x2="265" y2="116" stroke="#6B4226" stroke-width="2.5" stroke-linecap="round"/>

  <!-- ── Foreground fruits ── -->
  <!-- Fruit cluster centre -->
  <circle cx="215" cy="172" r="24" fill="url(#f1)" filter="url(#fruitShadow)"/>
  <circle cx="215" cy="172" r="24" fill="url(#shine)"/>
  <!-- texture -->
  <circle cx="207" cy="165" r="1.5" fill="#B06000" opacity="0.3"/>
  <circle cx="222" cy="168" r="1.5" fill="#B06000" opacity="0.25"/>
  <circle cx="210" cy="178" r="1.5" fill="#B06000" opacity="0.3"/>

  <circle cx="183" cy="167" r="21" fill="url(#f2)" filter="url(#fruitShadow)"/>
  <circle cx="183" cy="167" r="21" fill="url(#shine)"/>
  <circle cx="176" cy="161" r="1.5" fill="#A05800" opacity="0.3"/>
  <circle cx="189" cy="164" r="1.5" fill="#A05800" opacity="0.25"/>

  <circle cx="253" cy="149" r="20" fill="url(#f3)" filter="url(#fruitShadow)"/>
  <circle cx="253" cy="149" r="20" fill="url(#shine)"/>
  <circle cx="246" cy="143" r="1.5" fill="#985000" opacity="0.3"/>
  <circle cx="259" cy="146" r="1.5" fill="#985000" opacity="0.25"/>

  <!-- Lower cluster -->
  <circle cx="140" cy="204" r="22" fill="url(#f1)" filter="url(#fruitShadow)"/>
  <circle cx="140" cy="204" r="22" fill="url(#shine)"/>
  <circle cx="133" cy="197" r="1.5" fill="#B06000" opacity="0.3"/>
  <circle cx="147" cy="200" r="1.5" fill="#B06000" opacity="0.25"/>

  <circle cx="112" cy="213" r="19" fill="url(#f2)" filter="url(#fruitShadow)"/>
  <circle cx="112" cy="213" r="19" fill="url(#shine)"/>

  <!-- Upper right fruit -->
  <circle cx="298" cy="116" r="19" fill="url(#f3)" filter="url(#fruitShadow)"/>
  <circle cx="298" cy="116" r="19" fill="url(#shine)"/>

  <circle cx="266" cy="120" r="17" fill="url(#f1)" filter="url(#fruitShadow)"/>
  <circle cx="266" cy="120" r="17" fill="url(#shine)"/>

  <!-- Small unripe buds -->
  <circle cx="262" cy="68" r="7" fill="#6A9A40" filter="url(#softBlur)"/>
  <circle cx="270" cy="62" r="6" fill="#5A8A35" filter="url(#softBlur)"/>
  <circle cx="278" cy="65" r="5" fill="#6A9A40" filter="url(#softBlur)"/>
</svg>`;

    const buf = Buffer.from(svg, "utf-8");
    setHeader(event, "Content-Type", "image/svg+xml");
    setHeader(event, "Content-Length", buf.length);
    setHeader(
      event,
      "Content-Disposition",
      download ? `attachment; filename="orange.svg"` : `inline; filename="orange.svg"`,
    );
    return buf;
  }

  // Build a minimal valid PDF dynamically so byte offsets are always correct
  const header = "%PDF-1.4\n";
  const obj1 = "1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n";
  const obj2 = "2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n";
  const obj3Stream =
    "BT /F1 16 Tf 72 720 Td (Sample document) Tj ET";
  const obj4 = `4 0 obj\n<</Length ${obj3Stream.length}>>\nstream\n${obj3Stream}\nendstream\nendobj\n`;
  const obj3 = `3 0 obj\n<</Type /Page /MediaBox [0 0 612 792] /Parent 2 0 R /Resources <</Font <</F1 <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>>>>> /Contents 4 0 R>>\nendobj\n`;

  const off1 = header.length;
  const off2 = off1 + obj1.length;
  const off3 = off2 + obj2.length;
  const off4 = off3 + obj3.length;
  const xrefStart = off4 + obj4.length;

  const pad = (n: number) => String(n).padStart(10, "0");
  const xref = [
    "xref\n",
    "0 5\n",
    "0000000000 65535 f \n",
    `${pad(off1)} 00000 n \n`,
    `${pad(off2)} 00000 n \n`,
    `${pad(off3)} 00000 n \n`,
    `${pad(off4)} 00000 n \n`,
    "trailer\n",
    "<</Size 5/Root 1 0 R>>\n",
    "startxref\n",
    `${xrefStart}\n`,
    "%%EOF",
  ].join("");

  const pdf = Buffer.from(header + obj1 + obj2 + obj3 + obj4 + xref, "latin1");

  setHeader(event, "Content-Type", "application/pdf");
  setHeader(event, "Content-Length", pdf.length);
  setHeader(
    event,
    "Content-Disposition",
    download
      ? `attachment; filename="sample.pdf"`
      : `inline; filename="sample.pdf"`,
  );
  return pdf;
});
