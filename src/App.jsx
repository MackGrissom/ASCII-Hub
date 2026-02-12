import { useState, useEffect, useRef } from "react";

const MONO = "'JetBrains Mono', 'SF Mono', 'Fira Code', Consolas, monospace";

/* ═══════════════════════════════════════════════════════════
   PALETTES & CHAR SETS
   ═══════════════════════════════════════════════════════════ */
const COLOR_PRESETS = [
  { name: "Green", value: "#4ade80" },
  { name: "Cyan", value: "#22d3ee" },
  { name: "Amber", value: "#fbbf24" },
  { name: "Pink", value: "#f472b6" },
  { name: "Red", value: "#ef4444" },
  { name: "Purple", value: "#a78bfa" },
  { name: "Orange", value: "#fb923c" },
  { name: "White", value: "#e4e4e7" },
];

const TIEDYE_PALETTES = {
  classic: ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"],
  sunset: ["#ff6b6b", "#ee5a24", "#f9ca24", "#f0932b", "#eb4d4b", "#6ab04c", "#e056fd"],
  ocean: ["#0652DD", "#1289A7", "#12CBC4", "#A3CB38", "#1B1464", "#6F1E51", "#ED4C67"],
  neon: ["#ff00ff", "#00ffff", "#ff0066", "#66ff00", "#ff6600", "#0066ff", "#ffff00"],
  pastel: ["#FDA7DF", "#A2D2FF", "#BFDFB4", "#FFF3B0", "#E4C1F9", "#FCF6BD", "#D0F4DE"],
};

const SIZE_OPTIONS = [10, 12, 14, 16, 18];

/* ═══════════════════════════════════════════════════════════
   21 ASCII ANIMATIONS
   ═══════════════════════════════════════════════════════════ */

// 1. MATRIX RAIN
function MatrixRain({ color = "#4ade80", size = 14, width = 44, height = 20, customChars = "" }) {
  const [frame, setFrame] = useState([]);
  const cols = useRef([]);
  const defaultChars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
  const chars = customChars.length >= 2 ? customChars : defaultChars;
  useEffect(() => {
    if (!cols.current.length) cols.current = Array.from({ length: width }, () => ({ y: Math.random() * height | 0, speed: 0.3 + Math.random() * 0.7 }));
    const grid = Array.from({ length: height }, () => Array(width).fill(" "));
    const id = setInterval(() => {
      cols.current.forEach((col, x) => {
        const trailLen = 6 + (Math.random() * 8 | 0);
        for (let t = 0; t < trailLen; t++) {
          const y = (Math.floor(col.y) - t + height) % height;
          if (y >= 0 && y < height) grid[y][x] = t === 0 ? chars[Math.random() * chars.length | 0] : (t < 3 ? chars[Math.random() * chars.length | 0] : " ");
        }
        col.y = (col.y + col.speed) % height;
      });
      setFrame(grid.map((r) => r.join("")));
    }, 70);
    return () => clearInterval(id);
  }, [width, height, chars]);
  return <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.2, color, margin: 0, whiteSpace: "pre" }}>{frame.join("\n")}</pre>;
}

// 2. WAVE
function Wave({ color = "#22d3ee", size = 14, width = 50, height = 12, customChars = "" }) {
  const [f, setF] = useState(0);
  const chars = customChars.length >= 4 ? customChars : "█▓▒░ ";
  useEffect(() => { const id = setInterval(() => setF((v) => v + 1), 50); return () => clearInterval(id); }, []);
  const lines = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      const v = (Math.sin((x * 0.3) + (f * 0.15) + (y * 0.5)) + 1) / 2;
      const idx = Math.floor(v * (chars.length - 1));
      return chars[Math.min(idx, chars.length - 1)];
    }).join("")
  );
  return <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.15, color, margin: 0 }}>{lines.join("\n")}</pre>;
}

// 3. FIRE
function Fire({ color = "#f97316", size = 13, width = 44, height = 16, customChars = "" }) {
  const buf = useRef(Array(width * (height + 2)).fill(0));
  const [frame, setFrame] = useState("");
  const palette = customChars.length >= 4 ? customChars : " .:-=+*#%@";
  useEffect(() => {
    const id = setInterval(() => {
      const b = buf.current;
      for (let x = 0; x < width; x++) b[(height + 1) * width + x] = Math.random() > 0.4 ? Math.min(palette.length - 1, 8 + (Math.random() * 2 | 0)) : 0;
      for (let y = 0; y < height + 1; y++) {
        for (let x = 0; x < width; x++) {
          const bl = b[((y + 1) % (height + 2)) * width + ((x - 1 + width) % width)];
          const bc = b[((y + 1) % (height + 2)) * width + x];
          const br = b[((y + 1) % (height + 2)) * width + ((x + 1) % width)];
          const bc2 = b[((y + 2) % (height + 2)) * width + x];
          b[y * width + x] = Math.max(0, ((bl + bc + br + bc2) / 4.04) | 0);
        }
      }
      const lines = [];
      for (let y = 0; y < height; y++) {
        let row = "";
        for (let x = 0; x < width; x++) row += palette[Math.min(b[y * width + x], palette.length - 1)];
        lines.push(row);
      }
      setFrame(lines.join("\n"));
    }, 60);
    return () => clearInterval(id);
  }, [width, height, palette]);
  return <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.1, color, margin: 0 }}>{frame}</pre>;
}

