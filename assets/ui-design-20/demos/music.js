// デモ共通：曲をクリックすると、右下に Suno のプレイヤーが開いて実際に聴ける
// 使い方：<script src="music.js" data-tracks="曲の要素のセレクタ"></script>
//        曲は中の画像（ジャケット）か、曲名の文字から自動で判別する
(() => {
  const SONGS = [
    { id: '6b4a5f0e-1799-4b9f-b27e-7bbe61fe8bcc', img: 'y_b.jpg', t: 'そのまま進め、ゆっくり歩いていこう', keys: [/そのまま進め/] },
    { id: 'af907997-203b-408d-afb5-6bdc6b1d653c', img: 'song8.jpg', t: 'Hamburg steak recipe', keys: [/hamburg/i, /ハンバーグ/] },
    { id: '81859e00-c3ab-45a0-82a5-447a655e7d84', img: 'song1-2.jpg', t: 'ありのままで2', keys: [/ありのままで\s*(2|弐)/] },
    { id: '87d91602-d491-4305-9390-84dc0dc3211f', img: 'song2.jpg', t: 'over', keys: [/(^|[^a-z])over([^a-z]|$)/i] },
  ];
  const IMG = 'https://fumifum1.github.io/main/jpg/';
  const sel = (document.currentScript && document.currentScript.dataset.tracks) || '';

  const style = document.createElement('style');
  style.textContent = `
    .sm-panel{position:fixed;right:16px;bottom:74px;z-index:2147482000;width:min(360px,calc(100vw - 32px));padding:12px;border-radius:18px;background:rgba(18,18,24,.94);color:#fff;font:500 13px/1.4 system-ui,sans-serif;box-shadow:0 20px 50px -10px rgba(0,0,0,.55);backdrop-filter:blur(10px);transform:translateY(20px) scale(.96);opacity:0;pointer-events:none;transition:.35s cubic-bezier(.3,1.4,.5,1)}
    .sm-panel.on{transform:none;opacity:1;pointer-events:auto}
    .sm-head{display:flex;align-items:center;gap:10px;margin-bottom:10px}
    .sm-head img{width:40px;height:40px;border-radius:10px;object-fit:cover}
    .sm-head div{flex:1;min-width:0}
    .sm-head small{display:block;font-size:10px;letter-spacing:.14em;color:#ff9ad5}
    .sm-head b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px}
    .sm-head button{all:unset;cursor:pointer;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.12)}
    .sm-head button:hover{background:#ff7ac6;color:#111}
    .sm-panel iframe{display:block;width:100%;height:180px;border:0;border-radius:12px;background:#000}
    .sm-playing{outline:3px solid #ff7ac6!important;outline-offset:3px;animation:smPulse 1.6s ease-in-out infinite}
    @keyframes smPulse{50%{outline-color:#ffe066}}
    ${sel ? `${sel}{cursor:pointer}` : ''}`;
  document.head.appendChild(style);

  let panel, frame, current;
  const ensure = () => {
    if (panel) return;
    panel = document.createElement('div'); panel.className = 'sm-panel';
    panel.innerHTML = '<div class="sm-head"><img alt=""><div><small>NOW PLAYING · BEAR BEER BEAT</small><b></b></div><button aria-label="閉じる">✕</button></div><iframe title="Suno player" allow="autoplay"></iframe>';
    document.body.appendChild(panel);
    frame = panel.querySelector('iframe');
    panel.querySelector('button').addEventListener('click', e => { e.stopPropagation(); stop(); });
    panel.addEventListener('click', e => e.stopPropagation());
  };
  const stop = () => {
    if (!panel) return;
    panel.classList.remove('on'); frame.src = 'about:blank';
    if (current) current.classList.remove('sm-playing'); current = null;
  };
  const play = (song, el) => {
    if (typeof song === 'number') song = SONGS[(song % SONGS.length + SONGS.length) % SONGS.length];
    if (!song) return;
    ensure();
    panel.querySelector('img').src = IMG + song.img;
    panel.querySelector('b').textContent = song.t;
    const src = 'https://suno.com/embed/' + song.id + '/';
    if (frame.src !== src) frame.src = src;
    panel.classList.add('on');
    if (current) current.classList.remove('sm-playing');
    current = el || null; if (current) current.classList.add('sm-playing');
  };
  const songOf = el => {
    const img = el.tagName === 'IMG' ? el : el.querySelector('img');
    if (img) { const src = img.getAttribute('src') || ''; const s = SONGS.find(x => src.endsWith('/' + x.img)); if (s) return s; }
    // 文字が隣の要素とくっつかないよう、要素ごとの文字でも調べる（例：「04」「over」「BEAR BEER BEAT」）
    const texts = [el, ...el.querySelectorAll('*')].map(n => (n.textContent || '').trim()).filter(Boolean);
    return SONGS.find(x => x.keys.some(k => texts.some(tx => k.test(tx))));
  };
  // あとから追加される曲（ターミナルの出力など）にも効くよう、クリックはまとめて受け取る
  if (sel) document.addEventListener('click', e => {
    const el = e.target.closest(sel);
    if (!el) return;
    const song = songOf(el);
    if (!song) return;
    e.preventDefault();
    play(song, el);
  });
  window.SynapseMusic = { play, stop, songs: SONGS };
})();
