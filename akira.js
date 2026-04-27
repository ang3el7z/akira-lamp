/**
 * Akira — единый плагин для Lampa.
 * Объединяет логику из top_bar_akira, interface_horizontal, themes,
 * netflix_premium_style, tmdb_mod, appletv_agnative и element_scale.
 *
 * Каждый блок управляется из общего меню "Akira" (вложенные настройки
 * по образцу appletv_agnative). Все фичи можно по отдельности включать
 * и выключать. Размеры/масштабы рассчитываются адаптивно.
 */
(function () {
    'use strict';

    if (typeof Lampa === 'undefined') return;

    /* ================================================================
     * 1. CONFIG / GUARD / KEYS
     * ================================================================ */

    var CFG = {
        guard: '__AKIRA_PLUGIN_V2__',
        version: '2.0.0',
        prefix: 'akira_',
        component: 'akira',
        styleId: 'akira-plugin-style',
        topbarStyleId: 'akira-topbar-style',
        interfaceStyleId: 'akira-interface-style',
        themeStyleId: 'akira-theme-style',
        buttonsStyleId: 'akira-buttons-style',
        scaleStyleId: 'akira-scale-style',
        bodyClass: 'akira-ui',
        brand: 'AKIRA',
        logoCachePrefix: 'akira_logo_v2_',
        defaultNav: ['main', 'movie', 'tv', 'anime', 'release', 'favorite']
    };

    if (window[CFG.guard]) return;
    window[CFG.guard] = true;

    /* Идентификаторы под-компонентов настроек (вложенность). */
    var SUB = {
        topbar: 'akira_topbar',
        topnav: 'akira_topbar_nav',
        iface: 'akira_interface',
        buttons: 'akira_buttons',
        theme: 'akira_theme',
        logos: 'akira_logos',
        scale: 'akira_scale',
        tmdb: 'akira_tmdb'
    };

    /* Ключи в Lampa.Storage. Префикс единый — легко чистить. */
    var K = {
        enabled: CFG.prefix + 'enabled',

        topbarEnabled: CFG.prefix + 'topbar_enabled',
        topbarBrand: CFG.prefix + 'topbar_brand',
        topbarAlign: CFG.prefix + 'topbar_align',
        topbarItems: CFG.prefix + 'topbar_items',

        ifaceEnabled: CFG.prefix + 'iface_enabled',
        ifaceCardLogos: CFG.prefix + 'iface_card_logos',

        buttonsSeparate: CFG.prefix + 'buttons_separate',
        buttonsBig: CFG.prefix + 'buttons_big',

        themeEnabled: CFG.prefix + 'theme_enabled',
        themeAccent: CFG.prefix + 'theme_accent',
        themeFont: CFG.prefix + 'theme_font',

        logosEnabled: CFG.prefix + 'logos_enabled',
        logoLang: CFG.prefix + 'logo_lang',
        logoSize: CFG.prefix + 'logo_size',

        scaleEnabled: CFG.prefix + 'scale_enabled',

        tmdbEnabled: CFG.prefix + 'tmdb_enabled',
        tmdbCollection: CFG.prefix + 'tmdb_col_'
    };

    /* ================================================================
     * 2. УТИЛИТЫ
     * ================================================================ */

    var Util = {
        qs: function (sel, root) { return (root || document).querySelector(sel); },
        qsa: function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); },

        get: function (key, fallback) {
            try {
                if (!Lampa.Storage || typeof Lampa.Storage.get !== 'function') return fallback;
                var v = Lampa.Storage.get(key, fallback);
                return (typeof v === 'undefined') ? fallback : v;
            } catch (e) { return fallback; }
        },

        set: function (key, value) {
            try {
                if (Lampa.Storage && typeof Lampa.Storage.set === 'function') Lampa.Storage.set(key, value);
            } catch (e) {}
        },

        isOn: function (key, fallbackOn) {
            var v = this.get(key, typeof fallbackOn === 'undefined' ? true : fallbackOn);
            if (typeof v === 'boolean') return v;
            if (typeof v === 'number') return v !== 0;
            v = String(v).toLowerCase();
            return v !== 'off' && v !== 'false' && v !== '0' && v !== '';
        },

        ensure: function (key, fallback) {
            var v = this.get(key, undefined);
            if (typeof v === 'undefined' || v === null || v === '' || v === 'undefined' || v === 'null') {
                this.set(key, fallback);
                return fallback;
            }
            return v;
        },

        ensureOnOff: function (key, fallbackOn) {
            var v = this.get(key, undefined);
            if (typeof v === 'undefined' || v === null || v === '' || v === 'undefined' || v === 'null') {
                this.set(key, fallbackOn ? true : false);
                return !!fallbackOn;
            }
            return this.isOn(key, fallbackOn);
        },

        langCode: function () {
            var raw = 'en';
            try { raw = String(Lampa.Storage.get('language', 'en') || 'en').toLowerCase(); } catch (e) {}
            if (raw.indexOf('ru') === 0 || raw === 'be') return 'ru';
            if (raw.indexOf('uk') === 0 || raw === 'ua') return 'uk';
            return 'en';
        },

        escapeHtml: function (v) {
            var d = document.createElement('div');
            d.appendChild(document.createTextNode(String(v == null ? '' : v)));
            return d.innerHTML;
        },

        clean: function (v) { return String(v == null ? '' : v).replace(/\s+/g, ' ').trim(); },

        hexToRgb: function (h) {
            var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h || '');
            return m ? parseInt(m[1], 16) + ',' + parseInt(m[2], 16) + ',' + parseInt(m[3], 16) : '229,9,20';
        },

        notify: function (msg) {
            try { if (Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show(msg); } catch (e) {}
        },

        log: function () { /* console.log.apply(console, ['[Akira]'].concat([].slice.call(arguments))); */ }
    };

    /* ================================================================
     * 3. ЛОКАЛИЗАЦИЯ
     * ================================================================ */

    var L = {
        ru: {
            root_name: 'Akira',
            root_about: 'Единый кинотеатральный пресет: топ-бар, карточки, логотипы, тема, подборки и адаптив.',
            master_enabled: 'Включить плагин Akira',
            open_topbar: 'Верхний бар',
            open_iface: 'Интерфейс главной',
            open_buttons: 'Кнопки в карточке',
            open_theme: 'Тема и шрифты',
            open_logos: 'Логотипы фильмов',
            open_scale: 'Адаптивный масштаб',
            open_tmdb: 'Akira TMDB',
            reset_all: 'Сбросить все настройки Akira',
            reset_done: 'Akira: настройки сброшены',
            topbar_title: 'Верхний бар',
            topbar_enabled: 'Включить верхний бар',
            topbar_brand: 'Надпись бренда',
            topbar_align: 'Выравнивание',
            topbar_align_start: 'Слева',
            topbar_align_center: 'По центру',
            topbar_open_nav: 'Настроить пункты',
            topbar_nav_title: 'Пункты верхнего бара',
            show: 'Показать',
            hide: 'Скрыть',
            iface_title: 'Интерфейс главной',
            iface_enabled: 'Большая карточка + горизонтальные ряды',
            iface_card_logos: 'Логотипы внутри маленьких карточек',
            buttons_title: 'Кнопки в карточке фильма',
            buttons_separate: 'Раскрытые кнопки (Смотреть/Торренты/Трейлер)',
            buttons_big: 'Сохранять текст на маленьких экранах',
            theme_title: 'Тема и шрифты',
            theme_enabled: 'Включить тёмную тему Akira',
            theme_accent: 'Акцентный цвет',
            theme_font: 'Шрифт интерфейса',
            logos_title: 'Логотипы фильмов',
            logos_enabled: 'Показывать логотипы вместо названий',
            logos_lang: 'Язык логотипа',
            logos_size: 'Размер изображения',
            logos_clear: 'Сбросить кеш логотипов',
            logos_clear_done: 'Кеш логотипов очищен',
            scale_title: 'Адаптивный масштаб',
            scale_enabled: 'Включить (рассчитывается автоматически по экрану)',
            tmdb_title: 'Akira TMDB',
            tmdb_enabled: 'Включить подборки Akira',
            tmdb_about: 'Подборки добавятся к источнику Akira (выбирается в стандартном выборе источника).'
        },
        en: {
            root_name: 'Akira',
            root_about: 'Unified cinema preset: top bar, cards, logos, theme, collections and adaptive scale.',
            master_enabled: 'Enable Akira plugin',
            open_topbar: 'Top bar',
            open_iface: 'Home interface',
            open_buttons: 'Card buttons',
            open_theme: 'Theme & fonts',
            open_logos: 'Movie logos',
            open_scale: 'Adaptive scale',
            open_tmdb: 'Akira TMDB',
            reset_all: 'Reset all Akira settings',
            reset_done: 'Akira: settings reset',
            topbar_title: 'Top bar',
            topbar_enabled: 'Enable top bar',
            topbar_brand: 'Brand label',
            topbar_align: 'Alignment',
            topbar_align_start: 'Left',
            topbar_align_center: 'Center',
            topbar_open_nav: 'Configure items',
            topbar_nav_title: 'Top bar items',
            show: 'Show',
            hide: 'Hide',
            iface_title: 'Home interface',
            iface_enabled: 'Big hero card + horizontal rows',
            iface_card_logos: 'Logos inside small cards',
            buttons_title: 'Movie card buttons',
            buttons_separate: 'Expanded buttons (Watch/Torrents/Trailer)',
            buttons_big: 'Keep button text on small screens',
            theme_title: 'Theme & fonts',
            theme_enabled: 'Enable Akira dark theme',
            theme_accent: 'Accent color',
            theme_font: 'Interface font',
            logos_title: 'Movie logos',
            logos_enabled: 'Show logos instead of titles',
            logos_lang: 'Logo language',
            logos_size: 'Image size',
            logos_clear: 'Clear logo cache',
            logos_clear_done: 'Logo cache cleared',
            scale_title: 'Adaptive scale',
            scale_enabled: 'Enable (auto computed from viewport)',
            tmdb_title: 'Akira TMDB',
            tmdb_enabled: 'Enable Akira collections',
            tmdb_about: 'Collections appear under the Akira source (use the standard source picker).'
        },
        uk: {
            root_name: 'Akira',
            root_about: 'Єдиний кінопресет: верхній бар, картки, логотипи, тема, добірки та адаптив.',
            master_enabled: 'Увімкнути плагін Akira',
            open_topbar: 'Верхній бар',
            open_iface: 'Інтерфейс головної',
            open_buttons: 'Кнопки картки',
            open_theme: 'Тема та шрифти',
            open_logos: 'Логотипи фільмів',
            open_scale: 'Адаптивний масштаб',
            open_tmdb: 'Akira TMDB',
            reset_all: 'Скинути всі налаштування Akira',
            reset_done: 'Akira: налаштування скинуто',
            topbar_title: 'Верхній бар',
            topbar_enabled: 'Увімкнути верхній бар',
            topbar_brand: 'Надпис бренду',
            topbar_align: 'Вирівнювання',
            topbar_align_start: 'Зліва',
            topbar_align_center: 'По центру',
            topbar_open_nav: 'Налаштувати пункти',
            topbar_nav_title: 'Пункти верхнього бару',
            show: 'Показувати',
            hide: 'Сховати',
            iface_title: 'Інтерфейс головної',
            iface_enabled: 'Велика картка + горизонтальні ряди',
            iface_card_logos: 'Логотипи в маленьких картках',
            buttons_title: 'Кнопки в картці',
            buttons_separate: 'Розкриті кнопки (Дивитись/Торенти/Трейлер)',
            buttons_big: 'Зберігати текст на малих екранах',
            theme_title: 'Тема та шрифти',
            theme_enabled: 'Увімкнути темну тему Akira',
            theme_accent: 'Акцентний колір',
            theme_font: 'Шрифт інтерфейсу',
            logos_title: 'Логотипи фільмів',
            logos_enabled: 'Показувати логотипи замість назв',
            logos_lang: 'Мова логотипу',
            logos_size: 'Розмір зображення',
            logos_clear: 'Очистити кеш логотипів',
            logos_clear_done: 'Кеш логотипів очищено',
            scale_title: 'Адаптивний масштаб',
            scale_enabled: 'Увімкнути (рахується автоматично за екраном)',
            tmdb_title: 'Akira TMDB',
            tmdb_enabled: 'Увімкнути добірки Akira',
            tmdb_about: 'Добірки зявляться у джерелі Akira (стандартний перемикач джерел).'
        }
    };

    function t(key) {
        var pack = L[Util.langCode()] || L.en;
        return pack[key] || L.en[key] || key;
    }

    function trLampa(key, fallback) {
        try {
            if (Lampa.Lang && typeof Lampa.Lang.translate === 'function') {
                var v = Lampa.Lang.translate(key);
                if (v && v !== key) return v;
            }
        } catch (e) {}
        return fallback || key;
    }

    function onOffValues() {
        return { 'true': trLampa('extensions_enable', t('show')), 'false': trLampa('extensions_disable', t('hide')) };
    }

    /* ================================================================
     * 4. ДЕФОЛТЫ ХРАНИЛИЩА
     * ================================================================ */

    function ensureDefaults() {
        Util.ensureOnOff(K.enabled, true);

        Util.ensureOnOff(K.topbarEnabled, true);
        Util.ensure(K.topbarBrand, CFG.brand);
        Util.ensure(K.topbarAlign, 'start');
        var navStored = Util.get(K.topbarItems, undefined);
        if (typeof navStored === 'undefined' || navStored === null || navStored === '' || navStored === 'undefined') {
            Util.set(K.topbarItems, CFG.defaultNav.slice());
        }

        Util.ensureOnOff(K.ifaceEnabled, true);
        Util.ensureOnOff(K.ifaceCardLogos, true);

        Util.ensureOnOff(K.buttonsSeparate, true);
        Util.ensureOnOff(K.buttonsBig, true);

        Util.ensureOnOff(K.themeEnabled, true);
        Util.ensure(K.themeAccent, '#e50914');
        Util.ensure(K.themeFont, 'Montserrat');

        Util.ensureOnOff(K.logosEnabled, true);
        Util.ensure(K.logoLang, 'auto');
        Util.ensure(K.logoSize, 'original');

        Util.ensureOnOff(K.scaleEnabled, true);

        Util.ensureOnOff(K.tmdbEnabled, true);
    }

    /* ================================================================
     * 5. TOPBAR (порт top_bar_akira с прицелом на единый prefix)
     * ================================================================ */

    var Topbar = (function () {
        var ATTR_ON = 'data-akira-topbar';
        var ATTR_ALIGN = 'data-akira-topbar-align';
        var BRAND_VAR = '--akira-brand-w';

        var state = { clockTimer: null, domObserver: null, scheduled: false, listenersBound: false };

        var FALLBACK_ITEMS = [
            { action: 'main',        labelKey: 'menu_main',        fallback: { ru: 'Главная',     en: 'Home',        uk: 'Головна' } },
            { action: 'movie',       labelKey: 'menu_movies',      fallback: { ru: 'Фильмы',      en: 'Movies',      uk: 'Фільми' } },
            { action: 'tv',          labelKey: 'menu_tv',          fallback: { ru: 'Сериалы',     en: 'TV',          uk: 'Серіали' } },
            { action: 'anime',       labelKey: 'menu_anime',       fallback: { ru: 'Аниме',       en: 'Anime',       uk: 'Аніме' } },
            { action: 'cartoon',     labelKey: 'menu_multmovie',   fallback: { ru: 'Мультфильмы', en: 'Cartoons',    uk: 'Мультфільми' } },
            { action: 'release',     labelKey: 'title_new',        fallback: { ru: 'Новинки',     en: 'New',         uk: 'Новинки' } },
            { action: 'collections', labelKey: 'menu_collections', fallback: { ru: 'Коллекции',   en: 'Collections', uk: 'Колекції' } },
            { action: 'favorite',    labelKey: 'menu_bookmark',    fallback: { ru: 'Закладки',    en: 'Bookmarks',   uk: 'Закладки' } }
        ];

        function localized(value, fallback) {
            if (!value) return fallback || '';
            if (typeof value === 'string') return value;
            var lang = Util.langCode();
            return value[lang] || value.ru || value.en || fallback || '';
        }

        function pluginEnabled() { return Util.isOn(K.enabled, true); }
        function moduleEnabled() { return pluginEnabled() && Util.isOn(K.topbarEnabled, true); }

        function brandName() {
            var v = Util.clean(Util.get(K.topbarBrand, CFG.brand) || CFG.brand);
            return v || CFG.brand;
        }
        function topbarAlign() {
            var v = String(Util.get(K.topbarAlign, 'start') || 'start');
            return v === 'center' ? 'center' : 'start';
        }

        function normalizeAction(action) {
            var v = String(action || '').trim().toLowerCase();
            if (!v) return '';
            if (v === 'release' || v === 'releases') return 'relise';
            if (v === 'bookmarks') return 'favorite';
            if (v === 'schedule') return 'timetable';
            if (v === 'collections' || v === 'collection') return 'catalog';
            return v;
        }
        function menuItem(action) { return Util.qs('.menu .menu__item.selector[data-action="' + normalizeAction(action) + '"]'); }
        function nativeBack() { return Util.qs('.head__backward'); }

        function trMenuLabel(item) {
            var v = trLampa(item.labelKey, '');
            if (v && v !== item.labelKey) return v;
            return localized(item.fallback, item.action);
        }

        function availableItems() {
            var found = []; var seen = {};
            Util.qsa('.menu .menu__item.selector[data-action]').forEach(function (item) {
                var action = item.getAttribute('data-action');
                if (!action || seen[action] || action === 'search' || action === 'settings') return;
                var labelNode = Util.qs('.menu__text, .menu__item-name, .menu__item-text, .menu__item-title', item);
                var label = Util.clean(labelNode ? labelNode.textContent : item.textContent) || action;
                seen[action] = true; found.push({ action: action, label: label });
            });
            FALLBACK_ITEMS.forEach(function (item) {
                if (seen[item.action]) return;
                seen[item.action] = true; found.push({ action: item.action, label: trMenuLabel(item) });
            });
            return found;
        }

        function storedActions() {
            var v = Util.get(K.topbarItems, null);
            if (v === null || typeof v === 'undefined' || v === 'undefined' || v === 'null') return CFG.defaultNav.slice();
            if (typeof v === 'string') {
                try { v = JSON.parse(v); }
                catch (e) { v = v.split(',').map(function (s) { return Util.clean(s); }).filter(Boolean); }
            }
            return Array.isArray(v) && v.length ? v : CFG.defaultNav.slice();
        }

        function setActionOn(action, on) {
            var order = availableItems().map(function (i) { return i.action; });
            var sel = storedActions().filter(function (a, i, arr) { return a && arr.indexOf(a) === i; });
            if (on && sel.indexOf(action) === -1) sel.push(action);
            if (!on) sel = sel.filter(function (a) { return a !== action; });
            sel.sort(function (a, b) {
                var ai = order.indexOf(a); if (ai === -1) ai = 999;
                var bi = order.indexOf(b); if (bi === -1) bi = 999;
                return ai - bi;
            });
            Util.set(K.topbarItems, sel);
        }

        function selectedItems() {
            var map = {};
            availableItems().forEach(function (i) { map[i.action] = i; });
            return storedActions().map(function (a) { return map[a]; }).filter(Boolean);
        }

        function triggerEvent(node, name) {
            if (!node || !name) return false;
            try { if (window.$) { $(node).trigger(name); return true; } } catch (e) {}
            return false;
        }
        function clickNode(node) {
            if (!node) return false;
            try {
                if (typeof node.click === 'function') node.click();
                else node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                return true;
            } catch (e) {}
            return false;
        }
        function selectorEnter(node) {
            if (!node) return false;
            var ok = false;
            ok = triggerEvent(node, 'hover:focus') || ok;
            ok = triggerEvent(node, 'hover:enter') || ok;
            if (ok) return true;
            return clickNode(node);
        }

        function bindAction(node, handler) {
            if (!node || node.getAttribute('data-akira-bound') === '1') return;
            node.setAttribute('data-akira-bound', '1');
            node.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); handler(); });
            node.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
            });
            try {
                if (window.$) {
                    $(node).on('hover:enter.akira', handler);
                    $(node).on('hover:focus.akira hover:hover.akira', function () { node.classList.add('focus'); });
                    $(node).on('hover:blur.akira hover:out.akira', function () { node.classList.remove('focus'); });
                }
            } catch (e) {}
        }

        function goBack() {
            var n = nativeBack(); if (!n) return false;
            if (clickNode(n)) return true;
            return selectorEnter(n);
        }
        function openAction(action) {
            var normalized = normalizeAction(action);
            var item = menuItem(normalized);
            if (item && selectorEnter(item)) return true;
            try {
                if (!Lampa.Activity || !Lampa.Storage || !Lampa.Lang) return false;
                var source = Lampa.Storage.field('source');
                if (normalized === 'main') {
                    Lampa.Activity.push({ url: '', title: Lampa.Lang.translate('title_main'), component: 'main', source: source });
                    return true;
                }
                if (normalized === 'movie' || normalized === 'tv' || normalized === 'anime') {
                    Lampa.Activity.push({
                        url: normalized,
                        title: (normalized === 'movie' ? Lampa.Lang.translate('menu_movies')
                              : normalized === 'anime' ? Lampa.Lang.translate('menu_anime')
                              : Lampa.Lang.translate('menu_tv')) + ' - ' + String(source || '').toUpperCase(),
                        component: 'category',
                        source: normalized === 'anime' ? 'cub' : source,
                        page: 1
                    });
                    return true;
                }
                if (normalized === 'cartoon') {
                    Lampa.Activity.push({
                        url: 'movie', title: Lampa.Lang.translate('menu_multmovie') + ' - ' + String(source || '').toUpperCase(),
                        component: 'category', genres: 16, page: 1
                    });
                    return true;
                }
            } catch (e) {}
            return false;
        }
        function openSearch() {
            var n = menuItem('search'); if (n && selectorEnter(n)) return true;
            var b = Util.qs('.open--search'); if (b && selectorEnter(b)) return true;
            try { if (Lampa.Search && Lampa.Search.open) { Lampa.Search.open(); return true; } } catch (e) {}
            return false;
        }
        function openSettings() {
            var n = menuItem('settings'); if (n && selectorEnter(n)) return true;
            try { if (Lampa.Settings && Lampa.Settings.create) { Lampa.Settings.create(CFG.component); return true; } } catch (e) {}
            return false;
        }
        function openFavorite() {
            var n = menuItem('favorite'); if (n && selectorEnter(n)) return true;
            try {
                if (Lampa.Activity && Lampa.Lang) {
                    Lampa.Activity.push({ component: 'bookmarks', title: Lampa.Lang.translate('settings_input_links') });
                    return true;
                }
            } catch (e) {}
            return false;
        }

        function iconSearch()   { return '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="2"></circle><path d="M16 16L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>'; }
        function iconSettings() { return '<svg><use xlink:href="#sprite-settings"></use></svg>'; }
        function iconBookmark() { return '<svg viewBox="0 0 24 24" fill="none"><path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V21l-6-3.5L6 21V4.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path></svg>'; }
        function iconBack()     { return '<svg viewBox="0 0 24 24" fill="none"><path d="M15 5 8 12l7 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>'; }

        function updateClock() {
            var c = Util.qs('.akira-topbar__clock'); if (!c) return;
            var d = new Date();
            c.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
        }
        function startClock() { updateClock(); if (!state.clockTimer) state.clockTimer = setInterval(updateClock, 20000); }
        function stopClock()  { if (state.clockTimer) { clearInterval(state.clockTimer); state.clockTimer = null; } }

        function syncBrandWidth(icon) {
            if (!icon) return;
            requestAnimationFrame(function () {
                try {
                    var w = Math.ceil(icon.getBoundingClientRect().width || 0);
                    if (w > 0) document.documentElement.style.setProperty(BRAND_VAR, w + 'px');
                } catch (e) {}
            });
        }

        function patchBrand(head) {
            var icon = Util.qs('.head__menu-icon', head) || Util.qs('.head__menu-icon');
            if (!icon) return;
            if (!icon.getAttribute('data-akira-original-html')) icon.setAttribute('data-akira-original-html', icon.innerHTML || '');
            try { if (window.$) $(icon).off('.akira'); } catch (e) {}
            icon.removeAttribute('data-akira-bound');
            icon.classList.add('akira-head-brand');
            icon.classList.add('selector');
            icon.setAttribute('data-selector', 'true');
            icon.setAttribute('tabindex', '0');
            icon.innerHTML = '<span>' + Util.escapeHtml(brandName()) + '</span>';
            syncBrandWidth(icon);
        }

        function restoreBrand() {
            var icon = Util.qs('.head__menu-icon.akira-head-brand');
            if (!icon) return;
            var orig = icon.getAttribute('data-akira-original-html');
            if (orig !== null) icon.innerHTML = orig;
            icon.classList.remove('akira-head-brand');
            icon.classList.remove('focus');
            icon.removeAttribute('data-akira-original-html');
            icon.removeAttribute('data-akira-bound');
            try { document.documentElement.style.removeProperty(BRAND_VAR); } catch (e) {}
            try { if (window.$) $(icon).off('.akira'); } catch (e) {}
        }

        function patchBar() {
            var old = Util.qs('.akira-topbar');
            if (!moduleEnabled()) { if (old) old.remove(); restoreBrand(); stopClock(); return; }
            var head = Util.qs('.head__body') || Util.qs('.head');
            if (!head) return;
            patchBrand(head);
            var bar = Util.qs('.akira-topbar', head);
            if (!bar) {
                bar = document.createElement('div');
                bar.className = 'akira-topbar';
                bar.innerHTML = '<div class="akira-topbar__inner"><div class="akira-topbar__items"></div><div class="akira-topbar__right"></div></div>';
                head.appendChild(bar);
            }
            var itemsNode = Util.qs('.akira-topbar__items', bar);
            var rightNode = Util.qs('.akira-topbar__right', bar);
            itemsNode.innerHTML = '';
            rightNode.innerHTML = '';

            if (nativeBack()) {
                var back = document.createElement('div');
                back.className = 'akira-topbar__item akira-topbar__icon selector';
                back.setAttribute('data-selector', 'true'); back.setAttribute('tabindex', '0');
                back.innerHTML = iconBack();
                bindAction(back, goBack);
                itemsNode.appendChild(back);
            }

            selectedItems().forEach(function (item) {
                var btn = document.createElement('div');
                btn.className = 'akira-topbar__item selector';
                btn.setAttribute('data-selector', 'true');
                btn.setAttribute('data-action', item.action);
                btn.setAttribute('tabindex', '0');
                btn.textContent = item.label;
                bindAction(btn, function () { openAction(item.action); });
                itemsNode.appendChild(btn);
            });

            [
                { role: 'search',   icon: iconSearch(),   handler: openSearch },
                { role: 'favorite', icon: iconBookmark(), handler: openFavorite },
                { role: 'settings', icon: iconSettings(), handler: openSettings }
            ].forEach(function (item) {
                var btn = document.createElement('div');
                btn.className = 'akira-topbar__item akira-topbar__icon selector';
                btn.setAttribute('data-selector', 'true');
                btn.setAttribute('data-role', item.role);
                btn.setAttribute('tabindex', '0');
                btn.innerHTML = item.icon;
                bindAction(btn, item.handler);
                rightNode.appendChild(btn);
            });

            var clock = document.createElement('div');
            clock.className = 'akira-topbar__clock selector';
            clock.setAttribute('data-selector', 'true');
            clock.setAttribute('tabindex', '0');
            bindAction(clock, openSettings);
            rightNode.appendChild(clock);
            startClock();

            Util.qsa('.akira-topbar__item[data-action]', bar).forEach(function (btn) {
                var n = menuItem(btn.getAttribute('data-action'));
                btn.classList.remove('is-active');
                if (n && (n.classList.contains('active') || n.classList.contains('focus') || n.classList.contains('hover'))) {
                    btn.classList.add('is-active');
                }
            });
        }

        function injectStyle() {
            var accent = Util.get(K.themeAccent, '#e50914') || '#e50914';
            var rgb = Util.hexToRgb(accent);
            var panel = 'rgba(14,14,16,.78)';
            var edge = 'rgba(255,255,255,.12)';
            var soft = 'rgba(' + rgb + ',.20)';

            var style = document.getElementById(CFG.topbarStyleId) || document.createElement('style');
            style.id = CFG.topbarStyleId;
            var bc = CFG.bodyClass;
            var css = [
                'body.' + bc + '[' + ATTR_ON + '="on"] .head, body.' + bc + '[' + ATTR_ON + '="on"] .head__body, body.' + bc + '[' + ATTR_ON + '="on"] .head__wrapper { background: transparent !important; box-shadow: none !important; overflow: visible !important; }',
                'body.' + bc + '[' + ATTR_ON + '="on"] .head__title, body.' + bc + '[' + ATTR_ON + '="on"] .head__time, body.' + bc + '[' + ATTR_ON + '="on"] .head__split, body.' + bc + '[' + ATTR_ON + '="on"] .head__logo, body.' + bc + '[' + ATTR_ON + '="on"] .open--search, body.' + bc + '[' + ATTR_ON + '="on"] .head__settings { display: none !important; }',
                'body.' + bc + '[' + ATTR_ON + '="on"] .head__body { position: relative !important; z-index: 48 !important; min-height: 0 !important; height: 0 !important; padding: 0 !important; overflow: visible !important; }',
                'body.' + bc + '[' + ATTR_ON + '="on"] .head__history, body.' + bc + '[' + ATTR_ON + '="on"] .head__source, body.' + bc + '[' + ATTR_ON + '="on"] .head__markers, body.' + bc + '[' + ATTR_ON + '="on"] .head__backward, body.' + bc + '[' + ATTR_ON + '="on"] .settings-icon-holder, body.' + bc + '[' + ATTR_ON + '="on"] .head__action, body.' + bc + '[' + ATTR_ON + '="on"] .head__button { display: none !important; }',
                'body.' + bc + ' .head__menu-icon.akira-head-brand { position: absolute !important; left: 1.05em !important; top: .54em !important; z-index: 50 !important; width: auto !important; max-width: min(30vw, 22em) !important; min-width: 4.4em !important; height: 2.62em !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; padding: 0 .95em !important; margin: 0 !important; border-radius: 8px !important; background: linear-gradient(92deg, ' + accent + ', rgba(' + rgb + ',.78)) !important; color: #fff !important; border: 1px solid rgba(255,255,255,.12) !important; box-shadow: 0 10px 28px ' + soft + ' !important; transform: none !important; overflow: hidden !important; }',
                'body.' + bc + ' .head__menu-icon.akira-head-brand span { display: block !important; max-width: 100% !important; overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important; font-size: .88em !important; line-height: 1 !important; font-weight: 900 !important; color: inherit !important; }',
                'body.' + bc + ' .head__menu-icon.akira-head-brand.focus, body.' + bc + ' .head__menu-icon.akira-head-brand.hover { box-shadow: 0 0 0 2px rgba(255,255,255,.18), 0 12px 30px ' + soft + ' !important; transform: translateY(-1px) !important; }',
                'body.' + bc + ' .akira-topbar { position: absolute; left: calc(var(' + BRAND_VAR + ', 5.2em) + 1.55em) !important; top: .54em !important; right: 1.05em !important; z-index: 49 !important; pointer-events: none; }',
                'body.' + bc + ' .akira-topbar__inner { height: 2.8em; display: flex; align-items: center; gap: .34em !important; pointer-events: auto; }',
                'body.' + bc + ' .akira-topbar__items, body.' + bc + ' .akira-topbar__right { display: inline-flex; align-items: center; gap: .18em; height: 2.62em; padding: .18em; border-radius: 8px; background: ' + panel + '; border: 1px solid ' + edge + '; backdrop-filter: blur(18px) saturate(130%); -webkit-backdrop-filter: blur(18px) saturate(130%); box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 10px 26px rgba(0,0,0,.22); }',
                'body.' + bc + ' .akira-topbar__items { max-width: calc(100vw - var(' + BRAND_VAR + ', 5.2em) - 17em) !important; overflow: hidden !important; }',
                'body.' + bc + ' .akira-topbar__right { margin-left: auto; }',
                'body.' + bc + ' .akira-topbar__item { height: 2.18em; min-width: 2.18em; display: inline-flex; align-items: center; justify-content: center; padding: 0 .88em; border-radius: 7px; color: rgba(255,255,255,.9); font-size: .84em; font-weight: 700; white-space: nowrap; transition: background .18s ease, transform .18s ease, color .18s ease; }',
                'body.' + bc + ' .akira-topbar__icon { width: 2.18em; padding: 0; }',
                'body.' + bc + ' .akira-topbar__icon svg { width: 1.08em; height: 1.08em; }',
                'body.' + bc + ' .akira-topbar__clock { height: 2.18em; min-width: 4.1em; display: inline-flex; align-items: center; justify-content: center; padding: 0 .72em; border-radius: 7px; color: rgba(255,255,255,.9); font-size: .84em; font-weight: 800; }',
                'body.' + bc + ' .akira-topbar__item.focus, body.' + bc + ' .akira-topbar__item.hover, body.' + bc + ' .akira-topbar__item.is-active, body.' + bc + ' .akira-topbar__clock.focus, body.' + bc + ' .akira-topbar__clock.hover { background: rgba(' + rgb + ',.85); color: #fff; transform: translateY(-1px); }',
                'body.' + bc + '[' + ATTR_ALIGN + '="center"] .akira-topbar { left: 0 !important; right: 0 !important; pointer-events: none !important; }',
                'body.' + bc + '[' + ATTR_ALIGN + '="center"] .akira-topbar__inner { position: relative !important; width: 100% !important; justify-content: center !important; pointer-events: none !important; }',
                'body.' + bc + '[' + ATTR_ALIGN + '="center"] .akira-topbar__items { position: absolute !important; left: 50% !important; top: 0 !important; transform: translateX(-50%) !important; max-width: calc(100vw - 23em) !important; pointer-events: auto !important; }',
                'body.' + bc + '[' + ATTR_ALIGN + '="center"] .akira-topbar__right { position: absolute !important; right: 1.05em !important; top: 0 !important; margin-left: 0 !important; pointer-events: auto !important; }',
                '@media (max-width: 900px) { body.' + bc + ' .akira-topbar { left: .75em !important; right: .75em !important; top: 3.65em !important; } body.' + bc + ' .akira-topbar__items { display: none !important; } body.' + bc + ' .akira-topbar__right { margin-left: auto !important; } body.' + bc + ' .head__menu-icon.akira-head-brand { left: .75em !important; top: .55em !important; } }',
                '@media (max-width: 560px) { body.' + bc + ' .akira-topbar { left: .65em !important; right: .65em !important; } body.' + bc + ' .head__menu-icon.akira-head-brand { max-width: min(42vw, 15em) !important; } }'
            ].join('\n');
            if (style.textContent !== css) style.textContent = css;
            if (!style.parentNode) (document.head || document.body).appendChild(style);
        }

        function syncBody() {
            if (!document.body) return;
            if (!pluginEnabled()) {
                document.body.classList.remove(CFG.bodyClass);
                document.body.removeAttribute(ATTR_ON);
                document.body.removeAttribute(ATTR_ALIGN);
                return;
            }
            document.body.classList.add(CFG.bodyClass);
            document.body.setAttribute(ATTR_ON, moduleEnabled() ? 'on' : 'off');
            document.body.setAttribute(ATTR_ALIGN, topbarAlign());
        }

        function removeUi() {
            var style = document.getElementById(CFG.topbarStyleId);
            if (style) style.remove();
            if (document.body) {
                document.body.removeAttribute(ATTR_ON);
                document.body.removeAttribute(ATTR_ALIGN);
            }
            try { document.documentElement.style.removeProperty(BRAND_VAR); } catch (e) {}
            var bar = Util.qs('.akira-topbar'); if (bar) bar.remove();
            restoreBrand();
            stopClock();
        }

        function safePatch() {
            state.scheduled = false;
            if (!moduleEnabled()) { removeUi(); return; }
            injectStyle();
            syncBody();
            patchBar();
        }
        function schedule(now) {
            if (state.scheduled && !now) return;
            state.scheduled = true;
            setTimeout(safePatch, now ? 10 : 120);
        }

        function observeDom() {
            if (state.domObserver || !window.MutationObserver || !document.body) return;
            var pending = false;
            state.domObserver = new MutationObserver(function (mutations) {
                if (!moduleEnabled()) return;
                var should = false;
                for (var i = 0; i < mutations.length && !should; i++) {
                    for (var j = 0; j < mutations[i].addedNodes.length; j++) {
                        var n = mutations[i].addedNodes[j];
                        if (!n || n.nodeType !== 1) continue;
                        if ((n.classList && (n.classList.contains('head__body') || n.classList.contains('head__backward') || n.classList.contains('menu__item'))) ||
                            (n.querySelector && n.querySelector('.head__body, .head__backward, .menu__item'))) {
                            should = true; break;
                        }
                    }
                }
                if (!should || pending) return;
                pending = true;
                setTimeout(function () { pending = false; schedule(); }, 90);
            });
            state.domObserver.observe(document.body, { childList: true, subtree: true });
        }

        function bindListeners() {
            if (state.listenersBound) return;
            state.listenersBound = true;
            try {
                if (Lampa.Listener && Lampa.Listener.follow) {
                    Lampa.Listener.follow('activity', function (e) {
                        if (e.type === 'start' || e.type === 'activity') schedule();
                    });
                    Lampa.Listener.follow('full', function () { schedule(); });
                }
            } catch (e) {}
            try {
                if (Lampa.Storage && Lampa.Storage.listener && Lampa.Storage.listener.follow) {
                    Lampa.Storage.listener.follow('change', function (e) {
                        if (!e || !e.name || e.name.indexOf(CFG.prefix) !== 0) return;
                        if ((e.name === K.enabled || e.name === K.topbarEnabled) && !moduleEnabled()) {
                            removeUi(); return;
                        }
                        schedule(true);
                    });
                }
            } catch (e) {}
            window.addEventListener('resize', function () { schedule(true); });
            window.addEventListener('orientationchange', function () { schedule(true); });
        }

        return {
            start: function () {
                bindListeners();
                if (!moduleEnabled()) { removeUi(); return; }
                injectStyle();
                syncBody();
                observeDom();
                schedule(true);
            },
            availableItems: availableItems,
            storedActions: storedActions,
            setActionOn: setActionOn,
            schedule: schedule
        };
    })();

    /* ================================================================
     * 6. LOGO ENGINE — двойной fallback с общим кешем
     *
     * Используется одновременно для:
     *  - hero-карточки на главной (interface)
     *  - маленьких карточек в горизонтальных рядах
     *  - детальной карточки фильма (full)
     *
     * Стратегия:
     *  1) METHOD A — широкий запрос images?include_image_language=lang,en,null,
     *     умный pick: PNG > SVG, сначала точный язык, потом ru (для uk/ua),
     *     затем en, затем любой первый.
     *  2) Если ничего не нашлось — METHOD B — узкий запрос
     *     images?language=lang (другой режим TMDB API, иногда возвращает
     *     дополнительные постеры/логотипы).
     *  3) Если оба пусты — кешируем 'none' и возвращаем null,
     *     потребитель показывает текстовый заголовок.
     *
     * Кеш — общий для всех трёх потребителей: один ключ
     * akira_logo_v2_<type>_<id>_<lang>.
     * Уровень 1 — sessionStorage (быстро), уровень 2 — localStorage
     * (переживёт перезагрузку), плюс in-memory map для мгновенных хитов.
     * ================================================================ */

    var Logos = (function () {
        var memCache = {};
        var pending = {};

        function pluginEnabled() { return Util.isOn(K.enabled, true); }
        function moduleEnabled() { return pluginEnabled() && Util.isOn(K.logosEnabled, true); }

        function lang() {
            var manual = String(Util.get(K.logoLang, 'auto') || 'auto');
            if (manual && manual !== 'auto' && manual !== '') return manual;
            try {
                var l = String(Lampa.Storage.get('language', 'en') || 'en').split('-')[0];
                return l || 'en';
            } catch (e) { return 'en'; }
        }

        function size() {
            return String(Util.get(K.logoSize, 'original') || 'original');
        }

        function cacheKey(type, id, lng) {
            return CFG.logoCachePrefix + type + '_' + id + '_' + lng;
        }

        function getCached(key) {
            if (key in memCache) return memCache[key];
            try {
                var s = sessionStorage.getItem(key);
                if (s !== null && typeof s !== 'undefined') { memCache[key] = s; return s; }
            } catch (e) {}
            try {
                var l = localStorage.getItem(key);
                if (l !== null && typeof l !== 'undefined') { memCache[key] = l; return l; }
            } catch (e) {}
            return null;
        }

        function setCached(key, value) {
            var v = value || 'none';
            memCache[key] = v;
            try { sessionStorage.setItem(key, v); } catch (e) {}
            try { localStorage.setItem(key, v); } catch (e) {}
        }

        function clearCache() {
            memCache = {};
            try {
                var rmS = [];
                for (var i = 0; i < sessionStorage.length; i++) {
                    var k = sessionStorage.key(i);
                    if (k && k.indexOf(CFG.logoCachePrefix) === 0) rmS.push(k);
                }
                rmS.forEach(function (k) { sessionStorage.removeItem(k); });
            } catch (e) {}
            try {
                var rm = [];
                for (var j = 0; j < localStorage.length; j++) {
                    var k2 = localStorage.key(j);
                    if (k2 && k2.indexOf(CFG.logoCachePrefix) === 0) rm.push(k2);
                }
                rm.forEach(function (k) { localStorage.removeItem(k); });
            } catch (e) {}
        }

        /* Способ interface_horizontal: точный язык > en > любой первый. */
        function pickInterface(logos, targetLang) {
            if (!logos || !logos.length) return null;
            for (var i = 0; i < logos.length; i++) {
                if (logos[i].iso_639_1 === targetLang && logos[i].file_path) return logos[i].file_path;
            }
            for (var j = 0; j < logos.length; j++) {
                if (logos[j].iso_639_1 === 'en' && logos[j].file_path) return logos[j].file_path;
            }
            return logos[0] && logos[0].file_path ? logos[0].file_path : null;
        }

        /* Способ netflix_premium_style: PNG > SVG, точный язык > ru (для uk/ua) > en > любой. */
        function pickBest(logos, targetLang) {
            if (!logos || !logos.length) return null;
            var sorted = logos.slice().sort(function (a, b) {
                var aS = (a.file_path || '').toLowerCase().indexOf('.svg') >= 0;
                var bS = (b.file_path || '').toLowerCase().indexOf('.svg') >= 0;
                return aS === bS ? 0 : (aS ? 1 : -1);
            });
            for (var i = 0; i < sorted.length; i++) {
                if (sorted[i].iso_639_1 === targetLang && sorted[i].file_path) return sorted[i].file_path;
            }
            if (targetLang === 'uk' || targetLang === 'ua') {
                for (var r = 0; r < sorted.length; r++) {
                    if (sorted[r].iso_639_1 === 'ru' && sorted[r].file_path) return sorted[r].file_path;
                }
            }
            for (var j = 0; j < sorted.length; j++) {
                if (sorted[j].iso_639_1 === 'en' && sorted[j].file_path) return sorted[j].file_path;
            }
            return sorted[0] && sorted[0].file_path ? sorted[0].file_path : null;
        }

        function buildUrl(filePath) {
            if (!filePath) return null;
            var sz = size();
            var normalized = String(filePath).replace('.svg', '.png');
            try { return Lampa.TMDB.image('/t/p/' + sz + normalized); }
            catch (e) { return null; }
        }

        function flushPending(key, value) {
            var list = pending[key] || [];
            delete pending[key];
            list.forEach(function (cb) { try { cb(value); } catch (e) {} });
        }

        function methodA(item, type, lng, key, done) {
            var url;
            try { url = Lampa.TMDB.api(type + '/' + item.id + '/images?api_key=' + Lampa.TMDB.key() + '&include_image_language=' + lng + ',ru,en,null'); }
            catch (e) { return done(null); }
            try {
                $.get(url, function (res) {
                    var path = res ? pickBest(res.logos, lng) : null;
                    done(buildUrl(path));
                }).fail(function () { done(null); });
            } catch (e) { done(null); }
        }

        function methodB(item, type, lng, key, done) {
            var url;
            try { url = Lampa.TMDB.api(type + '/' + item.id + '/images?api_key=' + Lampa.TMDB.key() + '&include_image_language=' + lng + ',en,null'); }
            catch (e) { return done(null); }
            try {
                $.get(url, function (res) {
                    var path = res ? pickInterface(res.logos, lng) : null;
                    done(buildUrl(path));
                }).fail(function () { done(null); });
            } catch (e) { done(null); }
        }

        /* Главная точка входа — вызывают все 3 потребителя. */
        function resolve(item, cb) {
            cb = cb || function () {};
            try {
                if (!moduleEnabled()) return cb(null);
                if (!item || !item.id) return cb(null);
                var source = item.source || 'tmdb';
                if (source !== 'tmdb' && source !== 'cub' && source !== 'akira_tmdb') return cb(null);
                if (!Lampa.TMDB || typeof Lampa.TMDB.api !== 'function' || typeof Lampa.TMDB.key !== 'function') return cb(null);

                var type = (item.media_type === 'tv' || item.name) ? 'tv' : 'movie';
                var lng = lang();
                var key = cacheKey(type, item.id, lng);

                var cached = getCached(key);
                if (cached === 'none') return cb(null);
                if (cached) return cb(cached);

                if (pending[key]) { pending[key].push(cb); return; }
                pending[key] = [cb];

                methodA(item, type, lng, key, function (urlA) {
                    if (urlA) {
                        setCached(key, urlA);
                        return flushPending(key, urlA);
                    }
                    methodB(item, type, lng, key, function (urlB) {
                        if (urlB) {
                            setCached(key, urlB);
                            return flushPending(key, urlB);
                        }
                        setCached(key, 'none');
                        flushPending(key, null);
                    });
                });
            } catch (e) { cb(null); }
        }

        function preload(item) { resolve(item, function () {}); }

        function setImageSizing(img) {
            if (!img) return;
            img.style.height = '';
            img.style.width = '';
            img.style.maxHeight = '';
            img.style.maxWidth = '';
            img.style.objectFit = 'contain';
            img.style.objectPosition = 'left bottom';
        }

        function swapContent(container, newNode) {
            if (!container) return;
            container.style.transition = 'opacity 0.3s ease';
            container.style.opacity = '0';
            setTimeout(function () {
                container.innerHTML = '';
                if (typeof newNode === 'string') container.textContent = newNode;
                else container.appendChild(newNode);
                container.style.transition = 'opacity 0.4s ease';
                container.style.opacity = '1';
            }, 150);
        }

        /* Применить логотип к hero-блоку. */
        function applyToInfo(ctx, item, titleText) {
            if (!ctx || !ctx.title || !item) return;
            var titleEl = ctx.title[0] || ctx.title;
            if (!titleEl) return;

            var requestId = (titleEl.__akira_logo_req || 0) + 1;
            titleEl.__akira_logo_req = requestId;

            if (titleEl.textContent !== titleText) titleEl.textContent = titleText;
            if (!moduleEnabled()) return;

            resolve(item, function (url) {
                if (titleEl.__akira_logo_req !== requestId) return;
                if (!titleEl.isConnected) return;
                if (!url) {
                    if (titleEl.querySelector && titleEl.querySelector('img')) swapContent(titleEl, titleText);
                    else titleEl.textContent = titleText;
                    return;
                }
                var img = new Image();
                img.className = 'akira-info-logo';
                img.alt = titleText;
                img.src = url;
                setImageSizing(img);
                swapContent(titleEl, img);
            });
        }

        /* Применить логотип к маленькой карточке в горизонтальном ряду. */
        function applyToCard(card) {
            if (!card || !card.data || typeof card.render !== 'function') return;
            if (!Util.isOn(K.ifaceCardLogos, true)) return;

            var jq = card.render(true);
            var root = (jq && jq[0]) ? jq[0] : jq;
            if (!root) return;
            var view = root.querySelector ? (root.querySelector('.card__view') || root) : root;
            var label = root.querySelector ? root.querySelector('.akira-card-title, .new-interface-card-title') : null;
            var titleText = ((card.data.title || card.data.name || card.data.original_title || card.data.original_name || '') + '').trim();

            var reqId = (card.__akira_logo_req || 0) + 1;
            card.__akira_logo_req = reqId;

            function removeLogo() {
                var ex = view.querySelector('.akira-card-logo');
                if (ex && ex.parentNode) ex.parentNode.removeChild(ex);
                if (label) label.style.display = '';
            }

            if (!moduleEnabled()) { removeLogo(); return; }

            var wrap = view.querySelector('.akira-card-logo');
            if (!wrap) {
                wrap = document.createElement('div');
                wrap.className = 'akira-card-logo';
                view.appendChild(wrap);
            }

            resolve(card.data, function (url) {
                if (card.__akira_logo_req !== reqId) return;
                if (!root.isConnected) return;
                if (!url) { removeLogo(); return; }
                var img = new Image();
                img.alt = titleText;
                img.src = url;
                setImageSizing(img);
                wrap.innerHTML = '';
                wrap.appendChild(img);
                if (label) label.style.display = 'none';
            });
        }

        function cleanupCard(card) {
            try {
                if (!card || typeof card.render !== 'function') return;
                var jq = card.render(true);
                var root = (jq && jq[0]) ? jq[0] : jq;
                if (root) {
                    var w = root.querySelector('.akira-card-logo');
                    if (w && w.parentNode) w.parentNode.removeChild(w);
                }
                delete card.__akira_logo_req;
            } catch (e) {}
        }

        /* Применить логотип к деталке фильма. */
        function applyToFull(activity, item) {
            try {
                if (!moduleEnabled()) return;
                if (!activity || typeof activity.render !== 'function' || !item) return;
                var container = activity.render();
                if (!container || typeof container.find !== 'function') return;
                var titleNode = container.find('.full-start-new__title, .full-start__title');
                if (!titleNode || !titleNode.length) return;
                var titleEl = titleNode[0];
                var titleText = ((item.title || item.name || item.original_title || item.original_name || '') + '').trim() || (titleNode.text() + '');

                if (!titleEl.__akira_full_orig) titleEl.__akira_full_orig = titleText;
                var originalText = titleEl.__akira_full_orig || titleText;

                if (titleNode.text() !== originalText) titleNode.text(originalText);

                var requestId = (titleEl.__akira_logo_req || 0) + 1;
                titleEl.__akira_logo_req = requestId;

                resolve(item, function (url) {
                    if (titleEl.__akira_logo_req !== requestId) return;
                    if (!titleEl.isConnected) return;
                    if (!url) {
                        if (titleEl.querySelector && titleEl.querySelector('img.akira-full-logo')) swapContent(titleEl, originalText);
                        else if (titleNode.text() !== originalText) titleNode.text(originalText);
                        return;
                    }
                    var img = new Image();
                    img.className = 'akira-full-logo';
                    img.alt = originalText;
                    img.src = url;
                    setImageSizing(img);
                    swapContent(titleEl, img);
                });
            } catch (e) {}
        }

        function injectStyle() {
            var id = 'akira-logos-style';
            var style = document.getElementById(id) || document.createElement('style');
            style.id = id;
            var css = [
                ':root{--akira-logo-max-h: clamp(3.6em, 11vh, 7.2em); --akira-card-logo-h: clamp(2.2em, 6vh, 3.8em);}',
                '.akira-card-logo{position:absolute;left:0;right:0;bottom:0;padding:.35em .45em;box-sizing:border-box;pointer-events:none;background:linear-gradient(to top,rgba(0,0,0,.78),rgba(0,0,0,0));}',
                '.akira-card-logo img{display:block;max-width:100%;max-height:var(--akira-card-logo-h);width:auto;height:auto;object-fit:contain;object-position:left bottom;}',
                '.akira-info-logo{display:block;max-width:100%;max-height:var(--akira-logo-max-h);width:auto;height:auto;object-fit:contain;object-position:left bottom;}',
                '.full-start-new__title img.akira-full-logo, .full-start__title img.akira-full-logo{display:block;max-width:100%;max-height:var(--akira-logo-max-h);width:auto;height:auto;object-fit:contain;object-position:left bottom;margin-top:.25em;filter:drop-shadow(0 4px 20px rgba(0,0,0,.85));}'
            ].join('\n');
            if (style.textContent !== css) style.textContent = css;
            if (!style.parentNode) (document.head || document.body).appendChild(style);
        }

        function bindFullHook() {
            if (window.__akira_full_logo_hooked) return;
            window.__akira_full_logo_hooked = true;
            try {
                if (!Lampa.Listener || typeof Lampa.Listener.follow !== 'function') return;
                Lampa.Listener.follow('full', function (e) {
                    try {
                        if (!e || e.type !== 'complite') return;
                        if (!e.object || !e.object.activity) return;
                        var data = (e.data && (e.data.movie || e.data)) ? (e.data.movie || e.data) : null;
                        if (!data) return;
                        applyToFull(e.object.activity, data);
                    } catch (err) {}
                });
            } catch (e) {}
        }

        return {
            start: function () { injectStyle(); bindFullHook(); },
            applyToInfo: applyToInfo,
            applyToCard: applyToCard,
            applyToFull: applyToFull,
            cleanupCard: cleanupCard,
            preload: preload,
            resolve: resolve,
            clearCache: clearCache,
            enabled: moduleEnabled
        };
    })();

    /* ================================================================
     * 7. INTERFACE — большая карточка вверху главной + горизонтальные
     *    ряды постеров. Принцип взят из interface_horizontal:
     *      - для свежих Lampa (app_digital >= 300) подвешиваемся к
     *        Lampa.Maker.map('Main') хукам;
     *      - для старых — делаем минимальный fallback.
     *    Логотипы в hero/карточках берёт модуль Logos.
     * ================================================================ */

    var Interface = (function () {
        var started = false;

        function pluginEnabled() { return Util.isOn(K.enabled, true); }
        function moduleEnabled() { return pluginEnabled() && Util.isOn(K.ifaceEnabled, true); }

        function injectStyle() {
            if (document.getElementById(CFG.interfaceStyleId)) return;
            var style = document.createElement('style');
            style.id = CFG.interfaceStyleId;
            style.textContent = [
                ':root{--ni-info-h: 24em;}',
                '.akira-iface{position:relative;}',
                '.akira-iface .card.card--wide, .akira-iface .card--small.card--wide{width:18.3em;}',
                '.akira-iface .card-more__box, .akira-iface .card.card--wide + .card-more .card-more__box, .akira-iface .card--small.card--wide + .card-more .card-more__box{padding-bottom:95%;}',
                '.akira-info{position:relative;padding:1.5em;height:var(--ni-info-h);overflow:hidden;z-index:3;}',
                '.akira-info:before{display:none !important;}',
                '.akira-info__body{position:relative;z-index:1;width:min(96%,78em);padding-top:1.1em;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.85fr);column-gap:clamp(16px,3vw,54px);align-items:stretch;height:100%;box-sizing:border-box;}',
                '.akira-info__left,.akira-info__right{min-width:0;height:100%;}',
                '.akira-info__textblock{margin-top:auto;display:flex;flex-direction:column;gap:.55em;min-height:0;}',
                '.akira-info__right{padding-top:clamp(.2em,2.2vh,1.6em);padding-bottom:clamp(.8em,2.4vh,2em);display:flex;flex-direction:column;}',
                '.akira-info__head{color:rgba(255,255,255,.6);margin-bottom:1em;font-size:1.3em;min-height:1em;}',
                '.akira-info__head span{color:#fff;}',
                '.akira-info__title{font-size:clamp(2.6em,4vw,3.6em);font-weight:600;margin-bottom:.3em;overflow:hidden;text-overflow:".";display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;line-height:1.25;margin-left:-.03em;}',
                '.akira-info__meta{margin-bottom:0;display:flex;flex-direction:column;gap:.35em;min-height:1em;}',
                '.akira-info__meta-top{display:flex;align-items:center;gap:.75em;flex-wrap:nowrap;min-height:1.9em;min-width:0;}',
                '.akira-info__rate{flex:0 0 auto;}',
                '.akira-info__genres{flex:1 1 auto;min-width:0;font-size:1.1em;line-height:1.25;overflow:hidden;text-overflow:".";display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;}',
                '.akira-info__runtime{flex:0 0 auto;font-size:1.05em;white-space:nowrap;}',
                '.akira-info__dot{flex:0 0 auto;font-size:.85em;opacity:.75;}',
                '.akira-info__pg{flex:0 0 auto;white-space:nowrap;}',
                '.akira-info__pg .full-start__pg{font-size:.95em;}',
                '.akira-info__description{font-size:.87em;font-weight:300;line-height:1.38;color:rgba(255,255,255,.9);text-shadow:0 2px 12px rgba(0,0,0,.45);overflow:hidden;text-overflow:".";display:-webkit-box;-webkit-line-clamp:7;-webkit-box-orient:vertical;width:auto;}',
                '.akira-iface .full-start__background{height:108%;top:-6em;}',
                '.akira-iface .full-start__rate{font-size:1.3em;margin-right:0;}',
                '.akira-iface .full-start__lines{padding-bottom:env(safe-area-inset-bottom,0px);}',
                '.akira-iface .card__promo{display:none;}',
                '.akira-iface .card .card-watched{display:none !important;}',
                '.akira-iface .card{position:relative !important;transition:transform .25s ease,z-index .25s ease !important;transform-origin:center center !important;}',
                '.akira-iface .card.focus,.akira-iface .card.hover,.akira-iface .card:hover{z-index:40 !important;transform:scale(1.08) !important;}',
                '.akira-iface .card .card__view{position:relative;overflow:visible !important;border-radius:8px !important;}',
                '.akira-iface .card .card__view::after{content:"";position:absolute;inset:-3px;border:3px solid transparent;border-radius:10px;pointer-events:none;box-shadow:none;transition:border-color .2s ease,box-shadow .2s ease;}',
                '.akira-iface .card.focus .card__view::after,.akira-iface .card.hover .card__view::after,.akira-iface .card:hover .card__view::after{border-color:var(--akira-accent,#e50914);box-shadow:0 0 0 3px rgba(229,9,20,.24),0 0 24px rgba(229,9,20,.45);}',
                '.akira-iface .akira-card-type,.akira-iface .akira-card-rating,.akira-iface .akira-card-quality{position:absolute;z-index:22;pointer-events:none;font-family:var(--akira-font,Arial,sans-serif);font-weight:800;line-height:1.25;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.55);box-shadow:0 2px 10px rgba(0,0,0,.42);}',
                '.akira-iface .akira-card-type{left:6px;top:6px;padding:.32em .55em;border-radius:6px 0 6px 0;background:rgba(229,9,20,.86);font-size:.68em;letter-spacing:0;text-transform:uppercase;}',
                '.akira-iface .card__quality,.akira-iface .akira-card-quality{display:block !important;left:6px !important;right:auto !important;bottom:6px !important;top:auto !important;padding:2px 8px !important;border-radius:4px !important;background:rgba(46,204,113,.88) !important;color:#fff !important;font-size:.7em !important;font-weight:800 !important;text-transform:uppercase !important;letter-spacing:0 !important;}',
                '.akira-iface .card__vote,.akira-iface .akira-card-rating{display:block !important;right:6px !important;left:auto !important;bottom:6px !important;top:auto !important;padding:2px 8px !important;border-radius:10px 0 10px 0 !important;background:rgba(20,20,24,.72) !important;color:#fff !important;font-size:.75em !important;font-weight:900 !important;}',
                '.akira-card-title{margin-top:.6em;font-size:1.05em;font-weight:500;color:#fff;display:block;text-align:center;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;pointer-events:none;}',
                'body.light--version .akira-card-title{color:#111;}',
                '.akira-iface-h{--ni-line-head-shift:-2vh;--ni-line-body-shift:-3vh;}',
                '.akira-iface-h .items-line__head{position:relative;top:var(--ni-line-head-shift);z-index:2;}',
                '.akira-iface-h .items-line__body > .scroll.scroll--horizontal{position:relative;top:var(--ni-line-body-shift);z-index:1;}',
                '@media (max-height:820px){.akira-info__right{padding-top:clamp(.15em,1.8vh,1.2em);}.akira-info__title{font-size:clamp(2.4em,3.6vw,3.1em);}.akira-info__description{-webkit-line-clamp:6;font-size:.83em;}}'
            ].join('\n');
            (document.head || document.body).appendChild(style);
        }

        function shouldUse(object) {
            if (!object) return false;
            if (!moduleEnabled()) return false;
            if (object.source === 'other' && !object.backdrop_path) return false;
            if (window.innerWidth < 767) return false;
            return true;
        }

        function buildInfoHtml() {
            return ''
                + '<div class="akira-info">'
                +   '<div class="akira-info__body">'
                +     '<div class="akira-info__left">'
                +       '<div class="akira-info__head"></div>'
                +       '<div class="akira-info__title"></div>'
                +     '</div>'
                +     '<div class="akira-info__right">'
                +       '<div class="akira-info__textblock">'
                +         '<div class="akira-info__meta">'
                +           '<div class="akira-info__meta-top">'
                +             '<div class="akira-info__rate"></div>'
                +             '<span class="akira-info__dot dot-rate-genre">&#9679;</span>'
                +             '<div class="akira-info__genres"></div>'
                +             '<span class="akira-info__dot dot-genre-runtime">&#9679;</span>'
                +             '<div class="akira-info__runtime"></div>'
                +             '<span class="akira-info__dot dot-runtime-pg">&#9679;</span>'
                +             '<div class="akira-info__pg"></div>'
                +           '</div>'
                +         '</div>'
                +         '<div class="akira-info__description"></div>'
                +       '</div>'
                +     '</div>'
                +   '</div>'
                + '</div>';
        }

        function InfoBlock() {
            this.html = null;
            this.timer = null;
            this.network = new Lampa.Reguest();
            this.loaded = {};
            this.currentUrl = null;
        }
        InfoBlock.prototype.create = function () { if (this.html) return; this.html = $(buildInfoHtml()); };
        InfoBlock.prototype.render = function (js) { if (!this.html) this.create(); return js ? this.html[0] : this.html; };
        InfoBlock.prototype.update = function (data) {
            if (!data) return;
            if (!this.html) this.create();
            this.html.find('.akira-info__head,.akira-info__genres,.akira-info__runtime').text('---');
            this.html.find('.akira-info__rate').empty();
            this.html.find('.akira-info__pg').empty();
            this.html.find('.akira-info__title').text(data.title || data.name || '');
            this.html.find('.akira-info__description').text(data.overview || (Lampa.Lang ? Lampa.Lang.translate('full_notext') : ''));
            try { Lampa.Background.change(Lampa.Utils.cardImgBackground(data)); } catch (e) {}
            this.load(data);
        };
        InfoBlock.prototype.load = function (data, options) {
            if (!data || !data.id) return;
            var source = data.source || 'tmdb';
            if (source !== 'tmdb' && source !== 'cub' && source !== 'akira_tmdb') return;
            if (!Lampa.TMDB || typeof Lampa.TMDB.api !== 'function' || typeof Lampa.TMDB.key !== 'function') return;
            var preload = options && options.preload;
            var type = (data.media_type === 'tv' || data.name) ? 'tv' : 'movie';
            var language;
            try { language = Lampa.Storage.get('language'); } catch (e) { language = 'en'; }
            var url = Lampa.TMDB.api(type + '/' + data.id + '?api_key=' + Lampa.TMDB.key() + '&append_to_response=content_ratings,release_dates&language=' + language);
            this.currentUrl = url;
            var self = this;
            if (this.loaded[url]) { if (!preload) this.draw(this.loaded[url]); return; }
            clearTimeout(this.timer);
            this.timer = setTimeout(function () {
                self.network.clear();
                self.network.timeout(5000);
                self.network.silent(url, function (movie) {
                    self.loaded[url] = movie;
                    if (!preload && self.currentUrl === url) self.draw(movie);
                });
            }, 0);
        };
        InfoBlock.prototype.draw = function (movie) {
            if (!movie || !this.html) return;
            var html = this.html;
            var create = ((movie.release_date || movie.first_air_date || '0000') + '').slice(0, 4);
            var vote = parseFloat((movie.vote_average || 0) + '').toFixed(1);
            var head = [];
            var sources = (Lampa.Api && Lampa.Api.sources && Lampa.Api.sources.tmdb) ? Lampa.Api.sources.tmdb : null;
            var countries = (sources && typeof sources.parseCountries === 'function') ? sources.parseCountries(movie) : [];
            var pg = (sources && typeof sources.parsePG === 'function') ? sources.parsePG(movie) : '';
            if (create !== '0000') head.push('<span>' + create + '</span>');
            if (countries && countries.length) head.push(countries.join(', '));
            var genreText = (movie.genres && movie.genres.length) ? movie.genres.map(function (it) { return Lampa.Utils.capitalizeFirstLetter(it.name); }).join(' | ') : '';
            var runtimeText = movie.runtime ? Lampa.Utils.secondsToTime(movie.runtime * 60, true) : '';
            html.find('.akira-info__head').empty().append(head.join(', '));
            if (vote > 0) html.find('.akira-info__rate').html('<div class="full-start__rate"><div>' + vote + '</div><div>TMDB</div></div>');
            else html.find('.akira-info__rate').empty();
            html.find('.akira-info__genres').text(genreText);
            html.find('.akira-info__runtime').text(runtimeText);
            html.find('.akira-info__pg').html(pg ? '<span class="full-start__pg" style="font-size:.9em;">' + pg + '</span>' : '');
            html.find('.akira-info__genres').toggle(!!genreText);
            html.find('.akira-info__runtime').toggle(!!runtimeText);
            html.find('.akira-info__pg').toggle(!!pg);
            html.find('.dot-rate-genre').toggle(!!(vote > 0 && genreText));
            html.find('.dot-genre-runtime').toggle(!!(genreText && (runtimeText || pg)));
            html.find('.dot-runtime-pg').toggle(!!(runtimeText && pg));
            html.find('.akira-info__description').text(movie.overview || (Lampa.Lang ? Lampa.Lang.translate('full_notext') : ''));
            var titleNode = html.find('.akira-info__title');
            var titleText = (movie.title || movie.name || '') + '';
            titleNode.text(titleText);
            Logos.applyToInfo({ wrapper: html, title: titleNode, head: html.find('.akira-info__head') }, movie, titleText);
        };
        InfoBlock.prototype.empty = function () {
            if (!this.html) return;
            this.html.find('.akira-info__head,.akira-info__genres,.akira-info__runtime').text('---');
            this.html.find('.akira-info__rate').empty();
        };
        InfoBlock.prototype.destroy = function () {
            clearTimeout(this.timer);
            try { this.network.clear(); } catch (e) {}
            this.loaded = {};
            this.currentUrl = null;
            if (this.html) { this.html.remove(); this.html = null; }
        };

        function startV3() {
            if (!Lampa.Maker || !Lampa.Maker.map || !Lampa.Utils) return false;
            if (window.__akira_iface_v3) return true;
            window.__akira_iface_v3 = true;

            var mainMap = Lampa.Maker.map('Main');
            if (!mainMap || !mainMap.Items || !mainMap.Create) return false;

            wrap(mainMap.Items, 'onInit', function (orig, args) {
                if (orig) orig.apply(this, args);
                this.__akiraEnabled = shouldUse(this && this.object);
            });
            wrap(mainMap.Create, 'onCreate', function (orig, args) {
                if (orig) orig.apply(this, args);
                if (!this.__akiraEnabled) return;
                ensureState(this).attach();
            });
            wrap(mainMap.Create, 'onCreateAndAppend', function (orig, args) {
                var element = args && args[0];
                if (this.__akiraEnabled && element) prepareLineData(element);
                return orig ? orig.apply(this, args) : undefined;
            });
            wrap(mainMap.Items, 'onAppend', function (orig, args) {
                if (orig) orig.apply(this, args);
                if (!this.__akiraEnabled) return;
                var item = args && args[0];
                var element = args && args[1];
                if (item && element) attachLineHandlers(this, item, element);
            });
            wrap(mainMap.Items, 'onDestroy', function (orig, args) {
                if (this.__akiraState) { this.__akiraState.destroy(); delete this.__akiraState; }
                delete this.__akiraEnabled;
                if (orig) orig.apply(this, args);
            });
            return true;
        }

        function ensureState(main) {
            if (main.__akiraState) return main.__akiraState;
            var info = new InfoBlock(); info.create();
            var background = document.createElement('img');
            background.className = 'full-start__background';

            var state = {
                main: main, info: info, background: background, infoElement: null,
                backgroundTimer: null, backgroundLast: '', attached: false,
                attach: function () {
                    if (this.attached) return;
                    var container = main.render(true);
                    if (!container) return;
                    container.classList.add('akira-iface', 'akira-iface-h');
                    if (!background.parentElement) container.insertBefore(background, container.firstChild || null);
                    var infoNode = info.render(true);
                    this.infoElement = infoNode;
                    if (infoNode && infoNode.parentNode !== container) {
                        if (background.parentElement === container) container.insertBefore(infoNode, background.nextSibling);
                        else container.insertBefore(infoNode, container.firstChild || null);
                    }
                    if (main.scroll && typeof main.scroll.minus === 'function') main.scroll.minus(infoNode);
                    this.attached = true;
                },
                update: function (data) { if (!data) return; info.update(data); this.updateBackground(data); },
                updateBackground: function (data) {
                    var path = data && data.backdrop_path ? Lampa.Api.img(data.backdrop_path, 'w1280') : '';
                    if (!path || path === this.backgroundLast) return;
                    clearTimeout(this.backgroundTimer);
                    var self = this;
                    this.backgroundTimer = setTimeout(function () {
                        background.classList.remove('loaded');
                        background.onload = function () { background.classList.add('loaded'); };
                        background.onerror = function () { background.classList.remove('loaded'); };
                        self.backgroundLast = path;
                        setTimeout(function () { background.src = self.backgroundLast; }, 300);
                    }, 1000);
                },
                reset: function () { info.empty(); },
                destroy: function () {
                    clearTimeout(this.backgroundTimer);
                    info.destroy();
                    var container = main.render(true);
                    if (container) container.classList.remove('akira-iface');
                    if (this.infoElement && this.infoElement.parentNode) this.infoElement.parentNode.removeChild(this.infoElement);
                    if (background && background.parentNode) background.parentNode.removeChild(background);
                    this.attached = false;
                }
            };
            main.__akiraState = state;
            return state;
        }

        function prepareLineData(element) {
            if (!element) return;
            if (Array.isArray(element.results)) {
                Lampa.Utils.extendItemsParams(element.results, { style: { name: 'wide' } });
            }
        }

        function updateCardTitle(card) {
            if (!card || typeof card.render !== 'function') return;
            var element = card.render(true);
            if (!element) return;
            if (!element.isConnected) {
                clearTimeout(card.__akiraLabelTimer);
                card.__akiraLabelTimer = setTimeout(function () { updateCardTitle(card); }, 50);
                return;
            }
            clearTimeout(card.__akiraLabelTimer);
            var text = (card.data && (card.data.title || card.data.name || card.data.original_title || card.data.original_name)) ? (card.data.title || card.data.name || card.data.original_title || card.data.original_name).trim() : '';
            var seek = element.querySelector('.akira-card-title');
            if (!text) {
                if (seek && seek.parentNode) seek.parentNode.removeChild(seek);
                card.__akiraLabel = null;
                return;
            }
            var label = seek || card.__akiraLabel;
            if (!label) { label = document.createElement('div'); label.className = 'akira-card-title'; }
            label.textContent = text;
            if (!label.parentNode || label.parentNode !== element) {
                if (label.parentNode) label.parentNode.removeChild(label);
                element.appendChild(label);
            }
            card.__akiraLabel = label;
        }

        function cardView(element) {
            if (!element || !element.querySelector) return element;
            return element.querySelector('.card__view') || element;
        }

        function mediaTypeLabel(data) {
            var isTv = !!(data && (data.media_type === 'tv' || data.name || data.first_air_date || data.number_of_seasons));
            var lang = Util.langCode();
            if (lang === 'en') return isTv ? 'SERIES' : 'MOVIE';
            if (lang === 'uk') return isTv ? 'СЕРІАЛ' : 'ФІЛЬМ';
            return isTv ? 'СЕРИАЛ' : 'ФИЛЬМ';
        }

        function normalizeRating(value) {
            var num = parseFloat(String(value || '').replace(',', '.'));
            if (!isFinite(num) || num <= 0) return '';
            return num.toFixed(1);
        }

        function qualityLabel(data) {
            var value = data && (data.quality || data.quality_name || data.video_quality || data.release_quality || data.rezolution || data.resolution);
            return Util.clean(value || '').toUpperCase();
        }

        function ensureBadge(view, className, text) {
            if (!view || !view.querySelector) return;
            var badge = view.querySelector('.' + className);
            if (!text) {
                if (badge && badge.parentNode) badge.parentNode.removeChild(badge);
                return;
            }
            if (!badge) {
                badge = document.createElement('div');
                badge.className = className;
                view.appendChild(badge);
            }
            badge.textContent = text;
        }

        function updateCardBadges(card) {
            if (!card || !card.data || typeof card.render !== 'function') return;
            var element = card.render(true);
            if (!element) return;
            var view = cardView(element);
            ensureBadge(view, 'akira-card-type', mediaTypeLabel(card.data));

            var hasNativeVote = element.querySelector && element.querySelector('.card__vote');
            var rating = normalizeRating(card.data.vote_average || card.data.vote || card.data.rating || card.data.rate);
            ensureBadge(view, 'akira-card-rating', hasNativeVote ? '' : rating);

            var hasNativeQuality = element.querySelector && element.querySelector('.card__quality');
            ensureBadge(view, 'akira-card-quality', hasNativeQuality ? '' : qualityLabel(card.data));
        }

        function decorateCard(state, card) {
            if (!card || card.__akiraCard || typeof card.use !== 'function' || !card.data) return;
            card.__akiraCard = true;
            card.params = card.params || {};
            card.params.style = card.params.style || {};
            if (!card.params.style.name) card.params.style.name = 'wide';
            card.use({
                onFocus:   function () { state.update(card.data); },
                onHover:   function () { state.update(card.data); },
                onTouch:   function () { state.update(card.data); },
                onVisible: function () { updateCardTitle(card); updateCardBadges(card); Logos.applyToCard(card); },
                onUpdate:  function () { updateCardTitle(card); updateCardBadges(card); Logos.applyToCard(card); },
                onDestroy: function () {
                    Logos.cleanupCard(card);
                    clearTimeout(card.__akiraLabelTimer);
                    try {
                        var root = card.render && card.render(true);
                        ['akira-card-type', 'akira-card-rating', 'akira-card-quality'].forEach(function (name) {
                            var node = root && root.querySelector && root.querySelector('.' + name);
                            if (node && node.parentNode) node.parentNode.removeChild(node);
                        });
                    } catch (e) {}
                    if (card.__akiraLabel && card.__akiraLabel.parentNode) card.__akiraLabel.parentNode.removeChild(card.__akiraLabel);
                    card.__akiraLabel = null;
                    delete card.__akiraCard;
                }
            });
            updateCardTitle(card);
            updateCardBadges(card);
            Logos.applyToCard(card);
        }

        function getCardData(card, element, index) {
            if (card && card.data) return card.data;
            if (element && Array.isArray(element.results)) return element.results[index || 0] || element.results[0];
            return null;
        }
        function getDomCardData(node) {
            if (!node) return null;
            var current = node && node.jquery ? node[0] : node;
            while (current && !current.card_data) current = current.parentNode;
            return current && current.card_data ? current.card_data : null;
        }
        function getFocusedCardData(line) {
            var container = line && typeof line.render === 'function' ? line.render(true) : null;
            if (!container || !container.querySelector) return null;
            var focus = container.querySelector('.selector.focus') || container.querySelector('.focus');
            return getDomCardData(focus);
        }

        function attachLineHandlers(main, line, element) {
            if (line.__akiraLine) return;
            line.__akiraLine = true;
            var state = ensureState(main);
            var apply = function (card) { decorateCard(state, card); };
            if (element && Array.isArray(element.results)) {
                element.results.slice(0, 5).forEach(function (it) {
                    state.info.load(it, { preload: true });
                    Logos.preload(it);
                });
            }
            line.use({
                onInstance: function (card) { apply(card); },
                onActive: function (card, itemData) { var d = getCardData(card, itemData); if (d) state.update(d); },
                onToggle: function () { setTimeout(function () { var d = getFocusedCardData(line); if (d) state.update(d); }, 32); },
                onMore:    function () { state.reset(); },
                onDestroy: function () { state.reset(); delete line.__akiraLine; }
            });
            if (Array.isArray(line.items) && line.items.length) line.items.forEach(apply);
            if (line.last) { var last = getDomCardData(line.last); if (last) state.update(last); }
        }

        function wrap(target, method, handler) {
            if (!target) return;
            var orig = typeof target[method] === 'function' ? target[method] : null;
            target[method] = function () { return handler.call(this, orig, arguments); };
        }

        return {
            start: function () {
                if (started) return;
                started = true;
                injectStyle();
                if (!moduleEnabled()) return;
                startV3();
            }
        };
    })();

    /* ================================================================
     * 8. BUTTONS — раскрытые кнопки (Смотреть/Торренты/Трейлер)
     *    + сохранение текста на маленьких экранах.
     *    Логика портирована из themes.js (incardtemplate / bigbuttons).
     * ================================================================ */

    var Buttons = (function () {
        function pluginEnabled() { return Util.isOn(K.enabled, true); }
        function moduleEnabled() { return pluginEnabled() && Util.isOn(K.buttonsSeparate, true); }

        var TEMPLATE_SEPARATE = '<div class="full-start-new">'
            + '  <div class="full-start-new__body">'
            + '    <div class="full-start-new__left">'
            + '      <div class="full-start-new__poster"><img class="full-start-new__img full--poster" /></div>'
            + '    </div>'
            + '    <div class="full-start-new__right">'
            + '      <div class="full-start-new__head"></div>'
            + '      <div class="full-start-new__title">{title}</div>'
            + '      <div class="full-start__title-original">{original_title}</div>'
            + '      <div class="full-start-new__tagline full--tagline">{tagline}</div>'
            + '      <div class="full-start-new__rate-line">'
            + '        <div class="full-start__rate rate--tmdb"><div>{rating}</div><div class="source--name">TMDB</div></div>'
            + '        <div class="full-start__rate rate--imdb hide"><div></div><div>IMDB</div></div>'
            + '        <div class="full-start__rate rate--kp hide"><div></div><div>KP</div></div>'
            + '        <div class="full-start__pg hide"></div>'
            + '        <div class="full-start__status hide"></div>'
            + '      </div>'
            + '      <div class="full-start-new__details"></div>'
            + '      <div class="full-start-new__reactions"><div>#{reactions_none}</div></div>'
            + '      <div class="full-start-new__buttons">'
            + '        <div class="full-start__button selector button--play"><svg><use xlink:href="#sprite-play"></use></svg><span>#{title_watch}</span></div>'
            + '        <div class="full-start__button view--torrent"><svg><use xlink:href="#sprite-torrent"></use></svg><span>#{full_torrents}</span></div>'
            + '        <div class="full-start__button selector view--trailer"><svg><use xlink:href="#sprite-trailer"></use></svg><span>#{full_trailers}</span></div>'
            + '        <div class="full-start__button selector button--book"><svg width="21" height="32" viewBox="0 0 21 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 1.5H19C19.276 1.5 19.5 1.724 19.5 2V27.962C19.5 28.376 19.026 28.61 18.697 28.36L12.621 23.73C11.368 22.776 9.632 22.776 8.379 23.73L2.303 28.36C1.974 28.61 1.5 28.376 1.5 27.962V2C1.5 1.724 1.724 1.5 2 1.5Z" stroke="currentColor" stroke-width="2.5"/></svg><span>#{settings_input_links}</span></div>'
            + '        <div class="full-start__button selector button--reaction"><svg><use xlink:href="#sprite-reaction"></use></svg><span>#{title_reactions}</span></div>'
            + '        <div class="full-start__button selector button--subscribe hide"><svg viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.019 24C6.274 27.356 9.078 30 12.5 30C15.922 30 18.726 27.356 18.981 24H15.965C15.722 25.696 14.263 27 12.5 27C10.737 27 9.278 25.696 9.035 24H6.019Z" fill="currentColor"></path><path d="M3.82 14.596V10.268C3.82 5.413 7.718 1.5 12.5 1.5C17.282 1.5 21.18 5.413 21.18 10.268V14.596C21.18 15.846 21.54 17.071 22.217 18.121L23.073 19.45C24.208 21.211 22.939 23.5 20.91 23.5H4.09C2.061 23.5 0.792 21.211 1.927 19.45L2.783 18.121C3.46 17.071 3.82 15.846 3.82 14.596Z" stroke="currentColor" stroke-width="2.6"></path></svg><span>#{title_subscribe}</span></div>'
            + '        <div class="full-start__button selector button--options"><svg><use xlink:href="#sprite-dots"></use></svg></div>'
            + '      </div>'
            + '    </div>'
            + '  </div>'
            + '</div>';

        function applyTemplate() {
            try {
                if (!Lampa.Template || typeof Lampa.Template.add !== 'function') return;
                if (moduleEnabled()) Lampa.Template.add('full_start_new', TEMPLATE_SEPARATE);
            } catch (e) {}
        }

        function injectBigStyle() {
            var style = document.getElementById(CFG.buttonsStyleId);
            if (!style) {
                style = document.createElement('style');
                style.id = CFG.buttonsStyleId;
                (document.head || document.body).appendChild(style);
            }
            if (pluginEnabled() && Util.isOn(K.buttonsBig, true)) {
                style.textContent = ''
                    + '.full-start-new__buttons .full-start__button:not(.focus) span{display:inline;}'
                    + '@media screen and (max-width:580px){'
                    +   '.full-start-new__buttons{overflow:auto;}'
                    +   '.full-start-new__buttons .full-start__button:not(.focus) span{display:none;}'
                    + '}';
            } else {
                style.textContent = '';
            }
        }

        function bindStorageWatch() {
            try {
                if (!Lampa.Storage || !Lampa.Storage.listener || !Lampa.Storage.listener.follow) return;
                Lampa.Storage.listener.follow('change', function (e) {
                    if (!e || !e.name) return;
                    if (e.name === K.buttonsBig || e.name === K.enabled) injectBigStyle();
                });
            } catch (e) {}
        }

        return {
            start: function () {
                applyTemplate();
                injectBigStyle();
                bindStorageWatch();
            }
        };
    })();

    /* ================================================================
     * 9. THEME — тёмная тема и шрифт в стиле Netflix
     *    Минимальный slim-вариант netflix_premium_style.css:
     *    палитра, акцент, шрифт, фокусы, скруглённые карточки.
     * ================================================================ */

    var Theme = (function () {
        function pluginEnabled() { return Util.isOn(K.enabled, true); }
        function moduleEnabled() { return pluginEnabled() && Util.isOn(K.themeEnabled, true); }

        function fontImport(family) {
            if (!family || family === 'system') return '';
            var name = String(family).replace(/ /g, '+');
            return '@import url("https://fonts.googleapis.com/css2?family=' + name + ':wght@400;500;600;700;800;900&display=swap");';
        }

        function build() {
            var accent = Util.get(K.themeAccent, '#e50914') || '#e50914';
            var rgb = Util.hexToRgb(accent);
            var family = Util.get(K.themeFont, 'Montserrat') || 'Montserrat';
            var fontStack = "'" + family + "', 'Helvetica Neue', Arial, sans-serif";

            return [
                fontImport(family),
                ':root{',
                '  --akira-bg: #0a0d12;',
                '  --akira-accent: ' + accent + ';',
                '  --akira-accent-rgb: ' + rgb + ';',
                '  --akira-accent-soft: rgba(' + rgb + ',.35);',
                '  --akira-text: #f0f0f0;',
                '  --akira-font: ' + fontStack + ';',
                '}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"]{background-color:var(--akira-bg) !important;font-family:var(--akira-font) !important;color:var(--akira-text) !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] html, body.' + CFG.bodyClass + '[data-akira-theme="on"] .extensions{background:linear-gradient(135deg,#0a0d12,#13171f) !important;color:var(--akira-text) !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .navigation-bar__body{background:rgba(10,13,18,.92) !important;}',
                /* Заголовки рядов и карточек */
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .items-line__title{font-family:var(--akira-font) !important;font-weight:700 !important;font-size:1.25em !important;color:#fff !important;text-shadow:0 2px 10px rgba(0,0,0,.6) !important;padding-left:1.2em !important;}',
                /* Фокус: однотонный акцент-градиент */
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item.focus, body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item.traverse, body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item.hover, body.' + CFG.bodyClass + '[data-akira-theme="on"] .simple-button.focus, body.' + CFG.bodyClass + '[data-akira-theme="on"] .full-start__button.focus, body.' + CFG.bodyClass + '[data-akira-theme="on"] .selectbox-item.focus, body.' + CFG.bodyClass + '[data-akira-theme="on"] .settings-folder.focus, body.' + CFG.bodyClass + '[data-akira-theme="on"] .settings-param.focus{background:linear-gradient(90deg, var(--akira-accent), rgba(' + rgb + ',.85)) !important;color:#fff !important;}',
                /* Бордюр карточки в фокусе */
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.focus .card__view::after, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.hover .card__view::after, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card-more.focus .card-more__box::after{border:.18em solid var(--akira-accent) !important;box-shadow:0 0 0 .35em var(--akira-accent-soft) !important;border-radius:.6em !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card .card__view, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card .card__img{border-radius:.6em !important;overflow:hidden !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .modal__content, body.' + CFG.bodyClass + '[data-akira-theme="on"] .selectbox__content, body.' + CFG.bodyClass + '[data-akira-theme="on"] .settings__content{background:rgba(10,13,18,.96) !important;border:0 !important;}',
                /* Голос рейтингов: TMDB акцентом */
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .full-start__rate.rate--tmdb{background:linear-gradient(90deg, var(--akira-accent), rgba(' + rgb + ',.7)) !important;color:#fff !important;border-radius:.4em !important;padding:.3em .5em !important;}',
                /* Безопасность для маленьких экранов: чтобы тема не ломала layout */
                '@media (max-width:560px){body.' + CFG.bodyClass + '[data-akira-theme="on"] .items-line__title{padding-left:.7em !important;font-size:1.1em !important;}}'
            ].join('\n');
        }

        function injectStyle() {
            var style = document.getElementById(CFG.themeStyleId);
            if (!style) {
                style = document.createElement('style');
                style.id = CFG.themeStyleId;
                (document.head || document.body).appendChild(style);
            }
            style.textContent = moduleEnabled() ? build() : '';
            if (document.body) {
                if (moduleEnabled()) {
                    document.body.classList.add(CFG.bodyClass);
                    document.body.setAttribute('data-akira-theme', 'on');
                } else {
                    document.body.removeAttribute('data-akira-theme');
                }
            }
        }

        function bindStorageWatch() {
            try {
                if (!Lampa.Storage || !Lampa.Storage.listener || !Lampa.Storage.listener.follow) return;
                Lampa.Storage.listener.follow('change', function (e) {
                    if (!e || !e.name) return;
                    if (e.name === K.themeEnabled || e.name === K.themeAccent || e.name === K.themeFont || e.name === K.enabled) injectStyle();
                });
            } catch (e) {}
        }

        return {
            start: function () {
                injectStyle();
                bindStorageWatch();
            }
        };
    })();

    /* ================================================================
     * 10. SCALE — адаптивный масштаб элементов.
     *     В отличие от element_scale.js здесь нет ручных значений:
     *     один переключатель ON/OFF. Размер шрифта подбирается
     *     автоматически по ширине окна. Используется единая CSS
     *     переменная --akira-base-font-size — Lampa-вёрстка масштабна
     *     благодаря em-юнитам, поэтому одна базовая величина двигает
     *     всё пропорционально.
     * ================================================================ */

    var Scale = (function () {
        /* Адаптивная таблица. Подбирали так, чтобы:
         *  - на смартфоне (~360-400px) текст был читаем (12-13px),
         *  - на ноутбуке (1366-1920) был привычный 16-18px,
         *  - на 4K-телевизоре (3840+) поднимался до 28-32px,
         *    при этом hero-блок и подписи карточек оставались
         *    в пределах безопасной ширины.
         */
        var PRESETS = [
            { maxW: 480,  px: 12 },
            { maxW: 720,  px: 13 },
            { maxW: 960,  px: 14 },
            { maxW: 1280, px: 15 },
            { maxW: 1600, px: 16 },
            { maxW: 1920, px: 18 },
            { maxW: 2560, px: 20 },
            { maxW: 3200, px: 22 },
            { maxW: 3840, px: 26 },
            { maxW: 99999,px: 30 }
        ];

        function pluginEnabled() { return Util.isOn(K.enabled, true); }
        function moduleEnabled() { return pluginEnabled() && Util.isOn(K.scaleEnabled, true); }

        function viewport() {
            if (window.visualViewport && window.visualViewport.width) return Math.round(window.visualViewport.width);
            return Math.round(window.innerWidth || document.documentElement.clientWidth || 1920);
        }

        function pickSize() {
            var w = viewport();
            for (var i = 0; i < PRESETS.length; i++) if (w <= PRESETS[i].maxW) return PRESETS[i].px;
            return 18;
        }

        function ensureStyle() {
            if (document.getElementById(CFG.scaleStyleId)) return;
            var style = document.createElement('style');
            style.id = CFG.scaleStyleId;
            style.textContent = [
                ':root{--akira-base-font-size:16px;}',
                'body.' + CFG.bodyClass + '[data-akira-scale="on"]{font-size:var(--akira-base-font-size) !important;}',
                /* Hero-блок: ограничиваем максимальную ширину текста и
                 * аккуратно растим описание на широких экранах. */
                'body.' + CFG.bodyClass + '[data-akira-scale="on"] .akira-info__body{max-width:min(96%, calc(78em + 6vw));}',
                'body.' + CFG.bodyClass + '[data-akira-scale="on"] .akira-info__description{-webkit-line-clamp:7;}',
                '@media (min-width:2200px){body.' + CFG.bodyClass + '[data-akira-scale="on"] .akira-info__description{-webkit-line-clamp:9;}}',
                '@media (min-width:3200px){body.' + CFG.bodyClass + '[data-akira-scale="on"] .akira-info__description{-webkit-line-clamp:11;}}'
            ].join('\n');
            (document.head || document.body).appendChild(style);
        }

        function apply() {
            ensureStyle();
            if (!document.body) return;
            if (!moduleEnabled()) {
                document.documentElement.style.removeProperty('--akira-base-font-size');
                document.body.removeAttribute('data-akira-scale');
                return;
            }
            document.body.classList.add(CFG.bodyClass);
            document.body.setAttribute('data-akira-scale', 'on');
            var size = pickSize();
            document.documentElement.style.setProperty('--akira-base-font-size', size + 'px');
            try { Lampa.Layer && Lampa.Layer.update && Lampa.Layer.update(); } catch (e) {}
        }

        var resizeTimer = null;
        function debouncedApply() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(apply, 120);
        }

        function bind() {
            window.addEventListener('resize', debouncedApply);
            window.addEventListener('orientationchange', debouncedApply);
            try {
                if (Lampa.Storage && Lampa.Storage.listener && Lampa.Storage.listener.follow) {
                    Lampa.Storage.listener.follow('change', function (e) {
                        if (!e || !e.name) return;
                        if (e.name === K.scaleEnabled || e.name === K.enabled) apply();
                    });
                }
            } catch (e) {}
            try {
                if (Lampa.Layer && typeof Lampa.Layer.update === 'function') {
                    var orig = Lampa.Layer.update;
                    Lampa.Layer.update = function (where) {
                        if (moduleEnabled()) {
                            document.documentElement.style.setProperty('--akira-base-font-size', pickSize() + 'px');
                        }
                        return orig.call(this, where);
                    };
                }
            } catch (e) {}
        }

        return {
            start: function () {
                ensureStyle();
                apply();
                bind();
            }
        };
    })();

    /* ================================================================
     * 11. TMDB подборки.
     *     По образцу tmdb_mod создаём отдельный источник 'akira_tmdb',
     *     клон оригинального 'tmdb', с подменённым main(). Подборки
     *     отдаются последовательно через Lampa.Api.sequentials/partNext.
     *     В настройках akira_tmdb можно отключать каждую подборку.
     * ================================================================ */

    var TmdbMod = (function () {
        var today = '';
        var thisYear = new Date().getFullYear();
        try { today = new Date().toISOString().substr(0, 10); } catch (e) { today = ''; }

        var COLLECTIONS = [
            { id: 'trending_movies', emoji: '🔥', name: { ru: 'Топ фильмов недели',  en: 'Top movies this week',  uk: 'Топ фільмів тижня' },
              request: 'trending/movie/week' },
            { id: 'trending_tv',     emoji: '🔥', name: { ru: 'Топ сериалов недели', en: 'Top series this week',  uk: 'Топ серіалів тижня' },
              request: 'trending/tv/week' },
            { id: 'hot_new_releases', emoji: '🎬', name: { ru: 'Свежие премьеры',    en: 'Hot new releases',      uk: 'Свіжі прем’єри' },
              request: 'discover/movie?sort_by=primary_release_date.desc&with_release_type=4|5|6&primary_release_date.lte=' + today + '&vote_count.gte=50&vote_average.gte=6&with_runtime.gte=40&without_genres=99' },
            { id: 'best_year',       emoji: '🌟', name: { ru: 'Лучшее текущего года', en: 'Best of the year',     uk: 'Найкраще поточного року' },
              request: 'discover/movie?primary_release_year=' + thisYear + '&sort_by=vote_average.desc&vote_count.gte=300' },
            { id: 'cult_classics',   emoji: '🍿', name: { ru: 'Классика и хиты',     en: 'Cult and classics',     uk: 'Класика та хіти' },
              request: 'discover/movie?primary_release_date.gte=1980-01-01&sort_by=popularity.desc&vote_average.gte=7&vote_count.gte=500' },
            { id: 'animation',       emoji: '🧸', name: { ru: 'Лучшая анимация',     en: 'Top animation',         uk: 'Найкраща анімація' },
              request: 'discover/movie?with_genres=16&sort_by=popularity.desc&vote_average.gte=7&vote_count.gte=500' },
            { id: 'world_series',    emoji: '🌍', name: { ru: 'Хиты мировых сериалов', en: 'World series hits',   uk: 'Хіти світових серіалів' },
              request: 'discover/tv?sort_by=popularity.desc&vote_average.gte=7&vote_count.gte=500&first_air_date.gte=2020-01-01&without_genres=16,99,10764,10767' },
            { id: 'netflix_best',    emoji: '⚫', name: { ru: 'Хиты Netflix',         en: 'Netflix hits',          uk: 'Хіти Netflix' },
              request: 'discover/tv?with_networks=213&sort_by=last_air_date.desc&first_air_date.gte=2020-01-01&vote_average.gte=7&vote_count.gte=500' }
        ];

        function pluginEnabled() { return Util.isOn(K.enabled, true); }
        function moduleEnabled() { return pluginEnabled() && Util.isOn(K.tmdbEnabled, true); }

        function colKey(id) { return K.tmdbCollection + id; }
        function colEnabled(id) { return Util.isOn(colKey(id), true); }

        function localized(value) {
            if (!value) return '';
            if (typeof value === 'string') return value;
            var lang = Util.langCode();
            return value[lang] || value.ru || value.en || '';
        }

        function ensureColDefaults() {
            COLLECTIONS.forEach(function (c) { Util.ensureOnOff(colKey(c.id), true); });
        }

        function buildDiscoveryMain(parent) {
            return function () {
                var params = arguments[0] !== undefined ? arguments[0] : {};
                var oncomplete = arguments[1];
                var onerror = arguments[2];
                var hasSeq = Lampa.Api && typeof Lampa.Api.sequentials === 'function';
                var hasPart = Lampa.Api && typeof Lampa.Api.partNext === 'function';
                if (!hasSeq && !hasPart) { if (onerror) onerror(); return function () {}; }

                var parts = []; var total = 0;
                COLLECTIONS.forEach(function (cfg) {
                    if (!colEnabled(cfg.id)) return;
                    total++;
                    parts.push(function (call) {
                        parent.get(cfg.request, params, function (json) {
                            var name = localized(cfg.name);
                            json.title = cfg.emoji ? cfg.emoji + ' ' + name : name;
                            if (Lampa.Utils && Lampa.Utils.addSource) Lampa.Utils.addSource(json, 'akira_tmdb');
                            call(json);
                        }, function () {
                            var name = localized(cfg.name);
                            call({ source: 'akira_tmdb', results: [], title: cfg.emoji ? cfg.emoji + ' ' + name : name });
                        });
                    });
                });

                if (parts.length === 0) { if (onerror) onerror(); return function () {}; }
                var method = hasSeq ? Lampa.Api.sequentials : Lampa.Api.partNext;
                method(parts, total, oncomplete, onerror);
                return function () {};
            };
        }

        function installSource() {
            try {
                if (!Lampa.Api || !Lampa.Api.sources || !Lampa.Api.sources.tmdb) return false;
                if (Lampa.Api.sources.akira_tmdb) {
                    try {
                        var readySources = (Lampa.Params && Lampa.Params.values && Lampa.Params.values.source) ? Lampa.Params.values.source : {};
                        if (readySources.akira_tmdb !== 'Akira') {
                            readySources.akira_tmdb = 'Akira';
                            Lampa.Params.select('source', readySources, (Lampa.Storage && Lampa.Storage.field ? Lampa.Storage.field('source') : 'tmdb') || 'tmdb');
                        }
                    } catch (readyErr) {}
                    return true;
                }
                var origTmdb = Lampa.Api.sources.tmdb;
                var clone = Object.assign({}, origTmdb);
                Lampa.Api.sources.akira_tmdb = clone;
                try { Object.defineProperty(Lampa.Api.sources, 'akira_tmdb', { get: function () { return clone; } }); } catch (e) {}
                var origMain = origTmdb.main;
                clone.main = function () {
                    var args = Array.prototype.slice.call(arguments);
                    if (moduleEnabled() && this.type !== 'movie' && this.type !== 'tv') {
                        return buildDiscoveryMain(clone).apply(this, args);
                    }
                    return origMain.apply(this, args);
                };
                if (Lampa.Params && Lampa.Params.select) {
                    try {
                        var sources = (Lampa.Params.values && Lampa.Params.values.source) ? Lampa.Params.values.source : {};
                        if (sources.akira_tmdb !== 'Akira') {
                            sources.akira_tmdb = 'Akira';
                            var current = 'tmdb';
                            try {
                                current = Lampa.Storage && Lampa.Storage.field ? Lampa.Storage.field('source') : Lampa.Storage.get('source', 'tmdb');
                            } catch (e2) {}
                            Lampa.Params.select('source', sources, current || 'tmdb');
                        }
                    } catch (e) {}
                }
                return true;
            } catch (e) { return false; }
        }

        return {
            collections: COLLECTIONS,
            colKey: colKey,
            localized: localized,
            ensureColDefaults: ensureColDefaults,
            start: function () {
                ensureColDefaults();
                if (moduleEnabled()) installSource();
            }
        };
    })();

    /* ================================================================
     * 12. SETTINGS — корневой пункт "akira" + вложенные подразделы
     *     по образцу appletv_agnative: каждое подменю — отдельный
     *     SettingsApi component, открывается через type:'button' с
     *     onChange → Lampa.Settings.create(child, { onBack: parent }).
     * ================================================================ */

    var Settings = (function () {
        var ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 5h16v3H4V5Zm0 5h11v3H4v-3Zm0 5h16v4H4v-4Z"/></svg>';

        function addParam(component, param, field, onChange) {
            try {
                Lampa.SettingsApi.addParam({ component: component, param: param, field: field, onChange: onChange });
            } catch (e) {}
        }

        function addComponent(name, label) {
            try {
                if (name === CFG.component) {
                    Lampa.SettingsApi.addComponent({ component: name, name: label, icon: ICON });
                }
                if (Lampa.Template && typeof Lampa.Template.add === 'function') {
                    Lampa.Template.add('settings_' + name, '<div></div>');
                }
            } catch (e) {}
        }

        function openSub(name) {
            try {
                if (!Lampa.Settings || typeof Lampa.Settings.create !== 'function') return;
                setTimeout(function () {
                    Lampa.Settings.create(name, {
                        onBack: function () {
                            Lampa.Settings.create(CFG.component);
                        }
                    });
                }, 0);
            } catch (e) {}
        }

        function notyReload() {
            Util.notify(t('reset_done').replace('сброшены', 'требуют перезагрузки главной').replace('reset', 'require home reload'));
        }

        function currentBrand() {
            var value = Util.clean(Util.get(K.topbarBrand, CFG.brand) || CFG.brand);
            return value || CFG.brand;
        }

        function openBrandPrompt() {
            var value = null;
            try { value = window.prompt(t('topbar_brand'), currentBrand()); } catch (e) {}
            if (value === null || typeof value === 'undefined') return;
            Util.set(K.topbarBrand, Util.clean(value) || CFG.brand);
            try { Topbar.schedule(true); } catch (e2) {}
        }

        function buildRoot() {
            addComponent(CFG.component, t('root_name'));
            addParam(CFG.component, { name: CFG.prefix + 'about', type: 'static' },
                { name: t('root_name'), description: t('root_about') });
            addParam(CFG.component, { name: K.enabled, type: 'trigger', default: true },
                { name: t('master_enabled') });

            addParam(CFG.component, { name: CFG.prefix + 'open_topbar', type: 'button' },
                { name: t('open_topbar'), description: t('topbar_title') }, function () { openSub(SUB.topbar); });
            addParam(CFG.component, { name: CFG.prefix + 'open_iface', type: 'button' },
                { name: t('open_iface'), description: t('iface_title') }, function () { openSub(SUB.iface); });
            addParam(CFG.component, { name: CFG.prefix + 'open_buttons', type: 'button' },
                { name: t('open_buttons'), description: t('buttons_title') }, function () { openSub(SUB.buttons); });
            addParam(CFG.component, { name: CFG.prefix + 'open_theme', type: 'button' },
                { name: t('open_theme'), description: t('theme_title') }, function () { openSub(SUB.theme); });
            addParam(CFG.component, { name: CFG.prefix + 'open_logos', type: 'button' },
                { name: t('open_logos'), description: t('logos_title') }, function () { openSub(SUB.logos); });
            addParam(CFG.component, { name: CFG.prefix + 'open_scale', type: 'button' },
                { name: t('open_scale'), description: t('scale_title') }, function () { openSub(SUB.scale); });
            addParam(CFG.component, { name: CFG.prefix + 'open_tmdb', type: 'button' },
                { name: t('open_tmdb'), description: t('tmdb_title') }, function () { openSub(SUB.tmdb); });

            addParam(CFG.component, { name: CFG.prefix + 'reset_all', type: 'button' },
                { name: t('reset_all') }, resetAll);
        }

        function buildTopbar() {
            addComponent(SUB.topbar, t('topbar_title'));
            addParam(SUB.topbar, { name: K.topbarEnabled, type: 'trigger', default: true },
                { name: t('topbar_enabled') });
            addParam(SUB.topbar, { name: CFG.prefix + 'brand_edit', type: 'button' },
                { name: t('topbar_brand'), description: currentBrand() }, openBrandPrompt);
            addParam(SUB.topbar, { name: K.topbarAlign, type: 'select', values: { start: t('topbar_align_start'), center: t('topbar_align_center') }, default: 'start' },
                { name: t('topbar_align') }, function () { try { Topbar.schedule(true); } catch (e) {} });
            addParam(SUB.topbar, { name: CFG.prefix + 'open_topnav', type: 'button' },
                { name: t('topbar_open_nav'), description: t('topbar_nav_title') }, function () {
                    try {
                        if (!Lampa.Settings || !Lampa.Settings.create) return;
                        buildTopnav();
                        setTimeout(function () {
                            Lampa.Settings.create(SUB.topnav, { onBack: function () { Lampa.Settings.create(SUB.topbar); } });
                        }, 0);
                    } catch (e) {}
                });
        }

        var topnavBuilt = false;
        function buildTopnav() {
            if (topnavBuilt) return;
            topnavBuilt = true;
            addComponent(SUB.topnav, t('topbar_nav_title'));
            addParam(SUB.topnav, { type: 'title' }, { name: t('topbar_nav_title') });
            try {
                Topbar.availableItems().forEach(function (item) {
                    var itemKey = CFG.prefix + 'topnav_' + String(item.action).replace(/[^a-z0-9_-]/gi, '_');
                    var on = Topbar.storedActions().indexOf(item.action) > -1;
                    Util.set(itemKey, on);
                    addParam(SUB.topnav, { name: itemKey, type: 'select', values: { 'true': t('show'), 'false': t('hide') }, default: on ? 'true' : 'false' },
                        { name: item.label, description: item.action }, function (value) {
                            var enabled = value === 'true' || value === true;
                            Topbar.setActionOn(item.action, enabled);
                            try { Topbar.schedule(true); } catch (e) {}
                        });
                });
            } catch (e) {}
        }

        function buildInterface() {
            addComponent(SUB.iface, t('iface_title'));
            addParam(SUB.iface, { name: K.ifaceEnabled, type: 'trigger', default: true },
                { name: t('iface_enabled') }, function () { Util.notify(t('reset_done')); });
            addParam(SUB.iface, { name: K.ifaceCardLogos, type: 'trigger', default: true },
                { name: t('iface_card_logos') });
        }

        function buildButtons() {
            addComponent(SUB.buttons, t('buttons_title'));
            addParam(SUB.buttons, { name: K.buttonsSeparate, type: 'trigger', default: true },
                { name: t('buttons_separate') }, function () { Util.notify(t('reset_done')); });
            addParam(SUB.buttons, { name: K.buttonsBig, type: 'trigger', default: true },
                { name: t('buttons_big') });
        }

        function buildTheme() {
            addComponent(SUB.theme, t('theme_title'));
            addParam(SUB.theme, { name: K.themeEnabled, type: 'trigger', default: true },
                { name: t('theme_enabled') });
            addParam(SUB.theme, {
                name: K.themeAccent, type: 'select',
                values: {
                    '#e50914': 'Netflix Red',
                    '#3da18d': 'Mint',
                    '#22d3ee': 'Cyan',
                    '#7e7ed9': 'Aurora',
                    '#f4a261': 'Amber',
                    '#f6a5b0': 'Sakura'
                },
                default: '#e50914'
            }, { name: t('theme_accent') });
            addParam(SUB.theme, {
                name: K.themeFont, type: 'select',
                values: {
                    'Montserrat': 'Montserrat',
                    'Roboto': 'Roboto',
                    'Open Sans': 'Open Sans',
                    'Inter': 'Inter',
                    'system': 'System'
                },
                default: 'Montserrat'
            }, { name: t('theme_font') });
        }

        function buildLogos() {
            addComponent(SUB.logos, t('logos_title'));
            addParam(SUB.logos, { name: K.logosEnabled, type: 'trigger', default: true },
                { name: t('logos_enabled') });
            addParam(SUB.logos, {
                name: K.logoLang, type: 'select',
                values: { 'auto': 'Auto', 'ru': 'Русский', 'en': 'English', 'uk': 'Українська', 'be': 'Беларуская', 'kz': 'Қазақша' },
                default: 'auto'
            }, { name: t('logos_lang') });
            addParam(SUB.logos, {
                name: K.logoSize, type: 'select',
                values: { 'w300': 'w300', 'w500': 'w500', 'w780': 'w780', 'original': 'Original' },
                default: 'original'
            }, { name: t('logos_size') });
            addParam(SUB.logos, { name: CFG.prefix + 'logo_clear', type: 'button' },
                { name: t('logos_clear') }, function () {
                    Logos.clearCache();
                    Util.notify(t('logos_clear_done'));
                });
        }

        function buildScale() {
            addComponent(SUB.scale, t('scale_title'));
            addParam(SUB.scale, { name: K.scaleEnabled, type: 'trigger', default: true },
                { name: t('scale_enabled') });
        }

        function buildTmdb() {
            addComponent(SUB.tmdb, t('tmdb_title'));
            addParam(SUB.tmdb, { name: CFG.prefix + 'tmdb_about', type: 'static' },
                { name: t('tmdb_title'), description: t('tmdb_about') });
            addParam(SUB.tmdb, { name: K.tmdbEnabled, type: 'trigger', default: true },
                { name: t('tmdb_enabled') }, function () { Util.notify(t('reset_done')); });
            TmdbMod.collections.forEach(function (c) {
                var name = (c.emoji ? c.emoji + ' ' : '') + TmdbMod.localized(c.name);
                addParam(SUB.tmdb, { name: TmdbMod.colKey(c.id), type: 'trigger', default: true },
                    { name: name });
            });
        }

        function resetAll() {
            try {
                if (!Lampa.Storage || !Lampa.Storage.get) return;
                /* Удаляем все ключи akira_* и логотип-кеш */
                var rm = [];
                try {
                    for (var i = 0; i < localStorage.length; i++) {
                        var k = localStorage.key(i);
                        if (k && (k.indexOf(CFG.prefix) === 0 || k.indexOf(CFG.logoCachePrefix) === 0)) rm.push(k);
                    }
                    rm.forEach(function (k) { localStorage.removeItem(k); });
                } catch (e) {}
                ensureDefaults();
                Util.notify(t('reset_done'));
                try { Lampa.Settings.create(CFG.component); } catch (e) {}
            } catch (e) {}
        }

        return {
            buildAll: function () {
                if (!Lampa.SettingsApi || typeof Lampa.SettingsApi.addParam !== 'function') return;
                buildRoot();
                buildTopbar();
                buildInterface();
                buildButtons();
                buildTheme();
                buildLogos();
                buildScale();
                buildTmdb();
            },
            openRoot: function () {
                try { if (Lampa.Settings && Lampa.Settings.create) Lampa.Settings.create(CFG.component); } catch (e) {}
            }
        };
    })();

    /* ================================================================
     * 13. BOOT
     * ================================================================ */

    function boot() {
        ensureDefaults();
        try { Settings.buildAll(); } catch (e) {}
        try { Theme.start();    } catch (e) {}
        try { Scale.start();    } catch (e) {}
        try { Logos.start();    } catch (e) {}
        try { Buttons.start();  } catch (e) {}
        try { Interface.start(); } catch (e) {}
        try { Topbar.start();   } catch (e) {}
        try { TmdbMod.start();  } catch (e) {}
        Util.log('Akira booted, version', CFG.version);
    }

    if (window.appready) {
        boot();
    } else {
        try {
            if (Lampa.Listener && typeof Lampa.Listener.follow === 'function') {
                Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') boot(); });
            } else if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', boot);
            } else {
                setTimeout(boot, 300);
            }
        } catch (e) {
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
            else setTimeout(boot, 300);
        }
    }
})();