// 4. DNA HELIX
function DNAHelix({ color = "#a78bfa", size = 14, width = 40, height = 16 }) {
  const [f, setF] = useState(0);
  useEffect(() => { const id = setInterval(() => setF((v) => v + 1), 80); return () => clearInterval(id); }, []);
  const lines = Array.from({ length: height }, (_, y) => {
    const row = Array(width).fill(" ");
    const offset = f * 0.2;
    const cx = width / 2;
    const a1 = Math.sin((y * 0.5) + offset) * (width * 0.35);
    const a2 = Math.sin((y * 0.5) + offset + Math.PI) * (width * 0.35);
    const p1 = Math.round(cx + a1);
    const p2 = Math.round(cx + a2);
    if (p1 >= 0 && p1 < width) row[p1] = "●";
    if (p2 >= 0 && p2 < width) row[p2] = "●";
    if (Math.abs(a1 - a2) < width * 0.3 && y % 2 === 0) {
      const mn = Math.min(p1, p2) + 1;
      const mx = Math.max(p1, p2);
      for (let x = mn; x < mx; x++) if (x >= 0 && x < width) row[x] = (x - mn) % 3 === 1 ? "═" : "─";
    }
    return row.join("");
  });
  return <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.25, color, margin: 0 }}>{lines.join("\n")}</pre>;
}

// 5. STARFIELD
function Starfield({ color = "#e4e4e7", size = 13, width = 50, height = 18, customChars = "" }) {
  const charArr = customChars.length >= 3 ? customChars.split("") : ["·", "✦", "★"];
  const stars = useRef(Array.from({ length: 60 }, () => ({ x: Math.random() * width, y: Math.random() * height, z: Math.random() * 3 })));
  const [frame, setFrame] = useState("");
  useEffect(() => {
    const id = setInterval(() => {
      const grid = Array.from({ length: height }, () => Array(width).fill(" "));
      stars.current.forEach((s) => {
        s.x -= (0.3 + s.z * 0.4);
        if (s.x < 0) { s.x = width - 1; s.y = Math.random() * height; s.z = Math.random() * 3; }
        const ix = Math.floor(s.x);
        const iy = Math.floor(s.y);
        if (ix >= 0 && ix < width && iy >= 0 && iy < height) {
          const ci = s.z > 2 ? Math.min(2, charArr.length - 1) : s.z > 1 ? Math.min(1, charArr.length - 1) : 0;
          grid[iy][ix] = charArr[ci];
        }
      });
      setFrame(grid.map((r) => r.join("")).join("\n"));
    }, 60);
    return () => clearInterval(id);
  }, [width, height, charArr.join("")]);
  return <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.2, color, margin: 0 }}>{frame}</pre>;
}

// 6. RADAR
function Radar({ color = "#4ade80", size = 13 }) {
  const [f, setF] = useState(0);
  const R = 9;
  useEffect(() => { const id = setInterval(() => setF((v) => (v + 1) % 360), 40); return () => clearInterval(id); }, []);
  const grid = Array.from({ length: R * 2 + 1 }, (_, y) =>
    Array.from({ length: R * 2 + 1 }, (_, x) => {
      const dx = x - R, dy = y - R;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ang = ((Math.atan2(dy, dx) * 180 / Math.PI) + 360) % 360;
      const sweep = (f + 360) % 360;
      const diff = ((ang - sweep) + 360) % 360;
      if (Math.abs(dist - R) < 0.6) return "·";
      if (Math.abs(dist - R / 2) < 0.4) return "·";
      if (dist < R && diff < 20) return diff < 5 ? "█" : diff < 10 ? "▓" : "░";
      if ((Math.abs(dx) < 0.5 || Math.abs(dy) < 0.5) && dist < R) return "·";
      return " ";
    }).join("")
  );
  return <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.15, color, margin: 0 }}>{grid.join("\n")}</pre>;
}

// 7. EQUALIZER
function Equalizer({ color = "#f472b6", size = 14, bars = 20, height = 14 }) {
  const [f, setF] = useState(0);
  useEffect(() => { const id = setInterval(() => setF((v) => v + 1), 80); return () => clearInterval(id); }, []);
  const lines = Array.from({ length: height }, (_, y) => {
    const ry = height - 1 - y;
    return Array.from({ length: bars }, (_, x) => {
      const h = ((Math.sin(x * 0.6 + f * 0.2) + 1) / 2) * height * (0.4 + 0.6 * ((Math.sin(x * 1.1 + f * 0.13) + 1) / 2));
      return ry < h ? (ry > h - 1.5 ? "█" : "▓") : " ";
    }).join(" ");
  });
  return <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.15, color, margin: 0 }}>{lines.join("\n")}</pre>;
}

