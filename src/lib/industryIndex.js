// src/lib/industryIndex.js
// 「表記ゆらぎ吸収」「逆方向リンクの自動生成」「候補サジェスト」の3点セット

const ALIASES = {
  '広告': '広告・マーケ・メディア',
  '広告マーケ': '広告・マーケ・メディア',
  'マーケ': '広告・マーケ・メディア',
  'メディア': '広告・マーケ・メディア',
  'ゼネコン': 'ゼネコン・サブコン',
  'サブコン': 'ゼネコン・サブコン',
  'it': 'IT',
  'インフラ': 'インフラ関連',
};

export function canonicalize(s = '') {
  return String(s)
    .toLowerCase()
    .replace(/\s+/g, '')           // 空白除去
    .replace(/[・／/\\\-]/g, '');  // 記号ゆらぎを吸収
}

export function toCanonicalName(name) {
  const key = canonicalize(name);
  for (const [alias, target] of Object.entries(ALIASES)) {
    if (canonicalize(alias) === key) return target;
  }
  // エイリアスに無ければ元の名前を返す
  return name;
}

function idOf(name) {
  return canonicalize(toCanonicalName(name));
}

/**
 * data.json を受け取り、以下をやる:
 *  - 表記ゆらぎを吸収してID化
 *  - related にしか出ない業種もノード化
 *  - 逆方向リンク（相互リンク）を自動生成
 * 返り値: Map(id -> { id, name, connections: [{ related:[{id,name},...], points: [...]}, ...] })
 */
export function buildIndex(raw) {
  const map = new Map();

  // 1) 上位 industry を追加
  raw.forEach(item => {
    const id = idOf(item.industry);
    if (!map.has(id)) {
      map.set(id, { id, name: toCanonicalName(item.industry), connections: [] });
    }
    item.connections.forEach(c => {
      const targets = c.related.map(r => ({ id: idOf(r), name: toCanonicalName(r) }));
      map.get(id).connections.push({ related: targets, points: c.points });
    });
  });

  // 2) related に出てくるだけの業種もノード化
  for (const node of map.values()) {
    node.connections.forEach(c => {
      c.related.forEach(r => {
        if (!map.has(r.id)) {
          map.set(r.id, { id: r.id, name: r.name, connections: [] });
        }
      });
    });
  }

  // 3) 逆方向リンクを自動生成（重複させない）
  for (const node of map.values()) {
    node.connections.forEach(c => {
      c.related.forEach(r => {
        const target = map.get(r.id);
        const already = (target.connections || []).some(conn =>
          conn.related.some(x => x.id === node.id)
        );
        if (!already) {
          (target.connections ||= []).push({
            related: [{ id: node.id, name: node.name }],
            points: c.points, // 必要なら相互用に短縮してもOK
          });
        }
      });
    });
  }

  return map;
}

// 完全一致（正規化ID一致）だけ拾う
export function findIndustryExact(map, query) {
  const q = idOf(query);
  return map.get(q) || null;
}

// 近い候補を提案（簡易スコア）
export function suggestClosest(map, query, limit = 5) {
  const q = canonicalize(query);
  const score = (name) => {
    const n = canonicalize(name);
    let s = [...new Set(n)].filter(ch => q.includes(ch)).length; // 共通文字数
    if (n.startsWith(q)) s += 5;                                 // 前方一致ボーナス
    return s;
  };
  return [...map.values()]
    .map(n => ({ name: n.name, score: score(n.name) }))
    .sort((a,b)=>b.score-a.score)
    .slice(0, limit)
    .map(x => x.name);
}