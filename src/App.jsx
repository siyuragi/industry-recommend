import { useEffect, useMemo, useState } from "react";

// ★ 理由→キーワード辞書（足りなければ随時追加OK）
const REASON_KEYWORDS = {
  "調達・供給・現場支援": ["調達","供給","現場","資材","品質"],
  "基礎資材提供と品質保証": ["基礎資材","品質","保証","検査"],
  "資源管理と持続可能な供給網構築": ["資源","持続可能","サプライチェーン","供給網","在庫"],
  "市場動向分析": ["市場","動向","分析","調査"],
  "技術情報発信": ["技術","情報","発信"],
  "部品供給・在庫管理": ["部品","供給","在庫","管理"],
  "共同開発": ["共同","開発","協業"],
  "技術連携と標準化対応": ["技術","連携","標準化"],
  "生産性向上": ["生産性","効率化","改善"],
  "人材育成": ["人材","育成","研修","教育"],
  "製品供給": ["製品","供給","出荷"],
  "需要予測": ["需要","予測","需給"],
  "ユーザー志向の企画開発": ["ユーザー","企画","開発","UX"],
  "ブランド戦略": ["ブランド","認知","訴求","マーケ"],
  "食の安全教育": ["食","安全","教育","衛生"],
  "需要予測": ["需要","予測"],
  "技術統合": ["技術","統合"],
  "供給網構築": ["供給網","SCM","サプライ"],
  "製品プロモーション": ["プロモーション","販促","広告"],
  "技術者育成": ["技術者","育成","教育"],
  "市場動向調査": ["市場","動向","調査"],
  "生産設備提供": ["設備","提供","機械"],
  "共同設計": ["設計","共同"],
  "製造DX": ["DX","デジタル","IoT","自動化"],
  "予防保全": ["保全","予防","稼働"],
  "生産効率化提案": ["効率化","改善","最適化"],
  "部品調達": ["部品","調達"],
  "品質維持": ["品質","維持","管理"],
  "EV・自動運転技術連携": ["EV","電動","自動運転"],
  "ブランド戦略": ["ブランド","戦略","認知","訴求"],
  "原材料供給": ["原材料","供給"],
  "共同研究": ["共同","研究","R&D"],
  "バイオ素材": ["バイオ","素材"],
  "環境対応製品": ["環境","対応","脱炭素"],
  "安全管理": ["安全","管理","コンプライアンス"],
  "人材教育": ["人材","教育","研修"],
  "建設用資材供給": ["建設","資材","供給"],
  "リサイクル": ["リサイクル","循環"],
  "脱炭素対応": ["脱炭素","カーボン","CO2"],
  "資材流通": ["資材","流通"],
  "サプライチェーン管理": ["サプライチェーン","在庫","物流"],
  "森林資源管理": ["森林","資源","管理"],
  "再生紙開発": ["再生紙","開発"],
  "原糸供給": ["原糸","供給"],
  "製品企画": ["製品","企画"],
  "エコ素材開発": ["エコ","素材","開発"],
  "多様な製品供給": ["多様","製品","供給"],
  "販路拡大": ["販路","拡大","チャネル"],
  "EC展開": ["EC","オンライン","販売"],
  // 他業界でも流用される汎用ラベル
  "課題解決型提案": ["課題","解決","提案"],
  "情報収集・分析": ["情報","収集","分析"],
  "顧客ニーズ把握": ["顧客","ニーズ","ヒアリング"],
  "情報提供・関係構築": ["情報提供","関係","構築"],
  "戦略立案": ["戦略","計画"],
  "業務効率化": ["業務","効率化","BPR"],
  "プロマネ": ["PM","プロマネ","進捗"],
  "改善提案": ["改善","提案"],
  "データ活用": ["データ","分析","BI"],
  "成果創出": ["成果","効果"],
  "提案型営業": ["提案","営業"],
  "企画・調整力": ["企画","調整"],
  "生活者理解": ["生活者","インサイト"],
  "ブランディング": ["ブランド","ブランディング"],
  "大規模プロジェクト管理": ["プロジェクト","大規模","管理"],
  "品質・安全管理": ["品質","安全","管理"],
  "技術・データ活用による効率化": ["技術","データ","効率化"],
  "顧客ニーズ対応": ["顧客","ニーズ","対応"],
  "価値創造": ["価値","創造"],
  "インフラ提供": ["インフラ","基盤"],
  "情報伝達": ["情報","伝達"],
  "トレンド対応": ["トレンド","潮流"],
  "顧客満足度向上": ["CS","満足","体験"],
  "現場改善": ["現場","改善"],
  "人材育成": ["人材","育成"],
  "知識伝達": ["知識","伝達"],
  "行動理解": ["行動","理解","インサイト"],
  "新価値提供": ["新価値","価値提供"],
  "ブランド価値向上": ["ブランド","価値","向上"],
  "市場分析": ["市場","分析"],
  "データ活用": ["データ","活用"],
  "情報発信": ["情報","発信"],
  "認知度向上": ["認知","向上"],
  "資金提供": ["資金","提供","投資"],
  "与信管理": ["与信","審査","リスク"],
  "決済システム": ["決済","システム"],
  "フィンテック": ["FinTech","フィンテック"],
  "リスク管理": ["リスク","管理"],
  "投資案件評価": ["投資","評価","案件"],
  "資金調達": ["資金","調達"],
  "採用・研修": ["採用","研修","育成"],
  "スキルマッチング": ["スキル","マッチング"],
  "組織改善": ["組織","改善"],
  "採用戦略立案": ["採用","戦略"],
  "求人広報": ["求人","広報"],
  "製品輸送": ["製品","輸送","配送"],
  "追跡システム": ["追跡","トラッキング","可視化"],
  "低炭素化": ["低炭素","CO2","環境"],
  "輸送網最適化": ["輸送網","最適化"]
};