// 8. SPINNING CUBE
function SpinCube({ color = "#fbbf24", size = 13, scale = 8 }) {
  const [f, setF] = useState(0);
  useEffect(() => { const id = setInterval(() => setF((v) => v + 1), 50); return () => clearInterval(id); }, []);
  const W = scale * 5, H = scale * 3;
  const verts = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
  const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  const a = f * 0.03, b = f * 0.02;
  const rot = ([x, y, z]) => {
    let x1 = x * Math.cos(a) - z * Math.sin(a), z1 = x * Math.sin(a) + z * Math.cos(a);
    let y1 = y * Math.cos(b) - z1 * Math.sin(b);
    let z2 = y * Math.sin(b) + z1 * Math.cos(b);
    return [x1, y1, z2];
  };
  const proj = ([x, y, z]) => {
    const p = 3 / (3 + z);
    return [Math.round(x * p * scale + W / 2), Math.round(y * p * scale * 0.5 + H / 2)];
  };
  const grid = Array.from({ length: H }, () => Array(W).fill(" "));
  const rv = verts.map(rot);
  edges.forEach(([i, j]) => {
    const [x0, y0] = proj(rv[i]), [x1, y1] = proj(rv[j]);
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
    for (let s = 0; s <= steps; s++) {
      const x = Math.round(x0 + (x1 - x0) * s / steps);
      const y = Math.round(y0 + (y1 - y0) * s / steps);
      if (x >= 0 && x < W && y >= 0 && y < H) grid[y][x] = "●";
    }
  });
  rv.forEach((v) => { const [x, y] = proj(v); if (x >= 0 && x < W && y >= 0 && y < H) grid[y][x] = "◉"; });
  return <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.15, color, margin: 0 }}>{grid.map((r) => r.join("")).join("\n")}</pre>;
}

// 9. TYPING
function Typing({ color = "#e4e4e7", size = 15, customChars = "" }) {
  const text = customChars.length >= 2 ? customChars : "The quick brown fox jumps over the lazy dog...";
  const [i, setI] = useState(0);
  const [on, setOn] = useState(true);
  useEffect(() => { const id = setInterval(() => setI((v) => (v + 1) % (text.length + 20)), 80); return () => clearInterval(id); }, [text]);
  useEffect(() => { const id = setInterval(() => setOn((v) => !v), 500); return () => clearInterval(id); }, []);
  const shown = text.slice(0, Math.min(i, text.length));
  return <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.4, color, margin: 0 }}>{"$ "}{shown}{on ? "█" : " "}</pre>;
}

// 10. PULSING HEART
function Heart({ color = "#f43f5e", size = 12 }) {
  const [f, setF] = useState(0);
  useEffect(() => { const id = setInterval(() => setF((v) => v + 1), 60); return () => clearInterval(id); }, []);
  const pulse = 1 + Math.sin(f * 0.12) * 0.15;
  const W = 36, H = 18;
  const lines = Array.from({ length: H }, (_, y) =>
    Array.from({ length: W }, (_, x) => {
      const nx = ((x - W / 2) / (W / 2)) / pulse;
      const ny = (-(y - H / 2) / (H / 2) + 0.2) / pulse / 0.6;
      const v = nx * nx + Math.pow(ny - Math.sqrt(Math.abs(nx)), 2);
      return v < 0.6 ? (v < 0.3 ? "█" : "▓") : v < 0.8 ? "░" : " ";
    }).join("")
  );
  return <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.1, color, margin: 0 }}>{lines.join("\n")}</pre>;
}

// 11. RAIN
function Rain({ color = "#60a5fa", size = 13, width = 44, height = 18, customChars = "" }) {
  const charArr = customChars.length >= 1 ? customChars.split("") : ["│", "¦"];
  const drops = useRef(Array.from({ length: 30 }, () => ({ x: Math.random() * width | 0, y: Math.random() * height | 0, s: 1 + Math.random() * 2 })));
  const [frame, setFrame] = useState("");
  useEffect(() => {
    const id = setInterval(() => {
      const grid = Array.from({ length: height }, () => Array(width).fill(" "));
      drops.current.forEach((d) => {
        d.y += d.s;
        if (d.y >= height) { d.y = 0; d.x = Math.random() * width | 0; }
        const iy = d.y | 0;
        if (iy >= 0 && iy < height) grid[iy][d.x] = charArr[0];
        if (iy - 1 >= 0 && charArr.length > 1) grid[iy - 1][d.x] = charArr[1 % charArr.length];
      });
      setFrame(grid.map((r) => r.join("")).join("\n"));
    }, 50);
    return () => clearInterval(id);
  }, [width, height, charArr.join("")]);
  return <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.15, color, margin: 0 }}>{frame}</pre>;
}

