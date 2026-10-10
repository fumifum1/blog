// デモ共通：フル表示時だけ下部に「記事へ戻る／前へ／次へ」のバーを出す（記事内の iframe では非表示）
(() => {
    if (window.self !== window.top) return;
    const pages = [
        ['01-atelier.html', 'Atelier White'], ['02-night.html', 'Synapse Night'], ['03-bento.html', 'Bento Box'],
        ['04-desktop.html', 'Desktop OS'], ['05-vinyl.html', 'Record Shop'], ['06-arcade.html', 'Arcade'],
        ['07-scrapbook.html', 'Scrapbook'], ['08-terminal.html', 'Terminal'], ['09-wa.html', '和 Ma'],
        ['10-pop.html', 'Pop Bubble'], ['11-aurora.html', 'Aurora Glass'], ['12-brutal.html', 'Neo Brutal'],
        ['13-magazine.html', 'Editorial Mag'], ['14-swiss.html', 'Swiss Grid'], ['15-clay.html', 'Clay Soft'],
        ['16-manga.html', 'Manga Panel'], ['17-memphis.html', 'Memphis 80s'], ['18-cinema.html', 'Cinema'],
        ['19-rpg.html', 'RPG Quest'], ['20-chalk.html', 'Chalkboard'],
    ];
    const article = '../../../ui-design-20.html';
    const file = decodeURIComponent(location.pathname.split('/').pop());
    const i = Math.max(0, pages.findIndex(p => p[0] === file));
    const prev = pages[(i + pages.length - 1) % pages.length], next = pages[(i + 1) % pages.length];
    const el = document.createElement('div');
    el.innerHTML = `
      <a href="${article}#d${String(i + 1).padStart(2, '0')}" title="記事へ戻る (Esc)">← 記事</a>
      <a href="${prev[0]}" title="${prev[1]}">‹</a>
      <span><b>${String(i + 1).padStart(2, '0')}</b> / ${pages.length} · ${pages[i][1]}</span>
      <a href="${next[0]}" title="${next[1]}">›</a>`;
    Object.assign(el.style, {
        position: 'fixed', left: '50%', bottom: '18px', transform: 'translateX(-50%)', zIndex: 2147483000,
        display: 'flex', alignItems: 'center', gap: '6px', padding: '6px', borderRadius: '999px',
        background: 'rgba(20,20,22,.86)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        color: '#fff', font: '500 12px/1 system-ui, sans-serif', letterSpacing: '.02em',
        boxShadow: '0 8px 30px rgba(0,0,0,.25)', whiteSpace: 'nowrap', maxWidth: 'calc(100vw - 24px)'
    });
    el.querySelectorAll('a').forEach(a => Object.assign(a.style, {
        color: '#fff', textDecoration: 'none', minWidth: '30px', height: '30px', padding: '0 10px', display: 'grid', placeItems: 'center',
        borderRadius: '999px', background: 'rgba(255,255,255,.12)', fontSize: '14px'
    }));
    el.querySelector('a').style.fontSize = '12px';
    el.querySelector('span').style.cssText = 'padding:0 8px;overflow:hidden;text-overflow:ellipsis';
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !e.target.closest('input,textarea')) location.href = el.querySelector('a').href;
    });
    document.body.appendChild(el);
})();
