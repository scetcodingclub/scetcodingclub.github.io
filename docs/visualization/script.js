(async () => {

  const watermark = new Image();
  watermark.src = "/asset/NEXUS Hero nobg.webp"; // your watermark image (place in same folder)
  let watermarkLoaded = false;
  watermark.onload = () => watermarkLoaded = true;

  const canvas = document.getElementById("vizCanvas");
  const ctx = canvas.getContext("2d");
  const PADD = 10;
  let bubbles = [];
  let pointer = { x: -9999, y: -9999 };
  let selected = null;

  const dist = (x1, y1, x2, y2) => Math.hypot(x1 - x2, y1 - y2);
  const lerpColor = (hex, amt) => {
    const n = hex.replace("#", "");
    const r = parseInt(n.slice(0, 2), 16),
      g = parseInt(n.slice(2, 4), 16),
      b = parseInt(n.slice(4, 6), 16);
    const rr = Math.round(r + (255 - r) * amt);
    const gg = Math.round(g + (255 - g) * amt);
    const bb = Math.round(b + (255 - b) * amt);
    return `rgb(${rr}, ${gg}, ${bb})`;
  };

  function resizeCanvas() {
    // Match the visible viewport without scrollbars or oversize
    const W = window.innerWidth;
    const H = window.innerHeight;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
  }


  async function loadFile(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.text();
  }

  function parseInputs(listText, mapText) {
    const lines = listText.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const counts = {};
    for (const l of lines) counts[l] = (counts[l] || 0) + 1;

    const tmap = {};
    mapText.split(/\r?\n/).map(s => s.trim()).filter(Boolean).forEach(line => {
      const [type, skill] = line.split("::").map(s => s.trim());
      if (type && skill) tmap[skill] = type.toUpperCase();
    });

    return { counts, tmap };
  }

  function computeSizeLinear(counts, W, H) {
    const values = Object.values(counts);
    const minCount = Math.min(...values);
    const maxCount = Math.max(...values);

    // Base size scales with screen size (smaller on phones)
    const base = Math.min(W, H);
    const minSize = base * 0.025;  // small circles
    const maxSize = base * 0.14;   // big circles → much more distinct

    const sizes = {};
    for (const [skill, c] of Object.entries(counts)) {
      if (maxCount === minCount) {
        sizes[skill] = (minSize + maxSize) / 2;
      } else {
        // perceptually linear — use mild power curve to widen gap
        const t = (c - minCount) / (maxCount - minCount);
        const scaled = Math.pow(t, 0.6); // 0.6 gives more visual contrast
        sizes[skill] = minSize + scaled * (maxSize - minSize);
      }
    }
    return sizes;
  }


  function generateBubbles(counts, tmap) {
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;

    // ✅ Add some padding relative to screen size
    const EDGE_PAD = Math.min(W, H) * 0.06; // ~6% of smaller dimension
    const sizes = computeSizeLinear(counts, W, H);

    const items = Object.keys(counts).map(skill => ({
      skill,
      count: counts[skill],
      type: tmap[skill] || "L",
      size: sizes[skill],
      x: EDGE_PAD + Math.random() * (W - EDGE_PAD * 2),
      y: EDGE_PAD + Math.random() * (H - EDGE_PAD * 2),
    }));

    // Physics-based relaxation to remove overlap and stay inside padded bounds
    for (let step = 0; step < 500; step++) {
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const a = items[i], b = items[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy);
          const minDist = a.size + b.size + PADD;
          if (d < minDist && d > 0.001) {
            const overlap = (minDist - d) / 2;
            const ox = (dx / d) * overlap;
            const oy = (dy / d) * overlap;
            a.x -= ox; a.y -= oy;
            b.x += ox; b.y += oy;
          }
        }
        // keep inside bounds with EDGE_PAD
        items[i].x = Math.min(W - EDGE_PAD - items[i].size, Math.max(EDGE_PAD + items[i].size, items[i].x));
        items[i].y = Math.min(H - EDGE_PAD - items[i].size, Math.max(EDGE_PAD + items[i].size, items[i].y));
      }
    }

    return items;
  }


  function drawOnce() {
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#FFF2F0";
    ctx.fillRect(0, 0, W, H);

    // Draw watermark in the center
  if (watermarkLoaded) {
    const width = W*0.8
    const height = width / (watermark.width / watermark.height)
    // const size = Math.min(W, H) * 0.4; // 40% of smaller dimension
    const x = (W - width) / 2;
    const y = (H - height) / 2;
    ctx.globalAlpha = 0.2; // make it faint
    ctx.drawImage(watermark, x, y,width, height);
    ctx.globalAlpha = 1.0; // reset alpha
  }

    for (const b of bubbles) {
      const isHover = dist(b.x, b.y, pointer.x, pointer.y) <= b.size + PADD;
      const isSelected = selected === b;
      const highlight = isHover || isSelected;
      const base = b.type === "S" ? "#FB7185" : "#08c3a7ff";
      const stroke = highlight ? lerpColor(base, 0.15) : base;

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = stroke;
      ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
      ctx.stroke();

      if (highlight) {
        ctx.beginPath();
        ctx.lineWidth = Math.max(5, PADD / 1.5);
        ctx.strokeStyle = lerpColor(base, 0.3);
        ctx.arc(b.x, b.y, b.size + PADD / 2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.save();
        ctx.font = `bold ${Math.max(12, Math.round(b.size / 3))}px system-ui`;
        ctx.fillStyle = "#0F172A";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.skill, b.x, b.y);
        ctx.font = `${Math.max(10, Math.round(b.size / 4))}px system-ui`;
        ctx.fillText(String(b.count), b.x, b.y + Math.max(14, b.size / 1.6));
        ctx.restore();
      }
    }
  }

  function loop() {
    drawOnce();
    requestAnimationFrame(loop);
  }

  function relaxPositions(bubbles, iterations = 50) {
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    const EDGE_PAD = Math.min(W, H) * 0.06; // ~6% of smaller dimension

    const pad = EDGE_PAD;
    for (let step = 0; step < iterations; step++) {
      let moved = false;
      for (let i = 0; i < bubbles.length; i++) {
        for (let j = i + 1; j < bubbles.length; j++) {
          const a = bubbles[i];
          const b = bubbles[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = a.size + b.size + 2; // add small gap
          if (dist < minDist && dist > 0.001) {
            const overlap = (minDist - dist) * 0.5;
            const nx = dx / dist;
            const ny = dy / dist;
            a.x -= nx * overlap;
            a.y -= ny * overlap;
            b.x += nx * overlap;
            b.y += ny * overlap;
            moved = true;
          }
        }
      }

      // Keep all inside bounds with padding
      for (const b of bubbles) {
        b.x = Math.min(W - pad - b.size, Math.max(pad + b.size, b.x));
        b.y = Math.min(H - pad - b.size, Math.max(pad + b.size, b.y));
      }

      if (!moved) break; // early exit if stable
    }

    // recentre system gently if drifted
    const avgX = bubbles.reduce((a, b) => a + b.x, 0) / bubbles.length;
    const avgY = bubbles.reduce((a, b) => a + b.y, 0) / bubbles.length;
    const dx = (W / 2) - avgX;
    const dy = (H / 2) - avgY;
    for (const b of bubbles) {
      b.x += dx;
      b.y += dy;
    }
  }


  // 🖱 Pointer + Touch handling
  canvas.addEventListener("pointermove", e => {
    if (window.matchMedia("(pointer:fine)").matches) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    }
  });
  canvas.addEventListener("pointerleave", () => {
    pointer = { x: -9999, y: -9999 };
  });
  canvas.addEventListener("pointerdown", e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let found = null;
    for (const b of bubbles) {
      if (dist(x, y, b.x, b.y) <= b.size + PADD) {
        found = b;
        break;
      }
    }
    selected = found;
    if (!window.matchMedia("(pointer:fine)").matches) {
      // On touch, show selected instead of hover
      pointer = { x: -9999, y: -9999 };
    }
  });

  //   document.getElementById("regenBtn").addEventListener("click", init);

  async function init() {
    resizeCanvas();
    const listText = await loadFile("./list.txt");
    const mapText = await loadFile("./that.txt");
    const { counts, tmap } = parseInputs(listText, mapText);
    bubbles = generateBubbles(counts, tmap);
    // relaxPositions(bubbles);
    drawOnce();
  }

  window.addEventListener("resize", init);
  await init();
  loop();
})();