// 12. SPINNER
function Spinner({ color = "#fbbf24", size = 14 }) {
  const frames = ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];
  const [f, setF] = useState(0);
  useEffect(() => { const id = setInterval(() => setF((v) => (v + 1) % frames.length), 80); return () => clearInterval(id); }, []);
  return <pre style={{ fontFamily: MONO, fontSize: size * 3, lineHeight: 1.2, color, margin: 0, textAlign: "center" }}>{frames[f]} <span style={{ fontSize: size }}>Loading...</span></pre>;
}

// 13. PLASMA
function Plasma({ color = "#c084fc", size = 12, width = 44, height = 16, customChars = "" }) {
  const [f, setF] = useState(0);
  const ch = customChars.length >= 4 ? customChars : " ░▒▓█▓▒░";
  useEffect(() => { const id = setInterval(() => setF((v) => v + 1), 50); return () => clearInterval(id); }, []);
  const lines = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      const v = Math.sin(x * 0.15 + f * 0.05) + Math.sin(y * 0.2 + f * 0.07) + Math.sin((x + y) * 0.1 + f * 0.06) + Math.sin(Math.sqrt(x * x + y * y) * 0.15 - f * 0.04);
      const idx = Math.floor(((v + 4) / 8) * ch.length) % ch.length;
      return ch[idx];
    }).join("")
  );
  return <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.1, color, margin: 0 }}>{lines.join("\n")}</pre>;
}

// 14. SINE SNAKE
function SineSnake({ color = "#34d399", size = 14, width = 50, height = 12 }) {
  const [f, setF] = useState(0);
  useEffect(() => { const id = setInterval(() => setF((v) => v + 1), 40); return () => clearInterval(id); }, []);
  const lines = Array.from({ length: height }, (_, y) => {
    const row = Array(width).fill(" ");
    const targetY = Math.round(((Math.sin((y * 0.8) - f * 0.1) + 1) / 2) * (width - 1));
    row[targetY] = "●";
    if (targetY > 0) row[targetY - 1] = "─";
    if (targetY < width - 1) row[targetY + 1] = "─";
    return row.join("");
  });
  return <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.2, color, margin: 0 }}>{lines.join("\n")}</pre>;
}

// 15. GAME OF LIFE
function GameOfLife({ color = "#4ade80", size = 12, width = 40, height = 20, customChars = "" }) {
  const alive = customChars.length >= 1 ? customChars[0] : "█";
  const dead = customChars.length >= 2 ? customChars[1] : " ";
  const gridRef = useRef(null);
  const [frame, setFrame] = useState("");
  useEffect(() => {
    gridRef.current = Array.from({ length: height }, () => Array.from({ length: width }, () => Math.random() > 0.7 ? 1 : 0));
    const id = setInterval(() => {
      const g = gridRef.current;
      const next = g.map((row, y) => row.map((cell, x) => {
        let n = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const ny2 = (y + dy + height) % height, nx2 = (x + dx + width) % width;
          n += g[ny2][nx2];
        }
        return cell ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
      }));
      gridRef.current = next;
      setFrame(next.map((r) => r.map((c) => c ? alive : dead).join("")).join("\n"));
    }, 150);
    return () => clearInterval(id);
  }, [width, height, alive, dead]);
  return <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.05, color, margin: 0 }}>{frame}</pre>;
}

// 16. CLOCK
function AsciiClock({ color = "#fbbf24", size = 13 }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id); }, []);
  const ts = time.toLocaleTimeString("en-US", { hour12: false });
  const R = 8, W = R * 2 + 1;
  const h = time.getHours() % 12, m = time.getMinutes(), s = time.getSeconds();
  const grid = Array.from({ length: W }, () => Array(W * 2).fill(" "));
  for (let a = 0; a < 360; a += 6) {
    const rad = a * Math.PI / 180;
    const x = Math.round(R + Math.cos(rad) * R * 2);
    const y = Math.round(R + Math.sin(rad) * R);
    if (y >= 0 && y < W && x >= 0 && x < W * 2) grid[y][x] = a % 30 === 0 ? "●" : "·";
  }
  const drawHand = (angle, len, ch) => {
    const rad = (angle - 90) * Math.PI / 180;
    for (let i = 1; i <= len; i++) {
      const x = Math.round(R + Math.cos(rad) * i * 2);
      const y = Math.round(R + Math.sin(rad) * i);
      if (y >= 0 && y < W && x >= 0 && x < W * 2) grid[y][x] = ch;
    }
  };
  drawHand((h + m / 60) * 30, 4, "█");
  drawHand(m * 6, 6, "▓");
  drawHand(s * 6, 7, "░");
  grid[R][R * 2] = "◉";
  return (
    <div>
      <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.15, color, margin: 0, textAlign: "center" }}>{grid.map((r) => r.join("")).join("\n")}</pre>
      <pre style={{ fontFamily: MONO, fontSize: size + 4, color, margin: 0, textAlign: "center", marginTop: 8 }}>{ts}</pre>
    </div>
  );
}