// 画面
export default function App() {
  const [step, setStep] = useState(1);
  const [dataset, setDataset] = useState([]);
  const [industry, setIndustry] = useState("");
  const [reasonKey, setReasonKey] = useState("");
  const [error, setError] = useState("");

  // JSONを public から取得
  useEffect(() => {
    fetch("/data.json")
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(json => { setDataset(json); if (json.length) setIndustry(json[0].industry); })
      .catch(e => setError(String(e)));
  }, []);

  const byIndustry = useMemo(() => Object.fromEntries(dataset.map(d => [d.industry, d])), [dataset]);
  const INDUSTRIES = useMemo(() => dataset.map(d => d.industry), [dataset]);
  const joinPoints = (pts) => pts.join("・");

  // Step2: 理由候補（pointsを1行に）
  const reasonOptions = useMemo(() => {
    const data = byIndustry[industry];
    return data ? data.connections.map(c => joinPoints(c.points)) : [];
  }, [byIndustry, industry]);

  useEffect(() => {
    setReasonKey(prev => (reasonOptions.includes(prev) ? prev : (reasonOptions[0] || "")));
  }, [reasonOptions]);

  // ★ スコアリング：起点業界の全connectionを横断し、peerごとにpointsを集約 → 選択理由のキーワードでスコア
  const results = useMemo(() => {
    const base = byIndustry[industry];
    if (!base) return [];

    // peer→ {peer, texts[]} を作る
    const bucket = new Map();
    for (const conn of base.connections) {
      for (const peer of conn.related) {
        if (peer === industry) continue; // 自分除外
        const cur = bucket.get(peer) || { peer, texts: [] };
        cur.texts.push(joinPoints(conn.points));
        bucket.set(peer, cur);
      }
    }

    // 選択理由のキーワード集合
    const kws = (REASON_KEYWORDS[reasonKey] || []).map(String);

    // スコア計算 & マッチしたキーワード抽出
    const scored = Array.from(bucket.values()).map(({ peer, texts }) => {
      const text = texts.join("／");
      const matched = kws.filter(k => k && text.includes(k));
      return { peer, score: matched.length, matched, texts };
    });

    return scored
      .filter(e => e.score > 0)                             // スコア0は非表示
      .sort((a, b) => (b.score - a.score) || a.peer.localeCompare(b.peer, "ja"));
  }, [byIndustry, industry, reasonKey]);

  // UIスタイル
  const wrap = { maxWidth: 960, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" };
  const card = { background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: 18, boxShadow: "0 2px 10px rgba(0,0,0,.04)" };
  const h1 = { fontSize: 22, fontWeight: 700, marginBottom: 8 };
  const sub = { color: "#666", fontSize: 13, marginBottom: 12 };
  const select = { width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10 };
  const btn = (primary) => ({ padding: "10px 16px", borderRadius: 10, border: primary ? "1px solid #4f46e5" : "1px solid #ddd", background: primary ? "#4f46e5" : "#fff", color: primary ? "#fff" : "#333", cursor: "pointer" });
  const crumb = (active) => ({ padding: "6px 10px", borderRadius: 999, border: "1px solid " + (active ? "#4f46e5" : "#e5e7eb"), background: active ? "#eef2ff" : "#fff", color: active ? "#3730a3" : "#6b7280", fontSize: 12, marginRight: 8 });
  const chip = { display: "inline-block", padding: "4px 8px", borderRadius: 999, border: "1px solid #eee", background: "#fafafa", fontSize: 12, marginRight: 6, marginTop: 6 };

  if (error) return <div style={wrap}><div style={card}><div style={h1}>読み込みエラー</div><div style={sub}>{error}</div></div></div>;
  if (!dataset.length) return <div style={wrap}><div style={card}>データ読込中…</div></div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f7fafc" }}>
      <div style={wrap}>
        <div style={{ marginBottom: 12 }}>
          <span style={crumb(step === 1)}>① 業界選択</span>
          <span style={crumb(step === 2)}>② 理由選択</span>
          <span style={crumb(step === 3)}>③ 他業界の提示（スコア付き）</span>
        </div>

        {step === 1 && (
          <div style={card}>
            <div style={h1}>興味のある業界を選んでください</div>
            <div style={sub}>まずは起点となる業界を決めましょう。</div>
            <select style={select} value={industry} onChange={(e) => setIndustry(e.target.value)}>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <div style={{ marginTop: 16 }}>
              <button style={btn(true)} onClick={() => setStep(2)}>次へ（理由を選ぶ）</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={card}>
            <div style={h1}>{industry} に興味がある理由を選んでください</div>
            <div style={sub}>※ リストは {industry} の「主な共通点」から生成。選ぶと、そのキーワードでスコアリングします。</div>
            <select style={select} value={reasonKey} onChange={(e) => setReasonKey(e.target.value)}>
              {reasonOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button style={btn(false)} onClick={() => setStep(1)}>戻る</button>
              <button style={btn(true)} onClick={() => setStep(3)} disabled={!reasonKey}>結果を見る</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={card}>
            <div style={h1}>{industry} → 共通点のある「別の業界」</div>
            <div style={sub}>理由：{reasonKey || "（未選択）"} ／ キーワード：{(REASON_KEYWORDS[reasonKey] || []).join("・") || "（定義なし）"}</div>

            <div style={{ display: "grid", gap: 12 }}>
              {results.map(({ peer, score, matched, texts }) => (
                <div key={peer} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>{peer}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>関連スコア: <b>{score}</b></div>
                  </div>

                  {/* マッチしたキーワード */}
                  <div style={{ marginTop: 6 }}>
                    {matched.length > 0 ? matched.map(k => <span key={peer + k} style={chip}>{k}</span>) : <span style={{ color:"#777", fontSize:12 }}>キーワード一致なし</span>}
                  </div>

                  {/* 参考：このpeerに紐づいたテキスト（当該起点業界の全connectionから） */}
                  <div style={{ marginTop: 8, color: "#555", fontSize: 13, lineHeight: 1.6 }}>
                    {texts.map((t, i) => <div key={i}>・{t}</div>)}
                  </div>
                </div>
              ))}
            </div>

            {results.length === 0 && (
              <div style={{ marginTop: 8, color: "#666" }}>該当データがありません。理由を変更してください。</div>
            )}

            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button style={btn(false)} onClick={() => setStep(2)}>理由を変える</button>
              <button style={btn(false)} onClick={() => setStep(1)}>最初から選び直す</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}