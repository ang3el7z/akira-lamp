/* Akira v2 */
(function () {
    'use strict';

    if (typeof Lampa === 'undefined') return;

    /* ================================================================
     * 1. CORE CONFIG
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
        defaultNav: ['main', 'movie', 'tv', 'anime', 'release']
    };

    if (window[CFG.guard]) return;
    window[CFG.guard] = true;

    /*
     * Akira intentionally ships as one file: Lampa plugins are loaded as a
     * single script. Architecture inside this monolith is still modular:
     *
     *  - CFG / K / L keep configuration, storage keys and translations.
     *  - Util contains shared safe wrappers and small pure helpers.
     *  - Feature modules are isolated IIFEs with a small public contract.
     *  - boot() is the only full application startup path and preserves order.
     */

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

    var K = {
        enabled: CFG.prefix + 'enabled',

        topbarEnabled: CFG.prefix + 'topbar_enabled',
        topbarBrand: CFG.prefix + 'topbar_brand',
        topbarAlign: CFG.prefix + 'topbar_align',
        topbarItems: CFG.prefix + 'topbar_items',

        ifaceEnabled: CFG.prefix + 'iface_enabled',
        ifaceCardLogos: CFG.prefix + 'iface_card_logos',
        ifaceHeroMode: CFG.prefix + 'iface_hero_mode',
        ifaceHeroDescription: CFG.prefix + 'iface_hero_description',
        ifaceHeroInfo: CFG.prefix + 'iface_hero_info',

        buttonsSeparate: CFG.prefix + 'buttons_separate',
        buttonsBig: CFG.prefix + 'buttons_big',

        themeEnabled: CFG.prefix + 'theme_enabled',
        themeAccent: CFG.prefix + 'theme_accent',
        themeFont: CFG.prefix + 'theme_font',

        logosEnabled: CFG.prefix + 'logos_enabled',
        logoLang: CFG.prefix + 'logo_lang',
        logoSize: CFG.prefix + 'logo_size',

        scaleEnabled: CFG.prefix + 'scale_enabled',

        shotsEnabled: CFG.prefix + 'shots_enabled',
        mobilePlayerEnabled: CFG.prefix + 'mobile_player_enabled',

        tmdbEnabled: CFG.prefix + 'tmdb_enabled',
        tmdbCollection: CFG.prefix + 'tmdb_col_'
    };

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

        mediaType: function (item) {
            if (!item) return 'movie';
            var mt = this.clean(item.media_type || item.type || item.media || '').toLowerCase();
            if (mt === 'tv' || mt === 'series') return 'tv';
            if (mt === 'movie' || mt === 'film') return 'movie';
            if (item.first_air_date || item.original_name || item.number_of_seasons || item.number_of_episodes || item.episode_run_time) return 'tv';
            if (item.release_date || item.original_title) return 'movie';
            return item.name && !item.title ? 'tv' : 'movie';
        },

        tmdbId: function (item) {
            if (!item) return '';
            var candidates = [item.tmdb_id, item.tmdbid, item.tmdb, item.id];
            for (var i = 0; i < candidates.length; i++) {
                var raw = candidates[i];
                if (raw && typeof raw === 'object') raw = raw.id || raw.tmdb_id;
                var id = this.clean(raw);
                if (/^\d+$/.test(id)) return id;
            }
            return '';
        },

        originalTitle: function (item, mainTitle) {
            if (!item) return '';
            var original = this.clean(item.original_title || item.original_name || '');
            var localized = this.clean(mainTitle || item.title || item.name || '');
            if (!original || !localized) return '';
            return original.toLowerCase() === localized.toLowerCase() ? '' : original;
        },

        countryName: function (code) {
            code = this.clean(code).toUpperCase();
            if (!code) return '';
            var lang = this.langCode();
            var short = {
                ru: { US: 'США', KR: 'Южная Корея', GB: 'Великобритания', UK: 'Великобритания', CA: 'Канада', JP: 'Япония', CN: 'Китай', FR: 'Франция', DE: 'Германия', MX: 'Мексика', ZA: 'ЮАР', IN: 'Индия' },
                uk: { US: 'США', KR: 'Південна Корея', GB: 'Велика Британія', UK: 'Велика Британія', CA: 'Канада', JP: 'Японія', CN: 'Китай', FR: 'Франція', DE: 'Німеччина', MX: 'Мексика', ZA: 'ПАР', IN: 'Індія' },
                en: { US: 'USA', KR: 'South Korea', GB: 'UK', UK: 'UK', CA: 'Canada', JP: 'Japan', CN: 'China', FR: 'France', DE: 'Germany', MX: 'Mexico', ZA: 'South Africa', IN: 'India' }
            };
            if (short[lang] && short[lang][code]) return short[lang][code];
            try {
                if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
                    var display = new Intl.DisplayNames([lang], { type: 'region' });
                    return this.clean(display.of(code) || code);
                }
            } catch (e) {}
            return code;
        },

        shortCountry: function (name) {
            name = this.clean(name);
            if (!name) return '';
            var lower = name.toLowerCase();
            var lang = this.langCode();
            var ru = {
                'соединенные штаты': 'США',
                'соединённые штаты': 'США',
                'соединенные штаты америки': 'США',
                'соединённые штаты америки': 'США',
                'united states': 'США',
                'united states of america': 'США',
                'usa': 'США',
                'республика корея': 'Южная Корея',
                'южная корея': 'Южная Корея',
                'south korea': 'Южная Корея',
                'republic of korea': 'Южная Корея',
                'united kingdom': 'Великобритания',
                'великобритания': 'Великобритания',
                'соединенное королевство': 'Великобритания',
                'соединённое королевство': 'Великобритания',
                'южно-африканская республика': 'ЮАР',
                'south africa': 'ЮАР'
            };
            var uk = {
                'united states': 'США',
                'united states of america': 'США',
                'usa': 'США',
                'сполучені штати': 'США',
                'сполучені штати америки': 'США',
                'south korea': 'Південна Корея',
                'republic of korea': 'Південна Корея',
                'республіка корея': 'Південна Корея',
                'південна корея': 'Південна Корея',
                'united kingdom': 'Велика Британія',
                'велика британія': 'Велика Британія',
                'південно-африканська республіка': 'ПАР',
                'south africa': 'ПАР'
            };
            var en = {
                'united states': 'USA',
                'united states of america': 'USA',
                'usa': 'USA',
                'south korea': 'South Korea',
                'republic of korea': 'South Korea',
                'united kingdom': 'UK',
                'great britain': 'UK',
                'south africa': 'South Africa'
            };
            var map = lang === 'uk' ? uk : (lang === 'en' ? en : ru);
            return map[lower] || name;
        },

        itemCountryNames: function (item) {
            var names = [];
            var seen = {};
            var self = this;
            function add(name) {
                name = self.shortCountry(name);
                var key = name.toLowerCase();
                if (!name || seen[key]) return;
                seen[key] = true;
                names.push(name);
            }
            try {
                var sources = (Lampa.Api && Lampa.Api.sources && Lampa.Api.sources.tmdb) ? Lampa.Api.sources.tmdb : null;
                if (sources && typeof sources.parseCountries === 'function') {
                    (sources.parseCountries(item) || []).forEach(add);
                }
            } catch (e) {}
            if (item && item.production_countries && item.production_countries.length) {
                item.production_countries.forEach(function (country) { add(country && (country.name || country.iso_3166_1)); });
            }
            if (item && item.origin_country && item.origin_country.length) {
                item.origin_country.forEach(function (code) { add(self.countryName(code)); });
            }
            return names;
        },

        hexToRgb: function (h) {
            var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h || '');
            return m ? parseInt(m[1], 16) + ',' + parseInt(m[2], 16) + ',' + parseInt(m[3], 16) : '229,9,20';
        },

        notify: function (msg) {
            try { if (Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show(msg); } catch (e) {}
        },

        log: function () { /* console.log.apply(console, ['[Akira]'].concat([].slice.call(arguments))); */ }
    };

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
            iface_hero_mode: 'Главная картинка',
            iface_hero_mode_block: 'Отдельным окном',
            iface_hero_mode_fullscreen: 'На весь экран',
            iface_hero_description: '\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0432 \u0431\u043e\u043b\u044c\u0448\u043e\u0439 \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0435',
            iface_hero_info: '\u0418\u043d\u0444\u043e \u0432 \u0431\u043e\u043b\u044c\u0448\u043e\u0439 \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0435',
            iface_hero_info_all: '\u0412\u0441\u0451 \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c',
            iface_hero_info_hide_description: '\u0421\u043a\u0440\u044b\u0442\u044c \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0435',
            iface_hero_info_hide_meta: '\u0421\u043a\u0440\u044b\u0442\u044c \u043c\u0435\u0442\u0430',
            iface_hero_info_hide_all: '\u0421\u043a\u0440\u044b\u0442\u044c \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0438 \u043c\u0435\u0442\u0430',
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
            shots_enabled: 'Скрывать Shots',
            mobile_player_enabled: 'Мобильный плеер fullscreen',
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
            iface_hero_mode: 'Hero image',
            iface_hero_mode_block: 'Inside info block',
            iface_hero_mode_fullscreen: 'Fullscreen',
            iface_hero_description: 'Show description in big card',
            iface_hero_info: 'Big card info',
            iface_hero_info_all: 'Show all',
            iface_hero_info_hide_description: 'Hide description',
            iface_hero_info_hide_meta: 'Hide meta',
            iface_hero_info_hide_all: 'Hide description and meta',
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
            shots_enabled: 'Hide Shots',
            mobile_player_enabled: 'Mobile player fullscreen',
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
            iface_hero_mode: 'Головна картинка',
            iface_hero_mode_block: 'Окремим вікном',
            iface_hero_mode_fullscreen: 'На весь екран',
            iface_hero_description: '\u041f\u043e\u043a\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u043e\u043f\u0438\u0441 \u0443 \u0432\u0435\u043b\u0438\u043a\u0456\u0439 \u043a\u0430\u0440\u0442\u0446\u0456',
            iface_hero_info: '\u0406\u043d\u0444\u043e \u0443 \u0432\u0435\u043b\u0438\u043a\u0456\u0439 \u043a\u0430\u0440\u0442\u0446\u0456',
            iface_hero_info_all: '\u041f\u043e\u043a\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u0432\u0441\u0435',
            iface_hero_info_hide_description: '\u0421\u0445\u043e\u0432\u0430\u0442\u0438 \u043e\u043f\u0438\u0441',
            iface_hero_info_hide_meta: '\u0421\u0445\u043e\u0432\u0430\u0442\u0438 \u043c\u0435\u0442\u0430',
            iface_hero_info_hide_all: '\u0421\u0445\u043e\u0432\u0430\u0442\u0438 \u043e\u043f\u0438\u0441 \u0456 \u043c\u0435\u0442\u0430',
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
            shots_enabled: 'Ховати Shots',
            mobile_player_enabled: 'Мобільний плеєр fullscreen',
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

    function safeRun(name, fn) {
        try { return fn(); } catch (e) { Util.log(name, e); }
    }

    function startModule(name, module, method) {
        method = method || 'start';
        safeRun(name, function () {
            if (module && typeof module[method] === 'function') module[method]();
        });
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
        Util.ensure(K.ifaceHeroMode, 'block');
        Util.ensure(K.ifaceHeroInfo, Util.isOn(K.ifaceHeroDescription, true) ? 'all' : 'hide_description');

        Util.ensureOnOff(K.buttonsSeparate, true);
        Util.ensureOnOff(K.buttonsBig, true);

        Util.ensureOnOff(K.themeEnabled, true);
        Util.ensure(K.themeAccent, '#e50914');
        Util.ensure(K.themeFont, 'Montserrat');

        Util.ensureOnOff(K.logosEnabled, true);
        Util.ensure(K.logoLang, 'auto');
        Util.ensure(K.logoSize, 'original');

        Util.ensureOnOff(K.scaleEnabled, true);

        Util.ensureOnOff(K.shotsEnabled, true);
        Util.ensureOnOff(K.mobilePlayerEnabled, false);

        Util.ensureOnOff(K.tmdbEnabled, true);
    }

    /* ================================================================
     * 5. TOPBAR (порт top_bar_akira с прицелом на единый prefix)
     * ================================================================ */

    var Topbar = (function () {
        var ATTR_ON = 'data-akira-topbar';
        var ATTR_ALIGN = 'data-akira-topbar-align';
        var BRAND_VAR = '--akira-brand-w';
        var BACK_VAR = '--akira-back-w';

        var state = { clockTimer: null, domObserver: null, scheduled: false, scheduleTimer: null, listenersBound: false };

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
            function measure() {
                try {
                    var w = Math.ceil(icon.getBoundingClientRect().width || 0);
                    if (w > 0) document.documentElement.style.setProperty(BRAND_VAR, w + 'px');
                } catch (e) {}
            }
            requestAnimationFrame(measure);
            setTimeout(measure, 80);
            setTimeout(measure, 220);
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
            if (!moduleEnabled()) { removeUi(); return; }
            var head = Util.qs('.head__body') || Util.qs('.head');
            if (!head) return;
            patchBrand(head);
            var backDock = Util.qs('.akira-topbar-backdock', head);
            if (!backDock) {
                backDock = document.createElement('div');
                backDock.className = 'akira-topbar-backdock';
                head.appendChild(backDock);
            }
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

            var hasBack = !!nativeBack();
            var centerMode = topbarAlign() === 'center';
            backDock.innerHTML = '';
            itemsNode.classList.toggle('akira-topbar__items--no-back', !hasBack || centerMode);
            try { document.documentElement.style.setProperty(BACK_VAR, centerMode && hasBack ? '3.08em' : '0px'); } catch (e) {}

            if (hasBack) {
                var back = document.createElement('div');
                back.className = 'akira-topbar__item akira-topbar__icon akira-topbar__back selector';
                back.setAttribute('data-selector', 'true'); back.setAttribute('tabindex', '0');
                back.innerHTML = iconBack();
                bindAction(back, goBack);
                if (centerMode) backDock.appendChild(back);
                else itemsNode.appendChild(back);
            }

            selectedItems().forEach(function (item) {
                var btn = document.createElement('div');
                btn.className = 'akira-topbar__item akira-topbar__nav selector';
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
            clock.className = 'akira-topbar__clock';
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
                'body.' + bc + '[' + ATTR_ON + '="on"] .head__title, body.' + bc + '[' + ATTR_ON + '="on"] .head__time, body.' + bc + '[' + ATTR_ON + '="on"] .head__split, body.' + bc + '[' + ATTR_ON + '="on"] .head__navigator, body.' + bc + '[' + ATTR_ON + '="on"] .head__logo, body.' + bc + '[' + ATTR_ON + '="on"] .open--search, body.' + bc + '[' + ATTR_ON + '="on"] .head__settings { display: none !important; }',
                'body.' + bc + '[' + ATTR_ON + '="on"] .head__body { position: relative !important; z-index: 48 !important; min-height: 0 !important; height: 0 !important; padding: 0 !important; overflow: visible !important; }',
                'body.' + bc + '[' + ATTR_ON + '="on"] .head__history, body.' + bc + '[' + ATTR_ON + '="on"] .head__source, body.' + bc + '[' + ATTR_ON + '="on"] .head__markers, body.' + bc + '[' + ATTR_ON + '="on"] .head__backward, body.' + bc + '[' + ATTR_ON + '="on"] .settings-icon-holder, body.' + bc + '[' + ATTR_ON + '="on"] .head__action, body.' + bc + '[' + ATTR_ON + '="on"] .head__button { display: none !important; }',
                'body.' + bc + ' .head__menu-icon.akira-head-brand { position: absolute !important; left: 1.05em !important; top: .5em !important; z-index: 51 !important; width: auto !important; max-width: min(30vw, 22em) !important; min-width: 4.4em !important; height: 2.8em !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; padding: 0 .95em !important; margin: 0 !important; border-radius: 8px !important; background: linear-gradient(92deg, ' + accent + ', rgba(' + rgb + ',.78)) !important; color: #fff !important; border: 1px solid rgba(255,255,255,.12) !important; box-shadow: 0 10px 28px ' + soft + ' !important; transform: none !important; overflow: hidden !important; box-sizing: border-box !important; }',
                'body.' + bc + ' .head__menu-icon.akira-head-brand span { display: block !important; max-width: 100% !important; overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important; font-size: .88em !important; line-height: 1 !important; font-weight: 900 !important; color: inherit !important; }',
                'body.' + bc + ' .head__menu-icon.akira-head-brand.focus, body.' + bc + ' .head__menu-icon.akira-head-brand.hover { box-shadow: 0 0 0 2px rgba(255,255,255,.18), 0 12px 30px ' + soft + ' !important; transform: translateY(-1px) !important; }',
                'body.' + bc + ' .akira-topbar-backdock { position: absolute !important; left: calc(1.05em + var(' + BRAND_VAR + ', 5.2em) + .45em) !important; top: .5em !important; z-index: 50 !important; height: 2.8em !important; display: inline-flex !important; align-items: center !important; gap: .18em !important; padding: .18em !important; border-radius: 8px !important; background: ' + panel + ' !important; border: 1px solid ' + edge + ' !important; backdrop-filter: blur(18px) saturate(130%) !important; -webkit-backdrop-filter: blur(18px) saturate(130%) !important; box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 10px 26px rgba(0,0,0,.22) !important; box-sizing: border-box !important; pointer-events: auto !important; }',
                'body.' + bc + ' .akira-topbar-backdock:empty { display: none !important; }',
                'body.' + bc + ' .akira-topbar { position: absolute; left: calc(1.05em + var(' + BRAND_VAR + ', 5.2em) + .65em + var(' + BACK_VAR + ', 0px)) !important; top: .5em !important; right: 1.05em !important; z-index: 49 !important; pointer-events: none; max-width: calc(100vw - 1.05em - var(' + BRAND_VAR + ', 5.2em) - .65em - var(' + BACK_VAR + ', 0px) - 1.05em) !important; }',
                'body.' + bc + ' .akira-topbar__inner { height: 2.8em; display: flex; align-items: center; gap: .34em !important; flex-wrap: nowrap !important; min-width: 0 !important; pointer-events: auto; }',
                'body.' + bc + ' .akira-topbar__items, body.' + bc + ' .akira-topbar__right { display: inline-flex; align-items: center; gap: .18em; height: 2.8em; padding: .18em; border-radius: 8px; background: ' + panel + '; border: 1px solid ' + edge + '; backdrop-filter: blur(18px) saturate(130%); -webkit-backdrop-filter: blur(18px) saturate(130%); box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 10px 26px rgba(0,0,0,.22); box-sizing: border-box; white-space: nowrap; }',
                'body.' + bc + ' .akira-topbar__items { flex: 0 1 auto; min-width: 0 !important; max-width: calc(100% - 10.5em) !important; overflow: hidden !important; }',
                'body.' + bc + ' .akira-topbar__items:empty { display: none !important; }',
                'body.' + bc + ' .akira-topbar__right { flex: 0 0 auto; margin-left: auto; }',
                'body.' + bc + ' .akira-topbar__item { flex: 0 0 auto; height: 2.34em; min-width: 2.34em; display: inline-flex; align-items: center; justify-content: center; padding: 0 .88em; border-radius: 7px; color: rgba(255,255,255,.9); font-size: .84em; font-weight: 700; white-space: nowrap; transition: background .18s ease, transform .18s ease, color .18s ease; box-sizing: border-box; }',
                'body.' + bc + ' .akira-topbar__icon { width: 2.34em; padding: 0; }',
                'body.' + bc + ' .akira-topbar__icon svg { width: 1.08em; height: 1.08em; }',
                'body.' + bc + ' .akira-topbar__clock { flex: 0 0 auto; height: 2.34em; min-width: 4.1em; display: inline-flex; align-items: center; justify-content: center; padding: 0 .72em; border-radius: 7px; color: rgba(255,255,255,.9); font-size: .84em; font-weight: 800; cursor: default; pointer-events: none; box-sizing: border-box; }',
                'body.' + bc + ' .akira-topbar__item.focus, body.' + bc + ' .akira-topbar__item.hover, body.' + bc + ' .akira-topbar__item.is-active { background: rgba(' + rgb + ',.85); color: #fff; transform: translateY(-1px); }',
                'body.' + bc + '[' + ATTR_ALIGN + '="center"] .akira-topbar { left: 0 !important; right: 0 !important; max-width: none !important; pointer-events: none !important; }',
                'body.' + bc + '[' + ATTR_ALIGN + '="center"] .akira-topbar__inner { position: relative !important; width: 100% !important; justify-content: center !important; pointer-events: none !important; }',
                'body.' + bc + '[' + ATTR_ALIGN + '="center"] .akira-topbar__items { position: absolute !important; left: 50% !important; top: 0 !important; transform: translateX(-50%) !important; max-width: calc(100vw - 2.1em - var(' + BRAND_VAR + ', 5.2em) - var(' + BACK_VAR + ', 0px) - 13em) !important; pointer-events: auto !important; }',
                'body.' + bc + '[' + ATTR_ALIGN + '="center"] .akira-topbar__right { position: absolute !important; right: 1.05em !important; top: 0 !important; margin-left: 0 !important; pointer-events: auto !important; }',
                '@media (min-width: 1800px) { body.' + bc + ' .head__menu-icon.akira-head-brand, body.' + bc + ' .akira-topbar { font-size: 1.1em !important; } }',
                '@media (min-width: 2500px) { body.' + bc + ' .head__menu-icon.akira-head-brand, body.' + bc + ' .akira-topbar { font-size: 1.18em !important; } }',
                '@media (max-width: 900px) { body.' + bc + ' .akira-topbar-backdock { left: calc(.75em + var(' + BRAND_VAR + ', 5.2em) + .42em) !important; top: .55em !important; } body.' + bc + ' .akira-topbar, body.' + bc + '[' + ATTR_ALIGN + '="center"] .akira-topbar { left: calc(.75em + var(' + BRAND_VAR + ', 5.2em) + .62em + var(' + BACK_VAR + ', 0px)) !important; right: .75em !important; top: .55em !important; max-width: calc(100vw - .75em - var(' + BRAND_VAR + ', 5.2em) - .62em - var(' + BACK_VAR + ', 0px) - .75em) !important; } body.' + bc + ' .akira-topbar__inner, body.' + bc + '[' + ATTR_ALIGN + '="center"] .akira-topbar__inner { justify-content: space-between !important; width: 100% !important; } body.' + bc + ' .akira-topbar__items { position: static !important; left: auto !important; top: auto !important; transform: none !important; display: inline-flex !important; flex: 0 0 auto !important; max-width: 2.8em !important; pointer-events: auto !important; } body.' + bc + '[' + ATTR_ALIGN + '="center"] .akira-topbar__items, body.' + bc + ' .akira-topbar__items--no-back { display: none !important; } body.' + bc + ' .akira-topbar__nav { display: none !important; } body.' + bc + ' .akira-topbar__right, body.' + bc + '[' + ATTR_ALIGN + '="center"] .akira-topbar__right { position: static !important; right: auto !important; top: auto !important; margin-left: auto !important; pointer-events: auto !important; } body.' + bc + ' .head__menu-icon.akira-head-brand { left: .75em !important; top: .55em !important; max-width: min(28vw, 13em) !important; } }',
                '@media (max-width: 560px) { body.' + bc + ' .akira-topbar { right: .65em !important; } body.' + bc + ' .akira-topbar-backdock { left: calc(.65em + var(' + BRAND_VAR + ', 5.2em) + .36em) !important; } body.' + bc + ' .akira-topbar__right { gap: .08em !important; padding-left: .14em !important; padding-right: .14em !important; } body.' + bc + ' .head__menu-icon.akira-head-brand { left: .65em !important; max-width: min(30vw, 10em) !important; min-width: 3.8em !important; padding-left: .7em !important; padding-right: .7em !important; } }',
                '@media (max-width: 380px) { body.' + bc + ' .akira-topbar__clock { display: none !important; } }'
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
            try { document.documentElement.style.removeProperty(BACK_VAR); } catch (e2) {}
            var bar = Util.qs('.akira-topbar'); if (bar) bar.remove();
            Util.qsa('.akira-topbar-backdock').forEach(function (node) { try { node.remove(); } catch (e3) {} });
            restoreBrand();
            stopClock();
        }

        function safePatch() {
            state.scheduled = false;
            state.scheduleTimer = null;
            if (!moduleEnabled()) { removeUi(); return; }
            injectStyle();
            syncBody();
            patchBar();
        }
        function schedule(now) {
            if (state.scheduleTimer) clearTimeout(state.scheduleTimer);
            state.scheduled = true;
            state.scheduleTimer = setTimeout(safePatch, now ? 60 : 140);
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

    var Comments = (function () {
        var observer = null;
        var timer = null;

        function pluginEnabled() { return Util.isOn(K.enabled, true); }

        function isCommentsTitle(text) {
            var s = Util.clean(text).toLowerCase();
            return s === 'comments' ||
                s.indexOf('comment') > -1 ||
                s.indexOf('\u043a\u043e\u043c\u043c\u0435\u043d\u0442') > -1 ||
                s.indexOf('\u043a\u043e\u043c\u0435\u043d\u0442') > -1;
        }

        function scan() {
            if (!pluginEnabled()) return;
            try {
                Util.qsa('.items-line').forEach(function (line) {
                    var title = Util.qs('.items-line__title', line);
                    if (!title || !isCommentsTitle(title.textContent || title.innerText || '')) return;
                    line.setAttribute('data-akira-hidden-comments', 'on');
                    line.style.display = 'none';
                });
            } catch (e) {}
        }

        function schedule() {
            clearTimeout(timer);
            timer = setTimeout(scan, 80);
        }

        function hasCommentsLine(nodes) {
            try {
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    if (!node || node.nodeType !== 1) continue;
                    if ((node.classList && node.classList.contains('items-line')) ||
                        (node.classList && node.classList.contains('items-line__title')) ||
                        (node.querySelector && node.querySelector('.items-line, .items-line__title'))) return true;
                }
            } catch (e) {}
            return false;
        }

        function bind() {
            if (observer || !window.MutationObserver) return;
            try {
                observer = new MutationObserver(function (mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                        if (hasCommentsLine(mutations[i].addedNodes || [])) {
                            schedule();
                            return;
                        }
                    }
                });
                observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
            } catch (e) {}
        }

        return {
            start: function () {
                scan();
                bind();
            }
        };
    })();

    var Shots = (function () {
        var originalPutScriptAsync = null;
        var patchInstalled = false;
        var listenersBound = false;
        var waitTimer = null;
        var servicesCaptured = false;
        var previousServices;

        function pluginEnabled() { return Util.isOn(K.enabled, true); }
        function moduleEnabled() { return pluginEnabled() && Util.isOn(K.shotsEnabled, true); }

        function shouldBlock(url) {
            return !!url && String(url).indexOf('/plugin/shots') > -1;
        }

        function syncGlobals() {
            try {
                if (typeof window.lampa_settings === 'undefined' || !window.lampa_settings) window.lampa_settings = {};
                if (moduleEnabled()) {
                    window.plugin_shots_ready = true;
                    if (!servicesCaptured) {
                        previousServices = window.lampa_settings.services;
                        servicesCaptured = true;
                    }
                    window.lampa_settings.services = false;
                } else {
                    try { delete window.plugin_shots_ready; } catch (e2) { window.plugin_shots_ready = false; }
                    if (servicesCaptured) {
                        if (typeof previousServices === 'undefined') delete window.lampa_settings.services;
                        else window.lampa_settings.services = previousServices;
                        servicesCaptured = false;
                        previousServices = undefined;
                    }
                }
            } catch (e) {}
        }

        function installPatch() {
            try {
                if (patchInstalled) return true;
                if (!Lampa.Utils || typeof Lampa.Utils.putScriptAsync !== 'function') return false;

                originalPutScriptAsync = Lampa.Utils.putScriptAsync;
                Lampa.Utils.putScriptAsync = function (items, complite, error, success, show_logs) {
                    if (moduleEnabled() && Array.isArray(items)) {
                        items = items.filter(function (url) { return !shouldBlock(url); });
                    }
                    return originalPutScriptAsync.call(this, items, complite, error, success, show_logs);
                };
                patchInstalled = true;
                return true;
            } catch (e) { return false; }
        }

        function waitForUtils() {
            var tries = 0;
            if (waitTimer) clearInterval(waitTimer);
            waitTimer = setInterval(function () {
                tries++;
                syncGlobals();
                if (installPatch() || tries > 100) {
                    clearInterval(waitTimer);
                    waitTimer = null;
                }
            }, 10);
        }

        function bindListeners() {
            if (listenersBound) return;
            try {
                if (Lampa.Storage && Lampa.Storage.listener && Lampa.Storage.listener.follow) {
                    Lampa.Storage.listener.follow('change', function (e) {
                        if (!e || (e.name !== K.enabled && e.name !== K.shotsEnabled)) return;
                        syncGlobals();
                    });
                    listenersBound = true;
                }
            } catch (e) {}
        }

        return {
            start: function () {
                bindListeners();
                syncGlobals();
                if (!installPatch()) waitForUtils();
            },
            sync: syncGlobals
        };
    })();

    // Shots must patch Lampa.Utils as early as possible; boot() starts it again
    // safely after defaults are ready.
    startModule('Shots early start', Shots);

    var MobilePlayer = (function () {
        var STYLE_ID = 'lampac-mobile-player-safearea-style';
        var RETRY_DELAY_MS = 120;
        var RETRY_LIMIT = 2;
        var listenersBound = false;
        var storageBound = false;
        var state = {
            session: 0,
            playerRoot: null,
            video: null,
            enteredElementFullscreen: false,
            enteredVideoFullscreen: false
        };

        function pluginEnabled() { return Util.isOn(K.enabled, true); }
        function moduleEnabled() { return pluginEnabled() && Util.isOn(K.mobilePlayerEnabled, true); }
        function isFunction(fn) { return typeof fn === 'function'; }

        function syncFlags() {
            try {
                if (moduleEnabled()) {
                    window.lampac_mobile_player_safearea_ready = true;
                    window.lampac_mobile_player_fullscreen_ready = true;
                } else {
                    try { delete window.lampac_mobile_player_safearea_ready; } catch (e1) { window.lampac_mobile_player_safearea_ready = false; }
                    try { delete window.lampac_mobile_player_fullscreen_ready; } catch (e2) { window.lampac_mobile_player_fullscreen_ready = false; }
                }
            } catch (e) {}
        }

        function isMobileContext() {
            try {
                if (!window.Lampa || !Lampa.Platform) return false;
                if (isFunction(Lampa.Platform.tv) && Lampa.Platform.tv()) return false;
                if (isFunction(Lampa.Platform.desktop) && Lampa.Platform.desktop()) return false;
                if (isFunction(Lampa.Platform.screen) && !Lampa.Platform.screen('mobile')) return false;
            } catch (e) { return false; }

            return Boolean(document.body && document.body.classList.contains('true--mobile'));
        }

        function isApkClient() {
            var agent = '';
            try { agent = String(navigator.userAgent || '').toLowerCase(); } catch (e) {}
            return typeof window.AndroidJS !== 'undefined' || agent.indexOf('lampa_client') > -1;
        }

        function ensureViewportFitCover() {
            var meta = document.querySelector('meta[name="viewport"]');
            var content, parts, normalized, i, part;
            var hasViewportFit = false;

            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', 'viewport');
                meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
                (document.head || document.documentElement).appendChild(meta);
                return;
            }

            content = (meta.getAttribute('content') || '').trim();
            parts = content ? content.split(',') : [];
            normalized = [];
            for (i = 0; i < parts.length; i++) {
                part = (parts[i] || '').trim();
                if (!part) continue;
                if (part.toLowerCase().indexOf('viewport-fit') === 0) {
                    normalized.push('viewport-fit=cover');
                    hasViewportFit = true;
                } else {
                    normalized.push(part);
                }
            }
            if (!hasViewportFit) normalized.push('viewport-fit=cover');
            meta.setAttribute('content', normalized.join(', '));
        }

        function removeStyle() {
            try {
                var style = document.getElementById(STYLE_ID);
                if (style && style.parentNode) style.parentNode.removeChild(style);
            } catch (e) {}
        }

        function ensureStyle() {
            var style;
            if (!moduleEnabled()) { removeStyle(); return; }
            if (document.getElementById(STYLE_ID)) return;

            style = document.createElement('style');
            style.id = STYLE_ID;
            style.textContent = [
                'body.true--mobile.player--viewing .player{width:100vw;height:100vh;height:100dvh;}',
                'body.true--mobile.player--viewing .player-info{top:calc(env(safe-area-inset-top,0px) + .75em)!important;left:calc(env(safe-area-inset-left,0px) + .75em)!important;right:calc(env(safe-area-inset-right,0px) + .75em)!important;}',
                'body.true--mobile.player--viewing .player-panel{left:calc(env(safe-area-inset-left,0px) + .75em)!important;right:calc(env(safe-area-inset-right,0px) + .75em)!important;bottom:calc(env(safe-area-inset-bottom,0px) + .75em)!important;width:auto!important;}',
                'body.true--mobile.player--viewing .player-video__subtitles{left:0!important;right:0!important;margin-top:1.5em!important;margin-right:calc(env(safe-area-inset-right,0px) + .75em)!important;margin-bottom:calc(env(safe-area-inset-bottom,0px) + 1.5em)!important;margin-left:calc(env(safe-area-inset-left,0px) + .75em)!important;}',
                'body.true--mobile.player--viewing .player-video__subtitles.on-top{top:0!important;margin-top:calc(env(safe-area-inset-top,0px) + 1.5em)!important;}',
                'body.true--mobile.player--viewing .player-video__backwork-icon{left:calc(env(safe-area-inset-left,0px) + 10%)!important;}',
                'body.true--mobile.player--viewing .player-video__forward-icon{right:calc(env(safe-area-inset-right,0px) + 10%)!important;}'
            ].join('\n');
            (document.head || document.documentElement).appendChild(style);
        }

        function resolvePlayerRoot() {
            var root = null;
            try {
                if (window.Lampa && Lampa.Player && isFunction(Lampa.Player.render)) root = Lampa.Player.render();
            } catch (e) {}
            if (root && root.jquery) return root[0];
            if (root && root.nodeType === 1) return root;
            return document.querySelector('.player');
        }

        function resolvePlayerVideo() {
            try {
                if (window.Lampa && Lampa.PlayerVideo && isFunction(Lampa.PlayerVideo.video)) return Lampa.PlayerVideo.video() || null;
            } catch (e) {}
            return document.querySelector('.player video');
        }

        function getFullscreenElement() {
            return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;
        }

        function markSession(session, key, value) {
            if (state.session !== session) return;
            state[key] = value;
        }

        function requestVideoFullscreen(video, session) {
            var request, result;
            if (!video) return false;

            request = video.requestFullscreen || video.webkitRequestFullscreen || video.mozRequestFullScreen || video.msRequestFullscreen;
            if (request) {
                try {
                    result = request.call(video);
                    if (result && isFunction(result.then)) {
                        result.then(function () { markSession(session, 'enteredElementFullscreen', true); }).catch(function () {});
                    } else {
                        markSession(session, 'enteredElementFullscreen', true);
                    }
                    return true;
                } catch (e) {}
            }

            if (isFunction(video.webkitEnterFullscreen)) {
                try {
                    video.webkitEnterFullscreen();
                    markSession(session, 'enteredVideoFullscreen', true);
                    return true;
                } catch (e2) {}
            }
            return false;
        }

        function requestElementFullscreen(element, session) {
            var request, result;
            if (!element) return false;
            request = element.requestFullscreen || element.webkitRequestFullscreen || element.mozRequestFullScreen || element.msRequestFullscreen;
            if (!request) return false;

            try {
                result = request.call(element);
                if (result && isFunction(result.then)) {
                    result.then(function () { markSession(session, 'enteredElementFullscreen', true); }).catch(function () {
                        if (state.session !== session || getFullscreenElement()) return;
                        requestVideoFullscreen(resolvePlayerVideo(), session);
                    });
                } else {
                    markSession(session, 'enteredElementFullscreen', true);
                }
                return true;
            } catch (e) { return false; }
        }

        function tryEnterFullscreen(session, attempt) {
            var root, video, started = false;
            if (state.session !== session || !moduleEnabled() || !isMobileContext()) return;
            if (getFullscreenElement()) return;

            root = resolvePlayerRoot();
            video = resolvePlayerVideo();
            if (root) state.playerRoot = root;
            if (video) state.video = video;

            if (root) started = requestElementFullscreen(root, session);
            if (!started && video) started = requestVideoFullscreen(video, session);
            if (!started && attempt < RETRY_LIMIT) {
                setTimeout(function () { tryEnterFullscreen(session, attempt + 1); }, RETRY_DELAY_MS);
            }
        }

        function containsElement(parent, child) {
            return Boolean(parent && child && parent.contains && parent.contains(child));
        }

        function exitManagedFullscreen() {
            var exit, fullscreenElement = getFullscreenElement();
            var playerRoot = state.playerRoot;
            var video = state.video;

            if (state.enteredElementFullscreen && fullscreenElement && (fullscreenElement === playerRoot || fullscreenElement === video || containsElement(playerRoot, fullscreenElement))) {
                exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
                if (exit) {
                    try { exit.call(document); } catch (e) {}
                }
            }

            if (state.enteredVideoFullscreen && video) {
                try {
                    if (video.webkitDisplayingFullscreen && isFunction(video.webkitExitFullscreen)) video.webkitExitFullscreen();
                } catch (e2) {}
            }
        }

        function resetState() {
            state.playerRoot = null;
            state.video = null;
            state.enteredElementFullscreen = false;
            state.enteredVideoFullscreen = false;
        }

        function bindPlayerEvents() {
            if (listenersBound) return;
            if (!window.Lampa || !Lampa.Player || !Lampa.Player.listener || !isFunction(Lampa.Player.listener.follow)) return;

            Lampa.Player.listener.follow('ready', function () {
                if (!moduleEnabled()) return;
                state.session += 1;
                resetState();
                tryEnterFullscreen(state.session, 0);
            });

            Lampa.Player.listener.follow('destroy', function () {
                exitManagedFullscreen();
                state.session += 1;
                resetState();
            });

            listenersBound = true;
        }

        function sync() {
            syncFlags();
            if (!moduleEnabled()) {
                removeStyle();
                exitManagedFullscreen();
                state.session += 1;
                resetState();
                return;
            }
            if (!isApkClient()) {
                ensureViewportFitCover();
                ensureStyle();
            }
            bindPlayerEvents();
        }

        function bindStorage() {
            if (storageBound) return;
            try {
                if (Lampa.Storage && Lampa.Storage.listener && Lampa.Storage.listener.follow) {
                    Lampa.Storage.listener.follow('change', function (e) {
                        if (!e || (e.name !== K.enabled && e.name !== K.mobilePlayerEnabled)) return;
                        sync();
                    });
                    storageBound = true;
                }
            } catch (e) {}
        }

        return {
            start: function () {
                removeStyle();
                try { delete window.lampac_mobile_player_safearea_ready; } catch (e1) { window.lampac_mobile_player_safearea_ready = false; }
                try { delete window.lampac_mobile_player_fullscreen_ready; } catch (e2) { window.lampac_mobile_player_fullscreen_ready = false; }
                state.session += 1;
                resetState();
            },
            sync: function () {
                removeStyle();
                state.session += 1;
                resetState();
            }
        };
    })();

    // Mobile fullscreen hooks are disabled for testing player performance.

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
        var memCacheOrder = [];
        var pending = {};
        var logoStorageWrites = 0;
        var LOGO_MEM_CACHE_LIMIT = 2000;
        var LOGO_STORAGE_CACHE_LIMIT = 5000;
        var LOGO_PRUNE_BATCH = 400;
        var LOGO_CACHE_INDEX_KEY = CFG.logoCachePrefix + 'index';
        var LOGO_CACHE_EVENT = 'akira:logo-cache';

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

        function keyFor(item) {
            try {
                var id = Util.tmdbId(item);
                if (!item || !id) return '';
                return cacheKey(Util.mediaType(item), id, lang());
            } catch (e) { return ''; }
        }

        function notifyCached(key, value) {
            if (!key || !value || value === 'none') return;
            try {
                var ev = new CustomEvent(LOGO_CACHE_EVENT, { detail: { key: key, url: value } });
                window.dispatchEvent(ev);
            } catch (e) {}
        }

        function isLogoCacheKey(key) {
            return !!(key && key.indexOf(CFG.logoCachePrefix) === 0 && key !== LOGO_CACHE_INDEX_KEY);
        }

        function rememberCached(key, value) {
            if (!(key in memCache)) memCacheOrder.push(key);
            memCache[key] = value;
            while (memCacheOrder.length > LOGO_MEM_CACHE_LIMIT) {
                delete memCache[memCacheOrder.shift()];
            }
            return value;
        }

        function readLogoIndex() {
            try {
                var raw = localStorage.getItem(LOGO_CACHE_INDEX_KEY);
                var parsed = raw ? JSON.parse(raw) : {};
                return parsed && typeof parsed === 'object' ? parsed : {};
            } catch (e) {
                return {};
            }
        }

        function writeLogoIndex(index) {
            try { localStorage.setItem(LOGO_CACHE_INDEX_KEY, JSON.stringify(index || {})); } catch (e) {}
        }

        function listLogoStorageKeys(storage, index) {
            var keys = [];
            try {
                for (var i = 0; i < storage.length; i++) {
                    var key = storage.key(i);
                    if (!isLogoCacheKey(key)) continue;
                    keys.push(key);
                    if (index && !index[key]) index[key] = 0;
                }
            } catch (e) {}
            return keys;
        }

        function pruneLocalLogoCache(reserve) {
            var index = readLogoIndex();
            var keys = listLogoStorageKeys(localStorage, index);
            var existing = {};
            keys.forEach(function (key) { existing[key] = true; });
            Object.keys(index).forEach(function (key) {
                if (!isLogoCacheKey(key) || !existing[key]) delete index[key];
            });

            var target = Math.max(0, LOGO_STORAGE_CACHE_LIMIT - (reserve || 0));
            if (keys.length <= target) {
                writeLogoIndex(index);
                return;
            }

            keys.sort(function (a, b) { return (index[a] || 0) - (index[b] || 0); });
            keys.slice(0, keys.length - target).forEach(function (key) {
                try { localStorage.removeItem(key); } catch (e) {}
                delete index[key];
            });
            writeLogoIndex(index);
        }

        function pruneSessionLogoCache(reserve) {
            try {
                var keys = listLogoStorageKeys(sessionStorage);
                var target = Math.max(0, LOGO_MEM_CACHE_LIMIT - (reserve || 0));
                if (keys.length <= target) return;
                keys.slice(0, keys.length - target).forEach(function (key) {
                    try { sessionStorage.removeItem(key); } catch (e) {}
                });
            } catch (e) {}
        }

        function setSessionCached(key, value) {
            try {
                sessionStorage.setItem(key, value);
            } catch (e) {
                pruneSessionLogoCache(LOGO_PRUNE_BATCH);
                try { sessionStorage.setItem(key, value); } catch (e2) {}
            }
        }

        function setLocalCached(key, value) {
            var index = readLogoIndex();
            index[key] = new Date().getTime();
            try {
                localStorage.setItem(key, value);
                writeLogoIndex(index);
                logoStorageWrites++;
                if (Object.keys(index).length > LOGO_STORAGE_CACHE_LIMIT || logoStorageWrites % 60 === 0) {
                    pruneLocalLogoCache(0);
                }
            } catch (e) {
                pruneLocalLogoCache(LOGO_PRUNE_BATCH);
                try {
                    localStorage.setItem(key, value);
                    index = readLogoIndex();
                    index[key] = new Date().getTime();
                    writeLogoIndex(index);
                } catch (e2) {}
            }
        }

        function getCached(key) {
            if (key in memCache) return memCache[key];
            try {
                var s = sessionStorage.getItem(key);
                if (s !== null && typeof s !== 'undefined') return rememberCached(key, s);
            } catch (e) {}
            try {
                var l = localStorage.getItem(key);
                if (l !== null && typeof l !== 'undefined') return rememberCached(key, l);
            } catch (e) {}
            return null;
        }

        function setCached(key, value) {
            var v = value || 'none';
            rememberCached(key, v);
            setSessionCached(key, v);
            setLocalCached(key, v);
            notifyCached(key, v);
        }

        function clearCache() {
            memCache = {};
            memCacheOrder = [];
            try {
                var rmS = [];
                for (var i = 0; i < sessionStorage.length; i++) {
                    var k = sessionStorage.key(i);
                    if (isLogoCacheKey(k)) rmS.push(k);
                }
                rmS.forEach(function (k) { sessionStorage.removeItem(k); });
            } catch (e) {}
            try {
                var rm = [];
                for (var j = 0; j < localStorage.length; j++) {
                    var k2 = localStorage.key(j);
                    if (isLogoCacheKey(k2) || k2 === LOGO_CACHE_INDEX_KEY) rm.push(k2);
                }
                rm.forEach(function (k) { localStorage.removeItem(k); });
            } catch (e) {}
        }

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

        var logoQueue = [];
        var logoRunning = 0;
        var LOGO_MAX_CONCURRENT = 2;
        var LOGO_RETRY_DELAY = 1500;

        function enqueueLogoFetch(task) {
            logoQueue.push(task);
            drainLogoQueue();
        }

        function drainLogoQueue() {
            while (logoRunning < LOGO_MAX_CONCURRENT && logoQueue.length) {
                logoRunning++;
                logoQueue.shift()();
            }
        }

        function completeLogoFetch() {
            logoRunning = Math.max(0, logoRunning - 1);
            drainLogoQueue();
        }

        function fetchLogo(url, picker, lng, done, retries) {
            retries = retries || 0;
            try {
                $.get(url, function (res) {
                    var picked = null;
                    try { picked = res ? picker(res.logos, lng) : null; } catch (e) {}
                    completeLogoFetch();
                    done(buildUrl(picked));
                }).fail(function (xhr) {
                    if (xhr && xhr.status === 429 && retries < 3) {
                        setTimeout(function () {
                            fetchLogo(url, picker, lng, done, retries + 1);
                        }, LOGO_RETRY_DELAY * (retries + 1));
                        return;
                    }
                    completeLogoFetch();
                    done(null);
                });
            } catch (e) {
                completeLogoFetch();
                done(null);
            }
        }

        function methodA(item, type, lng, key, done) {
            var url;
            try {
                url = Lampa.TMDB.api(type + '/' + Util.tmdbId(item) + '/images?api_key=' + Lampa.TMDB.key() + '&include_image_language=' + lng + ',ru,en,null');
            } catch (e) { return done(null); }

            enqueueLogoFetch(function () {
                fetchLogo(url, pickBest, lng, done);
            });
        }

        function methodB(item, type, lng, key, done) {
            var url;
            try {
                url = Lampa.TMDB.api(type + '/' + Util.tmdbId(item) + '/images?api_key=' + Lampa.TMDB.key() + '&include_image_language=' + lng + ',en,null');
            } catch (e) { return done(null); }

            enqueueLogoFetch(function () {
                fetchLogo(url, pickInterface, lng, done);
            });
        }

        function resolve(item, cb) {
            cb = cb || function () {};
            try {
                if (!moduleEnabled()) return cb(null);
                var id = Util.tmdbId(item);
                if (!item || !id) return cb(null);
                var source = item.source || 'tmdb';
                if (source !== 'tmdb' && source !== 'cub' && source !== 'akira_tmdb' && !item.tmdb_id && !item.tmdbid && !item.tmdb) return cb(null);
                if (!Lampa.TMDB || typeof Lampa.TMDB.api !== 'function' || typeof Lampa.TMDB.key !== 'function') return cb(null);

                var type = Util.mediaType(item);
                var lng = lang();
                var key = keyFor(item);
                if (!key) return cb(null);

                var cached = getCached(key);
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
                        flushPending(key, null);
                    });
                });
            } catch (e) { cb(null); }
        }

        function cached(item) {
            try {
                if (!moduleEnabled()) return null;
                var id = Util.tmdbId(item);
                if (!item || !id) return null;
                var source = item.source || 'tmdb';
                if (source !== 'tmdb' && source !== 'cub' && source !== 'akira_tmdb' && !item.tmdb_id && !item.tmdbid && !item.tmdb) return null;
                var url = getCached(keyFor(item));
                return url && url !== 'none' ? url : null;
            } catch (e) { return null; }
        }

        function preload(item) { resolve(item, function () {}); }

        function setImageSizing(i){if(!i)return;i.style.height='';i.style.width='';i.style.maxHeight='';i.style.maxWidth='';i.style.objectFit='contain';i.style.objectPosition='left bottom';}

        function makeLogoImage(cls, titleText, url) {
            var img = new Image();
            img.className = cls;
            img.alt = titleText;
            img.src = url;
            setImageSizing(img);
            return img;
        }

        function setContentInstant(container, node) {
            if (!container) return;
            container.style.opacity = '';
            container.style.height = '';
            container.style.overflow = '';
            container.style.display = '';
            container.innerHTML = '';
            if (typeof node === 'string') container.textContent = node;
            else if (node) container.appendChild(node);
        }

        var FADE_OUT_MS=300,MORPH_MS=400,FADE_IN_MS=400;
        function rafAnimate(el,prop,from,to,dur,cb){var s=null;function step(ts){if(!s)s=ts;var t=Math.min((ts-s)/dur,1),e=1-Math.pow(1-t,3);el.style[prop]=(from+(to-from)*e)+(prop==='opacity'?'':'px');if(t<1)requestAnimationFrame(step);else if(cb)cb();}requestAnimationFrame(step);}
        function swapContent(container,newNode){
            if(!container)return;
            var isImg=newNode&&typeof newNode!=='string'&&newNode.tagName==='IMG';
            if(!isImg){rafAnimate(container,'opacity',1,0,FADE_OUT_MS,function(){container.innerHTML='';if(typeof newNode==='string')container.textContent=newNode;else container.appendChild(newNode);rafAnimate(container,'opacity',0,1,FADE_IN_MS);});return;}
            var startH=container.getBoundingClientRect().height;
            rafAnimate(container,'opacity',1,0,FADE_OUT_MS,function(){
                container.innerHTML='';container.appendChild(newNode);container.style.opacity='1';newNode.style.opacity='0';
                var targetH=container.getBoundingClientRect().height;
                container.style.height=startH+'px';container.style.overflow='hidden';container.style.display='block';container.style.boxSizing='border-box';
                rafAnimate(container,'height',startH,targetH,MORPH_MS,function(){container.style.height='';container.style.overflow='';container.style.display='';});
                setTimeout(function(){rafAnimate(newNode,'opacity',0,1,FADE_IN_MS);},Math.max(0,MORPH_MS-100));
            });
        }

        function applyToInfo(ctx, item, titleText) {
            if (!ctx || !ctx.title || !item) return;
            var titleEl = ctx.title[0] || ctx.title;
            if (!titleEl) return;

            var requestId = (titleEl.__akira_logo_req || 0) + 1;
            titleEl.__akira_logo_req = requestId;

            if (titleEl.textContent !== titleText) titleEl.textContent = titleText;
            if (titleEl.classList) titleEl.classList.remove('akira-title-has-logo');
            if (!moduleEnabled()) return;

            resolve(item, function (url) {
                if (titleEl.__akira_logo_req !== requestId) return;
                if (!titleEl.isConnected) return;
                if (!url) {
                    if (titleEl.classList) titleEl.classList.remove('akira-title-has-logo');
                    if (titleEl.querySelector && titleEl.querySelector('img')) swapContent(titleEl, titleText);
                    else titleEl.textContent = titleText;
                    return;
                }
                    if (titleEl.classList) titleEl.classList.add('akira-title-has-logo');
                    swapContent(titleEl, makeLogoImage('akira-info-logo', titleText, url));
            });
        }

        function applyToCard(card, movieData) {
            function connected(node) {
                if (!node) return false;
                if (typeof node.isConnected === 'boolean') return node.isConnected;
                return !!(document.documentElement && document.documentElement.contains && document.documentElement.contains(node));
            }
            if (!card || (!card.data && !movieData) || typeof card.render !== 'function') return;
            if (!Util.isOn(K.ifaceCardLogos, true)) return;

            var jq = card.render(true);
            var root = (jq && jq[0]) ? jq[0] : jq;
            if (!root) return;
            var view = root.querySelector ? root.querySelector('.card__view') : null;
            var label = root.querySelector ? root.querySelector('.akira-card-title, .new-interface-card-title') : null;
            var serviceView = view && (
                (view.classList && view.classList.contains('bookmarks-folder__inner')) ||
                (view.closest && view.closest('.card-episode__footer,.bookmarks-folder,.register,.full-person,.card-more'))
            );
            if (!view || serviceView || (root.classList && !root.classList.contains('card'))) {
                if (root.querySelectorAll) {
                    ['.akira-card-title', '.akira-card-logo', '.akira-card-type', '.akira-card-rating', '.akira-card-quality'].forEach(function (selector) {
                        var nodes = root.querySelectorAll(selector);
                        Array.prototype.forEach.call(nodes, function (node) {
                            if (node && node.parentNode) node.parentNode.removeChild(node);
                        });
                    });
                }
                if (view && view.classList) view.classList.remove('akira-card-has-logo');
                if (label) label.style.display = '';
                return;
            }
            var data = movieData || card.__akiraMetaData || card.data;
            var titleText = ((data.title || data.name || data.original_title || data.original_name || '') + '').trim();
            try { card.__akiraLogoKey = keyFor(data); } catch (e) {}

            var reqId = (card.__akira_logo_req || 0) + 1;
            card.__akira_logo_req = reqId;

            function removeLogo() {
                var ex = view.querySelector('.akira-card-logo');
                if (ex && ex.parentNode) ex.parentNode.removeChild(ex);
                if (view && view.classList) view.classList.remove('akira-card-has-logo');
                if (label) label.style.display = '';
            }

            if (!moduleEnabled()) { removeLogo(); return; }

            var wrap = view.querySelector('.akira-card-logo');
            if (!wrap) {
                wrap = document.createElement('div');
                wrap.className = 'akira-card-logo';
                view.appendChild(wrap);
            }
            try { wrap.setAttribute('data-akira-logo-owner', 'card'); } catch (e) {}

            resolve(data, function (url) {
                if (card.__akira_logo_req !== reqId) return;
                if (!connected(root)) return;
                if (!url) { removeLogo(); return; }
                if (view && view.classList) view.classList.add('akira-card-has-logo');
                var img = new Image();
                img.alt = titleText;
                img.src = url;
                setImageSizing(img);
                wrap.innerHTML = '';
                wrap.appendChild(img);
                if (label) label.style.display = '';
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
                    var v = root.querySelector('.card__view') || root;
                    if (v && v.classList) v.classList.remove('akira-card-has-logo');
                }
                delete card.__akira_logo_req;
            } catch (e) {}
        }

        function applyToFull(activity, item) {
            try {
                if (!activity || typeof activity.render !== 'function' || !item) return;
                var container = activity.render();
                if (!container || typeof container.find !== 'function') return;
                try {
                    var root = container[0];
                    if (root && root.style) {
                        var bg = item.backdrop_path ? Lampa.TMDB.image('t/p/original' + item.backdrop_path) : (item.poster_path ? Lampa.TMDB.image('t/p/w780' + item.poster_path) : (item.img || ''));
                        if (bg) root.style.setProperty('--akira-mobile-bg', 'url(' + bg + ')');
                    }
                } catch (bgErr) {}
                var titleNode = container.find('.full-start-new__title, .full-start__title');
                if (!titleNode || !titleNode.length) return;
                var titleEl = titleNode[0];
                var titleText = ((item.title || item.name || item.original_title || item.original_name || '') + '').trim() || (titleNode.text() + '');
                if (titleEl.classList) titleEl.classList.remove('akira-title-has-logo');
                if (!moduleEnabled()) return;

                if (!titleEl.__akira_full_orig) titleEl.__akira_full_orig = titleText;
                var originalText = titleEl.__akira_full_orig || titleText;

                var requestId = (titleEl.__akira_logo_req || 0) + 1;
                titleEl.__akira_logo_req = requestId;

                var cachedUrl = cached(item);
                if (cachedUrl) {
                    if (titleEl.classList) titleEl.classList.add('akira-title-has-logo');
                    setContentInstant(titleEl, makeLogoImage('akira-full-logo', originalText, cachedUrl));
                    return;
                }

                if (titleEl.querySelector && titleEl.querySelector('img.akira-full-logo')) {
                    if (titleEl.classList) titleEl.classList.remove('akira-title-has-logo');
                    setContentInstant(titleEl, originalText);
                }
                else if (titleNode.text() !== originalText) titleNode.text(originalText);

                resolve(item, function (url) {
                    if (titleEl.__akira_logo_req !== requestId) return;
                    if (!titleEl.isConnected) return;
                    if (!url) {
                        if (titleEl.classList) titleEl.classList.remove('akira-title-has-logo');
                        if (titleEl.querySelector && titleEl.querySelector('img.akira-full-logo')) swapContent(titleEl, originalText);
                        else if (titleNode.text() !== originalText) titleNode.text(originalText);
                        return;
                    }
                    if (titleEl.classList) titleEl.classList.add('akira-title-has-logo');
                    swapContent(titleEl, makeLogoImage('akira-full-logo', originalText, url));
                });
            } catch (e) {}
        }

        function injectStyle() {
            var id = 'akira-logos-style';
            var style = document.getElementById(id) || document.createElement('style');
            style.id = id;
            var css = [
                ':root{--akira-logo-max-h: clamp(3.6em, 10.4vh, 6.8em); --akira-full-logo-max-h: clamp(4.9em, 11.1vh, 8.3em); --akira-card-logo-area-h:50%; --akira-card-logo-max-w:80%; --akira-card-meta-h:1.55em;}',
                '.akira-card-logo{position:absolute;left:0;right:0;bottom:0;height:calc(var(--akira-card-logo-area-h) + var(--akira-card-meta-h));min-height:0;padding:.25em .55em calc(var(--akira-card-meta-h) + .22em);box-sizing:border-box;pointer-events:none;background:linear-gradient(to top,rgba(0,0,0,.9) 0%,rgba(0,0,0,.62) 36%,rgba(0,0,0,.28) 72%,rgba(0,0,0,0) 100%);z-index:13;display:flex;align-items:flex-end;justify-content:flex-start;overflow:hidden;}',
                '.akira-card-logo img{position:relative;z-index:1;display:block;max-width:var(--akira-card-logo-max-w);max-height:calc(100% - var(--akira-card-meta-h) - .25em);width:auto!important;height:auto!important;object-fit:contain!important;object-position:left bottom!important;}',
                '.akira-info-logo{display:block;max-width:min(41.4vw,27.9em);max-height:var(--akira-logo-max-h);width:auto!important;height:auto!important;object-fit:contain!important;object-position:left bottom!important;}',
                '.full-start-new__title img.akira-full-logo, .full-start__title img.akira-full-logo{display:block;max-width:min(56vw,43em);max-height:var(--akira-full-logo-max-h);width:auto!important;height:auto!important;object-fit:contain!important;object-position:left bottom!important;margin-top:.2em;filter:none!important;background:none!important;box-shadow:none!important;}',
                '.akira-info__title.akira-title-has-logo,.full-start-new__title.akira-title-has-logo,.full-start__title.akira-title-has-logo{display:block!important;overflow:visible!important;text-overflow:clip!important;-webkit-line-clamp:initial!important;line-height:1!important;}',
                '.full-start-new,.full-start{position:relative!important;overflow:hidden!important;margin:0 0 clamp(1.2em,3vh,2.6em) 0!important;padding:0!important;background:none!important;}',
                '.full-start-new .full-start-new__background,.full-start-new .full-start__background,.full-start__background{position:absolute!important;top:-6em!important;left:0!important;width:100%!important;height:calc(100% + 6em)!important;margin:0!important;padding:0!important;mask-image:none!important;-webkit-mask-image:none!important;}',
                '.full-start-new .full-start-new__background img,.full-start-new .full-start__background img,.full-start__background img{width:100%!important;height:100%!important;object-fit:cover!important;filter:none!important;}',
                '.full-start-new::after,.full-start::after,.full-start-new__gradient,.full-start__gradient,.full-start-new__mask,.full-start__mask,.applecation__overlay,.application__overlay{display:none!important;content:none!important;background:none!important;}',
                '.full-start-new::before,.full-start::before{content:""!important;display:block!important;position:absolute!important;top:-6em!important;left:0!important;right:0!important;bottom:auto!important;height:calc(100% + 6em)!important;background:linear-gradient(to top,var(--akira-bg,#0a0d12) 0%,rgba(10,13,18,.9) 18%,rgba(10,13,18,.5) 44%,transparent 80%)!important;opacity:.66!important;z-index:1!important;pointer-events:none!important;}',
                '.full-start-new__title,.full-start__title,.full-start-new__head,.full-start__head,.full-start-new__details,.full-start__details,.full-start-new__right,.full-start__right,.full-start-new__body,.full-start__body{background:none!important;background-color:transparent!important;background-image:none!important;box-shadow:none!important;}',
                '.full-start-new__title::before,.full-start-new__title::after,.full-start__title::before,.full-start__title::after,.full-start-new__right::before,.full-start-new__right::after,.full-start__right::before,.full-start__right::after,.full-start-new__body::before,.full-start-new__body::after,.full-start__body::before,.full-start__body::after{display:none!important;content:none!important;background:none!important;}',
                '.full-start-new__body,.full-start__body{position:relative!important;z-index:2!important;padding-left:5%!important;display:flex!important;align-items:flex-end!important;min-height:calc(100vh - 1.6em)!important;min-height:calc(100svh - 1.6em)!important;padding-top:6em!important;padding-bottom:clamp(4.2em,7vh,7.4em)!important;box-sizing:border-box!important;}',
                '.full-start-new__left,.full-start__left{display:none!important;}',
                '.full-start-new__right,.full-start__right{position:relative!important;z-index:3!important;width:min(1500px,92vw)!important;max-width:min(1500px,92vw)!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:flex-end!important;gap:0!important;}',
                '.full-start-new__title,.full-start__title{font-family:var(--akira-font,Arial,sans-serif)!important;font-weight:800!important;font-size:clamp(1.8em,3.4vw,2.8em)!important;line-height:1.08!important;color:#fff!important;text-shadow:0 2px 10px rgba(0,0,0,.7),0 6px 24px rgba(0,0,0,.8)!important;margin-bottom:8px!important;max-width:100%!important;}',
                '.full-start-new__head,.full-start__head,.full-start-new__rate-line,.full-start__rate-line,.full-start-new__details,.full-start__details{font-family:var(--akira-font,Arial,sans-serif)!important;font-weight:500!important;font-size:.82em!important;line-height:1.3!important;color:rgba(255,255,255,.74)!important;text-shadow:0 2px 4px rgba(0,0,0,.5)!important;margin:0 0 2px 0!important;}',
                '.full-start-new__tagline,.full-start__tagline{font-family:var(--akira-font,Arial,sans-serif)!important;font-weight:500!important;font-style:italic!important;font-size:.88em!important;line-height:1.3!important;color:rgba(255,255,255,.65)!important;text-shadow:0 2px 4px rgba(0,0,0,.5)!important;margin:0 0 4px 0!important;padding:0!important;}',
                '.full-start-new__text,.full-start__text,.full-start-new__description,.full-start__description{font-family:var(--akira-font,Arial,sans-serif)!important;font-weight:500!important;color:rgba(255,255,255,.72)!important;font-size:.85em!important;line-height:1.4!important;text-shadow:0 2px 4px rgba(0,0,0,.5)!important;max-width:520px!important;margin:0 0 6px 0!important;}',
                '.full-start-new__reactions,.full-start__reactions{display:none!important;height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;}',
                '.full-start-new__buttons,.full-start__buttons{display:flex!important;align-items:center!important;flex-wrap:nowrap!important;column-gap:.45em!important;row-gap:.55em!important;width:100%!important;max-width:100%!important;overflow:visible!important;padding-bottom:clamp(2.2em,4vh,3.8em)!important;}',
                '.full-start-new__buttons .full-start__button,.full-start__buttons .full-start__button{flex:0 1 auto!important;margin:0!important;min-width:3.15em!important;max-width:100%!important;padding-left:.86em!important;padding-right:.86em!important;box-sizing:border-box!important;white-space:nowrap!important;}',
                '.full-start-new__buttons .full-start__button span,.full-start__buttons .full-start__button span{min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;}',
                '.full-start-new__buttons .button--play,.full-start__buttons .button--play{order:1!important;}',
                '.full-start-new__buttons .view--trailer,.full-start__buttons .view--trailer{order:2!important;}',
                '.full-start-new__buttons .view--torrent,.full-start__buttons .view--torrent{order:3!important;}',
                '.full-start-new__buttons .button--book,.full-start__buttons .button--book{order:4!important;}',
                '.full-start-new__buttons .button--reaction,.full-start__buttons .button--reaction{order:5!important;}',
                '.full-start-new__buttons .button--subscribe,.full-start__buttons .button--subscribe{order:6!important;}',
                '.full-start-new__buttons .button--options,.full-start__buttons .button--options{order:7!important;}',
                '.full-start__button,.full-start-new__button{font-family:var(--akira-font,Arial,sans-serif)!important;font-weight:600!important;border-radius:8px!important;border:1px solid rgba(255,255,255,.1)!important;background:rgba(120,120,120,.2)!important;backdrop-filter:blur(10px)!important;-webkit-backdrop-filter:blur(10px)!important;box-shadow:0 4px 16px rgba(0,0,0,.3)!important;color:rgba(255,255,255,.82)!important;text-shadow:0 2px 4px rgba(0,0,0,.5)!important;transition:background 300ms ease,transform 200ms ease,box-shadow 300ms ease,border-color 300ms ease!important;}',
                '.full-start__button.focus,.full-start__button:hover,.full-start-new__button.focus,.full-start-new__button:hover{background:rgba(var(--akira-accent-rgb,229,9,20),.7)!important;border-color:rgba(255,255,255,.3)!important;color:#fff!important;box-shadow:0 0 20px rgba(var(--akira-accent-rgb,229,9,20),.5),0 8px 28px rgba(0,0,0,.4)!important;transform:scale(1.04)!important;}',
                '@media(min-width:1600px), (min-height:900px){.full-start-new__body,.full-start__body{min-height:calc(100vh - 1.6em)!important;min-height:calc(100svh - 1.6em)!important;padding-bottom:clamp(4.8em,7vh,7.8em)!important;}.full-start-new__right,.full-start__right{width:min(1600px,90vw)!important;max-width:min(1600px,90vw)!important;}}',
                '@media(max-width:768px){.full-start-new__background,.full-start__background{display:none!important;}.full-start-new,.full-start{background-image:var(--akira-mobile-bg)!important;background-size:cover!important;background-position:center top!important;background-repeat:no-repeat!important;margin-top:-5.5em!important;padding-top:5.5em!important;}.applecation__overlay,.application__overlay{display:block!important;background:linear-gradient(to top,var(--akira-bg,#0a0d12) 0%,rgba(10,13,18,.85) 40%,rgba(10,13,18,.2) 75%,transparent 100%)!important;position:absolute!important;inset:0!important;pointer-events:none!important;}}',
                '@media(max-width:900px){.full-start-new__buttons,.full-start__buttons{flex-wrap:wrap!important;}.full-start-new__buttons .full-start__button,.full-start__buttons .full-start__button{padding-left:.75em!important;padding-right:.75em!important;}}',
                '@media(max-width:576px){.full-start-new__title,.full-start__title{font-size:1.5em!important;margin-bottom:4px!important;}.full-start-new__title img,.full-start__title img{max-height:110px!important;}.full-start-new__body,.full-start__body{min-height:calc(100vh - .5em)!important;min-height:calc(100svh - .5em)!important;padding-left:2%!important;padding-bottom:2.5em!important;}.full-start-new__right,.full-start__right{max-width:94vw!important;}}'
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
            keyFor: keyFor,
            cacheEvent: LOGO_CACHE_EVENT,
            cached: cached,
            clearCache: clearCache,
            enabled: moduleEnabled
        };
    })();

    var Interface = (function () {
        var started = false;
        var trackedLines = [];
        var logoCardRegistry = {};
        var refreshCardsTimer = null;
        var lifecycleBound = false;
        var HERO_OPEN_FALLBACK_MS = 900;
        var HERO_SWAP_FALLBACK_MS = 360;
        var HERO_INFO_FALLBACK_MS = 420;
        var HERO_CLOSE_FALLBACK_MS = 900;

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
                '.akira-info{position:relative;padding:0 1.5em;height:0;opacity:0;overflow:hidden;z-index:3;pointer-events:none;border:0!important;outline:0!important;box-shadow:none!important;background:transparent!important;will-change:height,opacity,padding;transition:height .58s cubic-bezier(.2,.8,.2,1),padding-top .58s cubic-bezier(.2,.8,.2,1),padding-bottom .58s cubic-bezier(.2,.8,.2,1),opacity .58s ease;}',
                '.akira-iface[data-akira-hero-state="opening"] .akira-info,.akira-iface[data-akira-hero-state="shown"] .akira-info,.akira-iface[data-akira-hero-state="closing"] .akira-info{height:var(--ni-info-h);padding-top:1.5em;padding-bottom:1.5em;opacity:1;}',
                '.akira-iface[data-akira-hero-state="shown"] .akira-info{pointer-events:auto;}',
                '.akira-info:before{display:none !important;}',
                '.akira-info__body{position:relative;z-index:1;width:min(96%,94em);padding-top:1.1em;display:grid;grid-template-columns:minmax(0,1fr) minmax(30em,.95fr);column-gap:clamp(28px,4.4vw,104px);align-items:end;height:100%;box-sizing:border-box;opacity:0;transform:translateY(.7em);will-change:opacity,transform;transition:opacity .26s ease,transform .52s cubic-bezier(.2,.8,.2,1);}',
                '.akira-iface[data-akira-hero-state="shown"] .akira-info__body{opacity:1;transform:none;}',
                '.akira-iface[data-akira-hero-state="closing"] .akira-info__body{opacity:0;transform:none;transition:opacity .24s ease-out;}',
                '.akira-info__left,.akira-info__right{min-width:0;height:100%;}',
                '.akira-info__textblock{margin-top:auto;display:flex;flex-direction:column;gap:.55em;min-height:0;max-width:min(52em,100%);padding:.85em 1em .95em;border-radius:10px;background:linear-gradient(90deg,rgba(5,7,12,.54),rgba(5,7,12,.32) 66%,rgba(5,7,12,.12));box-shadow:0 14px 46px rgba(0,0,0,.22);backdrop-filter:blur(1px);-webkit-backdrop-filter:blur(1px);}',
                '.akira-info__right{padding-top:clamp(.2em,2.2vh,1.6em);padding-bottom:clamp(.8em,2.4vh,2em);display:flex;flex-direction:column;align-items:flex-end;justify-self:end;transform:none;}',
                '.akira-info__head{color:rgba(255,255,255,.6);margin-bottom:1em;font-size:1.3em;min-height:1em;}',
                '.akira-info__head span{color:#fff;}',
                '.akira-info__title{font-size:clamp(2.6em,4vw,3.6em);font-weight:600;margin-bottom:.3em;overflow:hidden;text-overflow:".";display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.2;margin-left:-.03em;text-shadow:0 2px 16px rgba(0,0,0,.7),0 0 40px rgba(0,0,0,.4);}',
                '.akira-info__original{font-size:clamp(1em,1.45vw,1.45em);font-weight:500;line-height:1.18;color:rgba(255,255,255,.82);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 2px 12px rgba(0,0,0,.82);margin-top:-.1em;}',
                '.akira-info__meta{margin-bottom:0;display:flex;flex-direction:column;gap:.35em;min-height:1em;}',
                '.akira-info__meta-top{display:flex;align-items:center;gap:.55em;flex-wrap:nowrap;min-height:1.9em;min-width:0;}',
                '.akira-info__rate{flex:0 0 auto;}',
                '.akira-info__genres{flex:1 1 auto;min-width:0;font-size:1.1em;line-height:1.25;overflow:hidden;text-overflow:".";display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;}',
                '.akira-info__runtime{flex:0 0 auto;font-size:1.05em;white-space:nowrap;}',
                '.akira-info__dot{flex:0 0 auto;font-size:.85em;opacity:.75;}',
                '.akira-info__pg{flex:0 0 auto;white-space:nowrap;}',
                '.akira-info__pg .full-start__pg{font-size:.95em;}',
                '.akira-info__description{font-size:.87em;font-weight:400;line-height:1.38;color:rgba(255,255,255,.94);text-shadow:0 1px 2px rgba(0,0,0,.92),0 4px 18px rgba(0,0,0,.82);overflow:hidden;text-overflow:".";display:-webkit-box;-webkit-line-clamp:7;-webkit-box-orient:vertical;width:auto;}',
                'body.' + CFG.bodyClass + '[data-akira-hero-info="hide_description"] .akira-info__description,body.' + CFG.bodyClass + '[data-akira-hero-info="hide_all"] .akira-info__description{display:none!important;}',
                'body.' + CFG.bodyClass + '[data-akira-hero-info="hide_meta"] .akira-info__meta,body.' + CFG.bodyClass + '[data-akira-hero-info="hide_all"] .akira-info__meta{display:none!important;}',
                '.akira-iface .akira-info__background{position:absolute!important;left:0!important;right:0!important;top:0!important;height:0!important;overflow:hidden!important;pointer-events:none!important;z-index:0!important;opacity:0;will-change:height,opacity;transition:height .58s cubic-bezier(.2,.8,.2,1),opacity .58s ease;}',
                '.akira-iface[data-akira-hero-state="opening"] .akira-info__background,.akira-iface[data-akira-hero-state="shown"] .akira-info__background,.akira-iface[data-akira-hero-state="closing"] .akira-info__background{height:var(--ni-info-h)!important;opacity:1;}',
                '.akira-iface .akira-info__background img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;opacity:0;transition:opacity .55s ease-in-out;will-change:opacity;filter:none!important;}',
                '.akira-iface .akira-info__background img.active{opacity:1;}',
                '.akira-iface[data-akira-hero="fullscreen"][data-akira-hero-state="opening"] .akira-info__background,.akira-iface[data-akira-hero="fullscreen"][data-akira-hero-state="shown"] .akira-info__background,.akira-iface[data-akira-hero="fullscreen"][data-akira-hero-state="closing"] .akira-info__background{position:fixed!important;left:0!important;right:0!important;top:0!important;bottom:0!important;width:100vw!important;height:100vh!important;z-index:0!important;}',
                '.akira-iface[data-akira-hero="fullscreen"] .akira-info__background::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(to top,var(--akira-bg,#0a0d12) 0%,rgba(10,13,18,.78) 38%,rgba(10,13,18,.18) 72%,transparent 100%);z-index:1;}',
                '.akira-iface[data-akira-hero="fullscreen"] .akira-info{position:relative!important;z-index:2!important;}',
                '.akira-iface[data-akira-hero="fullscreen"] .akira-info__right{background:none!important;}',
                '@media(max-width:900px){.akira-iface .akira-info,.akira-iface .akira-info__background{display:none!important;height:0!important;min-height:0!important;padding-top:0!important;padding-bottom:0!important;opacity:0!important;overflow:hidden!important;}.akira-iface-h,.akira-iface-h[data-akira-hero-state]{--ni-line-head-shift:0;--ni-line-body-shift:0;}}',
                '@media(max-width:767px){.akira-iface[data-akira-hero="fullscreen"][data-akira-hero-state="opening"] .akira-info__background,.akira-iface[data-akira-hero="fullscreen"][data-akira-hero-state="shown"] .akira-info__background,.akira-iface[data-akira-hero="fullscreen"][data-akira-hero-state="closing"] .akira-info__background{position:absolute!important;height:var(--ni-info-h)!important;width:100%!important;}.akira-iface[data-akira-hero="fullscreen"] .akira-info__background::after{display:none;}}',
                '.akira-iface .full-start__rate{font-size:1.3em;margin-right:0;}',
                '.akira-iface .full-start__lines{padding-bottom:env(safe-area-inset-bottom,0px);}',
                '.akira-iface .card__promo{display:none;}',
                '.akira-iface .card__type{display:none !important;}',
                '.akira-iface .card__vote{display:none !important;}',
                '.akira-iface .card__quality{display:none !important;}',
                '.akira-iface .card-episode__footer .akira-card-logo,.akira-iface .card-episode__footer .akira-card-title,.akira-iface .card-episode__footer .akira-card-type,.akira-iface .card-episode__footer .akira-card-rating,.akira-iface .card-episode__footer .akira-card-quality{display:none !important;}',
                '.akira-iface .bookmarks-folder__inner .akira-card-logo,.akira-iface .bookmarks-folder__inner .akira-card-title,.akira-iface .bookmarks-folder__inner .akira-card-type,.akira-iface .bookmarks-folder__inner .akira-card-rating,.akira-iface .bookmarks-folder__inner .akira-card-quality{display:none !important;}',
                '.akira-iface .card .card-watched{display:none !important;}',
                '.akira-iface .card{position:relative !important;transition:transform .3s cubic-bezier(.4,0,.2,1),z-index 0s !important;transform-origin:center center !important;}',
                '.akira-iface .card.focus,.akira-iface .card.hover,.akira-iface .card:hover{z-index:100 !important;transform:scale(1.06) !important;}',
                '.akira-iface .card .card__view{position:relative;overflow:hidden !important;border-radius:8px !important;border:2px solid transparent;transition:border-color .25s ease,box-shadow .25s ease;}',
                '.akira-iface .card.focus .card__view,.akira-iface .card.hover .card__view,.akira-iface .card:hover .card__view{border-color:var(--akira-accent,#e50914);box-shadow:0 0 0 3px rgba(var(--akira-accent-rgb,229,9,20),.30),0 0 22px 3px rgba(var(--akira-accent-rgb,229,9,20),.46),0 8px 28px rgba(0,0,0,.58);}',
                '.akira-iface .card.focus ~ .card,.akira-iface .card.hover ~ .card,.akira-iface .card:hover ~ .card{transform:translateX(8px) !important;z-index:1 !important;}',
                '.akira-iface .akira-card-type,.akira-iface .akira-card-rating,.akira-iface .akira-card-quality{position:absolute;z-index:22;pointer-events:none;font-family:var(--akira-font,Arial,sans-serif);font-weight:800;line-height:1.25;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.55);box-shadow:0 2px 10px rgba(0,0,0,.42);max-width:calc(100% - 12px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
                '.akira-iface .akira-card-type{left:6px;top:6px;padding:.32em .55em;border-radius:6px 0 6px 0;background:rgba(var(--akira-accent-rgb,229,9,20),.86);font-size:.68em;letter-spacing:0;text-transform:uppercase;}',
                '.akira-iface .akira-card-quality{display:block !important;left:auto !important;right:6px !important;bottom:auto !important;top:6px !important;padding:2px 8px !important;border-radius:4px !important;background:rgba(46,204,113,.88) !important;color:#fff !important;font-size:.7em !important;font-weight:800 !important;text-transform:uppercase !important;letter-spacing:0 !important;z-index:22 !important;}',
                '.akira-iface .card__view.akira-card-has-rating .akira-card-quality{top:calc(6px + 2.05em) !important;}',
                '.akira-iface .akira-card-rating{display:block !important;right:6px !important;left:auto !important;bottom:auto !important;top:6px !important;padding:2px 8px !important;border-radius:10px 0 10px 0 !important;background:rgba(12,14,20,.68);border:1px solid rgba(255,255,255,.14);color:#ffd13d !important;font-size:.75em !important;font-weight:900 !important;z-index:23 !important;backdrop-filter:blur(8px) saturate(140%);-webkit-backdrop-filter:blur(8px) saturate(140%);}',
                '.akira-card-title{position:absolute;left:0;right:0;bottom:0;padding:.42em .55em .72em;color:#fff;pointer-events:none;background:linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.52) 68%,transparent 100%);z-index:16;box-sizing:border-box;}','.akira-ct-meta{position:relative;z-index:2;display:block;font-size:.66em;font-weight:700;line-height:1.15;color:rgba(255,255,255,.86);margin:.24em 0 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 1px 5px rgba(0,0,0,.9);}','.akira-ct-name{position:relative;z-index:2;display:block;font-size:.82em;font-weight:700;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 1px 5px rgba(0,0,0,.9);}','.akira-card-has-logo .akira-card-title{bottom:0;padding:.15em .55em .62em;background:none;}','.akira-card-has-logo .akira-ct-name{display:none;}',
                'body.light--version .akira-card-title{color:#fff;}',
                '.akira-iface-h{--ni-line-head-shift:-2vh;--ni-line-body-shift:-3vh;}',
                '.akira-iface-h[data-akira-hero-state="empty"],.akira-iface-h[data-akira-hero-state="hiding"]{--ni-line-head-shift:0;--ni-line-body-shift:0;}',
                '.akira-iface-h .items-line__head{position:relative;top:var(--ni-line-head-shift);z-index:2;transition:top .56s cubic-bezier(.2,.8,.2,1);}',
                '.akira-iface-h .items-line__body > .scroll.scroll--horizontal{position:relative;top:var(--ni-line-body-shift);z-index:1;transition:top .56s cubic-bezier(.2,.8,.2,1);}',
                '@media (min-width:1800px){.akira-info__body{width:min(94%,112em);grid-template-columns:minmax(0,1.05fr) minmax(34em,.88fr);column-gap:clamp(70px,7vw,160px);}.akira-info__textblock{max-width:min(58em,100%);}}',
                '@media (max-width:1100px){.akira-info__body{grid-template-columns:minmax(0,1fr) minmax(0,.9fr);column-gap:clamp(16px,3vw,54px);}.akira-info__right{align-items:stretch;justify-self:stretch;}.akira-info__textblock{padding:.55em .7em .65em;border-radius:8px;}}',
                '@media (max-height:820px){.akira-info__right{padding-top:clamp(.15em,1.8vh,1.2em);}.akira-info__title{font-size:clamp(2.4em,3.6vw,3.1em);}.akira-info__description{-webkit-line-clamp:6;font-size:.83em;}}'
            ].join('\n');
            (document.head || document.body).appendChild(style);
        }

        function shouldUse(object) {
            if (!object) return false;
            if (!moduleEnabled()) return false;
            if (object.source === 'other' && !object.backdrop_path) return false;
            if ((window.innerWidth || document.documentElement.clientWidth || 1920) <= 900) return false;
            return true;
        }

        function buildInfoHtml() {
            return ''
                + '<div class="akira-info">'
                +   '<div class="akira-info__body">'
                +     '<div class="akira-info__left">'
                +       '<div class="akira-info__head"></div>'
                +       '<div class="akira-info__title"></div>'
                +       '<div class="akira-info__original"></div>'
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
            this.network = new Lampa.Reguest();
            this.loaded = {};
            this.currentUrl = null;
            this.updateSeq = 0;
            this.drawSeq = 0;
            this.swapFallback = null;
        }
        InfoBlock.prototype.create = function () { if (this.html) return; this.html = $(buildInfoHtml()); };
        InfoBlock.prototype.render = function (js) { if (!this.html) this.create(); return js ? this.html[0] : this.html; };
        InfoBlock.prototype.load = function (data, options, done) {
            done = done || null;
            var tmdbId = Util.tmdbId(data);
            if (!data || !tmdbId) { if (done) done(data || null); return; }
            var source = data.source || 'tmdb';
            if (source !== 'tmdb' && source !== 'cub' && source !== 'akira_tmdb' && !data.tmdb_id && !data.tmdbid && !data.tmdb) { if (done) done(data); return; }
            if (!Lampa.TMDB || typeof Lampa.TMDB.api !== 'function' || typeof Lampa.TMDB.key !== 'function') { if (done) done(data); return; }
            var preload = options && options.preload;
            var type = Util.mediaType(data);
            var language;
            try { language = Lampa.Storage.get('language'); } catch (e) { language = 'en'; }
            var url = Lampa.TMDB.api(type + '/' + tmdbId + '?api_key=' + Lampa.TMDB.key() + '&append_to_response=content_ratings,release_dates&language=' + language);
            this.currentUrl = url;
            var self = this;
            if (this.loaded[url]) { if (done) done(this.loaded[url]); else if (!preload) this.draw(this.loaded[url]); return; }
            self.network.clear();
            self.network.timeout(5000);
            var settled = false;
            function finish(movie) {
                if (settled) return;
                settled = true;
                if (movie && movie.id) self.loaded[url] = movie;
                if (done) done(movie || data);
                else if (!preload && self.currentUrl === url) self.draw(movie || data);
            }
            self.network.silent(url, function (movie) {
                finish(movie);
            }, function () { finish(data); });
        };
        InfoBlock.prototype.preloadLogo = function (movie, done) {
            Logos.resolve(movie, function (url) {
                if (!url) return done(null);
                var img = new Image();
                var finished = false;
                function finish(value) { if (finished) return; finished = true; done(value); }
                img.onload = function () { finish(url); };
                img.onerror = function () { finish(null); };
                img.src = url;
                if (img.complete) finish(url);
            });
        };
        InfoBlock.prototype.prepare = function (data, done) {
            var self = this;
            this.load(data, {}, function (movie) {
                movie = movie || data;
                self.preloadLogo(movie, function (logoUrl) {
                    done(movie, logoUrl);
                });
            });
        };
        InfoBlock.prototype.drawPrepared = function (movie, logoUrl, options) {
            if (!movie || !this.html) return;
            options = options || {};
            var self = this;
            var drawSeq = ++this.drawSeq;
            var html = this.html;
            var body = html.find('.akira-info__body')[0];
            clearTimeout(this.swapFallback);
            var fill = function () {
                if (drawSeq !== self.drawSeq) return;
                var create = ((movie.release_date || movie.first_air_date || '0000') + '').slice(0, 4);
                var voteNum = parseFloat((movie.vote_average || 0) + '');
                var vote = isFinite(voteNum) ? voteNum.toFixed(1) : '0.0';
                var head = [];
                var sources = (Lampa.Api && Lampa.Api.sources && Lampa.Api.sources.tmdb) ? Lampa.Api.sources.tmdb : null;
                var countries = (sources && typeof sources.parseCountries === 'function') ? sources.parseCountries(movie) : [];
                var pg = (sources && typeof sources.parsePG === 'function') ? sources.parsePG(movie) : '';
                if (create !== '0000') head.push('<span>' + create + '</span>');
                if (countries && countries.length) head.push(countries.join(', '));
                var genreText = (movie.genres && movie.genres.length) ? movie.genres.map(function (it) { return Lampa.Utils.capitalizeFirstLetter(it.name); }).join(' | ') : '';
                var runtimeText = movie.runtime ? Lampa.Utils.secondsToTime(movie.runtime * 60, true) : '';
                html.find('.akira-info__head').empty().append(head.join(', '));
                if (voteNum > 0) html.find('.akira-info__rate').html('<div class="full-start__rate"><div>' + vote + '</div><div>TMDB</div></div>');
                else html.find('.akira-info__rate').empty();
                html.find('.akira-info__genres').text(genreText);
                html.find('.akira-info__runtime').text(runtimeText);
                html.find('.akira-info__pg').html(pg ? '<span class="full-start__pg" style="font-size:.9em;">' + pg + '</span>' : '');
                html.find('.akira-info__genres').toggle(!!genreText);
                html.find('.akira-info__runtime').toggle(!!runtimeText);
                html.find('.akira-info__pg').toggle(!!pg);
                html.find('.dot-rate-genre').toggle(!!(voteNum > 0 && genreText));
                html.find('.dot-genre-runtime').toggle(!!(genreText && (runtimeText || pg)));
                html.find('.dot-runtime-pg').toggle(!!(runtimeText && pg));
                var overview = Util.clean(movie.overview || '');
                html.find('.akira-info__description').text(overview).toggle(!!overview);
                var titleNode = html.find('.akira-info__title');
                var titleText = (movie.title || movie.name || movie.original_title || movie.original_name || '') + '';
                var originalText = Util.originalTitle(movie, titleText);
                html.find('.akira-info__original').text(originalText).toggle(!!originalText);
                if (logoUrl && titleNode[0]) {
                    var img = new Image();
                    img.className = 'akira-info-logo';
                    img.alt = titleText;
                    img.src = logoUrl;
                    img.style.objectFit = 'contain';
                    img.style.objectPosition = 'left bottom';
                    titleNode[0].innerHTML = '';
                    titleNode[0].appendChild(img);
                } else {
                    titleNode.text(titleText);
                }
                if (body && !options.hidden) {
                    body.style.transition = 'opacity .35s ease-in';
                    body.style.opacity = '1';
                }
            };
            if (body && options.hidden) {
                body.style.transition = '';
                body.style.opacity = '';
                fill();
            } else if (body) {
                var alreadyHidden = false;
                try {
                    alreadyHidden = !!(window.getComputedStyle && parseFloat(window.getComputedStyle(body).opacity || '0') <= 0.02);
                } catch (e) {}
                body.style.transition = 'opacity .22s ease-out';
                body.style.opacity = '0';
                var filled = false;
                var finishFadeOut = function () {
                    body.removeEventListener('transitionend', onFadeOut);
                    clearTimeout(self.swapFallback);
                    self.swapFallback = null;
                    if (filled || drawSeq !== self.drawSeq) return;
                    filled = true;
                    fill();
                };
                var onFadeOut = function (e) {
                    if (e && e.target === body && e.propertyName === 'opacity') finishFadeOut();
                };
                if (body.addEventListener) {
                    body.addEventListener('transitionend', onFadeOut);
                    if (alreadyHidden) finishFadeOut();
                    else self.swapFallback = setTimeout(finishFadeOut, HERO_SWAP_FALLBACK_MS);
                } else fill();
            } else fill();
        };
        InfoBlock.prototype.draw = function (movie) {
            var self = this;
            this.preloadLogo(movie, function (url) { self.drawPrepared(movie, url); });
        };
        InfoBlock.prototype.empty = function () {
            if (!this.html) return;
            this.html.find('.akira-info__head,.akira-info__title,.akira-info__original,.akira-info__genres,.akira-info__runtime,.akira-info__description').empty();
            this.html.find('.akira-info__rate').empty();
            this.html.find('.akira-info__pg').empty();
            this.html.find('.akira-info__dot').hide();
        };
        InfoBlock.prototype.destroy = function () {
            clearTimeout(this.swapFallback);
            try { this.network.clear(); } catch (e) {}
            this.loaded = {};
            this.currentUrl = null;
            this.drawSeq++;
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
            var background = document.createElement('div');
            background.className = 'akira-info__background';
            var backgroundA = document.createElement('img');
            var backgroundB = document.createElement('img');
            backgroundA.className = 'active';
            background.appendChild(backgroundA);
            background.appendChild(backgroundB);

            var state = {
                main: main, info: info, background: background, infoElement: null,
                backgroundLast: '', backgroundSlot: 0, updateSeq: 0, hideSeq: 0, attached: false, heroState: 'empty',
                revealFallback: null, revealNode: null, revealEnd: null,
                hideInfoFallback: null, hideFallback: null, hideBody: null, hideBodyEnd: null, hideNode: null, hideEnd: null,
                attach: function () {
                    if (this.attached) return;
                    var container = main.render(true);
                    if (!container) return;
                    container.classList.add('akira-iface', 'akira-iface-h');
                    this.applyHeroMode(container);
                    this.setHeroState('empty', container);
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
                applyHeroMode: function (container) {
                    var node = container || (main && main.render ? main.render(true) : null);
                    if (!node || !node.setAttribute) return;
                    var mode = String(Util.get(K.ifaceHeroMode, 'block') || 'block').toLowerCase();
                    if (mode !== 'fullscreen') mode = 'block';
                    node.setAttribute('data-akira-hero', mode);
                },
                setHeroState: function (stateName, container) {
                    var node = container || (main && main.render ? main.render(true) : null);
                    if (!node || !node.setAttribute) return;
                    var next = stateName === true ? 'shown' :
                        (stateName === 'opening' || stateName === 'shown' || stateName === 'closing' || stateName === 'hiding' ? stateName : 'empty');
                    this.heroState = next;
                    if (node.getAttribute('data-akira-hero-state') !== next) node.setAttribute('data-akira-hero-state', next);
                },
                clearRevealWait: function () {
                    clearTimeout(this.revealFallback);
                    this.revealFallback = null;
                    if (this.revealNode && this.revealEnd) this.revealNode.removeEventListener('transitionend', this.revealEnd);
                    this.revealNode = null;
                    this.revealEnd = null;
                },
                clearHideWait: function () {
                    clearTimeout(this.hideInfoFallback);
                    clearTimeout(this.hideFallback);
                    this.hideInfoFallback = null;
                    this.hideFallback = null;
                    if (this.hideBody && this.hideBodyEnd) this.hideBody.removeEventListener('transitionend', this.hideBodyEnd);
                    if (this.hideNode && this.hideEnd) this.hideNode.removeEventListener('transitionend', this.hideEnd);
                    this.hideBody = null;
                    this.hideBodyEnd = null;
                    this.hideNode = null;
                    this.hideEnd = null;
                },
                waitForOpen: function (seq) {
                    var self = this;
                    var node = this.infoElement;
                    var done = false;
                    this.clearRevealWait();
                    function finishReveal() {
                        if (done) return;
                        done = true;
                        self.clearRevealWait();
                        if (seq !== self.updateSeq || self.heroState !== 'opening') return;
                        self.setHeroState('shown');
                    }
                    if (node && node.addEventListener) {
                        this.revealNode = node;
                        this.revealEnd = function (e) {
                            if (e && e.target === node && e.propertyName === 'height') finishReveal();
                        };
                        node.addEventListener('transitionend', this.revealEnd);
                        this.revealFallback = setTimeout(finishReveal, HERO_OPEN_FALLBACK_MS);
                    } else {
                        finishReveal();
                    }
                },
                backgroundPath: function (movie) {
                    return movie && movie.backdrop_path ? Lampa.Api.img(movie.backdrop_path, 'w1280') : '';
                },
                update: function (data) {
                    if (!data || !canUseHeroData(data)) { this.reset(); return; }
                    var self = this;
                    var seq = ++this.updateSeq;
                    var path = this.backgroundPath(data);
                    var infoReady = false, bgReady = false, movieReady = null, logoReady = null;
                    this.hideSeq++;
                    this.clearHideWait();
                    if ((this.heroState === 'closing' || this.heroState === 'hiding') && this.backgroundLast) this.setHeroState('opening');
                    info.prepare(data, function (movie, logoUrl) {
                        if (seq !== self.updateSeq) return;
                        infoReady = true;
                        movieReady = movie;
                        logoReady = logoUrl;
                        commit();
                    });
                    this.preloadBackground(path, function () {
                        if (seq !== self.updateSeq) return;
                        bgReady = true;
                        commit();
                    });
                    function commit() {
                        if (!infoReady || !bgReady || seq !== self.updateSeq) return;
                        var finalData = movieReady || data;
                        var finalPath = self.backgroundPath(finalData);
                        if (!finalPath) {
                            self.reset();
                            return;
                        }
                        if (finalPath !== path && finalPath !== self.backgroundLast) {
                            self.preloadBackground(finalPath, function () {
                                if (seq !== self.updateSeq) return;
                                applyFinal(finalData, finalPath);
                            });
                            return;
                        }
                        applyFinal(finalData, finalPath);
                    }
                    function applyFinal(finalData, finalPath) {
                        if (seq !== self.updateSeq) return;
                        var wasShown = self.heroState === 'shown';
                        if (finalPath && finalPath !== self.backgroundLast) {
                            var next = self.backgroundSlot ? backgroundA : backgroundB;
                            var prev = self.backgroundSlot ? backgroundB : backgroundA;
                            next.src = finalPath;
                            next.classList.add('active');
                            prev.classList.remove('active');
                            self.backgroundSlot = self.backgroundSlot ? 0 : 1;
                            self.backgroundLast = finalPath;
                        }
                        try { Lampa.Background.change(Lampa.Utils.cardImgBackground(finalData)); } catch (e) {}
                        if (wasShown) {
                            self.setHeroState('shown');
                            info.drawPrepared(finalData, logoReady);
                            return;
                        }
                        info.drawPrepared(finalData, logoReady, { hidden: true });
                        self.setHeroState('opening');
                        self.waitForOpen(seq);
                    }
                },
                preloadBackground: function (path, done) {
                    done = done || function () {};
                    if (!path || path === this.backgroundLast) return done();
                    var img = new Image();
                    var finished = false;
                    function finish() { if (finished) return; finished = true; done(); }
                    img.onload = finish;
                    img.onerror = finish;
                    img.src = path;
                    if (img.complete) finish();
                },
                flushBackground: function () {
                    backgroundA.classList.remove('active');
                    backgroundB.classList.remove('active');
                    backgroundA.removeAttribute('src');
                    backgroundB.removeAttribute('src');
                    this.backgroundLast = '';
                    this.backgroundSlot = 0;
                    try { Lampa.Background.change(''); } catch (e) {}
                },
                clearBackground: function (emptyInfo) {
                    var self = this;
                    if (this.heroState === 'empty' && !this.backgroundLast) {
                        if (emptyInfo) info.empty();
                        return;
                    }
                    if (this.heroState === 'closing' || this.heroState === 'hiding') return;
                    this.clearRevealWait();
                    this.clearHideWait();
                    var hideToken = ++this.hideSeq;
                    var done = false;
                    var node = this.infoElement;
                    var body = node && node.querySelector ? node.querySelector('.akira-info__body') : null;
                    function finish() {
                        if (done) return;
                        done = true;
                        self.clearHideWait();
                        if (hideToken !== self.hideSeq || self.heroState !== 'hiding') return;
                        self.flushBackground();
                        self.setHeroState('empty');
                        if (emptyInfo) info.empty();
                    }
                    function collapse() {
                        if (hideToken !== self.hideSeq || done) return;
                        self.setHeroState('hiding');
                        if (node && node.addEventListener) {
                            self.hideNode = node;
                            self.hideEnd = function (e) {
                                if (e && e.target === node && e.propertyName === 'height') finish();
                            };
                            node.addEventListener('transitionend', self.hideEnd);
                            self.hideFallback = setTimeout(finish, HERO_CLOSE_FALLBACK_MS);
                        } else {
                            finish();
                        }
                    }
                    this.setHeroState('closing');
                    if (body && body.addEventListener) {
                        this.hideBody = body;
                        this.hideBodyEnd = function (e) {
                            if (e && e.target === body && e.propertyName === 'opacity') {
                                self.clearHideWait();
                                collapse();
                            }
                        };
                        body.addEventListener('transitionend', this.hideBodyEnd);
                        this.hideInfoFallback = setTimeout(collapse, HERO_INFO_FALLBACK_MS);
                    } else {
                        collapse();
                    }
                },
                clearBackgroundNow: function () {
                    this.hideSeq++;
                    this.clearRevealWait();
                    this.clearHideWait();
                    backgroundA.classList.remove('active');
                    backgroundB.classList.remove('active');
                    backgroundA.removeAttribute('src');
                    backgroundB.removeAttribute('src');
                    this.backgroundLast = '';
                    this.backgroundSlot = 0;
                    this.setHeroState('empty');
                    try { Lampa.Background.change(''); } catch (e) {}
                },
                reset: function () {
                    this.updateSeq++;
                    this.clearRevealWait();
                    this.clearBackground(true);
                },
                destroy: function () {
                    this.clearRevealWait();
                    this.clearHideWait();
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

        function removeCardDecor(root) {
            try {
                if (!root || !root.querySelectorAll) return;
                ['.akira-card-title', '.akira-card-logo', '.akira-card-type', '.akira-card-rating', '.akira-card-quality'].forEach(function (selector) {
                    var nodes = root.querySelectorAll(selector);
                    Array.prototype.forEach.call(nodes, function (node) {
                        if (node && node.parentNode) node.parentNode.removeChild(node);
                    });
                });
                var view = root.querySelector('.card__view');
                if (view && view.classList) view.classList.remove('akira-card-has-rating', 'akira-card-has-logo');
            } catch (e) {}
        }

        function realCardView(root) {
            if (!root || !root.querySelector) return null;
            if (root.classList && !root.classList.contains('card')) return null;
            var view = root.querySelector('.card__view');
            if (!view || (view.closest && view.closest('.card-episode__footer'))) return null;
            if (view.classList && view.classList.contains('bookmarks-folder__inner')) return null;
            if (view.closest && view.closest('.bookmarks-folder,.register,.full-person,.card-more')) return null;
            return view;
        }

        function isEpisodeData(d) {
            return !!(d && (d.episode_number || d.season_number || d.still_path || d.air_date) && !d.backdrop_path);
        }

        function canUseHeroData(d) {
            if (!d || !Util.tmdbId(d) || isEpisodeData(d)) return false;
            var title = Util.clean(d.title || d.name || d.original_title || d.original_name || '');
            if (!title) return false;
            return !!(d.backdrop_path || d.poster_path || d.img || d.release_date || d.first_air_date || d.overview || d.vote_average || (d.genres && d.genres.length));
        }

        var GENRE_MAP = {
            en: {
                28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
                99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
                27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
                10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western', 10759: 'Action',
                10762: 'Kids', 10763: 'News', 10764: 'Reality', 10765: 'Sci-Fi',
                10766: 'Soap', 10767: 'Talk', 10768: 'War'
            },
            ru: {
                28: 'Боевик', 12: 'Приключения', 16: 'Мультфильм', 35: 'Комедия', 80: 'Криминал',
                99: 'Документальный', 18: 'Драма', 10751: 'Семейный', 14: 'Фэнтези', 36: 'История',
                27: 'Ужасы', 10402: 'Музыка', 9648: 'Детектив', 10749: 'Мелодрама', 878: 'Фантастика',
                10770: 'Телефильм', 53: 'Триллер', 10752: 'Военный', 37: 'Вестерн', 10759: 'Боевик',
                10762: 'Детский', 10763: 'Новости', 10764: 'Реалити', 10765: 'Фантастика',
                10766: 'Мыльная опера', 10767: 'Ток-шоу', 10768: 'Военный'
            },
            uk: {
                28: 'Бойовик', 12: 'Пригоди', 16: 'Мультфільм', 35: 'Комедія', 80: 'Кримінал',
                99: 'Документальний', 18: 'Драма', 10751: 'Сімейний', 14: 'Фентезі', 36: 'Історія',
                27: 'Жахи', 10402: 'Музика', 9648: 'Детектив', 10749: 'Мелодрама', 878: 'Фантастика',
                10770: 'Телефільм', 53: 'Трилер', 10752: 'Воєнний', 37: 'Вестерн', 10759: 'Бойовик',
                10762: 'Дитячий', 10763: 'Новини', 10764: 'Реаліті', 10765: 'Фантастика',
                10766: 'Мильна опера', 10767: 'Ток-шоу', 10768: 'Воєнний'
            }
        };

        function cardGenreNames(d) {
            var names = [];
            var i;
            if (!d) return names;
            if (d.genres && d.genres.length) {
                for (i = 0; i < d.genres.length; i++) {
                    if (d.genres[i] && d.genres[i].name) names.push(Util.clean(d.genres[i].name));
                }
            } else if (d.genre_ids && d.genre_ids.length) {
                var map = GENRE_MAP[Util.langCode()] || GENRE_MAP.en;
                for (i = 0; i < d.genre_ids.length; i++) {
                    if (map[d.genre_ids[i]]) names.push(map[d.genre_ids[i]]);
                    else if (GENRE_MAP.en[d.genre_ids[i]]) names.push(GENRE_MAP.en[d.genre_ids[i]]);
                }
            }
            return names.filter(Boolean);
        }

        function cardRuntime(d) {
            if (!d) return '';
            var minutes = parseInt(d.runtime || (d.episode_run_time && d.episode_run_time[0]) || 0, 10);
            if (!isFinite(minutes) || minutes <= 0) return '';
            var h = Math.floor(minutes / 60);
            var m = minutes % 60;
            if (h && m) return h + 'h ' + m + 'm';
            if (h) return h + 'h';
            return m + 'm';
        }

        function itemCountryNames(d) {
            var names = [];
            var seen = {};
            function add(name) {
                name = Util.shortCountry(name);
                var key = name.toLowerCase();
                if (!name || seen[key]) return;
                seen[key] = true;
                names.push(name);
            }
            try {
                var sources = (Lampa.Api && Lampa.Api.sources && Lampa.Api.sources.tmdb) ? Lampa.Api.sources.tmdb : null;
                if (sources && typeof sources.parseCountries === 'function') {
                    (sources.parseCountries(d) || []).forEach(add);
                }
            } catch (e) {}
            if (d && d.production_countries && d.production_countries.length) {
                d.production_countries.forEach(function (item) { add(item && (item.name || item.iso_3166_1)); });
            }
            if (d && d.origin_country && d.origin_country.length) {
                d.origin_country.forEach(function (code) { add(Util.countryName(code)); });
            }
            return names;
        }

        function cardMetaText(d) {
            var parts = [];
            var year = d ? ((d.release_date || d.first_air_date || '') + '').slice(0,4) : '';
            var countries = itemCountryNames(d);
            var genres = cardGenreNames(d);
            var runtime = cardRuntime(d);
            if (year) parts.push(year);
            if (countries.length) parts.push(countries.slice(0, 2).join(', '));
            if (genres.length) parts.push(genres.slice(0, 1).join(', '));
            if (runtime) parts.push(runtime);
            return parts.join(', ');
        }

        function updateCardTitle(card, movieData) {
            if (!card || typeof card.render !== 'function') return;
            var element = card.render(true);
            if (!element) return;
            if (!element.isConnected) {
                clearTimeout(card.__akiraLabelTimer);
                card.__akiraLabelTimer = setTimeout(function () { updateCardTitle(card); }, 50);
                return;
            }
            clearTimeout(card.__akiraLabelTimer);
            var d = movieData || card.__akiraMetaData || card.data;
            var text = d ? (d.title || d.name || d.original_title || d.original_name || '').trim() : '';
            var _view = realCardView(element);
            if (!_view) { removeCardDecor(element); card.__akiraLabel = null; return; }
            var seek = _view.querySelector('.akira-card-title');
            if (_view && _view.closest && _view.closest('.card-episode__footer')) {
                if (seek && seek.parentNode) seek.parentNode.removeChild(seek);
                card.__akiraLabel = null;
                return;
            }
            if (!text) { if (seek) seek.parentNode.removeChild(seek); card.__akiraLabel = null; return; }
            var label = seek || card.__akiraLabel;
            if (!label) { label = document.createElement('div'); label.className = 'akira-card-title'; }
            var meta = cardMetaText(d);
            label.innerHTML = '<span class="akira-ct-name">' + Util.escapeHtml(text) + '</span>' + (meta ? '<span class="akira-ct-meta">' + Util.escapeHtml(meta) + '</span>' : '');
            if (!label.parentNode || label.parentNode !== _view) {
                if (label.parentNode) label.parentNode.removeChild(label);
                _view.appendChild(label);
            }
            card.__akiraLabel = label;
        }

        function cardView(e){return e&&e.querySelector?e.querySelector('.card__view'):null;}

        function mediaTypeLabel(d){var tv=!!(d&&(d.media_type==='tv'||d.name||d.first_air_date||d.number_of_seasons)),l=Util.langCode();return l==='en'?(tv?'SERIES':'MOVIE'):l==='uk'?(tv?'СЕРІАЛ':'ФІЛЬМ'):(tv?'СЕРИАЛ':'ФИЛЬМ');}

        function normalizeRating(v){var n=parseFloat(String(v||'').replace(',','.'));return isFinite(n)&&n>0?n.toFixed(1):'';}

        function qualityLabel(d){var v=d&&(d.quality||d.quality_name||d.video_quality||d.release_quality||d.rezolution||d.resolution);return Util.clean(v||'').toUpperCase();}

        function ensureBadge(v,cls,txt){if(!v||!v.querySelector)return;var b=v.querySelector('.'+cls);if(!txt){if(b&&b.parentNode)b.parentNode.removeChild(b);return;}if(!b){b=document.createElement('div');b.className=cls;v.appendChild(b);}b.textContent=txt;}

        function ratingColor(val){var n=parseFloat(val);if(!isFinite(n)||n<=0)return'';return n>=7.5?'rgba(46,204,113,.88)':n>=6.5?'rgba(241,196,15,.88)':n>=5?'rgba(230,126,34,.88)':'rgba(229,9,20,.86)';}
        function updateCardBadges(card) {
            if (!card || !card.data || typeof card.render !== 'function') return;
            var element = card.render(true);
            if (!element) return;
            var view = realCardView(element);
            if (!view) { removeCardDecor(element); return; }
            var data = card.__akiraMetaData || card.data;
            if (view && view.closest && view.closest('.card-episode__footer')) {
                ['akira-card-type','akira-card-rating','akira-card-quality'].forEach(function (name) {
                    var node = view.querySelector('.' + name);
                    if (node && node.parentNode) node.parentNode.removeChild(node);
                });
                view.classList.remove('akira-card-has-rating');
                return;
            }
            ensureBadge(view, 'akira-card-type', mediaTypeLabel(data));
            var nativeVote = element.querySelector && element.querySelector('.card__vote');
            var rating = normalizeRating(data.vote_average || data.vote || data.rating || data.rate);
            if (!rating && nativeVote) rating = normalizeRating(nativeVote.textContent || nativeVote.innerText);
            ensureBadge(view, 'akira-card-rating', rating);
            view.classList.toggle('akira-card-has-rating', !!rating);
            var rb = view.querySelector('.akira-card-rating');
            if(rb && rating) rb.style.background = ratingColor(rating);
            var nativeQuality = element.querySelector && element.querySelector('.card__quality');
            var quality = qualityLabel(data) || (nativeQuality ? Util.clean(nativeQuality.textContent || nativeQuality.innerText).toUpperCase() : '');
            ensureBadge(view, 'akira-card-quality', quality);
        }

        function refreshCardDetails(state, card) {
            if (!state || !state.info || !card || !card.data || !Util.tmdbId(card.data)) return;
            var key = Util.mediaType(card.data) + ':' + Util.tmdbId(card.data);
            if (card.__akiraDetailsReq === key) return;
            card.__akiraDetailsReq = key;
            state.info.load(card.data, { preload: true }, function (movie) {
                if (!card.__akiraCard || !movie || !Util.tmdbId(movie)) return;
                card.__akiraMetaData = movie;
                updateCardTitle(card, movie);
                updateCardBadges(card);
                Logos.applyToCard(card, movie);
            });
        }

        function updateHero(state, data) {
            if (!state) return;
            if (canUseHeroData(data)) state.update(data);
            else state.reset();
        }

        function registerLogoCard(state, card) {
            try {
                if (!state || !card || !card.data) return;
                var key = Logos.keyFor(card.__akiraMetaData || card.data);
                if (!key) return;
                var old = card.__akiraTrackedLogoKey;
                if (old && old !== key && logoCardRegistry[old]) {
                    logoCardRegistry[old] = logoCardRegistry[old].filter(function (entry) { return entry.card !== card; });
                }
                card.__akiraTrackedLogoKey = key;
                var list = logoCardRegistry[key] || (logoCardRegistry[key] = []);
                for (var i = 0; i < list.length; i++) {
                    if (list[i].card === card) {
                        list[i].state = state;
                        return;
                    }
                }
                list.push({ card: card, state: state });
                if (list.length > 60) list.splice(0, list.length - 60);
            } catch (e) {}
        }

        function refreshCardsForLogoKey(key) {
            try {
                var list = logoCardRegistry[key];
                if (!list || !list.length) return;
                logoCardRegistry[key] = list.filter(function (entry) {
                    var card = entry && entry.card;
                    if (!card || !card.data || !card.__akiraCard) return false;
                    refreshCardVisuals(entry.state, card);
                    return true;
                });
            } catch (e) {}
        }

        function refreshCardVisuals(state, card) {
            if (!card || !card.data || typeof card.render !== 'function') return;
            registerLogoCard(state, card);
            updateCardTitle(card, card.__akiraMetaData);
            updateCardBadges(card);
            Logos.applyToCard(card, card.__akiraMetaData);
            refreshCardDetails(state, card);
        }

        function decorateCard(state, card) {
            if (!card || typeof card.use !== 'function' || !card.data) return;
            if (card.__akiraCard) {
                refreshCardVisuals(state, card);
                return;
            }
            try {
                var initialRoot = card.render && card.render(true);
                if (initialRoot && initialRoot.isConnected && !realCardView(initialRoot)) {
                    removeCardDecor(initialRoot);
                    return;
                }
            } catch (e) {}
            card.__akiraCard = true;
            card.params = card.params || {};
            card.params.style = card.params.style || {};
            if (!card.params.style.name) card.params.style.name = 'wide';
            card.use({
                onFocus:   function () { updateHero(state, card.data); },
                onHover:   function () { updateHero(state, card.data); },
                onTouch:   function () { updateHero(state, card.data); },
                onVisible: function(){refreshCardVisuals(state, card);},
                onUpdate:function(){refreshCardVisuals(state, card);},
                onDestroy: function () {
                    Logos.cleanupCard(card);
                    clearTimeout(card.__akiraLabelTimer);
                    try {
                        var root = card.render && card.render(true);
                        ['akira-card-type','akira-card-rating','akira-card-quality'].forEach(function (name) {
                            var node = root && root.querySelector && root.querySelector('.' + name);
                            if (node && node.parentNode) node.parentNode.removeChild(node);
                        });
                        var view = root && cardView(root);
                        if (view && view.classList) view.classList.remove('akira-card-has-rating', 'akira-card-has-logo');
                    } catch (e) {}
                    if (card.__akiraLabel && card.__akiraLabel.parentNode) card.__akiraLabel.parentNode.removeChild(card.__akiraLabel);
                    card.__akiraLabel = null;
                    if (card.__akiraTrackedLogoKey && logoCardRegistry[card.__akiraTrackedLogoKey]) {
                        logoCardRegistry[card.__akiraTrackedLogoKey] = logoCardRegistry[card.__akiraTrackedLogoKey].filter(function (entry) { return entry.card !== card; });
                    }
                    delete card.__akiraTrackedLogoKey;
                    delete card.__akiraMetaData;
                    delete card.__akiraDetailsReq;
                    delete card.__akiraCard;
                }
            });
            refreshCardVisuals(state, card);
        }

        function getCardData(card, element, index) {
            if (card && card.data) return card.data;
            if (element && Array.isArray(element.results)) return element.results[index || 0] || element.results[0];
            return null;
        }
        function getDomCardData(n){if(!n)return null;var c=n&&n.jquery?n[0]:n;while(c&&!c.card_data)c=c.parentNode;return c&&c.card_data?c.card_data:null;}
        function getFocusedCardData(l){var c=l&&typeof l.render==='function'?l.render(true):null;if(!c||!c.querySelector)return null;return getDomCardData(c.querySelector('.selector.focus')||c.querySelector('.focus'));}

        function refreshLineCards(line, state) {
            try {
                if (!line || !state) return;
                if (Array.isArray(line.items) && line.items.length) line.items.forEach(function (card) { decorateCard(state, card); });
                if (line.last && line.last.card) decorateCard(state, line.last.card);
            } catch (e) {}
        }

        function trackLine(line, state) {
            if (!line || !state) return;
            line.__akiraStateRef = state;
            for (var i = 0; i < trackedLines.length; i++) {
                if (trackedLines[i].line === line) return;
            }
            trackedLines.push({ line: line, state: state });
            if (trackedLines.length > 80) trackedLines.shift();
        }

        function refreshTrackedCards() {
            refreshCardsTimer = null;
            trackedLines = trackedLines.filter(function (entry) {
                return !!(entry && entry.line && entry.line.__akiraLine);
            });
            trackedLines.forEach(function (entry) {
                refreshLineCards(entry.line, entry.state || entry.line.__akiraStateRef);
            });
        }

        function scheduleTrackedRefresh(delay) {
            if (!trackedLines.length) return;
            clearTimeout(refreshCardsTimer);
            refreshCardsTimer = setTimeout(refreshTrackedCards, typeof delay === 'number' ? delay : 120);
        }

        function bindLifecycleRefresh() {
            if (lifecycleBound) return;
            lifecycleBound = true;
            try {
                window.addEventListener(Logos.cacheEvent, function (e) {
                    var key = e && e.detail && e.detail.key;
                    if (key) setTimeout(function () { refreshCardsForLogoKey(key); }, 0);
                });
            } catch (eventErr) {}
            try {
                if (Lampa.Listener && typeof Lampa.Listener.follow === 'function') {
                    Lampa.Listener.follow('activity', function () {
                        scheduleTrackedRefresh(90);
                        setTimeout(scheduleTrackedRefresh, 420);
                    });
                    Lampa.Listener.follow('full', function () {
                        scheduleTrackedRefresh(120);
                        setTimeout(scheduleTrackedRefresh, 520);
                    });
                }
            } catch (e) {}
        }

        function attachLineHandlers(main, line, element) {
            var state = ensureState(main);
            if (line.__akiraLine) {
                trackLine(line, line.__akiraStateRef || state);
                refreshLineCards(line, line.__akiraStateRef || state);
                return;
            }
            line.__akiraLine = true;
            trackLine(line, state);
            var apply = function (card) { decorateCard(state, card); };
            if (element && Array.isArray(element.results)) {
                element.results.slice(0, 5).forEach(function (it) {
                    state.info.load(it, { preload: true });
                    Logos.preload(it);
                });
            }
            line.use({
                onInstance: function (card) { apply(card); },
                onActive: function (card, itemData) { var d = getCardData(card, itemData); updateHero(state, d); },
                onToggle: function () { setTimeout(function () { var d = getFocusedCardData(line); updateHero(state, d); }, 32); },
                onMore:    function () { state.reset(); },
                onDestroy: function () { state.reset(); delete line.__akiraLine; delete line.__akiraStateRef; }
            });
            if (Array.isArray(line.items) && line.items.length) line.items.forEach(apply);
            if (line.last) { var last = getDomCardData(line.last); updateHero(state, last); }
        }

        function wrap(target, method, handler) {
            if (!target) return;
            var orig = typeof target[method] === 'function' ? target[method] : null;
            target[method] = function () { return handler.call(this, orig, arguments); };
        }

        function applyHeroModeToAll() {
            try {
                var nodes = document.querySelectorAll('.akira-iface');
                var mode = String(Util.get(K.ifaceHeroMode, 'block') || 'block').toLowerCase();
                if (mode !== 'fullscreen') mode = 'block';
                Array.prototype.forEach.call(nodes, function (n) {
                    n.setAttribute('data-akira-hero', mode);
                });
            } catch (e) {}
        }

        function heroInfoMode() {
            var mode = String(Util.get(K.ifaceHeroInfo, '') || '').toLowerCase();
            if (!mode) mode = Util.isOn(K.ifaceHeroDescription, true) ? 'all' : 'hide_description';
            if (mode !== 'hide_description' && mode !== 'hide_meta' && mode !== 'hide_all') mode = 'all';
            return mode;
        }

        function syncHeroInfo() {
            try {
                if (!document.body) return;
                document.body.setAttribute('data-akira-hero-info', heroInfoMode());
            } catch (e) {}
        }

        return {
            start: function () {
                if (started) return;
                started = true;
                injectStyle();
                syncHeroInfo();
                bindLifecycleRefresh();
                try {
                    if (Lampa.Storage && Lampa.Storage.listener && typeof Lampa.Storage.listener.follow === 'function') {
                        Lampa.Storage.listener.follow('change', function (e) {
                            if (!e) return;
                            if (e.name === K.ifaceHeroMode) applyHeroModeToAll();
                            if (e.name === K.ifaceHeroInfo || e.name === K.ifaceHeroDescription || e.name === K.enabled || e.name === K.ifaceEnabled) syncHeroInfo();
                        });
                    }
                } catch (e) {}
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
        var storageBound = false;

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
            + '        <div class="full-start__button selector view--trailer"><svg><use xlink:href="#sprite-trailer"></use></svg><span>#{full_trailers}</span></div>'
            + '        <div class="full-start__button view--torrent"><svg><use xlink:href="#sprite-torrent"></use></svg><span>#{full_torrents}</span></div>'
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
            if (storageBound) return;
            try {
                if (!Lampa.Storage || !Lampa.Storage.listener || !Lampa.Storage.listener.follow) return;
                Lampa.Storage.listener.follow('change', function (e) {
                    if (!e || !e.name) return;
                    if (e.name === K.buttonsBig || e.name === K.enabled) injectBigStyle();
                });
                storageBound = true;
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
        var storageBound = false;
        var menuEventsBound = false;
        var menuTimer = null;
        var MENU_WIDTH_VAR = '--akira-menu-w';

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
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .search, body.' + CFG.bodyClass + '[data-akira-theme="on"] .search__body, body.' + CFG.bodyClass + '[data-akira-theme="on"] .search__content, body.' + CFG.bodyClass + '[data-akira-theme="on"] .search-source, body.' + CFG.bodyClass + '[data-akira-theme="on"] .search-result, body.' + CFG.bodyClass + '[data-akira-theme="on"] .search-results, body.' + CFG.bodyClass + '[data-akira-theme="on"] .activity--search{background:var(--akira-bg) !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .search .scroll__content, body.' + CFG.bodyClass + '[data-akira-theme="on"] .search .scroll__body, body.' + CFG.bodyClass + '[data-akira-theme="on"] .activity--search .scroll__content, body.' + CFG.bodyClass + '[data-akira-theme="on"] .activity--search .scroll__body{position:relative!important;z-index:2!important;background:var(--akira-bg) !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .scroll__body.mapping--line{isolation:isolate;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .items-line__title{font-family:var(--akira-font) !important;font-weight:700 !important;font-size:1.25em !important;color:#fff !important;text-shadow:0 2px 10px rgba(0,0,0,.6) !important;padding-left:1.2em !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu{width:var(' + MENU_WIDTH_VAR + ',min(22em,94vw)) !important;max-width:94vw !important;padding-right:0!important;overflow:hidden!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__case, body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__list{width:100%!important;max-width:100%!important;box-sizing:border-box!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item{position:relative!important;box-sizing:border-box!important;width:100%!important;max-width:none!important;margin-left:0!important;margin-right:0!important;padding-right:0!important;overflow:hidden!important;border-radius:0!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__text, body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item-name, body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item-text, body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item-title{min-width:0!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;}',
                '@media(max-width:520px){body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu{width:min(var(' + MENU_WIDTH_VAR + ',22em),94vw)!important;}body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item{max-width:100%!important;}body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__text, body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item-name, body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item-text, body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item-title{font-size:.88em!important;}}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item.focus, body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item.traverse, body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item.hover{background:linear-gradient(90deg, var(--akira-accent), rgba(' + rgb + ',.86)) !important;color:#fff !important;box-shadow:inset 0 0 0 2px rgba(255,255,255,.10)!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item.focus:before, body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item.traverse:before, body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item.hover:before{content:""!important;position:absolute!important;left:0!important;right:0!important;top:0!important;bottom:0!important;border-radius:0!important;pointer-events:none!important;box-shadow:inset 0 0 0 2px rgba(255,255,255,.12)!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .simple-button.focus, body.' + CFG.bodyClass + '[data-akira-theme="on"] .full-start__button.focus, body.' + CFG.bodyClass + '[data-akira-theme="on"] .selectbox-item.focus, body.' + CFG.bodyClass + '[data-akira-theme="on"] .settings-folder.focus, body.' + CFG.bodyClass + '[data-akira-theme="on"] .settings-param.focus{background:linear-gradient(90deg, var(--akira-accent), rgba(' + rgb + ',.85)) !important;color:#fff !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card__type, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card--tv .card__type, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card__type::after{background:linear-gradient(90deg,var(--akira-accent),rgba(' + rgb + ',.72)) !important;color:#fff!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.focus .card__view::after, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.hover .card__view::after, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card-more.focus .card-more__box::after{border:.18em solid var(--akira-accent) !important;box-shadow:0 0 0 .35em var(--akira-accent-soft) !important;border-radius:.6em !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card .card__view, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card .card__img{border-radius:.6em !important;overflow:hidden !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid{display:grid !important;grid-template-columns:repeat(auto-fit,minmax(17.6em,1fr)) !important;gap:1em .62em !important;align-items:start !important;overflow:visible !important;}',
                '@media(max-width:1279px){body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid{grid-template-columns:repeat(auto-fit,minmax(15em,1fr)) !important;}}',
                '@media(max-width:767px){body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid{grid-template-columns:repeat(auto-fit,minmax(13.4em,1fr)) !important;}}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .card{width:auto !important;margin:0 !important;padding-bottom:0 !important;position:relative !important;z-index:1;overflow:visible !important;transform-origin:center center !important;transition:transform .28s cubic-bezier(.22,.61,.36,1),z-index 0s !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .card__view{--akira-grid-logo-h:50%;--akira-grid-logo-max-w:80%;position:relative !important;height:0 !important;padding-bottom:56.25% !important;margin-bottom:0 !important;border-radius:10px !important;overflow:hidden !important;border:1px solid rgba(255,255,255,.08) !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 8px 22px rgba(0,0,0,.28) !important;transition:transform .28s cubic-bezier(.22,.61,.36,1),box-shadow .28s ease,filter .28s ease,border-color .28s ease !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-related-ready{width:18.3em!important;margin-right:.75em!important;padding-bottom:0!important;overflow:visible!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-related-ready .card__view{--akira-grid-logo-h:50%;--akira-grid-logo-max-w:80%;position:relative!important;height:0!important;padding-bottom:56.25%!important;margin-bottom:0!important;border-radius:10px!important;overflow:hidden!important;border:1px solid rgba(255,255,255,.08)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 8px 22px rgba(0,0,0,.28)!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-related-ready.focus .card__view, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-related-ready.hover .card__view{border-color:var(--akira-accent)!important;box-shadow:0 0 0 2px var(--akira-accent),0 0 22px rgba(var(--akira-accent-rgb),.42),0 18px 42px rgba(0,0,0,.42)!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .card__view > img, body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .card__img{position:absolute !important;inset:0 !important;width:100% !important;height:100% !important;object-fit:cover !important;object-position:center 22% !important;border-radius:10px !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-related-ready .card__view > img, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-related-ready .card__img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center 22%!important;border-radius:10px!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .card.focus, body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .card.hover{z-index:40 !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .card.focus .card__view{transform:none !important;filter:saturate(1.05) brightness(1.02) !important;border-color:var(--akira-accent) !important;box-shadow:0 0 0 2px var(--akira-accent),0 0 22px rgba(var(--akira-accent-rgb),.42),0 18px 42px rgba(0,0,0,.42) !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .card.hover .card__view{transform:none !important;filter:saturate(1.02) brightness(1.01) !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .card.focus::after, body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .card.hover::after, body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .card__view::before, body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .card__view::after{display:none !important;content:none !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .card.akira-grid-ready > .card__title, body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .card.akira-grid-ready > .card__age, body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .card.akira-grid-ready .card__vote, body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .card.akira-grid-ready .card__quality, body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .card.akira-grid-ready .card__type, body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .card.akira-grid-ready .card__promo{display:none !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .akira-card-title{position:absolute;left:0;right:0;bottom:0;padding:.42em .72em .72em;color:#fff;pointer-events:none;background:linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.52) 68%,transparent 100%);z-index:16;box-sizing:border-box;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .akira-ct-meta{position:relative;z-index:2;display:block;max-width:100%;font-size:.66em;font-weight:700;line-height:1.15;color:rgba(255,255,255,.86);margin:.24em 0 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 1px 5px rgba(0,0,0,.9);box-sizing:border-box;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .akira-ct-name{position:relative;z-index:2;display:block;font-size:.9em;font-weight:800;line-height:1.18;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 1px 5px rgba(0,0,0,.9);}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .akira-card-has-logo .akira-card-title{bottom:0;padding:.15em .72em .62em;background:none;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .akira-card-has-logo .akira-ct-name{display:none;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .akira-card-logo{z-index:13;bottom:0;height:calc(var(--akira-grid-logo-h) + var(--akira-card-meta-h,1.55em));min-height:0;padding:.25em .72em calc(var(--akira-card-meta-h,1.55em) + .22em);border-radius:0 0 10px 10px;display:flex;align-items:flex-end;background:linear-gradient(to top,rgba(0,0,0,.9) 0%,rgba(0,0,0,.62) 36%,rgba(0,0,0,.28) 72%,transparent 100%);}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .akira-card-logo img{position:relative;z-index:1;max-width:var(--akira-grid-logo-max-w,80%);max-height:calc(100% - var(--akira-card-meta-h,1.55em) - .25em);}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .akira-card-type, body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .akira-card-rating, body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .akira-card-quality{position:absolute;z-index:22;pointer-events:none;font-family:var(--akira-font,Arial,sans-serif);font-weight:800;line-height:1.25;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.55);box-shadow:0 2px 10px rgba(0,0,0,.42);max-width:calc(100% - 12px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .akira-card-type{left:6px;top:6px;padding:.32em .55em;border-radius:6px 0 6px 0;background:rgba(var(--akira-accent-rgb),.86);font-size:.68em;letter-spacing:0;text-transform:uppercase;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .akira-card-rating{display:block !important;right:6px !important;left:auto !important;bottom:auto !important;top:6px !important;padding:2px 8px !important;border-radius:10px 0 10px 0 !important;background:rgba(12,14,20,.68);border:1px solid rgba(255,255,255,.14);color:#ffd13d !important;font-size:.75em !important;font-weight:900 !important;z-index:23 !important;backdrop-filter:blur(8px) saturate(140%);-webkit-backdrop-filter:blur(8px) saturate(140%);}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .akira-card-quality{display:block !important;left:auto !important;right:6px !important;bottom:auto !important;top:6px !important;padding:2px 8px !important;border-radius:4px !important;background:rgba(46,204,113,.88) !important;color:#fff !important;font-size:.7em !important;font-weight:800 !important;text-transform:uppercase !important;letter-spacing:0 !important;z-index:22 !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .mapping--grid .card__view.akira-card-has-rating .akira-card-quality{top:calc(6px + 2.05em) !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready > .card__title, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready > .card__age, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready .card__vote, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready .card__quality, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready .card__type, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready .card__promo{display:none !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready .card__view{--akira-grid-logo-h:50%;--akira-grid-logo-max-w:80%;position:relative!important;overflow:hidden!important;border-radius:10px!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready .akira-card-title{position:absolute;left:0;right:0;bottom:0;padding:.42em .72em .72em;color:#fff;pointer-events:none;background:linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.52) 68%,transparent 100%);z-index:16;box-sizing:border-box;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready .akira-ct-meta{position:relative;z-index:2;display:block;max-width:100%;font-size:.66em;font-weight:700;line-height:1.15;color:rgba(255,255,255,.86);margin:.24em 0 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 1px 5px rgba(0,0,0,.9);box-sizing:border-box;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready .akira-ct-name{position:relative;z-index:2;display:block;font-size:.9em;font-weight:800;line-height:1.18;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 1px 5px rgba(0,0,0,.9);}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready .akira-card-has-logo .akira-card-title{bottom:0;padding:.15em .72em .62em;background:none;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready .akira-card-has-logo .akira-ct-name{display:none;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready .akira-card-logo{position:absolute;left:0;right:0;bottom:0;z-index:13;height:calc(var(--akira-grid-logo-h,50%) + var(--akira-card-meta-h,1.55em));min-height:0;padding:.25em .72em calc(var(--akira-card-meta-h,1.55em) + .22em);border-radius:0 0 10px 10px;display:flex;align-items:flex-end;box-sizing:border-box;pointer-events:none;background:linear-gradient(to top,rgba(0,0,0,.9) 0%,rgba(0,0,0,.62) 36%,rgba(0,0,0,.28) 72%,transparent 100%);}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready .akira-card-logo img{position:relative;z-index:1;display:block;max-width:var(--akira-grid-logo-max-w,80%);max-height:calc(100% - var(--akira-card-meta-h,1.55em) - .25em);width:auto;height:auto;object-fit:contain;object-position:left bottom;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready .akira-card-type, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready .akira-card-rating, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready .akira-card-quality{position:absolute;z-index:22;pointer-events:none;font-family:var(--akira-font,Arial,sans-serif);font-weight:800;line-height:1.25;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.55);box-shadow:0 2px 10px rgba(0,0,0,.42);max-width:calc(100% - 12px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready .akira-card-type{left:6px;top:6px;padding:.32em .55em;border-radius:6px 0 6px 0;background:rgba(var(--akira-accent-rgb),.86);font-size:.68em;letter-spacing:0;text-transform:uppercase;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready .akira-card-rating{display:block!important;right:6px!important;left:auto!important;bottom:auto!important;top:6px!important;padding:2px 8px!important;border-radius:10px 0 10px 0!important;background:rgba(12,14,20,.68);border:1px solid rgba(255,255,255,.14);color:#ffd13d!important;font-size:.75em!important;font-weight:900!important;z-index:23!important;backdrop-filter:blur(8px) saturate(140%);-webkit-backdrop-filter:blur(8px) saturate(140%);}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready .akira-card-quality{display:block!important;left:auto!important;right:6px!important;bottom:auto!important;top:6px!important;padding:2px 8px!important;border-radius:4px!important;background:rgba(46,204,113,.88)!important;color:#fff!important;font-size:.7em!important;font-weight:800!important;text-transform:uppercase!important;letter-spacing:0!important;z-index:22!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-grid-ready .card__view.akira-card-has-rating .akira-card-quality{top:calc(6px + 2.05em)!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-search-ready{position:relative!important;overflow:visible!important;margin-right:.75em!important;margin-bottom:1.05em!important;padding-bottom:0!important;z-index:1!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-search-ready .card__view{--akira-grid-logo-h:50%;--akira-grid-logo-max-w:80%;position:relative!important;overflow:hidden!important;border-radius:10px!important;border:1px solid rgba(255,255,255,.08)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 8px 22px rgba(0,0,0,.28)!important;background:#111722!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-search-ready.focus, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-search-ready.hover{z-index:40!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-search-ready.focus .card__view, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-search-ready.hover .card__view{border-color:var(--akira-accent)!important;box-shadow:0 0 0 2px var(--akira-accent),0 0 22px rgba(var(--akira-accent-rgb),.42),0 18px 42px rgba(0,0,0,.42)!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-search-ready .card__view > img, body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-search-ready .card__img{width:100%!important;height:100%!important;object-fit:cover!important;object-position:center 22%!important;border-radius:10px!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-search-ready .akira-card-logo{bottom:0;height:calc(var(--akira-grid-logo-h,50%) + var(--akira-card-meta-h,1.55em));min-height:0;padding:.22em .62em calc(var(--akira-card-meta-h,1.55em) + .22em);}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-search-ready .akira-card-logo img{max-width:var(--akira-grid-logo-max-w,80%);max-height:calc(100% - var(--akira-card-meta-h,1.55em) - .25em);}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-search-ready .akira-card-title{z-index:16!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .card.akira-search-ready .akira-card-logo{z-index:13!important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .modal__content, body.' + CFG.bodyClass + '[data-akira-theme="on"] .selectbox__content, body.' + CFG.bodyClass + '[data-akira-theme="on"] .settings__content{background:rgba(10,13,18,.96) !important;border:0 !important;}',
                'body.' + CFG.bodyClass + '[data-akira-theme="on"] .full-start__rate.rate--tmdb{background:linear-gradient(90deg, var(--akira-accent), rgba(' + rgb + ',.7)) !important;color:#fff !important;border-radius:.4em !important;padding:.3em .5em !important;}',
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
            if (storageBound) return;
            try {
                if (!Lampa.Storage || !Lampa.Storage.listener || !Lampa.Storage.listener.follow) return;
                Lampa.Storage.listener.follow('change', function (e) {
                    if (!e || !e.name) return;
                    if (e.name === K.themeEnabled || e.name === K.themeAccent || e.name === K.themeFont || e.name === K.enabled) {
                        injectStyle();
                        scheduleGridDecorate();
                    }
                });
                storageBound = true;
            } catch (e) {}
        }

        var gridObserver = null;
        var gridTimer = null;

        function domText(root, selector) {
            var node = root && root.querySelector ? root.querySelector(selector) : null;
            return Util.clean(node ? (node.textContent || node.innerText || '') : '');
        }

        function nativeBadgeText(root, selector) {
            var node = root && root.querySelector ? root.querySelector(selector) : null;
            if (!node) return '';
            return Util.clean(node.textContent || node.innerText || '').toUpperCase();
        }

        function gridData(card) {
            var node = card;
            while (node && node !== document.body) {
                if (node.card_data) return node.card_data;
                node = node.parentNode;
            }
            return null;
        }

        function gridYear(card, data) {
            var y = data ? ((data.release_date || data.first_air_date || '') + '').slice(0, 4) : '';
            return y || domText(card, '.card__age');
        }

        function gridCountries(data) {
            return Util.itemCountryNames(data).slice(0, 2).join(', ');
        }

        function gridRating(card, data) {
            var raw = data && (data.vote_average || data.vote || data.rating || data.rate);
            var n = parseFloat(String(raw || '').replace(',', '.'));
            if (isFinite(n) && n > 0) return n.toFixed(1);
            return domText(card, '.card__vote');
        }

        function gridQuality(card, data) {
            var raw = data && (data.quality || data.quality_name || data.video_quality || data.release_quality || data.rezolution || data.resolution);
            return Util.clean(raw || nativeBadgeText(card, '.card__quality')).toUpperCase();
        }

        function gridGenres(data) {
            if (!data || !data.genres || !data.genres.length) return '';
            return data.genres.slice(0, 2).map(function (item) {
                return Util.clean(item && item.name ? item.name : '');
            }).filter(Boolean).join(', ');
        }

        function gridMediaTypeLabel(data, card) {
            var nativeType = nativeBadgeText(card, '.card__type');
            var tv = !!((data && Util.mediaType(data) === 'tv') ||
                (card && card.classList && card.classList.contains('card--tv')) ||
                nativeType === 'TV');
            var lang = Util.langCode();
            return lang === 'en' ? (tv ? 'SERIES' : 'MOVIE') : lang === 'uk' ? (tv ? 'СЕРІАЛ' : 'ФІЛЬМ') : (tv ? 'СЕРИАЛ' : 'ФИЛЬМ');
        }

        function gridRatingColor(value) {
            var n = parseFloat(value);
            if (!isFinite(n) || n <= 0) return '';
            return n >= 7.5 ? 'rgba(46,204,113,.88)' : n >= 6.5 ? 'rgba(241,196,15,.88)' : n >= 5 ? 'rgba(230,126,34,.88)' : 'rgba(229,9,20,.86)';
        }

        function setGridBadge(view, cls, text) {
            var node = view.querySelector('.' + cls);
            if (!text) {
                if (node && node.parentNode) node.parentNode.removeChild(node);
                return;
            }
            if (!node) {
                node = document.createElement('div');
                node.className = cls;
                view.appendChild(node);
            }
            if (node.textContent !== text) node.textContent = text;
        }

        function cleanupGridLegacy(view) {
            ['akira-grid-overlay', 'akira-grid-rating', 'akira-grid-quality'].forEach(function (cls) {
                var node = view.querySelector('.' + cls);
                if (node && node.parentNode) node.parentNode.removeChild(node);
            });
            if (view.classList) view.classList.remove('akira-grid-has-rating');
        }

        function isRelatedLineCard(card) {
            if (!card || !card.closest) return false;
            if (card.closest('.akira-iface,.mapping--grid,.card-more,.bookmarks-folder,.register,.full-person,.card-episode__footer')) return false;
            var line = card.closest('.items-line');
            if (!line) return false;
            var title = Util.clean(domText(line, '.items-line__title')).toLowerCase();
            return title === 'recommendations' || title === 'similar' ||
                title === '\u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0446\u0438\u0438' ||
                title === '\u043f\u043e\u0445\u043e\u0436\u0438\u0435' ||
                title === '\u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0446\u0456\u0457' ||
                title === '\u0441\u0445\u043e\u0436\u0456' ||
                title === '\u043f\u043e\u0434\u0456\u0431\u043d\u0456';
        }

        function isSearchLineCard(card) {
            if (!card || !card.closest || !card.querySelector) return false;
            if (card.closest('.akira-iface,.items-line,.mapping--grid,.scroll--horizontal,.full-start,.full-start-new,.card-more,.bookmarks-folder,.register,.full-person,.card-episode__footer')) return false;
            var line = card.closest('.scroll__body.mapping--line');
            return !!(line && card.querySelector('.card__view'));
        }

        function isGridCard(card) {
            if (!card || !card.querySelector || !card.closest) return false;
            if (card.closest('.mapping--grid')) return true;
            if (isRelatedLineCard(card)) return true;
            if (isSearchLineCard(card)) return true;
            if (!card.classList || !card.classList.contains('card--wide')) return false;
            if (card.closest('.scroll--horizontal,.full-start,.full-start-new,.card-more,.bookmarks-folder,.register,.full-person,.card-episode__footer')) return false;
            return !!card.querySelector('.card__view');
        }

        function setGridLogo(card, view, data, title) {
            function connected(node) {
                if (!node) return false;
                if (typeof node.isConnected === 'boolean') return node.isConnected;
                return !!(document.documentElement && document.documentElement.contains && document.documentElement.contains(node));
            }
            function remove() {
                var old = view.querySelector('.akira-card-logo');
                if (old && old.parentNode) old.parentNode.removeChild(old);
                if (view.classList) view.classList.remove('akira-card-has-logo');
            }
            function retryWhenDataArrives() {
                var tries = card.__akiraGridLogoRetry || 0;
                if (tries >= 5) return;
                card.__akiraGridLogoRetry = tries + 1;
                clearTimeout(card.__akiraGridLogoRetryTimer);
                card.__akiraGridLogoRetryTimer = setTimeout(function () {
                    if (connected(card)) decorateGridCardUnified(card);
                }, tries ? 450 : 160);
            }
            if (!Util.isOn(K.ifaceCardLogos, true) || !Logos.enabled()) {
                remove();
                return;
            }
            if (!data || !Util.tmdbId(data)) {
                retryWhenDataArrives();
                return;
            }
            clearTimeout(card.__akiraGridLogoRetryTimer);
            delete card.__akiraGridLogoRetry;
            delete card.__akiraGridLogoRetryTimer;
            var requestId = (card.__akiraGridLogoReq || 0) + 1;
            card.__akiraGridLogoReq = requestId;
            var wrap = view.querySelector('.akira-card-logo');
            if (!wrap) {
                wrap = document.createElement('div');
                wrap.className = 'akira-card-logo';
                view.appendChild(wrap);
            }
            try { wrap.setAttribute('data-akira-logo-owner', 'theme'); } catch (e) {}
            Logos.resolve(data, function (url) {
                if (card.__akiraGridLogoReq !== requestId || !connected(card)) return;
                if (!url) { remove(); return; }
                if (!wrap.parentNode) {
                    wrap = view.querySelector('.akira-card-logo');
                    if (!wrap) {
                        wrap = document.createElement('div');
                        wrap.className = 'akira-card-logo';
                        view.appendChild(wrap);
                    }
                }
                try { wrap.setAttribute('data-akira-logo-owner', 'theme'); } catch (e) {}
                var img = new Image();
                img.alt = title || '';
                img.src = url;
                img.style.objectFit = 'contain';
                img.style.objectPosition = 'left bottom';
                wrap.innerHTML = '';
                wrap.appendChild(img);
                if (view.classList) view.classList.add('akira-card-has-logo');
            });
        }

        function decorateGridCardUnified(card) {
            if (!isGridCard(card)) return;
            var view = card.querySelector('.card__view');
            if (!view) return;
            if ((view.classList && view.classList.contains('bookmarks-folder__inner')) ||
                (view.closest && view.closest('.bookmarks-folder,.register,.full-person,.card-more,.card-episode__footer'))) {
                return;
            }
            cleanupGridLegacy(view);

            var data = gridData(card);
            var title = Util.clean((data && (data.title || data.name || data.original_title || data.original_name)) || domText(card, '.card__title'));
            var year = gridYear(card, data);
            var countries = gridCountries(data);
            var genres = gridGenres(data);
            var metaParts = [];
            if (year) metaParts.push(year);
            if (countries) metaParts.push(countries);
            if (genres) metaParts.push(genres);

            var label = view.querySelector('.akira-card-title');
            if (!label) {
                label = document.createElement('div');
                label.className = 'akira-card-title';
                view.appendChild(label);
            }
            var html = (title ? '<span class="akira-ct-name">' + Util.escapeHtml(title) + '</span>' : '')
                + (metaParts.length ? '<span class="akira-ct-meta">' + Util.escapeHtml(metaParts.join(', ')) + '</span>' : '');
            if (label.innerHTML !== html) label.innerHTML = html;

            var rating = gridRating(card, data);
            setGridBadge(view, 'akira-card-type', gridMediaTypeLabel(data, card));
            setGridBadge(view, 'akira-card-rating', rating);
            if (view.classList) view.classList.toggle('akira-card-has-rating', !!rating);
            var ratingNode = view.querySelector('.akira-card-rating');
            if (ratingNode && rating) ratingNode.style.background = gridRatingColor(rating);
            setGridBadge(view, 'akira-card-quality', gridQuality(card, data));
            setGridLogo(card, view, data, title);
            card.classList.add('akira-grid-ready');
            card.classList.toggle('akira-search-ready', isSearchLineCard(card));
            card.classList.toggle('akira-related-ready', isRelatedLineCard(card));
        }

        function decorateGridCard(card) {
            if (!isGridCard(card)) return;
            var view = card.querySelector('.card__view');
            if (!view) return;
            if ((view.classList && view.classList.contains('bookmarks-folder__inner')) ||
                (view.closest && view.closest('.bookmarks-folder,.register,.full-person,.card-more,.card-episode__footer'))) {
                return;
            }

            var data = gridData(card);
            var title = Util.clean((data && (data.title || data.name || data.original_title || data.original_name)) || domText(card, '.card__title'));
            var year = gridYear(card, data);
            var countries = gridCountries(data);
            var genres = gridGenres(data);
            var metaParts = [];
            if (year) metaParts.push(year);
            if (countries) metaParts.push(countries);
            if (genres) metaParts.push(genres);

            var overlay = view.querySelector('.akira-grid-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'akira-grid-overlay';
                view.appendChild(overlay);
            }
            var html = (title ? '<div class="akira-grid-title">' + Util.escapeHtml(title) + '</div>' : '')
                + (metaParts.length ? '<div class="akira-grid-meta">' + Util.escapeHtml(metaParts.join(', ')) + '</div>' : '');
            if (overlay.innerHTML !== html) overlay.innerHTML = html;

            var rating = gridRating(card, data);
            setGridBadge(view, 'akira-grid-rating', rating);
            if (view.classList) view.classList.toggle('akira-grid-has-rating', !!rating);
            setGridBadge(view, 'akira-grid-quality', gridQuality(card, data));
            card.classList.add('akira-grid-ready');
        }

        function cleanupGridCards() {
            try {
                var cards = document.querySelectorAll('.card.akira-grid-ready');
                Array.prototype.forEach.call(cards, function (card) {
                    card.classList.remove('akira-grid-ready');
                    var view = card.querySelector && card.querySelector('.card__view');
                    if (!view) return;
                    ['akira-grid-overlay', 'akira-grid-rating', 'akira-grid-quality', 'akira-card-title', 'akira-card-logo', 'akira-card-type', 'akira-card-rating', 'akira-card-quality'].forEach(function (cls) {
                        var node = view.querySelector('.' + cls);
                        if (node && node.parentNode) node.parentNode.removeChild(node);
                    });
                    if (view.classList) view.classList.remove('akira-grid-has-rating', 'akira-card-has-rating', 'akira-card-has-logo');
                    card.classList.remove('akira-related-ready', 'akira-search-ready');
                    delete card.__akiraGridLogoReq;
                    clearTimeout(card.__akiraGridLogoRetryTimer);
                    delete card.__akiraGridLogoRetry;
                    delete card.__akiraGridLogoRetryTimer;
                });
            } catch (e) {}
        }

        function decorateGrid() {
            if (!moduleEnabled()) { cleanupGridCards(); return; }
            try {
                var cards = document.querySelectorAll('.mapping--grid .card, .card.card--wide, .items-line .mapping--line .card, .scroll__body.mapping--line > .card');
                Array.prototype.forEach.call(cards, decorateGridCardUnified);
            } catch (e) {}
        }

        function syncMenuWidth() {
            if (!moduleEnabled()) {
                try { document.documentElement.style.removeProperty(MENU_WIDTH_VAR); } catch (e) {}
                return;
            }
            try {
                var menus = document.querySelectorAll ? document.querySelectorAll('.menu') : [];
                var menu = null;
                Array.prototype.forEach.call(menus, function (node) {
                    var rect = node.getBoundingClientRect ? node.getBoundingClientRect() : null;
                    if (!menu || (rect && rect.width > 0)) menu = node;
                });
                if (!menu) return;
                var max = 0;
                var items = menu.querySelectorAll('.menu__item');
                var canvas = syncMenuWidth.canvas || (syncMenuWidth.canvas = document.createElement('canvas'));
                var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
                Array.prototype.forEach.call(items, function (item) {
                    var label = item.querySelector && item.querySelector('.menu__text, .menu__item-name, .menu__item-text, .menu__item-title');
                    var icon = item.querySelector && item.querySelector('.menu__ico, .menu__icon, .menu__item-icon, svg, img');
                    var itemRect = item.getBoundingClientRect ? item.getBoundingClientRect() : null;
                    var labelRect = label && label.getBoundingClientRect ? label.getBoundingClientRect() : null;
                    var iconRect = icon && icon.getBoundingClientRect ? icon.getBoundingClientRect() : null;
                    var text = label ? Util.clean(label.textContent || '') : '';
                    var labelWidth = label ? Math.ceil(Math.max(label.scrollWidth || 0, labelRect ? labelRect.width : 0)) : 0;
                    if (ctx && text) {
                        try {
                            var cs = window.getComputedStyle ? window.getComputedStyle(label) : null;
                            ctx.font = cs ? [cs.fontStyle, cs.fontVariant, cs.fontWeight, cs.fontSize, cs.fontFamily].join(' ') : '400 28px Arial';
                            labelWidth = Math.max(labelWidth, Math.ceil(ctx.measureText(text).width));
                            var fontSize = cs ? parseFloat(cs.fontSize || '0') : 0;
                            if (fontSize > 0) labelWidth = Math.max(labelWidth, Math.ceil(text.length * fontSize * .76));
                        } catch (e) {}
                    } else if (text) {
                        labelWidth = Math.max(labelWidth, text.length * 24);
                    }
                    var labelOffset = itemRect && labelRect ? Math.max(0, Math.round(labelRect.left - itemRect.left)) : 0;
                    var iconOffset = itemRect && iconRect ? Math.max(0, Math.round(iconRect.left - itemRect.left)) : 0;
                    if (!labelWidth) labelWidth = Math.ceil((itemRect && itemRect.width) || item.scrollWidth || 0);
                    if (!labelOffset) labelOffset = Math.max(76, iconOffset + Math.ceil((iconRect && iconRect.width) || 32) + 24);
                    max = Math.max(max, labelOffset + labelWidth + Math.max(48, iconOffset || 0));
                });
                if (!max) return;
                var viewportMax = Math.floor((window.innerWidth || 420) * .94);
                var width = Math.min(Math.max(max, 240), Math.min(viewportMax, 460));
                document.documentElement.style.setProperty(MENU_WIDTH_VAR, width + 'px');
                menu.style.setProperty('width', width + 'px', 'important');
                menu.style.setProperty('max-width', '94vw', 'important');
                var body = menu.parentNode && menu.parentNode.classList && menu.parentNode.classList.contains('scroll__body') ? menu.parentNode : null;
                var content = body && body.parentNode && body.parentNode.classList && body.parentNode.classList.contains('scroll__content') ? body.parentNode : null;
                if (body) body.style.setProperty('width', width + 'px', 'important');
                if (content) content.style.setProperty('width', width + 'px', 'important');
            } catch (e2) {}
        }

        function scheduleMenuWidth() {
            clearTimeout(menuTimer);
            menuTimer = setTimeout(syncMenuWidth, 90);
        }

        function scheduleGridDecorate() {
            clearTimeout(gridTimer);
            gridTimer = setTimeout(decorateGrid, 80);
        }

        function shouldSyncMenuFromMutations(mutations) {
            try {
                for (var i = 0; i < mutations.length; i++) {
                    var nodes = mutations[i].addedNodes || [];
                    for (var j = 0; j < nodes.length; j++) {
                        var node = nodes[j];
                        if (!node || node.nodeType !== 1) continue;
                        if ((node.matches && node.matches('.menu, .menu__item')) ||
                            (node.closest && node.closest('.menu')) ||
                            (node.querySelector && node.querySelector('.menu, .menu__item'))) {
                            return true;
                        }
                    }
                }
            } catch (e) {}
            return false;
        }

        function shouldDecorateFromMutations(mutations) {
            function isAkiraDecorNode(node) {
                return !!(node && node.nodeType === 1 && (
                    (node.classList && (
                        node.classList.contains('akira-card-title') ||
                        node.classList.contains('akira-card-logo') ||
                        node.classList.contains('akira-card-type') ||
                        node.classList.contains('akira-card-rating') ||
                        node.classList.contains('akira-card-quality') ||
                        node.classList.contains('akira-ct-meta') ||
                        node.classList.contains('akira-ct-name')
                    )) ||
                    (node.closest && node.closest('.akira-card-title, .akira-card-logo, .akira-card-type, .akira-card-rating, .akira-card-quality'))
                ));
            }

            try {
                for (var i = 0; i < mutations.length; i++) {
                    var nodes = mutations[i].addedNodes || [];
                    for (var j = 0; j < nodes.length; j++) {
                        var node = nodes[j];
                        if (!node || node.nodeType !== 1) continue;
                        if (isAkiraDecorNode(node)) continue;
                        if ((node.matches && node.matches('.mapping--grid, .mapping--line, .items-line, .card')) ||
                            (node.closest && node.closest('.mapping--grid, .mapping--line, .items-line, .card')) ||
                            (node.querySelector && node.querySelector('.mapping--grid, .mapping--line, .items-line, .card'))) {
                            return true;
                        }
                    }
                }
            } catch (e) {}
            return false;
        }

        function bindGridObserver() {
            if (gridObserver || !window.MutationObserver) return;
            try {
                gridObserver = new MutationObserver(function (mutations) {
                    if (shouldSyncMenuFromMutations(mutations)) scheduleMenuWidth();
                    if (shouldDecorateFromMutations(mutations)) scheduleGridDecorate();
                });
                gridObserver.observe(document.body || document.documentElement, { childList: true, subtree: true });
            } catch (e) {}
        }

        function bindMenuWidthEvents() {
            if (menuEventsBound) return;
            menuEventsBound = true;
            try {
                window.addEventListener('resize', scheduleMenuWidth);
                window.addEventListener('orientationchange', scheduleMenuWidth);
            } catch (e) {}
        }

        return {
            start: function () {
                injectStyle();
                bindStorageWatch();
                bindMenuWidthEvents();
                bindGridObserver();
                scheduleMenuWidth();
                scheduleGridDecorate();
                setTimeout(scheduleMenuWidth, 450);
                setTimeout(scheduleMenuWidth, 1200);
                setTimeout(scheduleGridDecorate, 450);
                setTimeout(scheduleGridDecorate, 1200);
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
        var eventsBound = false;
        var storageBound = false;
        var layerWrapped = false;

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
                'body.' + CFG.bodyClass + '[data-akira-scale="on"] .akira-info__body{max-width:min(96%, calc(98em + 8vw));}',
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
            if (!eventsBound) {
                eventsBound = true;
                window.addEventListener('resize', debouncedApply);
                window.addEventListener('orientationchange', debouncedApply);
            }
            try {
                if (!storageBound && Lampa.Storage && Lampa.Storage.listener && Lampa.Storage.listener.follow) {
                    Lampa.Storage.listener.follow('change', function (e) {
                        if (!e || !e.name) return;
                        if (e.name === K.scaleEnabled || e.name === K.enabled) apply();
                    });
                    storageBound = true;
                }
            } catch (e) {}
            try {
                if (!layerWrapped && Lampa.Layer && typeof Lampa.Layer.update === 'function') {
                    var orig = Lampa.Layer.update;
                    Lampa.Layer.update = function (where) {
                        if (moduleEnabled()) {
                            document.documentElement.style.setProperty('--akira-base-font-size', pickSize() + 'px');
                        }
                        return orig.call(this, where);
                    };
                    layerWrapped = true;
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
        var PARTS_LIMIT = 3;
        var COLLECTION_CACHE_TIME = 1000 * 60 * 60;
        var COLLECTION_CACHE_JITTER = 1000 * 60 * 20;
        var DEFAULT_COLLECTION_TIMEOUT = 8000;
        var PERSONAL_COLLECTION_TIMEOUT = 6000;
        var PRIORITY_COLLECTION_TIMEOUT = 15000;
        var FIRST_BATCH_RETRIES = 3;
        var CACHE_PREFIX = CFG.prefix + 'tmdb_cache_';
        var RECOMMENDED_FALLBACK_REQUEST = 'discover/movie?sort_by=popularity.desc&vote_count.gte=300&vote_average.gte=6.5&with_runtime.gte=40&without_genres=99';

        var COLLECTIONS = [
            { id: 'personal_recommendations', emoji: '✨', name: { ru: 'Рекомендации для тебя', en: 'Recommended for you', uk: 'Рекомендації для тебе' },
              fallbackName: { ru: '\u0420\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0443\u0435\u043c \u043f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c', en: 'Worth watching', uk: '\u0420\u0430\u0434\u0438\u043c\u043e \u043f\u043e\u0434\u0438\u0432\u0438\u0442\u0438\u0441\u044f' },
              loader: 'personal', priority: true, timeout: PRIORITY_COLLECTION_TIMEOUT, cache: true, cacheTime: COLLECTION_CACHE_TIME, seedLimit: 5 },
            { id: 'trending_movies', emoji: '🔥', name: { ru: 'Топ фильмов недели',  en: 'Top movies this week',  uk: 'Топ фільмів тижня' },
              request: 'trending/movie/week', timeout: DEFAULT_COLLECTION_TIMEOUT, cache: true, cacheTime: COLLECTION_CACHE_TIME },
            { id: 'trending_tv',     emoji: '🔥', name: { ru: 'Топ сериалов недели', en: 'Top series this week',  uk: 'Топ серіалів тижня' },
              request: 'trending/tv/week', timeout: DEFAULT_COLLECTION_TIMEOUT, cache: true, cacheTime: COLLECTION_CACHE_TIME },
            { id: 'hot_new_releases', emoji: '🎬', name: { ru: 'Свежие премьеры',    en: 'Hot new releases',      uk: 'Свіжі прем’єри' },
              request: 'discover/movie?sort_by=primary_release_date.desc&with_release_type=4|5|6&primary_release_date.lte=' + today + '&vote_count.gte=50&vote_average.gte=6&with_runtime.gte=40&without_genres=99', timeout: DEFAULT_COLLECTION_TIMEOUT, cache: true, cacheTime: COLLECTION_CACHE_TIME },
            { id: 'best_year',       emoji: '🌟', name: { ru: 'Лучшее текущего года', en: 'Best of the year',     uk: 'Найкраще поточного року' },
              request: 'discover/movie?primary_release_year=' + thisYear + '&sort_by=vote_average.desc&vote_count.gte=300', timeout: DEFAULT_COLLECTION_TIMEOUT, cache: true, cacheTime: COLLECTION_CACHE_TIME },
            { id: 'cult_classics',   emoji: '🍿', name: { ru: 'Классика и хиты',     en: 'Cult and classics',     uk: 'Класика та хіти' },
              request: 'discover/movie?primary_release_date.gte=1980-01-01&sort_by=popularity.desc&vote_average.gte=7&vote_count.gte=500', timeout: DEFAULT_COLLECTION_TIMEOUT, cache: true, cacheTime: COLLECTION_CACHE_TIME },
            { id: 'animation',       emoji: '🧸', name: { ru: 'Лучшая анимация',     en: 'Top animation',         uk: 'Найкраща анімація' },
              request: 'discover/movie?with_genres=16&sort_by=popularity.desc&vote_average.gte=7&vote_count.gte=500', timeout: DEFAULT_COLLECTION_TIMEOUT, cache: true, cacheTime: COLLECTION_CACHE_TIME },
            { id: 'japanese_animation', emoji: '🌸', name: { ru: '\u0410\u043d\u0438\u043c\u0435 \u0444\u0438\u043b\u044c\u043c\u044b', en: 'Anime movies', uk: '\u0410\u043d\u0456\u043c\u0435 \u0444\u0456\u043b\u044c\u043c\u0438' },
              requests: [
                  { type: 'movie', request: 'discover/movie?with_genres=16&with_original_language=ja&sort_by=popularity.desc&vote_average.gte=7&vote_count.gte=120&with_runtime.gte=40' }
              ], timeout: DEFAULT_COLLECTION_TIMEOUT, cache: true, cacheTime: COLLECTION_CACHE_TIME },
            { id: 'anime_plugin_tv', emoji: '🌸', name: { ru: '\u0410\u043d\u0438\u043c\u0435 \u0441\u0435\u0440\u0438\u0430\u043b\u044b', en: 'Anime series', uk: '\u0410\u043d\u0456\u043c\u0435 \u0441\u0435\u0440\u0456\u0430\u043b\u0438' },
              request: 'discover/tv?vote_average.gte=6.5&vote_average.lte=9.5&first_air_date.lte=2026-12-31&first_air_date.gte=2020-01-01&with_original_language=ja',
              timeout: DEFAULT_COLLECTION_TIMEOUT, cache: true, cacheTime: COLLECTION_CACHE_TIME, defaultOn: false },
            { id: 'world_series',    emoji: '🌍', name: { ru: 'Хиты мировых сериалов', en: 'World series hits',   uk: 'Хіти світових серіалів' },
              request: 'discover/tv?sort_by=popularity.desc&vote_average.gte=7&vote_count.gte=500&first_air_date.gte=2020-01-01&without_genres=16,99,10764,10767', timeout: DEFAULT_COLLECTION_TIMEOUT, cache: true, cacheTime: COLLECTION_CACHE_TIME },
            { id: 'netflix_best',    emoji: '⚫', name: { ru: 'Хиты Netflix',         en: 'Netflix hits',          uk: 'Хіти Netflix' },
              request: 'discover/tv?with_networks=213&sort_by=last_air_date.desc&first_air_date.gte=2020-01-01&vote_average.gte=7&vote_count.gte=500', timeout: DEFAULT_COLLECTION_TIMEOUT, cache: true, cacheTime: COLLECTION_CACHE_TIME },
            { id: 'watching_now', emoji: '👀', name: { ru: '\u0421\u0435\u0439\u0447\u0430\u0441 \u0441\u043c\u043e\u0442\u0440\u044f\u0442', en: 'Watching now', uk: '\u0417\u0430\u0440\u0430\u0437 \u0434\u0438\u0432\u043b\u044f\u0442\u044c\u0441\u044f' },
              request: 'discover/movie?sort_by=popularity.desc&with_release_type=4|5|6&primary_release_date.lte=' + today + '&vote_count.gte=50&vote_average.gte=6&with_runtime.gte=40&without_genres=99',
              timeout: DEFAULT_COLLECTION_TIMEOUT, cache: true, cacheTime: COLLECTION_CACHE_TIME, defaultOn: false },
            { id: 'documentaries', emoji: '🎥', name: { ru: '\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430\u043b\u044c\u043d\u044b\u0435 \u0444\u0438\u043b\u044c\u043c\u044b', en: 'Documentaries', uk: '\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430\u043b\u044c\u043d\u0456 \u0444\u0456\u043b\u044c\u043c\u0438' },
              request: 'discover/movie?with_genres=99&sort_by=popularity.desc&vote_count.gte=20&with_translations=ru&include_translations=ru',
              timeout: DEFAULT_COLLECTION_TIMEOUT, cache: true, cacheTime: COLLECTION_CACHE_TIME, defaultOn: false },
            { id: 'recent_tv_hits', emoji: '📺', name: { ru: '\u0421\u0435\u0440\u0438\u0430\u043b\u044b \u043f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0445 \u043b\u0435\u0442', en: 'Recent series hits', uk: '\u0425\u0456\u0442\u0438 \u0441\u0435\u0440\u0456\u0430\u043b\u0456\u0432 \u043e\u0441\u0442\u0430\u043d\u043d\u0456\u0445 \u0440\u043e\u043a\u0456\u0432' },
              request: 'discover/tv?sort_by=popularity.desc&first_air_date.gte=2020-01-01&vote_average.gte=7&vote_count.gte=300&without_genres=16,99,10762,10763,10764,10766,10767',
              timeout: DEFAULT_COLLECTION_TIMEOUT, cache: true, cacheTime: COLLECTION_CACHE_TIME, defaultOn: false },
            { id: 'trending_all', emoji: '📈', name: { ru: '\u0422\u0440\u0435\u043d\u0434\u044b \u0441\u0435\u0439\u0447\u0430\u0441', en: 'Trending now', uk: '\u0422\u0440\u0435\u043d\u0434\u0438 \u0437\u0430\u0440\u0430\u0437' },
              request: 'trending/all/week', mediaTypes: ['movie', 'tv'],
              timeout: DEFAULT_COLLECTION_TIMEOUT, cache: true, cacheTime: COLLECTION_CACHE_TIME, defaultOn: false },
            { id: 'high_rated_movies', emoji: '⭐', name: { ru: '\u0412\u044b\u0441\u043e\u043a\u0438\u0439 \u0440\u0435\u0439\u0442\u0438\u043d\u0433', en: 'Highly rated movies', uk: '\u0412\u0438\u0441\u043e\u043a\u0438\u0439 \u0440\u0435\u0439\u0442\u0438\u043d\u0433' },
              request: 'discover/movie?sort_by=vote_count.desc&vote_average.gte=7.2&vote_count.gte=1000&with_runtime.gte=40&without_genres=99',
              timeout: DEFAULT_COLLECTION_TIMEOUT, cache: true, cacheTime: COLLECTION_CACHE_TIME, defaultOn: false },
            { id: 'russian_platforms', emoji: '📺', name: { ru: 'Российские платформы', en: 'Russian platforms',   uk: 'Російські платформи' },
              requests: [
                  { type: 'tv', request: 'discover/tv?with_networks=2493|2859|4085|3923|3871|3827|5806|806|1191&sort_by=first_air_date.desc&first_air_date.lte=' + today + '&vote_average.gte=5&vote_count.gte=3&without_genres=16,99,10762,10763,10764,10766,10767,10768' },
                  { type: 'movie', request: 'discover/movie?with_companies=2493|2859|4085|3923|3871|3827|5806|806|1191&sort_by=primary_release_date.desc&primary_release_date.lte=' + today + '&vote_average.gte=5&vote_count.gte=3&with_runtime.gte=40&without_genres=16,99' }
              ], timeout: DEFAULT_COLLECTION_TIMEOUT, cache: true, cacheTime: COLLECTION_CACHE_TIME, defaultOn: false }
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
            COLLECTIONS.forEach(function (c) { Util.ensureOnOff(colKey(c.id), c.defaultOn !== false); });
        }

        function mediaTypeOf(item) {
            if (!item) return 'movie';
            var v = String(item.media_type || item.type || '').toLowerCase();
            if (v === 'tv' || v === 'movie') return v;
            return (item.name || item.first_air_date || item.number_of_seasons) ? 'tv' : 'movie';
        }

        function mediaKey(item) {
            if (!item || !item.id) return '';
            return mediaTypeOf(item) + ':' + item.id;
        }

        function collectMediaItems(value, out, depth) {
            if (!value || out.length > 120 || depth > 5) return;
            if (Array.isArray(value)) {
                for (var i = 0; i < value.length; i++) collectMediaItems(value[i], out, depth + 1);
                return;
            }
            if (typeof value !== 'object') return;
            if (value.id && (value.title || value.name || value.original_title || value.original_name)) {
                out.push(value);
                return;
            }
            for (var k in value) {
                if (!Object.prototype.hasOwnProperty.call(value, k)) continue;
                if (k === 'card' || k === 'cards' || k === 'history' || k === 'movie' || k === 'tv' || k === 'data' || k === 'items' || k === 'results') {
                    collectMediaItems(value[k], out, depth + 1);
                }
            }
            if (depth > 0) {
                for (var key in value) {
                    if (!Object.prototype.hasOwnProperty.call(value, key) || out.length > 120) continue;
                    collectMediaItems(value[key], out, depth + 1);
                }
            }
        }

        function readHistoryItems() {
            var found = [];
            try {
                if (Lampa.Storage && typeof Lampa.Storage.get === 'function') {
                    ['favorite', 'history', 'viewed', 'watched', 'online_view'].forEach(function (key) {
                        try { collectMediaItems(Lampa.Storage.get(key, null), found, 0); } catch (err) {}
                    });
                }
            } catch (e) {}
            try {
                if (Lampa.Favorite && typeof Lampa.Favorite.get === 'function') {
                    ['history', 'view'].forEach(function (key) {
                        try { collectMediaItems(Lampa.Favorite.get(key), found, 0); } catch (err2) {}
                    });
                }
            } catch (e2) {}
            var uniq = [], seen = {};
            found.forEach(function (item) {
                var key = mediaKey(item);
                if (!key || seen[key]) return;
                seen[key] = true;
                uniq.push(item);
            });
            return uniq;
        }

        function debugEnabled() {
            try {
                return !!window.akira_tmdb_debug || Util.isOn(CFG.prefix + 'tmdb_debug', false);
            } catch (e) { return false; }
        }

        function debugLog() {
            if (!debugEnabled() || !window.console || !console.log) return;
            try {
                var args = Array.prototype.slice.call(arguments);
                args.unshift('[Akira TMDB]');
                console.log.apply(console, args);
            } catch (e) {}
        }

        function cloneJson(value) {
            if (!value) return value;
            try { return JSON.parse(JSON.stringify(value)); } catch (e) { return value; }
        }

        function collectionHasResults(json) {
            return !!(json && Array.isArray(json.results) && json.results.length);
        }

        function profileCachePart() {
            var profile = '';
            try { profile = Lampa.Storage.get('lampac_profile_id', '') || profile; } catch (e) {}
            try { profile = Lampa.Storage.get('profile_id', '') || profile; } catch (e2) {}
            try {
                if (!profile && Lampa.Account && Lampa.Account.profile && Lampa.Account.profile.id) {
                    profile = Lampa.Account.profile.id;
                }
            } catch (e3) {}
            return String(profile || 'default');
        }

        function collectionCacheKey(cfg) {
            return CACHE_PREFIX + cfg.id + '_' + Util.langCode() + '_' + profileCachePart();
        }

        function collectionCacheJitter(cfg) {
            var raw = String((cfg && cfg.id) || '');
            var hash = 0;
            for (var i = 0; i < raw.length; i++) {
                hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
            }
            return Math.abs(hash) % COLLECTION_CACHE_JITTER;
        }

        function collectionExpiresAt(cfg, timestamp) {
            var ttl = (cfg && cfg.cacheTime) || COLLECTION_CACHE_TIME;
            return timestamp + ttl + collectionCacheJitter(cfg);
        }

        function readCollectionCache(cfg) {
            if (!cfg || cfg.cache === false) return null;
            try {
                var node = Util.get(collectionCacheKey(cfg), null);
                if (!node || !node.timestamp || !node.value) return null;
                var expiresAt = node.expiresAt || collectionExpiresAt(cfg, node.timestamp);
                if (new Date().getTime() > expiresAt) return null;
                return cloneJson(node.value);
            } catch (e) { return null; }
        }

        function writeCollectionCache(cfg, json) {
            if (!cfg || cfg.cache === false || !collectionHasResults(json)) return;
            try {
                var now = new Date().getTime();
                Util.set(collectionCacheKey(cfg), {
                    timestamp: now,
                    expiresAt: collectionExpiresAt(cfg, now),
                    value: cloneJson(json)
                });
            } catch (e) {}
        }

        function emptyCollection(cfg) {
            var name = localized(cfg.name);
            return {
                source: 'akira_tmdb',
                results: [],
                title: cfg.emoji ? cfg.emoji + ' ' + name : name
            };
        }

        function prepareCollection(cfg, json) {
            var name = localized(json && json.__akiraFallback && cfg.fallbackName ? cfg.fallbackName : cfg.name);
            json = json || { source: 'akira_tmdb', results: [] };
            if (!Array.isArray(json.results)) json.results = [];
            if (cfg.mediaTypes && cfg.mediaTypes.length) {
                json.results = json.results.filter(function (item) {
                    var type = String(item && (item.media_type || item.type) || '').toLowerCase();
                    if (!type) type = mediaTypeOf(item);
                    return cfg.mediaTypes.indexOf(type) !== -1;
                });
            }
            try { delete json.__akiraFallback; } catch (e) {}
            json.source = json.source || 'akira_tmdb';
            json.title = cfg.emoji ? cfg.emoji + ' ' + name : name;
            if (Lampa.Utils && Lampa.Utils.addSource) Lampa.Utils.addSource(json, 'akira_tmdb');
            return json;
        }

        function loadPersonalRecommendations(parent, params, done, fail, cfg) {
            var seeds = readHistoryItems().slice(0, (cfg && cfg.seedLimit) || 5);
            var watched = {};
            seeds.forEach(function (item) { var key = mediaKey(item); if (key) watched[key] = true; });

            function fallback() {
                parent.get(RECOMMENDED_FALLBACK_REQUEST, params, function (json) {
                    json = json || { source: 'akira_tmdb', results: [] };
                    json.__akiraFallback = true;
                    done(json);
                }, fail || done);
            }

            if (!seeds.length) { fallback(); return; }

            var index = 0;
            var byKey = {};
            var list = [];

            function addItems(type, items) {
                (items || []).forEach(function (item) {
                    if (!item || !item.id) return;
                    if (!item.media_type) item.media_type = type;
                    var key = mediaKey(item);
                    if (!key || watched[key]) return;
                    if (!byKey[key]) {
                        item.__akiraScore = 0;
                        byKey[key] = item;
                        list.push(item);
                    }
                    byKey[key].__akiraScore += 1;
                });
            }

            function next() {
                if (index >= seeds.length) {
                    if (!list.length) { fallback(); return; }
                    list.sort(function (a, b) {
                        var as = (a.__akiraScore || 0) * 100 + (a.vote_average || 0) * 3 + Math.min(a.vote_count || 0, 1200) / 100;
                        var bs = (b.__akiraScore || 0) * 100 + (b.vote_average || 0) * 3 + Math.min(b.vote_count || 0, 1200) / 100;
                        return bs - as;
                    });
                    list = list.slice(0, 20).map(function (item) {
                        try { delete item.__akiraScore; } catch (e) {}
                        return item;
                    });
                    done({ source: 'akira_tmdb', results: list });
                    return;
                }
                var seed = seeds[index++];
                var type = mediaTypeOf(seed);
                parent.get(type + '/' + seed.id + '/recommendations', params, function (json) {
                    addItems(type, json && json.results);
                    next();
                }, function () { next(); });
            }

            next();
        }

        function itemDateValue(item) {
            var raw = item && (item.release_date || item.first_air_date || '');
            var time = raw ? Date.parse(raw) : 0;
            return isFinite(time) ? time : 0;
        }

        function loadMultiRequestCollection(parent, params, requests, done, fail) {
            requests = Array.isArray(requests) ? requests : [];
            if (!requests.length) { if (fail) fail(); else done({ source: 'akira_tmdb', results: [] }); return; }

            var index = 0;
            var list = [];
            var seen = {};

            function add(type, items) {
                (items || []).forEach(function (item) {
                    if (!item || !item.id) return;
                    if (!item.media_type) item.media_type = type || mediaTypeOf(item);
                    var key = mediaKey(item);
                    if (!key || seen[key]) return;
                    seen[key] = true;
                    list.push(item);
                });
            }

            function next() {
                if (index >= requests.length) {
                    list.sort(function (a, b) {
                        var dateDiff = itemDateValue(b) - itemDateValue(a);
                        if (dateDiff) return dateDiff;
                        return (b.popularity || 0) - (a.popularity || 0);
                    });
                    done({ source: 'akira_tmdb', results: list.slice(0, 20) });
                    return;
                }
                var cfg = requests[index++];
                parent.get(cfg.request, params, function (json) {
                    add(cfg.type, json && json.results);
                    next();
                }, function () { next(); });
            }

            next();
        }

        function loadCollectionRaw(cfg, parent, params, done, fail) {
            if (cfg.loader === 'personal') {
                loadPersonalRecommendations(parent, params, done, fail, cfg);
            } else if (cfg.requests) {
                loadMultiRequestCollection(parent, params, cfg.requests, done, fail);
            } else if (cfg.request) {
                parent.get(cfg.request, params, done, fail);
            } else {
                fail();
            }
        }

        function safePart(cfg, parent, params, call) {
            var finished = false;
            var timer = null;
            var attempt = 0;
            var retries = cfg.retries || 0;
            var timeout = cfg.priority ? (cfg.timeout || PRIORITY_COLLECTION_TIMEOUT) : (cfg.timeout || DEFAULT_COLLECTION_TIMEOUT);
            var cachedFirst = readCollectionCache(cfg);

            if (cachedFirst && collectionHasResults(cachedFirst)) {
                debugLog(cfg.id, 'cache-hit', cachedFirst.results.length);
                call(prepareCollection(cfg, cachedFirst));
                return;
            }

            function complete(json, reason) {
                if (finished) return;
                finished = true;
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }

                var prepared = prepareCollection(cfg, json);
                if (collectionHasResults(prepared)) {
                    if (reason !== 'cache') writeCollectionCache(cfg, prepared);
                    debugLog(cfg.id, reason || 'success', prepared.results.length);
                    call(prepared);
                    return;
                }

                var cached = readCollectionCache(cfg);
                if (cached && collectionHasResults(cached)) {
                    debugLog(cfg.id, reason || 'empty', 'cache', cached.results.length);
                    call(prepareCollection(cfg, cached));
                    return;
                }

                debugLog(cfg.id, reason || 'empty', 'no-cache');
                call(emptyCollection(cfg));
            }

            function fail(reason) {
                if (attempt <= retries) {
                    run(reason || 'error');
                    return;
                }
                complete(null, reason || 'error');
            }

            function run(previousReason) {
                if (finished) return;
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                attempt++;
                timer = setTimeout(function () {
                    fail('timeout');
                }, timeout);
                try {
                    debugLog(cfg.id, attempt === 1 ? 'start' : 'retry', attempt, previousReason || '');
                    loadCollectionRaw(cfg, parent, params, function (json) {
                        complete(json, attempt === 1 ? 'success' : 'retry-success');
                    }, function () {
                        fail('error');
                    });
                } catch (e) {
                    fail('exception');
                }
            }

            run();
        }

        function buildDiscoveryMain(parent) {
            return function () {
                var params = arguments[0] !== undefined ? arguments[0] : {};
                var oncomplete = arguments[1];
                var onerror = arguments[2];
                var hasSeq = Lampa.Api && typeof Lampa.Api.sequentials === 'function';
                var hasPart = Lampa.Api && typeof Lampa.Api.partNext === 'function';
                if (!hasPart && !hasSeq) { if (onerror) onerror(); return function () {}; }

                var parts = [];
                COLLECTIONS.forEach(function (cfg, index) {
                    if (!colEnabled(cfg.id)) return;
                    parts.push(function (call) { safePart(cfg, parent, params, call); });
                    if (parts.length <= PARTS_LIMIT && !cfg.retries) cfg.retries = FIRST_BATCH_RETRIES;
                });

                if (!parts.length) { if (onerror) onerror(); return function () {}; }

                var emitted = 0;

                function normalizeBatch(data) {
                    var list = Array.isArray(data) ? data : [data];
                    return list.filter(function (item) {
                        return collectionHasResults(item);
                    });
                }

                function loadPart(partLoaded, partEmpty) {
                    var method = hasPart ? Lampa.Api.partNext : Lampa.Api.sequentials;
                    var limit = hasPart ? PARTS_LIMIT : parts.length;
                    method(parts, limit, function (data) {
                        var list = normalizeBatch(data);
                        if (list.length) {
                            emitted += list.length;
                            if (partLoaded) partLoaded(list);
                        } else if (!emitted && partEmpty) {
                            partEmpty();
                        }
                    }, function (err) {
                        if (!emitted && partEmpty) partEmpty(err);
                    });
                }

                loadPart(oncomplete, onerror);
                return loadPart;
            };
        }

        function createAkiraMain(source, originalMain) {
            var main = function () {
                var args = Array.prototype.slice.call(arguments);
                if (moduleEnabled() && this.type !== 'movie' && this.type !== 'tv') {
                    return buildDiscoveryMain(source).apply(this, args);
                }
                return originalMain.apply(this, args);
            };
            main.__akiraMain = true;
            return main;
        }

        function ensureParamsSource() {
            try {
                var sources = (Lampa.Params && Lampa.Params.values && Lampa.Params.values.source) ? Lampa.Params.values.source : {};
                if (sources.akira_tmdb !== 'Akira') {
                    sources.akira_tmdb = 'Akira';
                    var current = 'tmdb';
                    try {
                        current = Lampa.Storage && Lampa.Storage.field ? Lampa.Storage.field('source') : Lampa.Storage.get('source', 'tmdb');
                    } catch (e) {}
                    Lampa.Params.select('source', sources, current || 'tmdb');
                }
            } catch (e2) {}
        }

        function installSource() {
            try {
                if (!Lampa.Api || !Lampa.Api.sources || !Lampa.Api.sources.tmdb) return false;
                if (Lampa.Api.sources.akira_tmdb) {
                    var readySource = Lampa.Api.sources.akira_tmdb;
                    if (!readySource.main || !readySource.main.__akiraMain) {
                        readySource.__akiraOriginalMain = readySource.__akiraOriginalMain || Lampa.Api.sources.tmdb.main;
                        readySource.main = createAkiraMain(readySource, readySource.__akiraOriginalMain);
                    }
                    ensureParamsSource();
                    return true;
                }
                var origTmdb = Lampa.Api.sources.tmdb;
                var clone = Object.assign({}, origTmdb);
                Lampa.Api.sources.akira_tmdb = clone;
                try { Object.defineProperty(Lampa.Api.sources, 'akira_tmdb', { get: function () { return clone; } }); } catch (e) {}
                var origMain = origTmdb.main;
                clone.__akiraOriginalMain = origMain;
                clone.main = createAkiraMain(clone, origMain);
                if (Lampa.Params && Lampa.Params.select) ensureParamsSource();
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
     * 12. SETTINGS вЂ” РєРѕСЂРЅРµРІРѕР№ РїСѓРЅРєС‚ "akira" + РІР»РѕР¶РµРЅРЅС‹Рµ РїРѕРґСЂР°Р·РґРµР»С‹
     *     РїРѕ РѕР±СЂР°Р·С†Сѓ appletv_agnative: РєР°Р¶РґРѕРµ РїРѕРґРјРµРЅСЋ вЂ” РѕС‚РґРµР»СЊРЅС‹Р№
     *     SettingsApi component, РѕС‚РєСЂС‹РІР°РµС‚СЃСЏ С‡РµСЂРµР· type:'button' СЃ
     *     onChange в†’ Lampa.Settings.create(child, { onBack: parent }).
     * ================================================================ */

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

        function buildRoot() {
            addComponent(CFG.component, t('root_name'));
            addParam(CFG.component, { name: CFG.prefix + 'about', type: 'static' },
                { name: t('root_name'), description: t('root_about') });
            addParam(CFG.component, { name: K.enabled, type: 'trigger', default: true },
                { name: t('master_enabled') });
            addParam(CFG.component, { name: K.shotsEnabled, type: 'trigger', default: true },
                { name: t('shots_enabled') }, function () { try { Shots.sync(); } catch (e) {} });
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
            addParam(SUB.topbar, { name: K.topbarBrand, type: 'input', values: '', placeholder: CFG.brand, default: CFG.brand },
                { name: t('topbar_brand'), description: currentBrand() }, function (value) {
                    var clean = Util.clean(value) || CFG.brand;
                    if (clean !== value) Util.set(K.topbarBrand, clean);
                    try { Topbar.schedule(true); } catch (e) {}
                });
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
            addParam(SUB.iface, {
                name: K.ifaceHeroMode, type: 'select',
                values: { 'block': t('iface_hero_mode_block'), 'fullscreen': t('iface_hero_mode_fullscreen') },
                default: 'block'
            }, { name: t('iface_hero_mode') });
            addParam(SUB.iface, {
                name: K.ifaceHeroInfo, type: 'select',
                values: {
                    'all': t('iface_hero_info_all'),
                    'hide_description': t('iface_hero_info_hide_description'),
                    'hide_meta': t('iface_hero_info_hide_meta'),
                    'hide_all': t('iface_hero_info_hide_all')
                },
                default: 'all'
            }, { name: t('iface_hero_info') });
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
                addParam(SUB.tmdb, { name: TmdbMod.colKey(c.id), type: 'trigger', default: c.defaultOn !== false },
                    { name: name });
            });
        }

        function resetAll() {
            try {
                if (!Lampa.Storage || !Lampa.Storage.get) return;
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

    var booted = false;

    // Keep startup order explicit: shared services first, UI modules after CSS
    // and settings are in place, optional data source last.
    var BOOT_MODULES = [
        { name: 'Shots', module: Shots },
        { name: 'Settings', module: Settings, method: 'buildAll' },
        { name: 'Theme', module: Theme },
        { name: 'Scale', module: Scale },
        { name: 'Logos', module: Logos },
        { name: 'Buttons', module: Buttons },
        { name: 'Interface', module: Interface },
        { name: 'Topbar', module: Topbar },
        { name: 'TmdbMod', module: TmdbMod },
        { name: 'Comments', module: Comments }
    ];

    function boot() {
        if (booted) return;
        ensureDefaults();
        booted = true;
        BOOT_MODULES.forEach(function (entry) {
            startModule(entry.name, entry.module, entry.method);
        });
        Util.log('Akira', CFG.version);
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
