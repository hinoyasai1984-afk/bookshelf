/*
 * 本棚に本を追加するには、下の books 配列に1件足すだけでよい。
 * 必須: id, title, url, category, description, color(ライト表示時の背表紙色), colorDark(ダーク表示時の背表紙色)
 * 幅・高さは title から自動計算されるので指定不要(自然にばらつく)。
 */
const books = [
  {
    id: "claude-cowork",
    title: "Claude Cowork入門",
    subtitle: "個人と組織のためのAIコワーカー",
    url: "https://hinoyasai1984-afk.github.io/claude-cowork-book/",
    category: "技術書",
    description: "Claude Coworkの位置づけ、Claude Codeとの関係、ファイル操作・ツール連携・スケジュール実行タスク・業務システム連携から、個人と組織それぞれの活用の勘所までを11章で読む。",
    color: "#9C5B24",
    colorDark: "#D99A5C"
  },
  {
    id: "rekishi-tetsugaku",
    title: "歴史哲学の系譜",
    subtitle: "アウグスティヌスから現在まで",
    url: "https://hinoyasai1984-afk.github.io/rekishi-tetsugaku-book/",
    category: "思想史",
    description: "アウグスティヌスからヘーゲル、マルクス、E.H.カー、物語論を経て現在に至る歴史哲学の変遷を11章で読む。",
    color: "#7A2E3A",
    colorDark: "#D07A88"
  },
  {
    id: "gender-history",
    title: "ジェンダー史の変遷",
    subtitle: "女性史からジェンダー史へ",
    url: "https://hinoyasai1984-afk.github.io/gender-history-book/",
    category: "思想史",
    description: "ボーヴォワールから女性史の確立、ジョーン・スコットの転回、クィア史、インターセクショナリティを経て現在に至るジェンダー史の変遷を11章で読む。",
    color: "#7A3B66",
    colorDark: "#D98CC0"
  },
  {
    id: "prompt-engineering",
    title: "プロンプトエンジニアリング基礎",
    subtitle: "伝わる指示の設計技法",
    url: "https://hinoyasai1984-afk.github.io/prompt-engineering-book/",
    category: "技術書",
    description: "明確さと具体性、Few-shot、Chain-of-Thought、構造化出力からハルシネーション対策・プロンプトインジェクション対策までを11章で読む。",
    color: "#34507D",
    colorDark: "#7FA0D6"
  },
  {
    id: "context-engineering",
    title: "コンテキストエンジニアリング基礎",
    subtitle: "モデルに何を見せるかの設計技法",
    url: "https://hinoyasai1984-afk.github.io/context-engineering-book/",
    category: "技術書",
    description: "コンテキストウィンドウという有限資源から、プロンプトキャッシュ、RAG、コンパクション、メモリ、サブエージェントによる分離までを11章で読む。",
    color: "#1F6E64",
    colorDark: "#6ABFAF"
  },
  {
    id: "loop-engineering",
    title: "ループエンジニアリング基礎",
    subtitle: "考えて・動いて・確かめる仕組みの設計技法",
    url: "https://hinoyasai1984-afk.github.io/loop-engineering-book/",
    category: "技術書",
    description: "エージェントループの基本構造、停止理由の読み方、並列ツール呼び出し、Human-in-the-loop、タスクバジェット、マルチエージェントまでを11章で読む。",
    color: "#3A5A82",
    colorDark: "#85A9D4"
  },
  {
    id: "optimization",
    title: "制約付き数理最適化基礎",
    subtitle: "MILPとソルバー、LLM活用の技法",
    url: "https://hinoyasai1984-afk.github.io/optimization-book/",
    category: "技術書",
    description: "決定変数・目的関数・制約条件の基礎から、MILP定式化の技法、分枝限定法とソルバーの選び方、LLMによる定式化調整支援、設備更新・シフト・配送計画のケーススタディまでを11章で読む。",
    color: "#B65C21",
    colorDark: "#E08A45"
  }
];

const THEME_KEY = "bookshelf:theme";
const BOOKS_PER_ROW = 6;

function hashStr(s){
  let h = 0;
  for (let i = 0; i < s.length; i++){ h = (h * 31 + s.charCodeAt(i)) >>> 0; }
  return h;
}

function chunk(arr, size){
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function buildSpine(book){
  const h = hashStr(book.title);
  const height = 210 + (h % 56);          // 210–265px
  const width = 56 + ((h >> 4) % 22);      // 56–77px
  const tilt = ((h >> 8) % 5) - 2;         // -2〜2度、わずかな傾き

  const a = document.createElement("a");
  a.className = "spine";
  a.href = book.url;
  a.style.setProperty("--spine-color", book.color);
  a.style.setProperty("--spine-color-dark", book.colorDark || book.color);
  a.style.height = height + "px";
  a.style.width = width + "px";
  a.style.setProperty("--tilt", tilt + "deg");
  a.setAttribute("aria-label", book.title + "。" + book.category + "。" + book.description);
  a.title = book.title + " ― " + book.description;

  a.innerHTML =
    '<span class="spine-band top"></span>' +
    '<span class="spine-title">' + book.title + '</span>' +
    '<span class="spine-tag">' + book.category + '</span>' +
    '<span class="spine-band bottom"></span>';

  return a;
}

function render(){
  const shelf = document.getElementById("shelf");
  shelf.innerHTML = "";
  const rows = chunk(books, BOOKS_PER_ROW);
  rows.forEach((rowBooks) => {
    const row = document.createElement("div");
    row.className = "shelf-row";
    const spines = document.createElement("div");
    spines.className = "spines";
    rowBooks.forEach((book) => spines.appendChild(buildSpine(book)));
    row.appendChild(spines);
    const plank = document.createElement("div");
    plank.className = "plank";
    row.appendChild(plank);
    shelf.appendChild(row);
  });

  if (books.length === 0){
    const empty = document.createElement("p");
    empty.className = "empty-note";
    empty.textContent = "まだ本がありません。";
    shelf.appendChild(empty);
  }
}

function applyTheme(mode){
  if (mode === "dark" || mode === "light"){
    document.documentElement.setAttribute("data-theme", mode);
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  localStorage.setItem(THEME_KEY, mode || "");
}

document.getElementById("theme-toggle").addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme") || "";
  const next = cur === "dark" ? "light" : cur === "light" ? "" : "dark";
  applyTheme(next);
});

function copyPageLink(btn) {
  const url = window.location.href;
  const onDone = () => {
    const original = btn.textContent;
    btn.textContent = "✓";
    setTimeout(() => { btn.textContent = original; }, 1600);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(onDone).catch(() => fallbackCopy(url, onDone));
  } else {
    fallbackCopy(url, onDone);
  }
}
function fallbackCopy(text, onDone) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); } catch (e) { /* clipboard unavailable */ }
  document.body.removeChild(ta);
  onDone();
}
document.getElementById("share-link").addEventListener("click", (e) => copyPageLink(e.currentTarget));

applyTheme(localStorage.getItem(THEME_KEY) || "");
render();