// 17. BOUNCING BALL
function BouncingBall({ color = "#fb923c", size = 14, width = 44, height = 14 }) {
  const ball = useRef({ x: 5, y: 2, dx: 1.2, dy: 0.8 });
  const [frame, setFrame] = useState("");
  useEffect(() => {
    const id = setInterval(() => {
      const b = ball.current;
      b.x += b.dx; b.y += b.dy;
      if (b.x <= 1 || b.x >= width - 2) b.dx *= -1;
      if (b.y <= 1 || b.y >= height - 2) b.dy *= -1;
      const lines = Array.from({ length: height }, (_, y) =>
        Array.from({ length: width }, (_, x) => {
          if (y === 0 && x === 0) return "┌";
          if (y === 0 && x === width - 1) return "┐";
          if (y === height - 1 && x === 0) return "└";
          if (y === height - 1 && x === width - 1) return "┘";
          if (y === 0 || y === height - 1) return "─";
          if (x === 0 || x === width - 1) return "│";
          const dx2 = x - b.x, dy2 = y - b.y;
          const d = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          return d < 1.2 ? "●" : d < 2.5 ? "·" : " ";
        }).join("")
      );
      setFrame(lines.join("\n"));
    }, 50);
    return () => clearInterval(id);
  }, [width, height]);
  return <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.15, color, margin: 0 }}>{frame}</pre>;
}

// 18. GLITCH TEXT
function GlitchText({ color = "#ef4444", size = 18, customChars = "" }) {
  const text = customChars.length >= 2 ? customChars : "SYSTEM ERROR";
  const glitchChars = "!@#$%^&*░▒▓█<>?";
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    setDisplay(text);
    const id = setInterval(() => {
      if (Math.random() > 0.6) {
        const arr = text.split("");
        const count = 1 + (Math.random() * 4 | 0);
        for (let i = 0; i < count; i++) {
          const pos = Math.random() * arr.length | 0;
          arr[pos] = glitchChars[Math.random() * glitchChars.length | 0];
        }
        setDisplay(arr.join(""));
      } else {
        setDisplay(text);
      }
    }, 100);
    return () => clearInterval(id);
  }, [text]);
  return (
    <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.4, color, margin: 0, textAlign: "center", letterSpacing: "0.15em" }}>
      {">"} {display} {"<"}
    </pre>
  );
}

// 19. MANDALA
function Mandala({ color = "#e879f9", size = 12, customChars = "" }) {
  const [f, setF] = useState(0);
  useEffect(() => { const id = setInterval(() => setF((v) => v + 1), 60); return () => clearInterval(id); }, []);
  const R = 10, W = R * 2 + 1;
  const syms = customChars.length >= 4 ? customChars : " ·∘○◎●◉";
  const lines = Array.from({ length: W }, (_, y) =>
    Array.from({ length: W * 2 }, (_, x) => {
      const dx = x / 2 - R, dy = y - R;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ang = Math.atan2(dy, dx);
      const v = Math.sin(dist * 0.8 - f * 0.08) + Math.sin(ang * 6 + f * 0.06);
      const idx = Math.floor(((v + 2) / 4) * syms.length);
      return dist > R + 0.5 ? " " : syms[Math.max(0, Math.min(idx, syms.length - 1))];
    }).join("")
  );
  return <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.1, color, margin: 0, textAlign: "center" }}>{lines.join("\n")}</pre>;
}

// 20. PROGRESS BAR
function ProgressBar({ color = "#22d3ee", size = 14, width = 40, customChars = "" }) {
  const fillChar = customChars.length >= 1 ? customChars[0] : "█";
  const emptyChar = customChars.length >= 2 ? customChars[1] : "░";
  const [pct, setPct] = useState(0);
  useEffect(() => { const id = setInterval(() => setPct((v) => (v + 1) % 101), 60); return () => clearInterval(id); }, []);
  const filled = Math.round((pct / 100) * width);
  const bar = fillChar.repeat(filled) + emptyChar.repeat(width - filled);
  return (
    <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.6, color, margin: 0, textAlign: "center" }}>
      {`┌${"─".repeat(width + 2)}┐\n`}
      {`│ ${bar} │\n`}
      {`└${"─".repeat(width + 2)}┘\n`}
      {`     ${pct.toString().padStart(3)}% complete`}
    </pre>
  );
}

