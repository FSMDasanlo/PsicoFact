// Menú lateral común. Se carga con: <script defer src="js/menu.js"></script>
(function () {
    const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const isPanel = page === 'index.html' || page === '';
    // En index.html solo se muestra con ?panel=1 (sin él es la pantalla de login)
    if (isPanel && !/[?&]panel=1/.test(location.search)) return;

    const ITEMS = [
        { href: 'agenda.html', icon: '📅', label: 'Agenda', pages: ['agenda.html'] },
        { href: 'consultas.html', icon: '👤', label: 'Consultas', pages: ['consultas.html', 'con_pacientes.html', 'con_citas.html', 'facturas.html', 'expediente_paciente.html', 'lineavida.html', 'mapa_calor.html', 'sentiment_dashboard.html', 'copiloto.html', 'evaluacion.html', 'pautas.html', 'psilogia.html', 'documentos.html', 'tutores.html'] },
        { href: 'configuracion.html', icon: '⚙️', label: 'Configuración/Datos', pages: ['configuracion.html', 'pacientes.html', 'sociedades.html', 'clinicas.html', 'centros.html', 'estados.html'] },
        { href: 'plan_bienestar.html', icon: '🌿', label: 'Plan de Bienestar', pages: ['plan_bienestar.html'] },
        { href: 'utilidades.html', icon: '🛠️', label: 'Utilidades', pages: ['utilidades.html'] },
        { href: 'herramientas.html', icon: '🚀', label: 'Herramientas', pages: ['herramientas.html'] },
        { href: 'admin.html', icon: '🛡️', label: 'Admin', pages: ['admin.html'], admin: true },
        { href: 'help.html', icon: '❓', label: 'Ayuda', pages: ['help.html'] },
        { href: 'index.html?panel=1', icon: '🏠', label: 'Panel de inicio', pages: ['index.html'] }
    ];

    const css = `
        body.has-sidebar { padding-left: 230px; }
        body.has-sidebar .modal { left: 230px; width: calc(100% - 230px); }
        #app-sidebar { position: fixed; top: var(--nb-h, 72px); left: 0; bottom: 0; width: 230px; background: var(--sb-bg, #2c3e50); color: var(--sb-fg, #fff);
            display: flex; flex-direction: column; padding: 1rem 0; z-index: 1000; overflow-y: auto; box-shadow: 2px 0 6px rgba(0,0,0,.15); }
        html.sb-on body { padding-top: var(--nb-h, 72px); }
        html.sb-on header.navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 900; height: var(--nb-h, 72px); box-sizing: border-box; padding-top: 0; padding-bottom: 0; }
        html.sb-pre body { visibility: hidden; }
        #app-sidebar .sb-brand { display: none; }
        #app-sidebar a.sb-item { display: flex; align-items: center; gap: 12px; padding: 12px 20px; color: var(--sb-fg, #ecf0f1);
            text-decoration: none; font-size: .95rem; border-left: 4px solid transparent; }
        #app-sidebar a.sb-item:hover { background: var(--sb-hover, rgba(255,255,255,.08)); }
        #app-sidebar a.sb-item.active { background: rgba(72,201,176,.5); border-left-color: #7ff0d8; font-weight: 600; }
        #app-sidebar a.sb-item .sb-icon { width: 24px; text-align: center; font-size: 1.15rem; }
        #app-sidebar a.sb-admin { display: none; }
        #app-sidebar .sb-brand { border-bottom-color: var(--sb-hover, rgba(255,255,255,.12)); }
        #sb-gear { margin-top: auto; background: none; border: none; color: var(--sb-fg, #fff); cursor: pointer; text-align: left;
            padding: 12px 20px; font-size: .95rem; display: flex; align-items: center; gap: 12px; }
        #sb-gear:hover { background: var(--sb-hover, rgba(255,255,255,.08)); }
        #sb-gear .sb-icon { width: 24px; text-align: center; font-size: 1.15rem; }
        #sb-color-panel { display: none; padding: 10px 16px 14px; font-size: .85rem; border-top: 1px solid var(--sb-hover, rgba(255,255,255,.12)); }
        #sb-color-panel.open { display: block; }
        #sb-color-panel .sb-target { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
        #sb-color-panel .sb-target label { display: flex; align-items: center; gap: 6px; cursor: pointer; }
        #sb-sv { position: relative; width: 100%; height: 130px; border-radius: 6px; cursor: crosshair; touch-action: none; overflow: hidden;
            background: linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(var(--sb-h, 0), 100%, 50%)); }
        #sb-sv-thumb { position: absolute; width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 50%; border: 2px solid #fff;
            box-shadow: 0 0 0 1px rgba(0,0,0,.5); pointer-events: none; }
        #sb-hue { -webkit-appearance: none; appearance: none; width: 100%; height: 12px; margin: 10px 0; border-radius: 6px; outline: none; cursor: pointer;
            background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00); }
        #sb-hue::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #fff; border: 2px solid rgba(0,0,0,.5); }
        #sb-hue::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: #fff; border: 2px solid rgba(0,0,0,.5); }
        #sb-color-panel .sb-hexrow { display: flex; align-items: center; gap: 8px; }
        #sb-preview { width: 32px; height: 32px; border-radius: 6px; border: 2px solid rgba(255,255,255,.7); flex: 0 0 auto; }
        #sb-hex { flex: 1; min-width: 0; padding: 6px 8px; border-radius: 6px; border: 1px solid rgba(128,128,128,.6); font-family: monospace; font-size: .9rem; text-transform: uppercase; }
        #sb-hex.invalid { border-color: #e74c3c; }
        #sb-color-panel button.sb-reset { width: 100%; margin-top: 8px; padding: 6px; border-radius: 6px; border: 1px solid currentColor;
            background: none; color: inherit; cursor: pointer; }
        .menu-card { background-color: var(--card-bg, #fff); }
        .menu-card h2 { color: var(--card-fg, #2c3e50); }
        .menu-card p { color: var(--card-fg2, #7f8c8d); }
        #sb-collapse { position: fixed; top: calc(var(--nb-h, 72px) + 12px); left: 230px; z-index: 1001; width: 22px; height: 38px; border: none; cursor: pointer;
            border-radius: 0 8px 8px 0; background: var(--sb-bg, #2c3e50); color: var(--sb-fg, #fff); font-weight: 700; font-size: .95rem; padding: 0;
            box-shadow: 2px 0 6px rgba(0,0,0,.15); }
        body.sb-collapsed { padding-left: 0 !important; }
        body.sb-collapsed #app-sidebar { transform: translateX(-100%); }
        body.sb-collapsed #sb-collapse { left: 0; }
        body.sb-collapsed.has-sidebar .modal { left: 0; width: 100%; }
        #sb-toggle { display: none; position: fixed; top: 10px; left: 10px; z-index: 1100; border: none; border-radius: 6px;
            background: var(--sb-bg, #2c3e50); color: var(--sb-fg, #fff); font-size: 1.4rem; padding: 4px 12px; cursor: pointer; }
        .navbar .navbar-title { margin: 0 auto 0 0 !important; color: #fff !important; font-size: 1.35rem !important; font-weight: 600 !important; text-align: left; }
        body.has-sidebar header.navbar .logo-container { flex: 0 0 auto; width: calc(230px - 2rem + 20px); }
        body.has-sidebar.sb-collapsed header.navbar .logo-container { width: auto; margin-right: 1rem; }
        @media (max-width: 900px) {
            body.has-sidebar header.navbar .logo-container { width: auto; margin-right: 1rem; }
            body.has-sidebar { padding-left: 0; }
            body.has-sidebar .modal { left: 0; width: 100%; }
            body.has-sidebar .navbar { padding-left: 4rem; }
            #app-sidebar { transform: translateX(-100%); transition: transform .2s; }
            #app-sidebar.open { transform: none; }
            #sb-toggle { display: block; }
            #sb-collapse { display: none; }
        }`;

    const DEFAULT_COLOR = '#2c3e50';
    const LS_COLOR = 'psicofact_menu_color';
    const LS_COLLAPSED = 'psicofact_menu_collapsed';
    const DEFAULT_CARD = '#ffffff';
    const LS_CARD = 'psicofact_card_color';

    function hexToHsv(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
        let h = 0;
        if (d) {
            if (max === r) h = ((g - b) / d) % 6;
            else if (max === g) h = (b - r) / d + 2;
            else h = (r - g) / d + 4;
            h = Math.round(h * 60);
            if (h < 0) h += 360;
        }
        return { h, s: max ? d / max : 0, v: max };
    }

    function hsvToHex(h, s, v) {
        const f = (n) => {
            const k = (n + h / 60) % 6;
            return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
        };
        return '#' + [f(5), f(3), f(1)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
    }

    // Fondo de las tarjetas del menú; el texto se adapta (claro/oscuro) según la luminosidad del color
    function applyCardColor(hex) {
        if (!/^#[0-9a-f]{6}$/i.test(hex || '')) hex = DEFAULT_CARD;
        const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
        const light = (0.299 * r + 0.587 * g + 0.114 * b) > 150;
        const root = document.documentElement.style;
        root.setProperty('--card-bg', hex);
        root.setProperty('--card-fg', light ? '#2c3e50' : '#ffffff');
        root.setProperty('--card-fg2', light ? '#7f8c8d' : '#d5dde5');
        try { localStorage.setItem(LS_CARD, hex); } catch (e) {}
        return hex;
    }

    function applyColor(hex) {
        if (!/^#[0-9a-f]{6}$/i.test(hex || '')) hex = DEFAULT_COLOR;
        const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
        const light = (0.299 * r + 0.587 * g + 0.114 * b) > 160;
        const root = document.documentElement.style;
        root.setProperty('--sb-bg', hex);
        root.setProperty('--sb-fg', light ? '#2c3e50' : '#ecf0f1');
        root.setProperty('--sb-hover', light ? 'rgba(0,0,0,.08)' : 'rgba(255,255,255,.1)');
        try { localStorage.setItem(LS_COLOR, hex); } catch (e) {}
        return hex;
    }

    function build() {
        try { applyColor(localStorage.getItem(LS_COLOR)); } catch (e) { applyColor(DEFAULT_COLOR); }
        try { applyCardColor(localStorage.getItem(LS_CARD)); } catch (e) { applyCardColor(DEFAULT_CARD); }

        const nav = document.createElement('nav');
        nav.id = 'app-sidebar';
        nav.innerHTML = ITEMS.map(i => {
                const active = i.pages.includes(page) ? ' active' : '';
                const adm = i.admin ? ' sb-admin' : '';
                return `<a class="sb-item${active}${adm}" href="${i.href}"><span class="sb-icon">${i.icon}</span><span>${i.label}</span></a>`;
            }).join('') +
            '<button type="button" id="sb-gear"><span class="sb-icon">⚙️</span><span>Color de fondo</span></button>' +
            '<div id="sb-color-panel">' +
            '<div class="sb-target"><label><input type="radio" name="sb-target" value="menu" checked> Menú lateral</label>' +
            '<label><input type="radio" name="sb-target" value="card"> Tarjetas</label></div>' +
            '<div id="sb-sv"><div id="sb-sv-thumb"></div></div>' +
            '<input type="range" id="sb-hue" min="0" max="360" step="1" value="0">' +
            '<div class="sb-hexrow"><span id="sb-preview"></span><input type="text" id="sb-hex" maxlength="7" spellcheck="false" value="' + DEFAULT_COLOR + '" aria-label="Código HEX"></div>' +
            '<button type="button" class="sb-reset" id="sb-reset">Restablecer color original</button></div>';
        document.body.prepend(nav);

        const btn = document.createElement('button');
        btn.id = 'sb-toggle';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Menú');
        btn.textContent = '☰';
        btn.addEventListener('click', () => nav.classList.toggle('open'));
        document.body.prepend(btn);

        const collapse = document.createElement('button');
        collapse.id = 'sb-collapse';
        collapse.type = 'button';
        document.body.prepend(collapse);
        const setCollapsed = (v) => {
            document.body.classList.toggle('sb-collapsed', v);
            collapse.textContent = v ? '>' : '<';
            collapse.title = v ? 'Mostrar menú' : 'Ocultar menú';
            try { localStorage.setItem(LS_COLLAPSED, v ? '1' : '0'); } catch (e) {}
        };
        collapse.addEventListener('click', () => setCollapsed(!document.body.classList.contains('sb-collapsed')));
        let startCollapsed = false;
        try { startCollapsed = localStorage.getItem(LS_COLLAPSED) === '1'; } catch (e) {}
        setCollapsed(startCollapsed);

        document.body.classList.add('has-sidebar');
        if (!isPanel) moveTitleToNavbar();
        document.documentElement.classList.remove('sb-pre');
        setupFirebase(nav);
    }

    // Sube el título de la página a la barra superior (sustituye al logo, que ya está en el menú)
    function moveTitleToNavbar() {
        const navbar = document.querySelector('header.navbar');
        const h2 = Array.from(document.querySelectorAll('main h2')).find(h => !h.closest('.modal'));
        if (!navbar || !h2) return;
        h2.classList.add('navbar-title');
        const logo = navbar.querySelector('.logo-container');
        if (logo) logo.after(h2); else navbar.prepend(h2);
    }

    // Mantiene --nb-h igual a la altura real de la barra superior
    function trackNavbarHeight() {
        const navbar = document.querySelector('header.navbar');
        if (!navbar) return;
        const set = () => { if (navbar.offsetHeight) document.documentElement.style.setProperty('--nb-h', navbar.offsetHeight + 'px'); };
        set();
        if (window.ResizeObserver) new ResizeObserver(set).observe(navbar);
        window.addEventListener('resize', set);
    }

    // Admin visible solo para el administrador y color del menú guardado en Firestore (usuarios/{uid}/facultativo/perfil)
    async function setupFirebase(nav) {
        const gear = nav.querySelector('#sb-gear');
        const panel = nav.querySelector('#sb-color-panel');
        gear.addEventListener('click', () => panel.classList.toggle('open'));

        const sv = nav.querySelector('#sb-sv');
        const thumb = nav.querySelector('#sb-sv-thumb');
        const hueEl = nav.querySelector('#sb-hue');
        const hexEl = nav.querySelector('#sb-hex');
        const preview = nav.querySelector('#sb-preview');
        const resetBtn = nav.querySelector('#sb-reset');

        // Colores actuales y funciones de guardado de cada destino
        const targets = {
            menu: { hex: DEFAULT_COLOR, def: DEFAULT_COLOR, ls: LS_COLOR, apply: applyColor, save: () => {}, resetLabel: 'Restablecer color original' },
            card: { hex: DEFAULT_CARD, def: DEFAULT_CARD, ls: LS_CARD, apply: applyCardColor, save: () => {}, resetLabel: 'Restablecer tarjetas' }
        };
        try { targets.menu.hex = localStorage.getItem(LS_COLOR) || DEFAULT_COLOR; } catch (e) {}
        try { targets.card.hex = localStorage.getItem(LS_CARD) || DEFAULT_CARD; } catch (e) {}
        const getTarget = () => targets[(nav.querySelector('input[name="sb-target"]:checked') || {}).value || 'menu'];

        let hsv = hexToHsv(targets.menu.hex);
        // Dibuja el selector (cuadro, tono, HEX y vista previa) a partir de hsv
        const paint = () => {
            sv.style.setProperty('--sb-h', hsv.h);
            thumb.style.left = (hsv.s * 100) + '%';
            thumb.style.top = ((1 - hsv.v) * 100) + '%';
            hueEl.value = hsv.h;
            const hex = hsvToHex(hsv.h, hsv.s, hsv.v);
            hexEl.value = hex.toUpperCase();
            hexEl.classList.remove('invalid');
            preview.style.background = hex;
            return hex;
        };
        const setHsvFromHex = (hex) => { hsv = hexToHsv(hex); paint(); };
        // live: aplica al instante; final: además guarda (al soltar el ratón)
        const update = (final) => {
            const t = getTarget();
            const hex = paint();
            t.hex = t.apply(hex);
            if (final) t.save(t.hex);
        };

        const pickSv = (e) => {
            const r = sv.getBoundingClientRect();
            hsv.s = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
            hsv.v = 1 - Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
            update(false);
        };
        sv.addEventListener('pointerdown', (e) => { sv.setPointerCapture(e.pointerId); pickSv(e); });
        sv.addEventListener('pointermove', (e) => { if (sv.hasPointerCapture(e.pointerId)) pickSv(e); });
        sv.addEventListener('pointerup', (e) => { if (sv.hasPointerCapture(e.pointerId)) { sv.releasePointerCapture(e.pointerId); update(true); } });
        hueEl.addEventListener('input', () => { hsv.h = Number(hueEl.value); update(false); });
        hueEl.addEventListener('change', () => update(true));
        hexEl.addEventListener('input', () => {
            let v = hexEl.value.trim();
            if (v && v[0] !== '#') v = '#' + v;
            if (/^#[0-9a-f]{6}$/i.test(v)) {
                v = v.toLowerCase();
                const t = getTarget();
                hsv = hexToHsv(v);
                sv.style.setProperty('--sb-h', hsv.h);
                thumb.style.left = (hsv.s * 100) + '%';
                thumb.style.top = ((1 - hsv.v) * 100) + '%';
                hueEl.value = hsv.h;
                hexEl.classList.remove('invalid');
                preview.style.background = v;
                t.hex = t.apply(v);
                t.save(t.hex);
            } else {
                hexEl.classList.add('invalid');
            }
        });
        nav.querySelectorAll('input[name="sb-target"]').forEach(r => r.addEventListener('change', () => {
            const t = getTarget();
            resetBtn.textContent = t.resetLabel;
            setHsvFromHex(t.hex);
        }));
        resetBtn.addEventListener('click', () => {
            const t = getTarget();
            t.hex = t.apply(t.def);
            setHsvFromHex(t.hex);
            t.save(t.hex);
        });
        setHsvFromHex(targets.menu.hex);

        try {
            const cfg = window.APP_CONFIG && window.APP_CONFIG.firebase;
            if (!cfg) return;
            const base = 'https://www.gstatic.com/firebasejs/10.12.0/';
            const { initializeApp } = await import(base + 'firebase-app.js');
            const { getAuth, onAuthStateChanged } = await import(base + 'firebase-auth.js');
            const { getFirestore, doc, getDoc, setDoc } = await import(base + 'firebase-firestore.js');
            const fbApp = initializeApp(cfg, 'menu');
            const auth = getAuth(fbApp);
            const db = getFirestore(fbApp);
            onAuthStateChanged(auth, async user => {
                const email = ((user && user.email) || '').toLowerCase().trim();
                const el = nav.querySelector('.sb-admin');
                if (el) el.style.display = email === 'jesus.samperruiz@gmail.com' ? 'flex' : 'none';
                if (!user) return;
                const ref = doc(db, 'usuarios', user.uid, 'facultativo', 'perfil');
                targets.menu.save = (hex) => setDoc(ref, { menuColor: hex, menuColorOriginal: DEFAULT_COLOR }, { merge: true })
                    .catch(e => console.error('Menú: no se pudo guardar el color', e));
                targets.card.save = (hex) => setDoc(ref, { cardColor: hex }, { merge: true })
                    .catch(e => console.error('Menú: no se pudo guardar el color de tarjetas', e));
                try {
                    const snap = await getDoc(ref);
                    const data = snap.exists() ? snap.data() : {};
                    if (data.menuColor) targets.menu.hex = applyColor(data.menuColor);
                    if (data.cardColor) targets.card.hex = applyCardColor(data.cardColor);
                    setHsvFromHex(getTarget().hex);
                } catch (e) { console.error('Menú: no se pudo leer el color', e); }
            });
        } catch (e) { console.error('Menú: error de Firebase', e); }
    }

    // Estilos y altura fija de la barra desde el primer pintado, para evitar saltos al cargar
    const earlyStyle = document.createElement('style');
    earlyStyle.textContent = css;
    document.head.appendChild(earlyStyle);
    document.documentElement.classList.add('sb-on', 'sb-pre');

    if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
