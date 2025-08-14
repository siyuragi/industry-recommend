// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import { buildIndex, findIndustryExact, suggestClosest } from "./lib/industryIndex";

// GitHub Pages のリポ名が industry-recommend である想定。違うなら書き換えてください。
const DATA_URL = import.meta.env.PROD
  ? '/industry-recommend/data.json'
  : '/data.json';

export default function App() {
  const [map, setMap] = useState(null);
  const [query, setQuery] = useState('');
  const [node, setNode] = useState(null);
  const [candidates, setCandidates] = useState([]);

  // 1) 起動時に data.json を取り込んでインデックス化
  useEffect(() => {
    (async () => {
      const res = await fetch(DATA_URL);
      const data = await res.json();
      const m = buildIndex(data);
      setMap(m);
      console.log('✅ index built. nodes =', m.size);
    })();
  }, []);

  // 2) 入力が変わったら検索（完全一致→無ければ候補）
  useEffect(() => {
    if (!map) return;
    if (!query) {
      setNode(null);
      setCandidates([]);
      return;
    }
    const exact = findIndustryExact(map, query);
    if (exact) {
      setNode(exact);
      setCandidates([]);
    } else {
      setNode(null);
      setCandidates(suggestClosest(map, query, 6));
    }
  }, [map, query]);

  const connectionsView = useMemo(() => {
    if (!node) return null;
    // 見やすさのため、各 connection を「→ 関連先：ポイント」で列挙
    return node.connections.map((c, idx) => {
      const toNames = c.related.map(r => r.name).join('、');
      const pts = c.points.join(' / ');
      return (
        <li key={idx} style={{ marginBottom: 6 }}>
          <strong>→ {toNames}</strong>：{pts}
        </li>
      );
    });
  }, [node]);

  return (
    <div style={{ padding: 16, maxWidth: 720, margin: '0 auto', lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>業界つながり検索</h1>

      {!map ? (
        <p>読み込み中...</p>
      ) : (
        <>
          <div style={{ marginTop: 12 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="例：広告、ゼネコン、完成品メーカー など"
              style={{ width: '100%', padding: 10, fontSize: 16, border: '1px solid #ccc', borderRadius: 8 }}
            />
            <p style={{ fontSize: 12, color: '#666', marginTop: 6 }}>
              ※「広告」「広告マーケ」「メディア」→ 自動で「広告・マーケ・メディア」に寄せます。<br />
              ※「ゼネコン」→ 自動で「ゼネコン・サブコン」に寄せます。
            </p>
          </div>

          {node && (
            <div style={{ marginTop: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{node.name} のつながり</h2>
              <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                {connectionsView}
              </ul>
            </div>
          )}

          {!node && query && candidates.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 8 }}>該当なしでした。近い候補：</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {candidates.map(name => (
                  <button
                    key={name}
                    onClick={() => setQuery(name)}
                    style={{ padding: '6px 10px', borderRadius: 999, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!node && query && candidates.length === 0 && (
            <p style={{ marginTop: 16 }}>該当なし。</p>
          )}
        </>
      )}
    </div>
  );
}