// 21. TIE-DYE
function TieDye({ size = 13, width = 56, height = 28, customChars = "", tiePalette = "classic", twist = 6, rings = 8 }) {
  const [f, setF] = useState(0);
  const colors = TIEDYE_PALETTES[tiePalette] || TIEDYE_PALETTES.classic;
  const chars = customChars.length >= 4 ? customChars : " ░▒▓█▓▒░";
  useEffect(() => { const id = setInterval(() => setF((v) => v + 1), 40); return () => clearInterval(id); }, []);
  const cx = width / 2, cy = height / 2;
  const lines = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      const dx = (x - cx) / (width * 0.45), dy = (y - cy) / (height * 0.45);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      const spiral = angle + dist * twist - f * 0.04;
      const ripple = Math.sin(dist * rings - f * 0.06);
      const fold = Math.sin(spiral * 3) * 0.5 + Math.sin(dist * 5 - f * 0.03) * 0.3;
      const blend = Math.sin(angle * 2 + f * 0.02) * 0.4;
      const combined = spiral + ripple * 0.8 + fold + blend;
      const charIdx = Math.floor(((Math.sin(dist * 4 - f * 0.05) + 1) / 2) * (chars.length - 1));
      const colorIdx = ((Math.floor(combined * 1.5) % colors.length) + colors.length) % colors.length;
      const edgeFade = dist > 1 ? Math.max(0, 1 - (dist - 1) * 3) : 1;
      return { char: edgeFade < 0.3 ? " " : chars[Math.max(0, Math.min(charIdx, chars.length - 1))], color: colors[colorIdx], opacity: Math.max(0.15, edgeFade) };
    })
  );
  return (
    <pre style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.08, margin: 0, whiteSpace: "pre", letterSpacing: "0.05em" }}>
      {lines.map((row, y) => (
        <div key={y} style={{ height: "1.08em" }}>
          {row.map((cell, x) => (
            <span key={x} style={{ color: cell.color, opacity: cell.opacity }}>{cell.char}</span>
          ))}
        </div>
      ))}
    </pre>
  );
}

/* ═══════════════════════════════════════════════════════════
   ANIMATION REGISTRY
   ═══════════════════════════════════════════════════════════ */
const animations = [
  { name: "Matrix Rain", component: MatrixRain, defaultColor: "#4ade80", hasCustomChars: true, charLabel: "falling characters", charPlaceholder: "ABCDEF1234" },
  { name: "Ocean Wave", component: Wave, defaultColor: "#22d3ee", hasCustomChars: true, charLabel: "density characters (4+)", charPlaceholder: "█▓▒░ " },
  { name: "Fire", component: Fire, defaultColor: "#f97316", hasCustomChars: true, charLabel: "intensity chars (4+)", charPlaceholder: " .:-=+*#%@" },
  { name: "DNA Helix", component: DNAHelix, defaultColor: "#a78bfa", hasCustomChars: false },
  { name: "Starfield", component: Starfield, defaultColor: "#e4e4e7", hasCustomChars: true, charLabel: "star chars (3)", charPlaceholder: "·✦★" },
  { name: "Radar Sweep", component: Radar, defaultColor: "#4ade80", hasCustomChars: false },
  { name: "Equalizer", component: Equalizer, defaultColor: "#f472b6", hasCustomChars: false },
  { name: "3D Cube", component: SpinCube, defaultColor: "#fbbf24", hasCustomChars: false },
  { name: "Typewriter", component: Typing, defaultColor: "#e4e4e7", hasCustomChars: true, charLabel: "text to type", charPlaceholder: "Hello world..." },
  { name: "Pulsing Heart", component: Heart, defaultColor: "#f43f5e", hasCustomChars: false },
  { name: "Rain", component: Rain, defaultColor: "#60a5fa", hasCustomChars: true, charLabel: "raindrop chars", charPlaceholder: "│¦" },
  { name: "Spinner", component: Spinner, defaultColor: "#fbbf24", hasCustomChars: false },
  { name: "Plasma", component: Plasma, defaultColor: "#c084fc", hasCustomChars: true, charLabel: "density chars (4+)", charPlaceholder: " ░▒▓█▓▒░" },
  { name: "Sine Snake", component: SineSnake, defaultColor: "#34d399", hasCustomChars: false },
  { name: "Game of Life", component: GameOfLife, defaultColor: "#4ade80", hasCustomChars: true, charLabel: "alive + dead char", charPlaceholder: "█ " },
  { name: "Analog Clock", component: AsciiClock, defaultColor: "#fbbf24", hasCustomChars: false },
  { name: "Bouncing Ball", component: BouncingBall, defaultColor: "#fb923c", hasCustomChars: false },
  { name: "Glitch Text", component: GlitchText, defaultColor: "#ef4444", hasCustomChars: true, charLabel: "text to glitch", charPlaceholder: "SYSTEM ERROR" },
  { name: "Mandala", component: Mandala, defaultColor: "#e879f9", hasCustomChars: true, charLabel: "pattern chars (4+)", charPlaceholder: " ·∘○◎●◉" },
  { name: "Progress Bar", component: ProgressBar, defaultColor: "#22d3ee", hasCustomChars: true, charLabel: "fill + empty char", charPlaceholder: "█░" },
  { name: "Tie-Dye", component: TieDye, defaultColor: null, hasCustomChars: true, isTieDye: true, charLabel: "density chars (4+)", charPlaceholder: " ░▒▓█▓▒░" },
];

