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
        #sb-color-panel .sb-swatches { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0; }
        #sb-color-panel .sb-swatch { width: 26px; height: 26px; border-radius: 50%; border: 2px solid rgba(255,255,255,.7); cursor: pointer; padding: 0; }
        #sb-color-panel input[type=color] { width: 100%; height: 32px; border: none; padding: 0; background: none; cursor: pointer; }
        #sb-color-panel button.sb-reset { width: 100%; margin-top: 8px; padding: 6px; border-radius: 6px; border: 1px solid currentColor;
            background: none; color: inherit; cursor: pointer; }
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
    const PRESETS = ['#2c3e50', '#1f3a5f', '#34495e', '#16a085', '#8e44ad', '#c0392b', '#d35400', '#7f8c8d', '#e8eef2', '#fdf2e9'];
    const LS_COLOR = 'psicofact_menu_color';
    const LS_COLLAPSED = 'psicofact_menu_collapsed';

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

        const nav = document.createElement('nav');
        nav.id = 'app-sidebar';
        nav.innerHTML = ITEMS.map(i => {
                const active = i.pages.includes(page) ? ' active' : '';
                const adm = i.admin ? ' sb-admin' : '';
                return `<a class="sb-item${active}${adm}" href="${i.href}"><span class="sb-icon">${i.icon}</span><span>${i.label}</span></a>`;
            }).join('') +
            '<button type="button" id="sb-gear"><span class="sb-icon">⚙️</span><span>Color del menú</span></button>' +
            '<div id="sb-color-panel"><div>Elige un color de fondo</div><div class="sb-swatches">' +
            PRESETS.map(c => `<button type="button" class="sb-swatch" data-color="${c}" style="background:${c}" title="${c}"></button>`).join('') +
            '</div><input type="color" id="sb-color-input" value="' + DEFAULT_COLOR + '">' +
            '<button type="button" class="sb-reset">Restablecer color original</button></div>';
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
        const input = nav.querySelector('#sb-color-input');
        gear.addEventListener('click', () => panel.classList.toggle('open'));
        try { input.value = localStorage.getItem(LS_COLOR) || DEFAULT_COLOR; } catch (e) {}

        let save = () => {};
        const choose = (hex) => { input.value = applyColor(hex); save(hex); };
        nav.querySelectorAll('.sb-swatch').forEach(b => b.addEventListener('click', () => choose(b.dataset.color)));
        input.addEventListener('input', () => applyColor(input.value));
        input.addEventListener('change', () => choose(input.value));
        nav.querySelector('.sb-reset').addEventListener('click', () => choose(DEFAULT_COLOR));

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
                save = (hex) => setDoc(ref, { menuColor: hex, menuColorOriginal: DEFAULT_COLOR }, { merge: true })
                    .catch(e => console.error('Menú: no se pudo guardar el color', e));
                try {
                    const snap = await getDoc(ref);
                    const saved = snap.exists() ? snap.data().menuColor : null;
                    if (saved) input.value = applyColor(saved);
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
