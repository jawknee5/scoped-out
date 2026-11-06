const EXT = { html: "html", css: "css", javascript: "js", js: "js", jsx: "jsx", typescript: "ts", ts: "ts", tsx: "tsx", python: "py", py: "py", json: "json", bash: "sh", sh: "sh", shell: "sh", yaml: "yml", yml: "yml", md: "md", markdown: "md", sql: "sql" };
const PATH_RE = /([\w@./-]+\.[a-z0-9]{1,5})/i;

const findName = (before, body) => {
  const prev = before.trimEnd().split("\n").pop() || "";
  const m = prev.match(PATH_RE);
  if (m) return m[1].replace(/^\.?\//, "");
  const first = body.split("\n")[0];
  const c = first.match(/^\s*(?:\/\/|#|<!--|\/\*)\s*([\w@./-]+\.[a-z0-9]{1,5})/i);
  return c ? c[1].replace(/^\.?\//, "") : null;
};

export function extractCodeBlocks(text) {
  const blocks = [];
  const re = /```([\w+-]*)[^\n]*\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(text))) {
    const lang = (m[1] || "txt").toLowerCase();
    const body = m[2];
    let name = findName(text.slice(0, m.index), body);
    if (!name) name = `file-${blocks.length + 1}.${EXT[lang] || "txt"}`;
    blocks.push({ lang, name, body });
  }
  const seen = {};
  return blocks.map((b) => {
    seen[b.name] = (seen[b.name] || 0) + 1;
    return seen[b.name] > 1 ? { ...b, name: b.name.replace(/(\.[^.]+)$/, `-${seen[b.name]}$1`) } : b;
  });
}

const ext = (b) => b.name.split(".").pop().toLowerCase();

export function buildPreview(blocks) {
  const html = blocks.find((b) => ext(b) === "html" || b.lang === "html");
  if (!html) return null;
  let doc = html.body;
  const css = blocks.filter((b) => ext(b) === "css").map((b) => b.body).join("\n");
  const js = blocks.filter((b) => ext(b) === "js" && !/node|server|express/i.test(b.name)).map((b) => b.body).join("\n");
  doc = doc.replace(/<link[^>]+href=["'](?!https?:)[^"']+\.css["'][^>]*>/gi, "");
  doc = doc.replace(/<script[^>]+src=["'](?!https?:)[^"']+\.js["'][^>]*>\s*<\/script>/gi, "");
  const style = css ? `<style>${css}</style>` : "";
  const script = js ? `<script>${js}<\/script>` : "";
  doc = /<\/head>/i.test(doc) ? doc.replace(/<\/head>/i, `${style}</head>`) : style + doc;
  doc = /<\/body>/i.test(doc) ? doc.replace(/<\/body>/i, `${script}</body>`) : doc + script;
  return doc;
}