/* ═══════════════════════════════════════════════════════════
   GALLERY APP
   ═══════════════════════════════════════════════════════════ */
export default function AsciiGallery() {
  const [active, setActive] = useState(0);
  const [color, setColor] = useState(animations[0].defaultColor);
  const [size, setSize] = useState(13);
  const [customChars, setCustomChars] = useState("");
  const [copied, setCopied] = useState(false);
  const [tiePalette, setTiePalette] = useState("classic");
  const [twist, setTwist] = useState(6);
  const [rings, setRings] = useState(8);

  const anim = animations[active];
  const Comp = anim.component;

  const handleSelect = (i) => {
    setActive(i);
    setColor(animations[i].defaultColor);
    setCustomChars("");
    setCopied(false);
  };

  const handleCopy = () => {
    const name = anim.name.replace(/\s/g, "");
    let props = [];
    if (color && !anim.isTieDye) props.push(`color="${color}"`);
    props.push(`size={${size}}`);
    if (customChars) props.push(`customChars="${customChars}"`);
    if (anim.isTieDye) {
      props.push(`tiePalette="${tiePalette}"`);
      props.push(`twist={${twist}}`);
      props.push(`rings={${rings}}`);
    }
    const snippet = `<${name} ${props.join(" ")} />`;
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const compProps = anim.isTieDye
    ? { size, customChars, tiePalette, twist, rings }
    : { color, size, customChars };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 3px; }
        input[type="text"]:focus { outline: none; border-color: #3b82f6 !important; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#09090b", color: "#fafafa", fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px 80px" }}>

          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: MONO, fontSize: 11, color: "#3f3f46", letterSpacing: "0.12em", marginBottom: 6 }}>{"// "}ASCII ANIMATIONS</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>21 Copy-Paste ASCII Animations</h1>
            <p style={{ fontSize: 13, color: "#52525b", marginTop: 4 }}>Click any animation · Customize color, size & characters · Copy the JSX</p>
          </div>

          <div style={{ display: "flex", gap: 20 }}>
            {/* Sidebar */}
            <div style={{ width: 190, flexShrink: 0, maxHeight: "80vh", overflowY: "auto" }}>
              {animations.map((a, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  style={{
                    display: "block", width: "100%",
                    padding: "7px 10px", borderRadius: 8, border: "none",
                    background: active === i ? "rgba(59,130,246,0.1)" : "transparent",
                    color: active === i ? "#60a5fa" : "#71717a",
                    fontSize: 11, fontWeight: active === i ? 700 : 500,
                    cursor: "pointer", textAlign: "left", fontFamily: MONO, marginBottom: 1,
                  }}
                >
                  <span style={{ color: "#3f3f46", marginRight: 6 }}>{String(i + 1).padStart(2, "0")}</span>
                  {a.name}
                  {a.hasCustomChars && <span style={{ color: "#27272a", marginLeft: 4, fontSize: 9 }}>✎</span>}
                </button>
              ))}
            </div>

            {/* Main */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* Controls Row 1: Color + Size */}
              {!anim.isTieDye && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 16, marginBottom: 10,
                  padding: "12px 16px", background: "#111113", border: "1px solid #1c1c1f", borderRadius: 12, flexWrap: "wrap",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "#52525b", fontFamily: MONO }}>color</span>
                    {COLOR_PRESETS.map((c) => (
                      <button key={c.value} onClick={() => setColor(c.value)} title={c.name} style={{
                        width: 20, height: 20, borderRadius: 6,
                        border: color === c.value ? "2px solid #fff" : "2px solid #27272a",
                        background: c.value, cursor: "pointer", padding: 0,
                      }} />
                    ))}
                  </div>
                  <div style={{ width: 1, height: 20, background: "#1c1c1f" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, color: "#52525b", fontFamily: MONO }}>size</span>
                    {SIZE_OPTIONS.map((s) => (
                      <button key={s} onClick={() => setSize(s)} style={{
                        padding: "3px 8px", borderRadius: 6,
                        border: size === s ? "1px solid #3b82f6" : "1px solid #27272a",
                        background: size === s ? "rgba(59,130,246,0.1)" : "transparent",
                        color: size === s ? "#60a5fa" : "#52525b",
                        fontSize: 11, fontFamily: MONO, cursor: "pointer",
                      }}>{s}</button>
                    ))}
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <button onClick={handleCopy} style={{
                      padding: "6px 16px", borderRadius: 8, border: "1px solid #27272a",
                      background: copied ? "rgba(34,197,94,0.1)" : "#111",
                      color: copied ? "#4ade80" : "#a1a1aa",
                      fontSize: 12, fontWeight: 600, fontFamily: MONO, cursor: "pointer",
                    }}>{copied ? "✓ Copied!" : "Copy JSX"}</button>
                  </div>
                </div>
              )}

              {/* Tie-dye specific controls */}
              {anim.isTieDye && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 10 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                    padding: "12px 16px", background: "#111113", border: "1px solid #1c1c1f", borderRadius: 12,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, color: "#52525b", fontFamily: MONO }}>palette</span>
                      {Object.entries(TIEDYE_PALETTES).map(([name, cols]) => (
                        <button key={name} onClick={() => setTiePalette(name)} title={name} style={{
                          width: 28, height: 20, borderRadius: 6, cursor: "pointer", padding: 0,
                          border: tiePalette === name ? "2px solid #fff" : "2px solid #27272a",
                          background: `linear-gradient(90deg, ${cols.slice(0, 4).join(", ")})`,
                        }} />
                      ))}
                    </div>
                    <div style={{ width: 1, height: 20, background: "#1c1c1f" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11, color: "#52525b", fontFamily: MONO }}>size</span>
                      {SIZE_OPTIONS.map((s) => (
                        <button key={s} onClick={() => setSize(s)} style={{
                          padding: "3px 8px", borderRadius: 6,
                          border: size === s ? "1px solid #3b82f6" : "1px solid #27272a",
                          background: size === s ? "rgba(59,130,246,0.1)" : "transparent",
                          color: size === s ? "#60a5fa" : "#52525b",
                          fontSize: 11, fontFamily: MONO, cursor: "pointer",
                        }}>{s}</button>
                      ))}
                    </div>
                    <div style={{ marginLeft: "auto" }}>
                      <button onClick={handleCopy} style={{
                        padding: "6px 16px", borderRadius: 8, border: "1px solid #27272a",
                        background: copied ? "rgba(34,197,94,0.1)" : "#111",
                        color: copied ? "#4ade80" : "#a1a1aa",
                        fontSize: 12, fontWeight: 600, fontFamily: MONO, cursor: "pointer",
                      }}>{copied ? "✓ Copied!" : "Copy JSX"}</button>
                    </div>
                  </div>
                  <div style={{
                    display: "flex", gap: 24, padding: "12px 16px",
                    background: "#111113", border: "1px solid #1c1c1f", borderRadius: 12,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                      <span style={{ fontSize: 11, color: "#52525b", fontFamily: MONO, minWidth: 36 }}>twist</span>
                      <input type="range" min="1" max="20" value={twist} onChange={(e) => setTwist(Number(e.target.value))} style={{ flex: 1, accentColor: "#8b5cf6" }} />
                      <span style={{ fontSize: 11, color: "#71717a", fontFamily: MONO, minWidth: 20 }}>{twist}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                      <span style={{ fontSize: 11, color: "#52525b", fontFamily: MONO, minWidth: 36 }}>rings</span>
                      <input type="range" min="2" max="20" value={rings} onChange={(e) => setRings(Number(e.target.value))} style={{ flex: 1, accentColor: "#ec4899" }} />
                      <span style={{ fontSize: 11, color: "#71717a", fontFamily: MONO, minWidth: 20 }}>{rings}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Characters Input */}
              {anim.hasCustomChars && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 12, marginBottom: 10,
                  padding: "10px 16px", background: "#111113", border: "1px solid #1c1c1f", borderRadius: 12,
                }}>
                  <span style={{ fontSize: 11, color: "#52525b", fontFamily: MONO, whiteSpace: "nowrap" }}>
                    ✎ {anim.charLabel}
                  </span>
                  <input
                    type="text"
                    value={customChars}
                    onChange={(e) => setCustomChars(e.target.value)}
                    placeholder={anim.charPlaceholder}
                    style={{
                      flex: 1, padding: "6px 12px", borderRadius: 8,
                      border: "1px solid #27272a", background: "#0c0c0e",
                      color: "#e4e4e7", fontFamily: MONO, fontSize: 13,
                    }}
                  />
                  {customChars && (
                    <button onClick={() => setCustomChars("")} style={{
                      padding: "4px 10px", borderRadius: 6, border: "1px solid #27272a",
                      background: "transparent", color: "#52525b", fontSize: 11,
                      fontFamily: MONO, cursor: "pointer",
                    }}>reset</button>
                  )}
                </div>
              )}

              {/* Animation Display */}
              <div style={{
                background: "#0c0c0e", border: "1px solid #1c1c1f",
                borderRadius: 16, padding: 24,
                minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
              }}>
                <Comp {...compProps} />
              </div>

              {/* Footer label */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, padding: "0 4px" }}>
                <span style={{ fontFamily: MONO, fontSize: 11, color: "#3f3f46" }}>
                  {String(active + 1).padStart(2, "0")} / 21 — {anim.name}
                </span>
                <span style={{ fontFamily: MONO, fontSize: 10, color: "#27272a", maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {customChars ? `customChars="${customChars}"` : "default chars"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
