(function () {
    'use strict';

    if (typeof Lampa === 'undefined') return;

    var CFG = {
        guard: '__AKIRA_UNIFIED_PLUGIN__',
        version: '0.1.0',
        prefix: 'akira_',
        component: 'akira',
        styleId: 'akira-unified-style',
        bodyClass: 'akira-ui',
        brand: 'AKIRA'
    };

    if (window[CFG.guard]) return;
    window[CFG.guard] = true;

    var C = {
        root: 'akira',
        topbar: 'akira_topbar',
        topnav: 'akira_topnav',
        interface: 'akira_interface',
        detail: 'akira_detail',
        buttons: 'akira_buttons',
        logos: 'akira_logos',
        tmdb: 'akira_tmdb',
        scale: 'akira_scale'
    };

    var K = {
        enabled: CFG.prefix + 'enabled',
        themeEnabled: CFG.prefix + 'theme_enabled',
        accent: CFG.prefix + 'accent',
        topbar: CFG.prefix + 'topbar',
        topbarAlign: CFG.prefix + 'topbar_align',
        brandName: CFG.prefix + 'brand_name',
        topnavItems: CFG.prefix + 'topnav_items',
        interfaceEnabled: CFG.prefix + 'interface_enabled',
        detailEnabled: CFG.prefix + 'detail_enabled',
        cardDesign: CFG.prefix + 'card_design',
        buttonsSeparate: CFG.prefix + 'buttons_separate',
        buttonsBig: CFG.prefix + 'buttons_big',
        translateTv: CFG.prefix + 'translate_tv',
        animations: CFG.prefix + 'animations',
        logos: CFG.prefix + 'logos_enabled',
        logoLang: CFG.prefix + 'logo_lang',
        logoSize: CFG.prefix + 'logo_size',
        logoHideHead: CFG.prefix + 'logo_hide_head',
        scale: CFG.prefix + 'scale_enabled',
        tmdb: CFG.prefix + 'tmdb_enabled'
    };

    var TOPBAR_FALLBACK = [
        { action: 'main', label: { ru: 'Главная', en: 'Home', uk: 'Головна' }, lang: 'title_main' },
        { action: 'movie', label: { ru: 'Фильмы', en: 'Movies', uk: 'Фільми' }, lang: 'menu_movies' },
        { action: 'tv', label: { ru: 'Сериалы', en: 'TV', uk: 'Серіали' }, lang: 'menu_tv' },
        { action: 'anime', label: { ru: 'Аниме', en: 'Anime', uk: 'Аніме' }, lang: 'menu_anime' },
        { action: 'cartoon', label: { ru: 'Мультфильмы', en: 'Cartoons', uk: 'Мультфільми' }, lang: 'menu_multmovie' },
        { action: 'release', label: { ru: 'Новинки', en: 'New', uk: 'Новинки' }, lang: 'title_new' },
        { action: 'favorite', label: { ru: 'Закладки', en: 'Bookmarks', uk: 'Закладки' }, lang: 'menu_bookmark' }
    ];

    var PALETTES = {
        netflix: { label: 'Netflix Red', accent: '#e50914', accent2: '#ff3b47', rgb: '229,9,20', focusText: '#fff' },
        graphite: { label: 'Graphite Red', accent: '#f04444', accent2: '#f59e0b', rgb: '240,68,68', focusText: '#fff' },
        mint: { label: 'Cinema Mint', accent: '#35c7a5', accent2: '#6ee7b7', rgb: '53,199,165', focusText: '#061413' },
        cyan: { label: 'Ice Cyan', accent: '#22d3ee', accent2: '#60a5fa', rgb: '34,211,238', focusText: '#03131b' }
    };

    var TEXT = {
        ru: {
            title: 'Akira',
            about: 'Единый плагин Akira: верхний бар, горизонтальный интерфейс, деталка, логотипы, TMDB-подборки и авто-масштаб.',
            enabled: 'Включить Akira',
            openTopbar: 'Верхний бар',
            openInterface: 'Главная и карточки',
            openDetail: 'Деталка фильма',
            openButtons: 'Кнопки деталки',
            openLogos: 'Логотипы',
            openTmdb: 'TMDB-подборки',
            openScale: 'Авто-масштаб',
            enableTopbar: 'Включить верхний бар',
            brand: 'Название бренда',
            align: 'Положение верхнего бара',
            alignStart: 'Слева',
            alignCenter: 'По центру',
            configureTopnav: 'Настроить пункты верхнего бара',
            topnavTitle: 'Пункты верхнего бара',
            show: 'Показывать',
            hide: 'Скрыть',
            enableInterface: 'Включить большую карточку на главной',
            enableTheme: 'Включить тему Akira/Netflix',
            accent: 'Акцент темы',
            cardDesign: 'Дизайн маленьких карточек',
            enableDetail: 'Включить дизайн деталки',
            buttonsSeparate: 'Развернуть онлайн/торренты/трейлеры',
            buttonsBig: 'Показывать подписи кнопок',
            translateTv: 'Перевести метку TV',
            animations: 'Анимации фокуса',
            enableLogos: 'Логотипы вместо названий',
            logoLang: 'Язык логотипов',
            logoSize: 'Размер логотипов TMDB',
            logoHideHead: 'Переносить год/страну при логотипе',
            clearLogoCache: 'Очистить кэш логотипов',
            enableTmdb: 'Включить источник Akira TMDB',
            enableScale: 'Включить адаптивный масштаб',
            reset: 'Сбросить настройки Akira',
            ok: 'Готово',
            reload: 'Изменения полностью применятся после перезагрузки текущего экрана',
            on: 'Вкл',
            off: 'Выкл',
            auto: 'Авто'
        },
        en: {
            title: 'Akira',
            about: 'Unified Akira plugin: top bar, horizontal home, detail page, logos, TMDB collections, and adaptive scale.',
            enabled: 'Enable Akira',
            openTopbar: 'Top bar',
            openInterface: 'Home and cards',
            openDetail: 'Movie detail',
            openButtons: 'Detail buttons',
            openLogos: 'Logos',
            openTmdb: 'TMDB collections',
            openScale: 'Auto scale',
            enableTopbar: 'Enable top bar',
            brand: 'Brand name',
            align: 'Top bar position',
            alignStart: 'Left',
            alignCenter: 'Center',
            configureTopnav: 'Configure top bar items',
            topnavTitle: 'Top bar items',
            show: 'Show',
            hide: 'Hide',
            enableInterface: 'Enable home hero card',
            enableTheme: 'Enable Akira/Netflix theme',
            accent: 'Theme accent',
            cardDesign: 'Small card design',
            enableDetail: 'Enable detail design',
            buttonsSeparate: 'Ungroup online/torrents/trailers',
            buttonsBig: 'Show button labels',
            translateTv: 'Translate TV label',
            animations: 'Focus animations',
            enableLogos: 'Use logos instead of titles',
            logoLang: 'Logo language',
            logoSize: 'TMDB logo size',
            logoHideHead: 'Move year/country when logo is active',
            clearLogoCache: 'Clear logo cache',
            enableTmdb: 'Enable Akira TMDB source',
            enableScale: 'Enable adaptive scale',
            reset: 'Reset Akira settings',
            ok: 'Done',
            reload: 'Changes fully apply after reloading the current screen',
            on: 'On',
            off: 'Off',
            auto: 'Auto'
        },
        uk: {
            title: 'Akira',
            about: 'Єдиний плагін Akira: верхній бар, горизонтальний інтерфейс, деталка, логотипи, TMDB-добірки та авто-масштаб.',
            enabled: 'Увімкнути Akira',
            openTopbar: 'Верхній бар',
            openInterface: 'Головна і картки',
            openDetail: 'Деталка фільму',
            openButtons: 'Кнопки деталки',
            openLogos: 'Логотипи',
            openTmdb: 'TMDB-добірки',
            openScale: 'Авто-масштаб',
            enableTopbar: 'Увімкнути верхній бар',
            brand: 'Назва бренду',
            align: 'Положення верхнього бара',
            alignStart: 'Зліва',
            alignCenter: 'По центру',
            configureTopnav: 'Налаштувати пункти верхнього бара',
            topnavTitle: 'Пункти верхнього бара',
            show: 'Показувати',
            hide: 'Сховати',
            enableInterface: 'Увімкнути велику картку на головній',
            enableTheme: 'Увімкнути тему Akira/Netflix',
            accent: 'Акцент теми',
            cardDesign: 'Дизайн малих карток',
            enableDetail: 'Увімкнути дизайн деталки',
            buttonsSeparate: 'Розгорнути онлайн/торенти/трейлери',
            buttonsBig: 'Показувати підписи кнопок',
            translateTv: 'Перекласти мітку TV',
            animations: 'Анімації фокуса',
            enableLogos: 'Логотипи замість назв',
            logoLang: 'Мова логотипів',
            logoSize: 'Розмір логотипів TMDB',
            logoHideHead: 'Переносити рік/країну при логотипі',
            clearLogoCache: 'Очистити кеш логотипів',
            enableTmdb: 'Увімкнути джерело Akira TMDB',
            enableScale: 'Увімкнути адаптивний масштаб',
            reset: 'Скинути налаштування Akira',
            ok: 'Готово',
            reload: 'Зміни повністю застосуються після перезавантаження поточного екрана',
            on: 'Увімк',
            off: 'Вимк',
            auto: 'Авто'
        }
    };

    var now = new Date();
    var today = now.toISOString().substr(0, 10);
    var currentYear = now.getFullYear();
    var lastYear = currentYear - 1;

    var COLLECTIONS = [
        { id: 'hot_new_releases', label: 'Самые свежие премьеры', icon: '', request: 'discover/movie?sort_by=primary_release_date.desc&with_release_type=4|5|6&primary_release_date.lte=' + today + '&vote_count.gte=50&vote_average.gte=6&with_runtime.gte=40&without_genres=99&region=RU' },
        { id: 'trending_movies', label: 'Топ фильмов недели', icon: '', request: 'trending/movie/week' },
        { id: 'fresh_online', label: 'Сейчас смотрят', icon: '', request: 'discover/movie?sort_by=popularity.desc&with_release_type=4|5|6&primary_release_date.lte=' + today + '&vote_count.gte=50&vote_average.gte=6&with_runtime.gte=40&without_genres=99&region=RU' },
        { id: 'cult_cinema', label: 'Популярные фильмы с 80-х', icon: '', request: 'discover/movie?primary_release_date.gte=1980-01-01&sort_by=popularity.desc&vote_average.gte=7&vote_count.gte=500' },
        { id: 'top_studios', label: 'Золотая десятка студий', icon: '', request: 'discover/movie?with_companies=6194|33|4|306|5|12|8411|9195|2|7295&sort_by=popularity.desc&vote_average.gte=7.0&vote_count.gte=1000' },
        { id: 'best_current_year', label: 'Лучшие фильмы ' + currentYear, icon: '', request: 'discover/movie?primary_release_year=' + currentYear + '&sort_by=vote_average.desc&vote_count.gte=300&region=RU' },
        { id: 'best_last_year', label: 'Лучшие фильмы ' + lastYear, icon: '', request: 'discover/movie?primary_release_year=' + lastYear + '&sort_by=vote_average.desc&vote_count.gte=500&region=RU' },
        { id: 'animation', label: 'Лучшие мультфильмы', icon: '', request: 'discover/movie?with_genres=16&sort_by=popularity.desc&vote_average.gte=7&vote_count.gte=500' },
        { id: 'documentary', label: 'Документальные фильмы', icon: '', request: 'discover/movie?with_genres=99&sort_by=popularity.desc&vote_count.gte=20&with_translations=ru&include_translations=ru' },
        { id: 'russian_movies', label: 'Новинки русского кино', icon: '', request: 'discover/movie?with_original_language=ru&sort_by=primary_release_date.desc&with_release_type=4|5|6&primary_release_date.lte=' + today + '&with_runtime.gte=40&without_genres=99&region=RU' },
        { id: 'trending_tv', label: 'Топ сериалов недели', icon: '', request: 'trending/tv/week' },
        { id: 'best_world_series', label: 'Хиты сериалов мира 2020+', icon: '', request: 'discover/tv?with_origin_country=US|CA|GB|AU|IE|DE|FR|NL|SE|NO|DK|FI|ES|IT|BE|CH|AT|KR|JP|MX|BR&sort_by=last_air_date.desc&vote_average.gte=7&vote_count.gte=500&first_air_date.gte=2020-01-01&first_air_date.lte=' + today + '&without_genres=16|99|10762|10763|10764|10766|10767|10768|10770&with_status=0|1|2|3' },
        { id: 'netflix_best', label: 'Хиты сериалов Netflix', icon: '', request: 'discover/tv?with_networks=213&sort_by=last_air_date.desc&first_air_date.gte=2020-01-01&last_air_date.lte=' + today + '&vote_count.gte=500&vote_average.gte=7&without_genres=16|99|10751|10762|10763|10764|10766|10767|10768|10770' },
        { id: 'miniseries_hits', label: 'Лучшие мини-сериалы', icon: '', request: 'discover/tv?with_type=2&sort_by=popularity.desc&vote_average.gte=7.0&vote_count.gte=200&without_genres=10764,10767' },
        { id: 'russian_series', label: 'Русскоязычные сериалы 2020+', icon: '', request: 'discover/tv?with_original_language=ru&sort_by=last_air_date.desc&first_air_date.gte=2020-01-01&last_air_date.lte=' + today + '&vote_average.gte=6&vote_count.gte=5&without_genres=16|99|10751|10762|10763|10764|10766|10767|10768' },
        { id: 'okko_platform', label: 'OKKO Originals', icon: '', request: 'discover/tv?language=ru&with_networks=3871&sort_by=first_air_date.desc' },
        { id: 'premier_platform', label: 'Premier Originals', icon: '', request: 'discover/tv?language=ru&with_networks=2859&sort_by=first_air_date.desc' },
        { id: 'start_platform', label: 'START Originals', icon: '', request: 'discover/tv?language=ru&with_networks=2493&sort_by=first_air_date.desc' },
        { id: 'wink_platform', label: 'WINK Originals', icon: '', request: 'discover/tv?language=ru&with_networks=5806&sort_by=first_air_date.desc' },
        { id: 'kion_platform', label: 'KION Originals', icon: '', request: 'discover/tv?language=ru&with_networks=4085&sort_by=first_air_date.desc' },
        { id: 'kinopoisk_platform', label: 'Кинопоиск Originals', icon: '', request: 'discover/tv?language=ru&with_networks=3827&sort_by=first_air_date.desc' },
        { id: 'cts_platform', label: 'СТС Originals', icon: '', request: 'discover/tv?language=ru&with_networks=806&sort_by=first_air_date.desc' },
        { id: 'tnt_platform', label: 'ТНТ Originals', icon: '', request: 'discover/tv?language=ru&with_networks=1191&sort_by=first_air_date.desc' },
        { id: 'ivi_platform', label: 'ИВИ Originals', icon: '', request: 'discover/tv?language=ru&with_networks=3923&sort_by=first_air_date.desc' }
    ];

    var started = false;
    var settingsReady = false;
    var topbarTimer = null;
    var topbarObserver = null;
    var scheduleTimer = null;
    var scaleDebounce = null;

    function langCode() {
        var raw = 'en';
        try { raw = String(Lampa.Storage.get('language', 'en') || 'en').toLowerCase(); } catch (e) {}
        if (raw.indexOf('ru') === 0 || raw === 'be') return 'ru';
        if (raw.indexOf('uk') === 0 || raw === 'ua') return 'uk';
        return 'en';
    }

    function text(key) {
        var pack = TEXT[langCode()] || TEXT.en;
        return pack[key] || TEXT.en[key] || key;
    }

    function localize(value, fallback) {
        if (!value) return fallback || '';
        if (typeof value === 'string') return value;
        var lang = langCode();
        return value[lang] || value.ru || value.en || fallback || '';
    }

    function tr(key, fallback) {
        try {
            var value = Lampa.Lang && Lampa.Lang.translate ? Lampa.Lang.translate(key) : '';
            if (value && value !== key) return value;
        } catch (e) {}
        return fallback || key;
    }

    function get(name, fallback) {
        try {
            if (Lampa.Storage && typeof Lampa.Storage.get === 'function') {
                var value = Lampa.Storage.get(name, fallback);
                return typeof value === 'undefined' ? fallback : value;
            }
        } catch (e) {}
        try {
            var raw = localStorage.getItem(name);
            return raw === null ? fallback : raw;
        } catch (e2) {}
        return fallback;
    }

    function set(name, value) {
        try {
            if (Lampa.Storage && typeof Lampa.Storage.set === 'function') {
                Lampa.Storage.set(name, value);
                return;
            }
        } catch (e) {}
        try { localStorage.setItem(name, typeof value === 'string' ? value : JSON.stringify(value)); } catch (e2) {}
    }

    function storageField(name, fallback) {
        try {
            if (Lampa.Storage && typeof Lampa.Storage.field === 'function') {
                var value = Lampa.Storage.field(name);
                return typeof value === 'undefined' || value === null || value === '' ? fallback : value;
            }
        } catch (e) {}
        return get(name, fallback);
    }

    function getBool(name, fallback) {
        var value = get(name, fallback ? 'on' : 'off');
        if (typeof value === 'boolean') return value;
        value = String(value);
        return value !== 'off' && value !== 'false' && value !== '0' && value !== 'null';
    }

    function getOnOff(name, fallback) {
        return getBool(name, fallback) ? 'on' : 'off';
    }

    function ensure(name, value) {
        var current = get(name, undefined);
        if (typeof current === 'undefined' || current === null || current === '') set(name, value);
    }

    function clean(value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    }

    function escapeHtml(value) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(String(value || '')));
        return div.innerHTML;
    }

    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function notify(message) {
        try {
            if (Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show(message);
        } catch (e) {}
    }

    function pluginOn() {
        return getBool(K.enabled, true);
    }

    function palette() {
        var name = String(get(K.accent, 'netflix') || 'netflix');
        return PALETTES[name] || PALETTES.netflix;
    }

    function brandName() {
        return clean(get(K.brandName, CFG.brand) || CFG.brand) || CFG.brand;
    }

    function setBodyState() {
        if (!document.body) return;
        document.body.classList.toggle(CFG.bodyClass, pluginOn());
        document.body.setAttribute('data-akira-theme', pluginOn() && getBool(K.themeEnabled, true) ? 'on' : 'off');
        document.body.setAttribute('data-akira-topbar', pluginOn() && getBool(K.topbar, true) ? 'on' : 'off');
        document.body.setAttribute('data-akira-topbar-align', String(get(K.topbarAlign, 'start')) === 'center' ? 'center' : 'start');
        document.body.setAttribute('data-akira-detail', pluginOn() && getBool(K.detailEnabled, true) ? 'on' : 'off');
        document.body.setAttribute('data-akira-cards', pluginOn() && getBool(K.cardDesign, true) ? 'on' : 'off');
        document.body.setAttribute('data-akira-buttons-big', getBool(K.buttonsBig, false) ? 'on' : 'off');
        document.body.setAttribute('data-akira-scale', pluginOn() && getBool(K.scale, true) ? 'on' : 'off');
    }

    function initDefaults() {
        ensure(K.enabled, 'on');
        ensure(K.themeEnabled, 'on');
        ensure(K.accent, 'netflix');
        ensure(K.topbar, 'on');
        ensure(K.topbarAlign, 'start');
        ensure(K.brandName, CFG.brand);
        ensure(K.interfaceEnabled, 'on');
        ensure(K.detailEnabled, 'on');
        ensure(K.cardDesign, 'on');
        ensure(K.buttonsSeparate, 'on');
        ensure(K.buttonsBig, 'off');
        ensure(K.translateTv, 'on');
        ensure(K.animations, 'on');
        ensure(K.logos, 'on');
        ensure(K.logoLang, 'auto');
        ensure(K.logoSize, 'original');
        ensure(K.logoHideHead, 'on');
        ensure(K.scale, 'on');
        ensure(K.tmdb, 'on');
        ensure(K.topnavItems, ['main', 'movie', 'tv', 'anime', 'release', 'favorite']);
        for (var i = 0; i < COLLECTIONS.length; i++) ensure(collectionKey(COLLECTIONS[i].id), 'on');
    }

    function addParam(component, param, field, onChange) {
        try {
            Lampa.SettingsApi.addParam({ component: component, param: param, field: field, onChange: onChange });
        } catch (e) {}
    }

    function addButton(component, key, label, description, action) {
        addParam(component, { name: CFG.prefix + key, type: 'button' }, { name: label, description: description || '' }, action);
    }

    function onOffValues() {
        return { on: text('on'), off: text('off') };
    }

    function openSection(component) {
        try {
            if (!Lampa.Settings || !Lampa.Settings.create) return false;
            setTimeout(function () {
                try {
                    Lampa.Settings.create(component, {
                        onBack: function () {
                            Lampa.Settings.create(C.root);
                            scheduleApply(true);
                        }
                    });
                } catch (e) {}
            }, 0);
            return true;
        } catch (e2) {}
        return false;
    }

    function openBrandPrompt() {
        var value = null;
        try { value = window.prompt(text('brand'), brandName()); } catch (e) {}
        if (value !== null && typeof value !== 'undefined') {
            set(K.brandName, clean(value) || CFG.brand);
            scheduleApply(true);
        }
    }

    function resetSettings() {
        set(K.enabled, 'on');
        set(K.themeEnabled, 'on');
        set(K.accent, 'netflix');
        set(K.topbar, 'on');
        set(K.topbarAlign, 'start');
        set(K.brandName, CFG.brand);
        set(K.interfaceEnabled, 'on');
        set(K.detailEnabled, 'on');
        set(K.cardDesign, 'on');
        set(K.buttonsSeparate, 'on');
        set(K.buttonsBig, 'off');
        set(K.translateTv, 'on');
        set(K.animations, 'on');
        set(K.logos, 'on');
        set(K.logoLang, 'auto');
        set(K.logoSize, 'original');
        set(K.logoHideHead, 'on');
        set(K.scale, 'on');
        set(K.tmdb, 'on');
        set(K.topnavItems, ['main', 'movie', 'tv', 'anime', 'release', 'favorite']);
        for (var i = 0; i < COLLECTIONS.length; i++) set(collectionKey(COLLECTIONS[i].id), 'on');
        scheduleApply(true);
        notify(text('ok'));
    }

    function clearLogoCache() {
        var keys = [];
        try {
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key && key.indexOf(AkiraLogo.prefix) === 0) keys.push(key);
            }
            for (var j = 0; j < keys.length; j++) localStorage.removeItem(keys[j]);
        } catch (e) {}
        try {
            if (Lampa.Storage && Lampa.Storage.cache) {
                for (var k = 0; k < keys.length; k++) Lampa.Storage.set(keys[k], '');
            }
        } catch (e2) {}
        notify(text('ok'));
    }

    function addSettings() {
        if (settingsReady || !Lampa.SettingsApi || !Lampa.SettingsApi.addParam) return;
        settingsReady = true;

        try {
            if (Lampa.Template && Lampa.Template.add) {
                Lampa.Template.add('settings_' + C.root, '<div></div>');
                Lampa.Template.add('settings_' + C.topbar, '<div></div>');
                Lampa.Template.add('settings_' + C.topnav, '<div></div>');
                Lampa.Template.add('settings_' + C.interface, '<div></div>');
                Lampa.Template.add('settings_' + C.detail, '<div></div>');
                Lampa.Template.add('settings_' + C.buttons, '<div></div>');
                Lampa.Template.add('settings_' + C.logos, '<div></div>');
                Lampa.Template.add('settings_' + C.tmdb, '<div></div>');
                Lampa.Template.add('settings_' + C.scale, '<div></div>');
            }
        } catch (e) {}

        try {
            Lampa.SettingsApi.addComponent({
                component: C.root,
                name: text('title'),
                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 5h16v3H4V5Zm0 5h11v3H4v-3Zm0 5h16v4H4v-4Z"></path></svg>'
            });
        } catch (e2) {}

        addParam(C.root, { name: CFG.prefix + 'about', type: 'static' }, { name: text('title'), description: text('about') });
        addParam(C.root, { name: K.enabled, type: 'select', values: onOffValues(), default: 'on' }, { name: text('enabled') }, function () { scheduleApply(true); });
        addButton(C.root, 'open_topbar', text('openTopbar'), '', function () { openSection(C.topbar); });
        addButton(C.root, 'open_interface', text('openInterface'), '', function () { openSection(C.interface); });
        addButton(C.root, 'open_detail', text('openDetail'), '', function () { openSection(C.detail); });
        addButton(C.root, 'open_buttons', text('openButtons'), '', function () { openSection(C.buttons); });
        addButton(C.root, 'open_logos', text('openLogos'), '', function () { openSection(C.logos); });
        addButton(C.root, 'open_tmdb', text('openTmdb'), '', function () { openSection(C.tmdb); });
        addButton(C.root, 'open_scale', text('openScale'), '', function () { openSection(C.scale); });
        addButton(C.root, 'reset', text('reset'), '', resetSettings);

        addParam(C.topbar, { name: K.topbar, type: 'select', values: onOffValues(), default: 'on' }, { name: text('enableTopbar') }, function () { scheduleApply(true); });
        addParam(C.topbar, { name: CFG.prefix + 'brand_edit', type: 'button' }, { name: text('brand'), description: brandName() }, openBrandPrompt);
        addParam(C.topbar, { name: K.topbarAlign, type: 'select', values: { start: text('alignStart'), center: text('alignCenter') }, default: 'start' }, { name: text('align') }, function () { scheduleApply(true); });
        addButton(C.topbar, 'open_topnav', text('configureTopnav'), text('topnavTitle'), function () { openSection(C.topnav); });
        addTopnavSettings();

        var accentValues = {};
        for (var p in PALETTES) if (Object.prototype.hasOwnProperty.call(PALETTES, p)) accentValues[p] = PALETTES[p].label;
        addParam(C.interface, { name: K.interfaceEnabled, type: 'select', values: onOffValues(), default: 'on' }, { name: text('enableInterface') }, function () { scheduleApply(true); });
        addParam(C.interface, { name: K.themeEnabled, type: 'select', values: onOffValues(), default: 'on' }, { name: text('enableTheme') }, function () { scheduleApply(true); });
        addParam(C.interface, { name: K.accent, type: 'select', values: accentValues, default: 'netflix' }, { name: text('accent') }, function () { scheduleApply(true); });
        addParam(C.interface, { name: K.cardDesign, type: 'select', values: onOffValues(), default: 'on' }, { name: text('cardDesign') }, function () { scheduleApply(true); });
        addParam(C.interface, { name: K.translateTv, type: 'select', values: onOffValues(), default: 'on' }, { name: text('translateTv') }, function () { scheduleApply(true); });
        addParam(C.interface, { name: K.animations, type: 'select', values: onOffValues(), default: 'on' }, { name: text('animations') }, function () { scheduleApply(true); });

        addParam(C.detail, { name: K.detailEnabled, type: 'select', values: onOffValues(), default: 'on' }, { name: text('enableDetail') }, function () { scheduleApply(true); });
        addParam(C.buttons, { name: K.buttonsSeparate, type: 'select', values: onOffValues(), default: 'on' }, { name: text('buttonsSeparate'), description: text('reload') }, function () { applyFullTemplate(); scheduleApply(true); notify(text('reload')); });
        addParam(C.buttons, { name: K.buttonsBig, type: 'select', values: onOffValues(), default: 'off' }, { name: text('buttonsBig') }, function () { scheduleApply(true); });

        addParam(C.logos, { name: K.logos, type: 'select', values: onOffValues(), default: 'on' }, { name: text('enableLogos') }, function () { scheduleApply(true); });
        addParam(C.logos, { name: K.logoLang, type: 'select', values: { auto: text('auto'), ru: 'Русский', en: 'English', uk: 'Українська', de: 'Deutsch', fr: 'Français', es: 'Español' }, default: 'auto' }, { name: text('logoLang') });
        addParam(C.logos, { name: K.logoSize, type: 'select', values: { w300: 'w300', w500: 'w500', w780: 'w780', original: 'original' }, default: 'original' }, { name: text('logoSize') });
        addParam(C.logos, { name: K.logoHideHead, type: 'select', values: onOffValues(), default: 'on' }, { name: text('logoHideHead') }, function () { scheduleApply(true); });
        addParam(C.logos, { name: CFG.prefix + 'logo_clear_cache', type: 'button' }, { name: text('clearLogoCache') }, clearLogoCache);

        addParam(C.scale, { name: K.scale, type: 'select', values: onOffValues(), default: 'on' }, { name: text('enableScale') }, function () { updateScale(); scheduleApply(true); });

        addParam(C.tmdb, { name: K.tmdb, type: 'select', values: onOffValues(), default: 'on' }, { name: text('enableTmdb'), description: 'Akira TMDB' }, function () { scheduleApply(true); notify(text('reload')); });
        for (var i = 0; i < COLLECTIONS.length; i++) {
            (function (item) {
                addParam(C.tmdb, { name: collectionKey(item.id), type: 'select', values: onOffValues(), default: 'on' }, { name: item.label }, function () { notify(text('reload')); });
            })(COLLECTIONS[i]);
        }
    }

    function collectionKey(id) {
        return CFG.prefix + 'tmdb_collection_' + id;
    }

    function normalizeAction(action) {
        var value = String(action || '').trim().toLowerCase();
        if (value === 'release' || value === 'releases') return 'relise';
        if (value === 'collections' || value === 'collection') return 'catalog';
        if (value === 'bookmarks') return 'favorite';
        return value;
    }

    function menuItem(action) {
        return qs('.menu .menu__item.selector[data-action="' + normalizeAction(action) + '"]');
    }

    function triggerEvent(node, name) {
        try {
            if (window.$ && node) {
                $(node).trigger(name);
                return true;
            }
        } catch (e) {}
        return false;
    }

    function clickNode(node) {
        try {
            if (!node) return false;
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
        return ok || clickNode(node);
    }

    function bindAction(node, handler) {
        if (!node || node.getAttribute('data-akira-bound') === '1') return;
        node.setAttribute('data-akira-bound', '1');
        node.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            handler();
        });
        node.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handler();
            }
        });
        try {
            if (window.$) {
                $(node).on('hover:enter.akira', handler);
                $(node).on('hover:focus.akira hover:hover.akira', function () { node.classList.add('focus'); });
                $(node).on('hover:blur.akira hover:out.akira', function () { node.classList.remove('focus'); });
            }
        } catch (e) {}
    }

    function labelForAction(item) {
        var value = tr(item.lang, '');
        return value && value !== item.lang ? value : localize(item.label, item.action);
    }

    function availableTopbarItems() {
        var list = [];
        var seen = {};
        qsa('.menu .menu__item.selector[data-action]').forEach(function (item) {
            var action = item.getAttribute('data-action');
            if (!action || action === 'search' || action === 'settings' || seen[action]) return;
            var labelNode = qs('.menu__text, .menu__item-name, .menu__item-text, .menu__item-title', item);
            var label = clean(labelNode ? labelNode.textContent : item.textContent) || action;
            seen[action] = true;
            list.push({ action: action, label: label });
        });
        for (var i = 0; i < TOPBAR_FALLBACK.length; i++) {
            var fb = TOPBAR_FALLBACK[i];
            if (seen[normalizeAction(fb.action)]) continue;
            seen[normalizeAction(fb.action)] = true;
            list.push({ action: fb.action, label: labelForAction(fb) });
        }
        return list;
    }

    function storedTopbarActions() {
        var value = get(K.topnavItems, null);
        if (!value || value === 'undefined' || value === 'null') return ['main', 'movie', 'tv', 'anime', 'release', 'favorite'];
        if (typeof value === 'string') {
            try { value = JSON.parse(value); }
            catch (e) { value = value.split(',').map(clean).filter(Boolean); }
        }
        return Array.isArray(value) && value.length ? value : ['main', 'movie', 'tv', 'anime', 'release', 'favorite'];
    }

    function setTopbarAction(action, enabled) {
        var selected = storedTopbarActions();
        var exists = selected.indexOf(action) > -1;
        if (enabled && !exists) selected.push(action);
        if (!enabled && exists) selected = selected.filter(function (item) { return item !== action; });
        set(K.topnavItems, selected);
    }

    function topnavSettingKey(action) {
        return CFG.prefix + 'topnav_item_' + String(action || '').replace(/[^a-z0-9_-]/gi, '_');
    }

    function addTopnavSettings() {
        addParam(C.topnav, { type: 'title' }, { name: text('topnavTitle') });
        var selected = storedTopbarActions();
        var items = availableTopbarItems();
        for (var i = 0; i < items.length; i++) {
            (function (item) {
                var isSelected = selected.indexOf(item.action) > -1 ? 'on' : 'off';
                var key = topnavSettingKey(item.action);
                set(key, isSelected);
                addParam(C.topnav, { name: key, type: 'select', values: { on: text('show'), off: text('hide') }, default: isSelected }, { name: item.label, description: item.action }, function (value) {
                    setTopbarAction(item.action, value !== 'off' && value !== false);
                    scheduleApply(true);
                });
            })(items[i]);
        }
    }

    function selectedTopbarItems() {
        var map = {};
        availableTopbarItems().forEach(function (item) { map[item.action] = item; });
        return storedTopbarActions().map(function (action) { return map[action]; }).filter(Boolean);
    }

    function openAction(action) {
        var normalized = normalizeAction(action);
        var nativeItem = menuItem(normalized);
        if (nativeItem && selectorEnter(nativeItem)) return true;
        try {
            var source = storageField('source', 'tmdb');
            if (normalized === 'main') {
                Lampa.Activity.push({ url: '', title: tr('title_main', 'Main'), component: 'main', source: source });
                return true;
            }
            if (normalized === 'movie' || normalized === 'tv' || normalized === 'anime') {
                Lampa.Activity.push({
                    url: normalized,
                    title: (normalized === 'movie' ? tr('menu_movies', 'Movies') : normalized === 'anime' ? tr('menu_anime', 'Anime') : tr('menu_tv', 'TV')) + ' - ' + String(source || '').toUpperCase(),
                    component: 'category',
                    source: normalized === 'anime' ? 'cub' : source,
                    page: 1
                });
                return true;
            }
            if (normalized === 'cartoon') {
                Lampa.Activity.push({ url: 'movie', title: tr('menu_multmovie', 'Cartoons'), component: 'category', genres: 16, page: 1 });
                return true;
            }
        } catch (e) {}
        return false;
    }

    function openSearch() {
        var nativeItem = menuItem('search');
        if (nativeItem && selectorEnter(nativeItem)) return true;
        var nativeButton = qs('.open--search');
        if (nativeButton && selectorEnter(nativeButton)) return true;
        try {
            if (Lampa.Search && Lampa.Search.open) {
                Lampa.Search.open();
                return true;
            }
        } catch (e) {}
        return false;
    }

    function openFavorite() {
        var nativeItem = menuItem('favorite');
        if (nativeItem && selectorEnter(nativeItem)) return true;
        try {
            Lampa.Activity.push({ component: 'bookmarks', title: tr('settings_input_links', 'Bookmarks') });
            return true;
        } catch (e) {}
        return false;
    }

    function goBack() {
        var back = qs('.head__backward');
        return back ? clickNode(back) || selectorEnter(back) : false;
    }

    function openSettingsRoot() {
        try {
            if (Lampa.Settings && Lampa.Settings.create) {
                Lampa.Settings.create(C.root);
                return true;
            }
        } catch (e) {}
        return false;
    }

    function iconSearch() {
        return '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="2"></circle><path d="M16 16L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>';
    }

    function iconSettings() {
        return '<svg><use xlink:href="#sprite-settings"></use></svg>';
    }

    function iconBookmark() {
        return '<svg viewBox="0 0 24 24" fill="none"><path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V21l-6-3.5L6 21V4.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path></svg>';
    }

    function iconBackward() {
        return '<svg viewBox="0 0 24 24" fill="none"><path d="M15 5 8 12l7 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    }

    function updateClock() {
        var node = qs('.akira-topbar__clock');
        if (!node) return;
        var date = new Date();
        node.textContent = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
    }

    function stopClock() {
        if (!topbarTimer) return;
        clearInterval(topbarTimer);
        topbarTimer = null;
    }

    function startClock() {
        updateClock();
        if (!topbarTimer) topbarTimer = setInterval(updateClock, 20000);
    }

    function patchBrand(head) {
        var icon = qs('.head__menu-icon', head) || qs('.head__menu-icon');
        if (!icon) return;
        if (!icon.getAttribute('data-akira-original-html')) icon.setAttribute('data-akira-original-html', icon.innerHTML || '');
        try { if (window.$) $(icon).off('.akira'); } catch (e) {}
        icon.classList.add('akira-head-brand', 'selector');
        icon.setAttribute('data-selector', 'true');
        icon.setAttribute('tabindex', '0');
        icon.innerHTML = '<span>' + escapeHtml(brandName()) + '</span>';
        bindAction(icon, function () { openAction('main'); });
        requestAnimationFrame(function () {
            try {
                var width = Math.ceil(icon.getBoundingClientRect().width || 0);
                if (width) document.documentElement.style.setProperty('--akira-brand-w', width + 'px');
            } catch (e2) {}
        });
    }

    function restoreBrand() {
        var icon = qs('.head__menu-icon.akira-head-brand');
        if (!icon) return;
        var original = icon.getAttribute('data-akira-original-html');
        if (original !== null) icon.innerHTML = original;
        icon.classList.remove('akira-head-brand', 'focus');
        icon.removeAttribute('data-akira-original-html');
        icon.removeAttribute('data-akira-bound');
        try { document.documentElement.style.removeProperty('--akira-brand-w'); } catch (e) {}
    }

    function patchTopbar() {
        var old = qs('.akira-topbar');
        if (!pluginOn() || !getBool(K.topbar, true)) {
            if (old) old.remove();
            restoreBrand();
            stopClock();
            return;
        }
        var head = qs('.head__body') || qs('.head');
        if (!head) return;
        patchBrand(head);
        var bar = qs('.akira-topbar', head);
        if (!bar) {
            bar = document.createElement('div');
            bar.className = 'akira-topbar';
            bar.innerHTML = '<div class="akira-topbar__inner"><div class="akira-topbar__items"></div><div class="akira-topbar__right"></div></div>';
            head.appendChild(bar);
        }
        var itemsNode = qs('.akira-topbar__items', bar);
        var rightNode = qs('.akira-topbar__right', bar);
        itemsNode.innerHTML = '';
        rightNode.innerHTML = '';

        if (qs('.head__backward')) {
            var backButton = document.createElement('div');
            backButton.className = 'akira-topbar__item akira-topbar__icon selector';
            backButton.setAttribute('data-selector', 'true');
            backButton.setAttribute('tabindex', '0');
            backButton.innerHTML = iconBackward();
            bindAction(backButton, goBack);
            itemsNode.appendChild(backButton);
        }

        selectedTopbarItems().forEach(function (item) {
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
            { role: 'search', icon: iconSearch(), handler: openSearch },
            { role: 'favorite', icon: iconBookmark(), handler: openFavorite },
            { role: 'settings', icon: iconSettings(), handler: openSettingsRoot }
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
        bindAction(clock, openSettingsRoot);
        rightNode.appendChild(clock);
        startClock();
    }

    var AkiraLogo = {
        prefix: 'akira_logo_v1_',
        pending: {},
        enabled: function () {
            return pluginOn() && getBool(K.logos, true);
        },
        lang: function () {
            var forced = String(get(K.logoLang, 'auto') || 'auto');
            if (forced && forced !== 'auto') return forced;
            var lang = String(get('logo_lang', '') || get('language', 'en') || 'en');
            return (lang.split('-')[0] || 'en').toLowerCase();
        },
        size: function () {
            return String(get(K.logoSize, 'original') || 'original');
        },
        key: function (type, id, lang) {
            return this.prefix + type + '_' + id + '_' + lang;
        },
        getCached: function (key) {
            try {
                var sessionValue = sessionStorage.getItem(key);
                if (sessionValue) return sessionValue;
            } catch (e) {}
            try {
                var localValue = localStorage.getItem(key);
                if (localValue) return localValue;
            } catch (e2) {}
            return get(key, null);
        },
        setCached: function (key, value) {
            var stored = value || 'none';
            try { sessionStorage.setItem(key, stored); } catch (e) {}
            try { localStorage.setItem(key, stored); } catch (e2) {}
            try { set(key, stored); } catch (e3) {}
        },
        pickBest: function (logos, lang) {
            if (!logos || !logos.length) return null;
            var sorted = logos.slice().sort(function (a, b) {
                var as = String(a && a.file_path || '').toLowerCase().indexOf('.svg') > -1;
                var bs = String(b && b.file_path || '').toLowerCase().indexOf('.svg') > -1;
                return as === bs ? 0 : (as ? 1 : -1);
            });
            var order = [lang];
            if (lang === 'uk' || lang === 'ua') order.push('ru');
            if (lang !== 'en') order.push('en');
            order.push(null);
            for (var o = 0; o < order.length; o++) {
                for (var i = 0; i < sorted.length; i++) {
                    if (!sorted[i] || !sorted[i].file_path) continue;
                    if (order[o] === null || sorted[i].iso_639_1 === order[o]) return sorted[i].file_path;
                }
            }
            return sorted[0] && sorted[0].file_path ? sorted[0].file_path : null;
        },
        imageUrl: function (path) {
            if (!path) return null;
            var normalized = String(path).replace(/\.svg$/i, '.png');
            return Lampa.TMDB.image('/t/p/' + this.size() + normalized);
        },
        request: function (type, id, lang, mode, done) {
            if (!Lampa.TMDB || !Lampa.TMDB.api || !Lampa.TMDB.key || !window.$) {
                done(null);
                return;
            }
            var query = mode === 'netflix'
                ? type + '/' + id + '/images?api_key=' + Lampa.TMDB.key() + '&language=' + lang
                : type + '/' + id + '/images?api_key=' + Lampa.TMDB.key() + '&include_image_language=' + lang + ',ru,en,null';
            $.get(Lampa.TMDB.api(query), function (res) {
                var path = AkiraLogo.pickBest(res && res.logos, lang);
                done(AkiraLogo.imageUrl(path));
            }).fail(function () {
                done(null);
            });
        },
        resolve: function (item, done) {
            try {
                if (!this.enabled() || !item || !item.id) {
                    done(null);
                    return;
                }
                var source = item.source || 'tmdb';
                if (source !== 'tmdb' && source !== 'cub') {
                    done(null);
                    return;
                }
                var type = item.media_type === 'tv' || item.name ? 'tv' : 'movie';
                var lang = this.lang();
                var key = this.key(type, item.id, lang);
                var cached = this.getCached(key);
                if (cached) {
                    done(cached === 'none' ? null : cached);
                    return;
                }
                if (this.pending[key]) {
                    this.pending[key].push(done);
                    return;
                }
                this.pending[key] = [done];
                this.request(type, item.id, lang, 'interface', function (first) {
                    if (first) {
                        AkiraLogo.finish(key, first);
                        return;
                    }
                    AkiraLogo.request(type, item.id, lang, 'netflix', function (second) {
                        AkiraLogo.finish(key, second || null);
                    });
                });
            } catch (e) {
                done(null);
            }
        },
        finish: function (key, value) {
            this.setCached(key, value);
            var list = this.pending[key] || [];
            delete this.pending[key];
            for (var i = 0; i < list.length; i++) {
                try { list[i](value); } catch (e) {}
            }
        },
        preload: function (item) {
            this.resolve(item, function () {});
        },
        setLogoCss: function (img, mode) {
            img.style.display = 'block';
            img.style.maxWidth = '100%';
            img.style.width = 'auto';
            img.style.height = 'auto';
            img.style.objectFit = 'contain';
            img.style.objectPosition = 'left bottom';
            img.style.maxHeight = mode === 'card' ? 'var(--akira-card-logo-h)' : 'var(--akira-logo-max-h)';
        },
        swap: function (node, content) {
            if (!node) return;
            if (node.__akiraLogoTimer) clearTimeout(node.__akiraLogoTimer);
            node.style.transition = 'opacity .22s ease';
            node.style.opacity = '0';
            node.__akiraLogoTimer = setTimeout(function () {
                node.__akiraLogoTimer = null;
                node.innerHTML = '';
                if (typeof content === 'string') node.textContent = content;
                else node.appendChild(content);
                node.style.opacity = '1';
            }, 120);
        },
        applyToInfo: function (ctx, item, titleText) {
            if (!ctx || !ctx.title || !item) return;
            var titleEl = ctx.title[0] || ctx.title;
            if (!titleEl) return;
            var requestId = (titleEl.__akiraLogoReq || 0) + 1;
            titleEl.__akiraLogoReq = requestId;
            if (!this.enabled()) {
                titleEl.textContent = titleText || '';
                if (ctx.head) (ctx.head[0] || ctx.head).style.display = '';
                if (ctx.movedHead) {
                    var movedOff = ctx.movedHead[0] || ctx.movedHead;
                    movedOff.textContent = '';
                    movedOff.style.display = 'none';
                }
                return;
            }
            titleEl.textContent = titleText || '';
            this.resolve(item, function (url) {
                if (titleEl.__akiraLogoReq !== requestId || !titleEl.isConnected) return;
                if (!url) {
                    titleEl.textContent = titleText || '';
                    return;
                }
                var img = new Image();
                img.className = 'akira-info-logo';
                img.alt = titleText || '';
                AkiraLogo.setLogoCss(img, 'info');
                img.onerror = function () { titleEl.textContent = titleText || ''; };
                img.src = url;
                if (getBool(K.logoHideHead, true) && ctx.head && ctx.movedHead) {
                    var head = ctx.head[0] || ctx.head;
                    var moved = ctx.movedHead[0] || ctx.movedHead;
                    var textValue = ctx.headText || '';
                    if (textValue) {
                        head.style.display = 'none';
                        moved.textContent = textValue;
                        moved.style.display = '';
                    }
                }
                AkiraLogo.swap(titleEl, img);
            });
        },
        applyToCard: function (card) {
            if (!card || !card.data || !card.render) return;
            var root = card.render(true);
            if (root && root[0]) root = root[0];
            if (!root) return;
            var view = qs('.card__view', root) || root;
            var label = qs('.akira-card-title', root) || qs('.new-interface-card-title', root);
            var title = clean(card.data.title || card.data.name || card.data.original_title || card.data.original_name);
            var req = (card.__akiraLogoReq || 0) + 1;
            card.__akiraLogoReq = req;
            function removeLogo() {
                var old = qs('.akira-card-logo', view);
                if (old && old.parentNode) old.parentNode.removeChild(old);
                if (label) label.style.display = '';
            }
            if (!this.enabled()) {
                removeLogo();
                return;
            }
            var wrap = qs('.akira-card-logo', view);
            if (!wrap) {
                wrap = document.createElement('div');
                wrap.className = 'akira-card-logo';
                view.appendChild(wrap);
            }
            this.resolve(card.data, function (url) {
                if (card.__akiraLogoReq !== req || !root.isConnected) return;
                if (!url) {
                    removeLogo();
                    return;
                }
                var img = new Image();
                img.alt = title;
                AkiraLogo.setLogoCss(img, 'card');
                img.onerror = removeLogo;
                img.src = url;
                wrap.innerHTML = '';
                wrap.appendChild(img);
                if (label) label.style.display = 'none';
            });
        },
        applyToFull: function (activity, item) {
            try {
                if (!activity || !activity.render || !item) return;
                var container = activity.render();
                if (!container || !container.find) return;
                var titleNode = container.find('.full-start-new__title, .full-start__title');
                if (!titleNode || !titleNode.length) return;
                var titleEl = titleNode[0];
                var titleText = clean(item.title || item.name || item.original_title || item.original_name || titleNode.text());
                if (!titleEl.__akiraFullTitleText) titleEl.__akiraFullTitleText = titleText;
                var original = titleEl.__akiraFullTitleText || titleText;
                var req = (titleEl.__akiraLogoReq || 0) + 1;
                titleEl.__akiraLogoReq = req;
                if (!this.enabled()) {
                    titleNode.text(original);
                    syncFullHead(container, false);
                    return;
                }
                titleNode.text(original);
                syncFullHead(container, false);
                this.resolve(item, function (url) {
                    if (titleEl.__akiraLogoReq !== req || !titleEl.isConnected) return;
                    if (!url) {
                        titleNode.text(original);
                        syncFullHead(container, false);
                        return;
                    }
                    var img = new Image();
                    img.className = 'akira-full-logo new-interface-full-logo';
                    img.alt = original;
                    AkiraLogo.setLogoCss(img, 'full');
                    img.onerror = function () {
                        titleNode.text(original);
                        syncFullHead(container, false);
                    };
                    img.src = url;
                    syncFullHead(container, getBool(K.logoHideHead, true));
                    AkiraLogo.swap(titleEl, img);
                });
            } catch (e) {}
        }
    };

    function syncFullHead(container, active) {
        try {
            if (!container || !container.find) return;
            var headNode = container.find('.full-start-new__head');
            var detailsNode = container.find('.full-start-new__details');
            if (!headNode.length || !detailsNode.length) return;
            var head = headNode[0];
            var details = detailsNode[0];
            var moved = qs('.akira-logo-moved-head', details);
            var sep = qs('.akira-logo-moved-separator', details);
            if (!active) {
                if (moved && moved.parentNode) moved.parentNode.removeChild(moved);
                if (sep && sep.parentNode) sep.parentNode.removeChild(sep);
                head.style.display = '';
                return;
            }
            if (moved) {
                head.style.display = 'none';
                return;
            }
            var html = clean(head.innerHTML || '');
            if (!html) return;
            var headSpan = document.createElement('span');
            headSpan.className = 'akira-logo-moved-head';
            headSpan.innerHTML = head.innerHTML;
            var sepSpan = document.createElement('span');
            sepSpan.className = 'full-start-new__split akira-logo-moved-separator';
            sepSpan.textContent = '•';
            if (details.children && details.children.length) details.appendChild(sepSpan);
            details.appendChild(headSpan);
            head.style.display = 'none';
        } catch (e) {}
    }

    function InterfaceInfo() {
        this.html = null;
        this.timer = null;
        this.network = null;
        this.loaded = {};
        try { this.network = new Lampa.Reguest(); } catch (e) {}
    }

    InterfaceInfo.prototype.create = function () {
        if (this.html || !window.$) return;
        this.html = $('<div class="akira-hero"><div class="akira-hero__body"><div class="akira-hero__left"><div class="akira-hero__head"></div><div class="akira-hero__title"></div></div><div class="akira-hero__right"><div class="akira-hero__textblock"><div class="akira-hero__meta"><div class="akira-hero__rate"></div><span class="akira-hero__dot dot-rate-head">•</span><div class="akira-hero__moved-head"></div><span class="akira-hero__dot dot-head-genre">•</span><span class="akira-hero__dot dot-rate-genre">•</span><div class="akira-hero__genres"></div><span class="akira-hero__dot dot-genre-runtime">•</span><div class="akira-hero__runtime"></div><span class="akira-hero__dot dot-runtime-pg">•</span><div class="akira-hero__pg"></div></div><div class="akira-hero__description"></div></div></div></div></div>');
    };

    InterfaceInfo.prototype.render = function (js) {
        if (!this.html) this.create();
        return js ? this.html[0] : this.html;
    };

    InterfaceInfo.prototype.update = function (data) {
        if (!data) return;
        if (!this.html) this.create();
        this.html.find('.akira-hero__head,.akira-hero__genres,.akira-hero__runtime').text('---');
        this.html.find('.akira-hero__rate,.akira-hero__pg').empty();
        this.html.find('.akira-hero__title').text(data.title || data.name || '');
        this.html.find('.akira-hero__description').text(data.overview || tr('full_notext', ''));
        try { Lampa.Background.change(Lampa.Utils.cardImgBackground(data)); } catch (e) {}
        this.load(data);
    };

    InterfaceInfo.prototype.load = function (data, options) {
        if (!data || !data.id) return;
        var source = data.source || 'tmdb';
        if (source !== 'tmdb' && source !== 'cub') return;
        if (!Lampa.TMDB || !Lampa.TMDB.api || !Lampa.TMDB.key) return;
        var preload = options && options.preload;
        var type = data.media_type === 'tv' || data.name ? 'tv' : 'movie';
        var language = get('language', 'ru');
        var url = Lampa.TMDB.api(type + '/' + data.id + '?api_key=' + Lampa.TMDB.key() + '&append_to_response=content_ratings,release_dates&language=' + language);
        this.currentUrl = url;
        if (this.loaded[url]) {
            if (!preload) this.draw(this.loaded[url]);
            return;
        }
        var self = this;
        clearTimeout(this.timer);
        this.timer = setTimeout(function () {
            if (!self.network || !self.network.silent) return;
            self.network.clear();
            self.network.timeout(5000);
            self.network.silent(url, function (movie) {
                self.loaded[url] = movie;
                if (!preload && self.currentUrl === url) self.draw(movie);
            });
        }, 0);
    };

    InterfaceInfo.prototype.draw = function (movie) {
        if (!movie || !this.html) return;
        var year = ((movie.release_date || movie.first_air_date || '0000') + '').slice(0, 4);
        var vote = parseFloat((movie.vote_average || 0) + '').toFixed(1);
        var head = [];
        var sources = Lampa.Api && Lampa.Api.sources && Lampa.Api.sources.tmdb ? Lampa.Api.sources.tmdb : null;
        var countries = sources && sources.parseCountries ? sources.parseCountries(movie) : [];
        var pg = sources && sources.parsePG ? sources.parsePG(movie) : '';
        if (year !== '0000') head.push('<span>' + year + '</span>');
        if (countries && countries.length) head.push(countries.join(', '));
        var genreText = movie.genres && movie.genres.length ? movie.genres.map(function (item) {
            return Lampa.Utils && Lampa.Utils.capitalizeFirstLetter ? Lampa.Utils.capitalizeFirstLetter(item.name) : item.name;
        }).join(' | ') : '';
        var runtimeText = movie.runtime && Lampa.Utils && Lampa.Utils.secondsToTime ? Lampa.Utils.secondsToTime(movie.runtime * 60, true) : '';

        this.html.find('.akira-hero__head').empty().append(head.join(', '));
        if (vote > 0) this.html.find('.akira-hero__rate').html('<div class="full-start__rate"><div>' + vote + '</div><div>TMDB</div></div>');
        else this.html.find('.akira-hero__rate').empty();
        this.html.find('.akira-hero__genres').text(genreText).toggle(!!genreText);
        this.html.find('.akira-hero__runtime').text(runtimeText).toggle(!!runtimeText);
        this.html.find('.akira-hero__pg').html(pg ? '<span class="full-start__pg">' + pg + '</span>' : '').toggle(!!pg);
        this.html.find('.dot-rate-genre').toggle(!!(vote > 0 && genreText));
        this.html.find('.dot-genre-runtime').toggle(!!(genreText && (runtimeText || pg)));
        this.html.find('.dot-runtime-pg').toggle(!!(runtimeText && pg));
        this.html.find('.dot-rate-head,.dot-head-genre').hide();
        this.html.find('.akira-hero__description').text(movie.overview || tr('full_notext', ''));
        var titleText = movie.title || movie.name || '';
        var titleNode = this.html.find('.akira-hero__title');
        this.html.find('.akira-hero__moved-head').text('').hide();
        titleNode.text(titleText);
        AkiraLogo.applyToInfo({
            title: titleNode,
            head: this.html.find('.akira-hero__head'),
            movedHead: this.html.find('.akira-hero__moved-head'),
            headText: head.join(', ')
        }, movie, titleText);
    };

    InterfaceInfo.prototype.empty = function () {
        if (!this.html) return;
        this.html.find('.akira-hero__head,.akira-hero__genres,.akira-hero__runtime').text('---');
        this.html.find('.akira-hero__rate').empty();
    };

    InterfaceInfo.prototype.destroy = function () {
        clearTimeout(this.timer);
        try { if (this.network) this.network.clear(); } catch (e) {}
        if (this.html) this.html.remove();
        this.html = null;
    };

    function shouldUseAkiraInterface(object) {
        if (!pluginOn() || !getBool(K.interfaceEnabled, true)) return false;
        if (!object) return false;
        if (window.innerWidth < 767) return false;
        if (object.source === 'other' && !object.backdrop_path) return false;
        return true;
    }

    function wrap(target, method, handler) {
        if (!target || target['__akira_wrap_' + method]) return;
        var original = typeof target[method] === 'function' ? target[method] : null;
        target['__akira_wrap_' + method] = true;
        target[method] = function () {
            return handler.call(this, original, Array.prototype.slice.call(arguments));
        };
    }

    function initInterfaceHooks() {
        if (window.__AKIRA_INTERFACE_HOOKS__) return;
        window.__AKIRA_INTERFACE_HOOKS__ = true;
        if (!Lampa.Maker || !Lampa.Maker.map || !Lampa.Utils) return;
        var mainMap = Lampa.Maker.map('Main');
        if (!mainMap || !mainMap.Items || !mainMap.Create) return;

        wrap(mainMap.Items, 'onInit', function (original, args) {
            if (original) original.apply(this, args);
            this.__akiraEnabled = shouldUseAkiraInterface(this && this.object);
        });
        wrap(mainMap.Create, 'onCreate', function (original, args) {
            if (original) original.apply(this, args);
            if (!this.__akiraEnabled) return;
            var state = ensureInterfaceState(this);
            state.attach();
        });
        wrap(mainMap.Create, 'onCreateAndAppend', function (original, args) {
            var element = args && args[0];
            if (this.__akiraEnabled && element && Array.isArray(element.results)) {
                Lampa.Utils.extendItemsParams(element.results, { style: { name: 'wide' } });
            }
            return original ? original.apply(this, args) : undefined;
        });
        wrap(mainMap.Items, 'onAppend', function (original, args) {
            if (original) original.apply(this, args);
            if (!this.__akiraEnabled) return;
            var line = args && args[0];
            var element = args && args[1];
            if (line && element) attachLineHandlers(this, line, element);
        });
        wrap(mainMap.Items, 'onDestroy', function (original, args) {
            if (this.__akiraState) {
                this.__akiraState.destroy();
                delete this.__akiraState;
            }
            delete this.__akiraEnabled;
            if (original) original.apply(this, args);
        });
    }

    function ensureInterfaceState(main) {
        if (main.__akiraState) return main.__akiraState;
        var info = new InterfaceInfo();
        info.create();
        var background = document.createElement('img');
        background.className = 'full-start__background akira-main-bg';
        var state = {
            main: main,
            info: info,
            bg: background,
            last: '',
            timer: null,
            attached: false,
            attach: function () {
                if (this.attached) return;
                var container = main.render(true);
                if (!container) return;
                container.classList.add('akira-main', 'new-interface', 'new-interface-h');
                if (!background.parentNode) container.insertBefore(background, container.firstChild || null);
                var infoNode = info.render(true);
                if (infoNode && infoNode.parentNode !== container) container.insertBefore(infoNode, background.nextSibling || container.firstChild);
                try { main.scroll.minus(infoNode); } catch (e) {}
                this.attached = true;
            },
            update: function (data) {
                if (!data) return;
                info.update(data);
                this.updateBackground(data);
            },
            updateBackground: function (data) {
                var path = data && data.backdrop_path && Lampa.Api && Lampa.Api.img ? Lampa.Api.img(data.backdrop_path, 'w1280') : '';
                if (!path || path === this.last) return;
                var self = this;
                clearTimeout(this.timer);
                this.timer = setTimeout(function () {
                    background.classList.remove('loaded');
                    background.onload = function () { background.classList.add('loaded'); };
                    background.onerror = function () { background.classList.remove('loaded'); };
                    self.last = path;
                    setTimeout(function () { background.src = self.last; }, 300);
                }, 600);
            },
            reset: function () { info.empty(); },
            destroy: function () {
                clearTimeout(this.timer);
                info.destroy();
                var container = main.render(true);
                if (container) container.classList.remove('akira-main', 'new-interface', 'new-interface-h');
                if (background.parentNode) background.parentNode.removeChild(background);
                this.attached = false;
            }
        };
        main.__akiraState = state;
        return state;
    }

    function updateCardTitle(card) {
        if (!card || !card.render) return;
        var element = card.render(true);
        if (element && element[0]) element = element[0];
        if (!element) return;
        if (!element.isConnected) {
            clearTimeout(card.__akiraLabelTimer);
            card.__akiraLabelTimer = setTimeout(function () { updateCardTitle(card); }, 50);
            return;
        }
        var textValue = clean(card.data && (card.data.title || card.data.name || card.data.original_title || card.data.original_name));
        var label = qs('.akira-card-title', element) || card.__akiraLabel;
        if (!textValue) {
            if (label && label.parentNode) label.parentNode.removeChild(label);
            card.__akiraLabel = null;
            return;
        }
        if (!label) {
            label = document.createElement('div');
            label.className = 'akira-card-title new-interface-card-title';
        }
        label.textContent = textValue;
        if (label.parentNode !== element) {
            if (label.parentNode) label.parentNode.removeChild(label);
            element.appendChild(label);
        }
        card.__akiraLabel = label;
    }

    function decorateCard(state, card) {
        if (!card || card.__akiraCard || !card.use || !card.data) return;
        card.__akiraCard = true;
        card.params = card.params || {};
        card.params.style = card.params.style || {};
        if (!card.params.style.name) card.params.style.name = 'wide';
        card.use({
            onFocus: function () { state.update(card.data); },
            onHover: function () { state.update(card.data); },
            onTouch: function () { state.update(card.data); },
            onVisible: function () { updateCardTitle(card); AkiraLogo.applyToCard(card); },
            onUpdate: function () { updateCardTitle(card); AkiraLogo.applyToCard(card); },
            onDestroy: function () {
                clearTimeout(card.__akiraLabelTimer);
                var root = card.render && card.render(true);
                if (root && root[0]) root = root[0];
                var logo = root && qs('.akira-card-logo', root);
                if (logo && logo.parentNode) logo.parentNode.removeChild(logo);
                if (card.__akiraLabel && card.__akiraLabel.parentNode) card.__akiraLabel.parentNode.removeChild(card.__akiraLabel);
                card.__akiraLabel = null;
                delete card.__akiraCard;
            }
        });
        updateCardTitle(card);
        AkiraLogo.applyToCard(card);
    }

    function getDomCardData(node) {
        var current = node && node.jquery ? node[0] : node;
        while (current && !current.card_data) current = current.parentNode;
        return current && current.card_data ? current.card_data : null;
    }

    function attachLineHandlers(main, line, element) {
        if (line.__akiraLine) return;
        line.__akiraLine = true;
        var state = ensureInterfaceState(main);
        var apply = function (card) { decorateCard(state, card); };
        if (element && Array.isArray(element.results)) {
            for (var i = 0; i < Math.min(element.results.length, 5); i++) {
                state.info.load(element.results[i], { preload: true });
                AkiraLogo.preload(element.results[i]);
            }
        }
        line.use({
            onInstance: function (card) { apply(card); },
            onActive: function (card, itemData) { state.update(card && card.data ? card.data : itemData); },
            onToggle: function () {
                setTimeout(function () {
                    var container = line.render && line.render(true);
                    var focus = container && (qs('.selector.focus', container) || qs('.focus', container));
                    var data = getDomCardData(focus);
                    if (data) state.update(data);
                }, 32);
            },
            onMore: function () { state.reset(); },
            onDestroy: function () {
                state.reset();
                delete line.__akiraLine;
            }
        });
        if (Array.isArray(line.items)) line.items.forEach(apply);
        if (line.last) {
            var lastData = getDomCardData(line.last);
            if (lastData) state.update(lastData);
        }
    }

    function applyFullTemplate() {
        if (!Lampa.Template || !Lampa.Template.add) return;
        var separate = getBool(K.buttonsSeparate, true);
        var torrent = separate
            ? '<div class="full-start__button selector view--torrent"><svg><use xlink:href="#sprite-torrent"></use></svg><span>#{full_torrents}</span></div><div class="full-start__button selector view--trailer"><svg><use xlink:href="#sprite-trailer"></use></svg><span>#{full_trailers}</span></div>'
            : '';
        var hidden = separate ? '' : '<div class="hide buttons--container"><div class="full-start__button view--torrent hide"><svg><use xlink:href="#sprite-torrent"></use></svg><span>#{full_torrents}</span></div><div class="full-start__button selector view--trailer"><svg><use xlink:href="#sprite-trailer"></use></svg><span>#{full_trailers}</span></div></div>';
        Lampa.Template.add('full_start_new',
            '<div class="full-start-new">' +
            '<div class="full-start-new__body">' +
            '<div class="full-start-new__left"><div class="full-start-new__poster"><img class="full-start-new__img full--poster" /></div></div>' +
            '<div class="full-start-new__right">' +
            '<div class="full-start-new__head"></div><div class="full-start-new__title">{title}</div><div class="full-start__title-original">{original_title}</div><div class="full-start-new__tagline full--tagline">{tagline}</div>' +
            '<div class="full-start-new__rate-line"><div class="full-start__rate rate--tmdb"><div>{rating}</div><div class="source--name">TMDB</div></div><div class="full-start__rate rate--imdb hide"><div></div><div>IMDB</div></div><div class="full-start__rate rate--kp hide"><div></div><div>KP</div></div><div class="full-start__pg hide"></div><div class="full-start__status hide"></div></div>' +
            '<div class="full-start-new__details"></div><div class="full-start-new__reactions"><div>#{reactions_none}</div></div>' +
            '<div class="full-start-new__buttons"><div class="full-start__button selector button--play"><svg><use xlink:href="#sprite-play"></use></svg><span>#{title_watch}</span></div>' + torrent +
            '<div class="full-start__button selector button--book"><svg width="21" height="32" viewBox="0 0 21 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 1.5H19C19.2761 1.5 19.5 1.72386 19.5 2V27.9618C19.5 28.3756 19.0261 28.6103 18.697 28.3595L12.6212 23.7303C11.3682 22.7757 9.63183 22.7757 8.37885 23.7303L2.30302 28.3595C1.9739 28.6103 1.5 28.3756 1.5 27.9618V2C1.5 1.72386 1.72386 1.5 2 1.5Z" stroke="currentColor" stroke-width="2.5"/></svg><span>#{settings_input_links}</span></div>' +
            '<div class="full-start__button selector button--reaction"><svg><use xlink:href="#sprite-reaction"></use></svg><span>#{title_reactions}</span></div><div class="full-start__button selector button--subscribe hide"><svg viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.01892 24C6.27423 27.3562 9.07836 30 12.5 30C15.9216 30 18.7257 27.3562 18.981 24H15.9645C15.7219 25.6961 14.2632 27 12.5 27C10.7367 27 9.27804 25.6961 9.03542 24H6.01892Z" fill="currentColor"></path><path d="M3.81972 14.5957V10.2679C3.81972 5.41336 7.7181 1.5 12.5 1.5C17.2819 1.5 21.1803 5.41336 21.1803 10.2679V14.5957C21.1803 15.8462 21.5399 17.0709 22.2168 18.1213L23.0727 19.4494C24.2077 21.2106 22.9392 23.5 20.9098 23.5H4.09021C2.06084 23.5 0.792282 21.2106 1.9273 19.4494L2.78317 18.1213C3.46012 17.0709 3.81972 15.8462 3.81972 14.5957Z" stroke="currentColor" stroke-width="2.6"></path></svg><span>#{title_subscribe}</span></div><div class="full-start__button selector button--options"><svg><use xlink:href="#sprite-dots"></use></svg></div></div>' +
            '</div></div>' + hidden + '</div>'
        );
    }

    function hookFullLogos() {
        if (window.__AKIRA_FULL_LOGO_HOOK__) return;
        window.__AKIRA_FULL_LOGO_HOOK__ = true;
        try {
            Lampa.Listener.follow('full', function (e) {
                if (!e || e.type !== 'complite') return;
                var data = e.data && (e.data.movie || e.data);
                if (data && e.object && e.object.activity) {
                    setMobileHeroBg(e.object.activity, data);
                    AkiraLogo.applyToFull(e.object.activity, data);
                }
            });
        } catch (err) {}
    }

    function setMobileHeroBg(activity, movie) {
        try {
            var render = activity.render();
            var root = render && (render[0] || render);
            if (!root) return;
            var bg = '';
            if (movie.backdrop_path && Lampa.TMDB && Lampa.TMDB.image) bg = Lampa.TMDB.image('t/p/original' + movie.backdrop_path);
            else if (movie.poster_path && Lampa.TMDB && Lampa.TMDB.image) bg = Lampa.TMDB.image('t/p/w780' + movie.poster_path);
            else if (movie.img) bg = movie.img;
            if (bg) root.style.setProperty('--akira-mobile-bg', 'url(' + bg + ')');
        } catch (e) {}
    }

    function initTmdbSource() {
        if (window.__AKIRA_TMDB_SOURCE__) return;
        if (!Lampa.Api || !Lampa.Api.sources || !Lampa.Api.sources.tmdb) return;
        window.__AKIRA_TMDB_SOURCE__ = true;
        var original = Lampa.Api.sources.tmdb;
        var akira = {};
        for (var k in original) if (Object.prototype.hasOwnProperty.call(original, k)) akira[k] = original[k];
        Lampa.Api.sources.akira_tmdb = akira;
        try {
            Object.defineProperty(Lampa.Api.sources, 'akira_tmdb', { get: function () { return akira; } });
        } catch (e) {}
        var originalMain = original.main;
        akira.main = function () {
            var args = Array.prototype.slice.call(arguments);
            if (pluginOn() && getBool(K.tmdb, true) && this.type !== 'movie' && this.type !== 'tv') {
                return createAkiraMain(akira).apply(this, args);
            }
            return originalMain.apply(this, args);
        };
        try {
            if (Lampa.Params && Lampa.Params.select) {
                var sources = Lampa.Params.values && Lampa.Params.values.source ? Lampa.Params.values.source : {};
                if (!sources.akira_tmdb) {
                    sources.akira_tmdb = 'Akira TMDB';
                    Lampa.Params.select('source', sources, storageField('source', 'tmdb'));
                }
            }
        } catch (e2) {}
    }

    function createAkiraMain(parent) {
        return function (params, oncomplete, onerror) {
            var parts = [];
            COLLECTIONS.forEach(function (item) {
                if (!getBool(collectionKey(item.id), true)) return;
                parts.push(function (call) {
                    parent.get(item.request, params || {}, function (json) {
                        json.title = item.label;
                        if (Lampa.Utils && Lampa.Utils.addSource) Lampa.Utils.addSource(json, 'tmdb');
                        call(json);
                    }, function () {
                        call({ source: 'tmdb', results: [], title: item.label });
                    });
                });
            });
            if (!parts.length) {
                if (onerror) onerror();
                return function () {};
            }
            var method = Lampa.Api && Lampa.Api.sequentials ? Lampa.Api.sequentials : Lampa.Api.partNext;
            if (!method) {
                if (onerror) onerror();
                return function () {};
            }
            method(parts, parts.length, oncomplete, onerror);
            return function () {};
        };
    }

    function updateScale() {
        if (!document.documentElement || !document.body) return;
        if (!pluginOn() || !getBool(K.scale, true)) {
            document.documentElement.style.removeProperty('--akira-font-size');
            document.documentElement.style.removeProperty('--akira-card-scale');
            document.documentElement.style.removeProperty('--akira-card-shift');
            document.documentElement.style.removeProperty('--akira-hero-h');
            document.documentElement.style.removeProperty('--akira-logo-max-h');
            document.documentElement.style.removeProperty('--akira-card-logo-h');
            document.documentElement.style.removeProperty('--akira-card-wide');
            setBodyState();
            return;
        }
        var vp = window.visualViewport || {};
        var width = Math.round(vp.width || window.innerWidth || document.documentElement.clientWidth || 1920);
        var height = Math.round(vp.height || window.innerHeight || document.documentElement.clientHeight || 1080);
        var base = clamp(width / 1920, 0.78, 1.28);
        if (height < 760) base *= 0.92;
        var font = Math.round(clamp(16 * base, 13, 22));
        var cardScale = width < 580 ? 1.08 : width < 1024 ? 1.18 : width < 1920 ? 1.30 : 1.40;
        var shift = width < 580 ? '8%' : width < 1024 ? '16%' : width < 1920 ? '24%' : '30%';
        var heroH = Math.round(clamp(height * 0.28, 260, 430));
        var logoH = Math.round(clamp(height * 0.12, 70, 170));
        var cardLogoH = Math.round(clamp(height * 0.055, 34, 74));
        var cardWide = (width < 900 ? 15.8 : width < 1920 ? 18.3 : 20.2) + 'em';
        document.documentElement.style.setProperty('--akira-font-size', font + 'px');
        document.documentElement.style.setProperty('--akira-card-scale', String(cardScale));
        document.documentElement.style.setProperty('--akira-card-shift', shift);
        document.documentElement.style.setProperty('--akira-hero-h', heroH + 'px');
        document.documentElement.style.setProperty('--akira-logo-max-h', logoH + 'px');
        document.documentElement.style.setProperty('--akira-card-logo-h', cardLogoH + 'px');
        document.documentElement.style.setProperty('--akira-card-wide', cardWide);
        setBodyState();
    }

    function tagCardEdges() {
        if (!pluginOn() || !getBool(K.cardDesign, true)) return;
        qsa('.scroll__body, .items-line__body').forEach(function (row) {
            var cards = qsa('.card', row);
            if (!cards.length) return;
            cards.forEach(function (card) {
                card.removeAttribute('data-akira-edge');
                card.removeAttribute('data-akira-single');
            });
            if (cards.length === 1) cards[0].setAttribute('data-akira-single', 'true');
            else {
                cards[0].setAttribute('data-akira-edge', 'first');
                cards[cards.length - 1].setAttribute('data-akira-edge', 'last');
            }
        });
    }

    function colorizeRatings() {
        if (!pluginOn() || !getBool(K.cardDesign, true)) return;
        qsa('.card__vote').forEach(function (el) {
            var value = parseFloat((el.textContent || '').replace(',', '.'));
            if (isNaN(value)) return;
            var color = value >= 7.5 ? '#2ecc71' : value >= 6.5 ? '#f1c40f' : value >= 5 ? '#e67e22' : 'var(--akira-accent)';
            el.style.setProperty('background', color, 'important');
        });
    }

    function observeDom() {
        if (topbarObserver || !window.MutationObserver || !document.body) return;
        var pending = false;
        topbarObserver = new MutationObserver(function () {
            if (!pluginOn() || pending) return;
            pending = true;
            setTimeout(function () {
                pending = false;
                patchTopbar();
                tagCardEdges();
                colorizeRatings();
            }, 100);
        });
        topbarObserver.observe(document.body, { childList: true, subtree: true });
    }

    function injectStyle() {
        var p = palette();
        var style = document.getElementById(CFG.styleId) || document.createElement('style');
        style.id = CFG.styleId;
        var css = ''
            + '@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap");\n'
            + ':root{--akira-bg:#0a0d12;--akira-accent:' + p.accent + ';--akira-accent-2:' + p.accent2 + ';--akira-accent-rgb:' + p.rgb + ';--akira-accent-gl:rgba(' + p.rgb + ',.48);--akira-accent-bg:rgba(' + p.rgb + ',.74);--akira-text:#f4f4f5;--akira-font:"Montserrat","Helvetica Neue",Arial,sans-serif;--akira-font-size:16px;--akira-card-scale:1.3;--akira-card-shift:24%;--akira-radius:8px;--akira-hero-h:350px;--akira-logo-max-h:140px;--akira-card-logo-h:58px;--akira-card-wide:18.3em;}\n'
            + 'body.' + CFG.bodyClass + '[data-akira-scale="on"]{font-size:var(--akira-font-size)!important;}\n'
            + 'body.' + CFG.bodyClass + '[data-akira-theme="on"]{background-color:var(--akira-bg)!important;color:var(--akira-text)!important;font-family:var(--akira-font)!important;}\n'
            + 'body.' + CFG.bodyClass + '[data-akira-topbar="on"] .head,body.' + CFG.bodyClass + '[data-akira-topbar="on"] .head__body,body.' + CFG.bodyClass + '[data-akira-topbar="on"] .head__wrapper{background:transparent!important;box-shadow:none!important;overflow:visible!important;}\n'
            + 'body.' + CFG.bodyClass + '[data-akira-topbar="on"] .head__title,body.' + CFG.bodyClass + '[data-akira-topbar="on"] .head__time,body.' + CFG.bodyClass + '[data-akira-topbar="on"] .head__split,body.' + CFG.bodyClass + '[data-akira-topbar="on"] .head__logo,body.' + CFG.bodyClass + '[data-akira-topbar="on"] .open--search,body.' + CFG.bodyClass + '[data-akira-topbar="on"] .head__settings{display:none!important;}\n'
            + 'body.' + CFG.bodyClass + '[data-akira-topbar="on"] .head__history,body.' + CFG.bodyClass + '[data-akira-topbar="on"] .head__source,body.' + CFG.bodyClass + '[data-akira-topbar="on"] .head__markers,body.' + CFG.bodyClass + '[data-akira-topbar="on"] .head__backward,body.' + CFG.bodyClass + '[data-akira-topbar="on"] .settings-icon-holder,body.' + CFG.bodyClass + '[data-akira-topbar="on"] .head__action,body.' + CFG.bodyClass + '[data-akira-topbar="on"] .head__button{display:none!important;}\n'
            + 'body.' + CFG.bodyClass + ' .head__menu-icon.akira-head-brand{position:absolute!important;left:1.05em!important;top:.54em!important;z-index:60!important;max-width:min(30vw,22em)!important;min-width:4.4em!important;height:2.62em!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;padding:0 .95em!important;border-radius:8px!important;background:linear-gradient(92deg,var(--akira-accent),var(--akira-accent-2))!important;color:' + p.focusText + '!important;border:1px solid rgba(255,255,255,.12)!important;box-shadow:0 10px 28px rgba(' + p.rgb + ',.22)!important;overflow:hidden!important;}\n'
            + 'body.' + CFG.bodyClass + ' .head__menu-icon.akira-head-brand span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:900;font-size:.88em;line-height:1;letter-spacing:0;color:inherit;}\n'
            + 'body.' + CFG.bodyClass + ' .akira-topbar{position:absolute;left:calc(var(--akira-brand-w,5.2em) + 1.55em)!important;top:.54em!important;right:1.05em!important;z-index:58!important;pointer-events:none;}\n'
            + 'body.' + CFG.bodyClass + ' .akira-topbar__inner{height:2.8em;display:flex;align-items:center;gap:.34em;pointer-events:auto;}\n'
            + 'body.' + CFG.bodyClass + ' .akira-topbar__items,body.' + CFG.bodyClass + ' .akira-topbar__right{display:inline-flex;align-items:center;gap:.18em;height:2.62em;padding:.18em;border-radius:8px;background:rgba(14,14,16,.78);border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(18px) saturate(130%);-webkit-backdrop-filter:blur(18px) saturate(130%);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 10px 26px rgba(0,0,0,.22);}\n'
            + 'body.' + CFG.bodyClass + ' .akira-topbar__items{max-width:calc(100vw - var(--akira-brand-w,5.2em) - 17em)!important;overflow:hidden!important;}body.' + CFG.bodyClass + ' .akira-topbar__right{margin-left:auto;}\n'
            + 'body.' + CFG.bodyClass + ' .akira-topbar__item,body.' + CFG.bodyClass + ' .akira-topbar__clock{height:2.18em;min-width:2.18em;display:inline-flex;align-items:center;justify-content:center;padding:0 .88em;border-radius:7px;color:rgba(255,255,255,.9);font-size:.84em;font-weight:700;white-space:nowrap;transition:background .18s ease,transform .18s ease,color .18s ease;}\n'
            + 'body.' + CFG.bodyClass + ' .akira-topbar__icon{width:2.18em;padding:0;}body.' + CFG.bodyClass + ' .akira-topbar__icon svg{width:1.08em;height:1.08em;}body.' + CFG.bodyClass + ' .akira-topbar__clock{min-width:4.1em;font-weight:800;padding:0 .72em;}\n'
            + 'body.' + CFG.bodyClass + ' .akira-topbar__item.focus,body.' + CFG.bodyClass + ' .akira-topbar__item.hover,body.' + CFG.bodyClass + ' .akira-topbar__clock.focus,body.' + CFG.bodyClass + ' .akira-topbar__clock.hover{background:rgba(255,255,255,.15);color:#fff;transform:translateY(-1px);}\n'
            + 'body.' + CFG.bodyClass + '[data-akira-topbar-align="center"] .akira-topbar{left:0!important;right:0!important;}body.' + CFG.bodyClass + '[data-akira-topbar-align="center"] .akira-topbar__inner{justify-content:center;pointer-events:none;}body.' + CFG.bodyClass + '[data-akira-topbar-align="center"] .akira-topbar__items{position:absolute;left:50%;top:0;transform:translateX(-50%);max-width:calc(100vw - 23em)!important;pointer-events:auto;}body.' + CFG.bodyClass + '[data-akira-topbar-align="center"] .akira-topbar__right{position:absolute;right:1.05em;top:0;margin-left:0;pointer-events:auto;}\n'
            + 'body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu{background:rgba(10,13,18,.74)!important;backdrop-filter:blur(28px) saturate(150%)!important;-webkit-backdrop-filter:blur(28px) saturate(150%)!important;border-right:1px solid rgba(255,255,255,.08)!important;overflow-x:hidden!important;}body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item{border-radius:0!important;background:rgba(255,255,255,.04)!important;border-left:3px solid transparent!important;padding:.55em 1.4em .55em 1em!important;margin:0!important;gap:.7em!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;}body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item.focus,body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item.hover,body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item.traverse,body.' + CFG.bodyClass + '[data-akira-theme="on"] .menu__item.active{background:rgba(255,255,255,.1)!important;border-left-color:var(--akira-accent)!important;box-shadow:none!important;}\n'
            + 'body.' + CFG.bodyClass + '[data-akira-cards="on"] .items-line__body,body.' + CFG.bodyClass + '[data-akira-cards="on"] .items-cards,body.' + CFG.bodyClass + '[data-akira-cards="on"] .scroll,body.' + CFG.bodyClass + '[data-akira-cards="on"] .scroll--horizontal,body.' + CFG.bodyClass + '[data-akira-cards="on"] .scroll__content,body.' + CFG.bodyClass + '[data-akira-cards="on"] .scroll__body{overflow:visible!important;}body.' + CFG.bodyClass + '[data-akira-cards="on"] .items-line{overflow:visible!important;position:relative!important;z-index:1!important;padding:45px 0!important;}body.' + CFG.bodyClass + '[data-akira-cards="on"] .items-line__title{font-family:var(--akira-font)!important;font-weight:700!important;font-size:1.3em!important;color:var(--akira-text)!important;text-shadow:0 2px 10px rgba(0,0,0,.8)!important;padding-left:4%!important;}\n'
            + 'body.' + CFG.bodyClass + '[data-akira-cards="on"] .card{position:relative!important;transition:transform 420ms cubic-bezier(.4,0,.2,1),z-index 0s!important;z-index:1!important;will-change:transform!important;backface-visibility:hidden!important;transform:translate3d(0,0,0)!important;transform-origin:center center!important;}body.' + CFG.bodyClass + '[data-akira-cards="on"] .card__view{border-radius:var(--akira-radius)!important;overflow:visible!important;position:relative!important;background:#16181d!important;border:3px solid transparent!important;transition:border-color 420ms cubic-bezier(.4,0,.2,1)!important;}body.' + CFG.bodyClass + '[data-akira-cards="on"] .card__view::before{content:""!important;display:block!important;position:absolute!important;inset:0;border-radius:inherit!important;box-shadow:0 0 20px var(--akira-accent-gl),0 20px 40px rgba(0,0,0,.6)!important;opacity:0!important;z-index:-1!important;pointer-events:none!important;transition:opacity 420ms cubic-bezier(.4,0,.2,1)!important;}body.' + CFG.bodyClass + '[data-akira-cards="on"] .card__view::after{display:none!important;content:none!important;}body.' + CFG.bodyClass + '[data-akira-cards="on"] .card__img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:var(--akira-radius)!important;filter:none!important;}body.' + CFG.bodyClass + '[data-akira-cards="on"] .card__age{display:none!important;}\n'
            + 'body.' + CFG.bodyClass + '[data-akira-cards="on"] .card__view-shadow,body.' + CFG.bodyClass + '[data-akira-cards="on"] .card .card__overlay,body.' + CFG.bodyClass + '[data-akira-cards="on"] .card .card__gradient,body.' + CFG.bodyClass + '[data-akira-cards="on"] .card .card__mask,body.' + CFG.bodyClass + '[data-akira-cards="on"] .card .card__blackout,body.' + CFG.bodyClass + '[data-akira-cards="on"] .card .card-watched,body.' + CFG.bodyClass + '[data-akira-cards="on"] .card__promo{display:none!important;background:none!important;opacity:0!important;}body.' + CFG.bodyClass + '[data-akira-cards="on"] .card__title{font-family:var(--akira-font)!important;font-size:.85em!important;font-weight:600!important;color:var(--akira-text)!important;padding:4px 2px 0!important;line-height:1.1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-shadow:0 1px 4px rgba(0,0,0,.5)!important;}body.' + CFG.bodyClass + '[data-akira-cards="on"] .card__quality{display:block!important;position:absolute!important;bottom:6px!important;left:6px!important;top:auto!important;right:auto!important;z-index:20!important;background:rgba(46,204,113,.88)!important;color:#fff!important;padding:2px 8px!important;border-radius:4px!important;font-size:.7em!important;font-weight:700!important;font-family:var(--akira-font)!important;text-transform:uppercase!important;letter-spacing:0!important;line-height:1.4!important;pointer-events:none!important;box-shadow:0 2px 8px rgba(0,0,0,.5)!important;}body.' + CFG.bodyClass + '[data-akira-cards="on"] .card__vote{display:block!important;position:absolute!important;bottom:6px!important;right:6px!important;top:auto!important;left:auto!important;z-index:20!important;background:rgba(120,120,120,.6)!important;color:#fff!important;padding:2px 8px!important;border-radius:10px 0 10px 0!important;font-size:.75em!important;font-weight:800!important;font-family:var(--akira-font)!important;line-height:1.4!important;pointer-events:none!important;box-shadow:0 2px 8px rgba(0,0,0,.5)!important;}\n'
            + 'body.' + CFG.bodyClass + '[data-akira-cards="on"] .card.focus,body.' + CFG.bodyClass + '[data-akira-cards="on"] .card.hover,body.' + CFG.bodyClass + '[data-akira-cards="on"] .card:hover{z-index:100!important;transform:scale3d(var(--akira-card-scale),var(--akira-card-scale),1)!important;}body.' + CFG.bodyClass + '[data-akira-cards="on"] .card.focus .card__view,body.' + CFG.bodyClass + '[data-akira-cards="on"] .card.hover .card__view,body.' + CFG.bodyClass + '[data-akira-cards="on"] .card:hover .card__view{border-color:var(--akira-accent)!important;}body.' + CFG.bodyClass + '[data-akira-cards="on"] .card.focus .card__view::before,body.' + CFG.bodyClass + '[data-akira-cards="on"] .card.hover .card__view::before,body.' + CFG.bodyClass + '[data-akira-cards="on"] .card:hover .card__view::before{opacity:1!important;}body.' + CFG.bodyClass + '[data-akira-cards="on"] .card.focus ~ .card,body.' + CFG.bodyClass + '[data-akira-cards="on"] .card.hover ~ .card,body.' + CFG.bodyClass + '[data-akira-cards="on"] .card:hover ~ .card{transform:translate3d(var(--akira-card-shift),0,0)!important;}body.' + CFG.bodyClass + '[data-akira-cards="on"] .card[data-akira-edge="first"].focus,body.' + CFG.bodyClass + '[data-akira-cards="on"] .card[data-akira-edge="first"].hover{transform-origin:left center!important;}body.' + CFG.bodyClass + '[data-akira-cards="on"] .card[data-akira-edge="last"].focus,body.' + CFG.bodyClass + '[data-akira-cards="on"] .card[data-akira-edge="last"].hover{transform-origin:right center!important;}\n'
            + 'body.' + CFG.bodyClass + ' .akira-main{position:relative;--ni-info-h:var(--akira-hero-h);}body.' + CFG.bodyClass + ' .akira-main .card.card--wide,body.' + CFG.bodyClass + ' .akira-main .card--small.card--wide{width:var(--akira-card-wide)!important;}body.' + CFG.bodyClass + ' .akira-main-bg{height:108%;top:-6em;opacity:0;transition:opacity .35s ease;}body.' + CFG.bodyClass + ' .akira-main-bg.loaded{opacity:.8;}body.' + CFG.bodyClass + ' .akira-hero{position:relative;padding:1.5em;height:var(--akira-hero-h);overflow:hidden;z-index:3;}body.' + CFG.bodyClass + ' .akira-hero__body{position:relative;z-index:1;width:min(96%,78em);padding-top:1.1em;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.85fr);column-gap:clamp(16px,3vw,54px);height:100%;box-sizing:border-box;}body.' + CFG.bodyClass + ' .akira-hero__left,body.' + CFG.bodyClass + ' .akira-hero__right{min-width:0;height:100%;}body.' + CFG.bodyClass + ' .akira-hero__right{padding-top:clamp(.2em,2.2vh,1.6em);padding-bottom:clamp(.8em,2.4vh,2em);display:flex;flex-direction:column;}body.' + CFG.bodyClass + ' .akira-hero__textblock{margin-top:auto;display:flex;flex-direction:column;gap:.55em;min-height:0;}body.' + CFG.bodyClass + ' .akira-hero__head{color:rgba(255,255,255,.6);margin-bottom:1em;font-size:1.3em;min-height:1em;}body.' + CFG.bodyClass + ' .akira-hero__head span{color:#fff;}body.' + CFG.bodyClass + ' .akira-hero__title{font-size:clamp(2.6em,4vw,3.6em);font-weight:700;margin-bottom:.3em;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical;line-height:1.25;}body.' + CFG.bodyClass + ' .akira-info-logo{max-height:var(--akira-logo-max-h);}body.' + CFG.bodyClass + ' .akira-hero__description{font-size:.87em;font-weight:300;line-height:1.38;color:rgba(255,255,255,.9);text-shadow:0 2px 12px rgba(0,0,0,.45);overflow:hidden;display:-webkit-box;-webkit-line-clamp:7;line-clamp:7;-webkit-box-orient:vertical;}body.' + CFG.bodyClass + ' .akira-hero__meta{display:flex;align-items:center;gap:.48em;flex-wrap:wrap;color:rgba(255,255,255,.84);}body.' + CFG.bodyClass + ' .akira-hero__moved-head{display:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.92;}\n'
            + 'body.' + CFG.bodyClass + ' .akira-card-title{font-family:var(--akira-font)!important;font-size:.85em!important;font-weight:600!important;color:var(--akira-text)!important;padding:4px 2px 0!important;line-height:1.1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-shadow:0 1px 4px rgba(0,0,0,.5)!important;}body.' + CFG.bodyClass + ' .akira-card-logo{position:absolute;left:0;right:0;bottom:0;padding:.35em .45em;box-sizing:border-box;pointer-events:none;background:linear-gradient(to top,rgba(0,0,0,.78),rgba(0,0,0,0));}body.' + CFG.bodyClass + ' .akira-card-logo img{max-height:var(--akira-card-logo-h);}\n'
            + 'body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start-new,body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start{position:relative!important;overflow:hidden!important;margin:0!important;padding:0!important;background:none!important;}body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start__background{position:absolute!important;top:-6em!important;left:0!important;width:100%!important;height:calc(100% + 6em)!important;margin:0!important;padding:0!important;mask-image:none!important;-webkit-mask-image:none!important;}body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start-new::after,body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start::after{display:none!important;content:none!important;}body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start-new::before,body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start::before{content:""!important;display:block!important;position:absolute!important;top:-6em!important;left:0!important;right:0!important;bottom:0!important;height:calc(100% + 6em)!important;background:linear-gradient(to top,var(--akira-bg) 0%,rgba(10,13,18,.85) 35%,transparent 80%)!important;opacity:.18!important;z-index:1!important;pointer-events:none!important;}body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start-new__body,body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start__body{position:relative!important;z-index:2!important;padding-left:5%!important;display:flex!important;align-items:flex-end!important;min-height:80vh!important;padding-top:6em!important;padding-bottom:2em!important;background:none!important;}body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start-new__left,body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start__left{display:none!important;}body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start-new__right,body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start__right{position:relative!important;z-index:3!important;max-width:min(650px,92vw)!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:flex-end!important;background:none!important;}body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start-new__title,body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start__title{font-family:var(--akira-font)!important;font-weight:800!important;font-size:clamp(1.8em,3.5vw,3.8em)!important;line-height:1.08!important;color:#fff!important;text-shadow:0 2px 10px rgba(0,0,0,.7),0 6px 24px rgba(0,0,0,.8)!important;margin-bottom:8px!important;background:none!important;box-shadow:none!important;max-width:100%!important;}body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start-new__title img,body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start__title img,body.' + CFG.bodyClass + '[data-akira-detail="on"] .akira-full-logo{max-height:var(--akira-logo-max-h)!important;filter:none!important;background:none!important;box-shadow:none!important;}body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start-new__head,body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start__head,body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start-new__details,body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start__details{font-family:var(--akira-font)!important;font-weight:500!important;font-size:.85em!important;line-height:1.3!important;color:rgba(255,255,255,.74)!important;text-shadow:0 2px 4px rgba(0,0,0,.5)!important;background:none!important;box-shadow:none!important;}body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start-new__tagline{font-style:italic;color:rgba(255,255,255,.65)!important;}body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start-new__reactions{display:none!important;height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;}\n'
            + 'body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start__button,body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start-new__button{font-family:var(--akira-font)!important;font-weight:600!important;border-radius:8px!important;border:1px solid rgba(255,255,255,.1)!important;background:rgba(120,120,120,.2)!important;backdrop-filter:blur(10px)!important;-webkit-backdrop-filter:blur(10px)!important;box-shadow:0 4px 16px rgba(0,0,0,.3)!important;color:rgba(255,255,255,.82)!important;text-shadow:0 2px 4px rgba(0,0,0,.5)!important;transition:background 300ms ease,transform 200ms ease,box-shadow 300ms ease,border-color 300ms ease!important;}body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start__button.focus,body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start__button:hover{background:var(--akira-accent-bg)!important;border-color:rgba(255,255,255,.3)!important;color:#fff!important;box-shadow:0 0 20px var(--akira-accent-gl),0 8px 28px rgba(0,0,0,.4)!important;transform:scale(1.04)!important;}body.' + CFG.bodyClass + '[data-akira-buttons-big="on"] .full-start-new__buttons .full-start__button:not(.focus) span{display:inline!important;}body.' + CFG.bodyClass + '[data-akira-buttons-big="off"] .full-start-new__buttons .full-start__button:not(.focus) span{display:none;}\n'
            + (getBool(K.translateTv, true) ? 'body.' + CFG.bodyClass + ' .card--tv .card__type,body.' + CFG.bodyClass + ' .card__type{font-size:1em;background:transparent!important;color:transparent!important;left:0;top:0;}body.' + CFG.bodyClass + ' .card__type::after{content:"СЕРИАЛ";color:#fff;position:absolute;left:0;top:0;padding:.4em .6em;border-radius:.4em 0 .4em 0;font-weight:700;background:var(--akira-accent-bg);}\n' : '')
            + (getBool(K.animations, true) ? 'body.' + CFG.bodyClass + ' .watched-history,body.' + CFG.bodyClass + ' .torrent-item,body.' + CFG.bodyClass + ' .online-prestige,body.' + CFG.bodyClass + ' .extensions__item,body.' + CFG.bodyClass + ' .full-start__button,body.' + CFG.bodyClass + ' .simple-button,body.' + CFG.bodyClass + ' .settings-folder,body.' + CFG.bodyClass + ' .settings-param{transform:scale(1);transition:transform .25s ease;}body.' + CFG.bodyClass + ' .watched-history.focus,body.' + CFG.bodyClass + ' .torrent-item.focus,body.' + CFG.bodyClass + ' .online-prestige.focus,body.' + CFG.bodyClass + ' .extensions__item.focus,body.' + CFG.bodyClass + ' .full-start__button.focus,body.' + CFG.bodyClass + ' .simple-button.focus{transform:scale(1.03);}body.' + CFG.bodyClass + ' .settings-folder.focus,body.' + CFG.bodyClass + ' .settings-param.focus{transform:translateX(.2em);}\n' : '')
            + '@media(max-width:900px){body.' + CFG.bodyClass + ' .akira-topbar{left:.75em!important;right:.75em!important;top:3.65em!important;}body.' + CFG.bodyClass + ' .akira-topbar__items{display:none!important;}body.' + CFG.bodyClass + ' .head__menu-icon.akira-head-brand{left:.75em!important;top:.55em!important;}body.' + CFG.bodyClass + ' .akira-hero{height:auto;min-height:260px;}body.' + CFG.bodyClass + ' .akira-hero__body{grid-template-columns:1fr;width:100%;}body.' + CFG.bodyClass + ' .akira-hero__right{padding-top:.6em;}body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start-new,body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start{background-image:var(--akira-mobile-bg)!important;background-size:cover!important;background-position:center top!important;}body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start__background{display:none!important;}body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start-new__body,body.' + CFG.bodyClass + '[data-akira-detail="on"] .full-start__body{padding-left:3%!important;min-height:75vh!important;}}\n';
        if (style.textContent !== css) style.textContent = css;
        if (!style.parentNode) (document.head || document.body).appendChild(style);
    }

    function scheduleApply(now) {
        clearTimeout(scheduleTimer);
        scheduleTimer = setTimeout(applyAll, now ? 10 : 120);
    }

    function applyAll() {
        setBodyState();
        updateScale();
        injectStyle();
        applyFullTemplate();
        patchTopbar();
        tagCardEdges();
        colorizeRatings();
    }

    function bindEvents() {
        try {
            if (Lampa.Listener && Lampa.Listener.follow) {
                Lampa.Listener.follow('activity', function (e) {
                    if (e && (e.type === 'start' || e.type === 'activity')) scheduleApply();
                });
                Lampa.Listener.follow('full', function () { scheduleApply(); });
            }
        } catch (e) {}
        try {
            if (Lampa.Storage && Lampa.Storage.listener && Lampa.Storage.listener.follow) {
                Lampa.Storage.listener.follow('change', function (event) {
                    if (!event || !event.name || event.name.indexOf(CFG.prefix) !== 0) return;
                    scheduleApply(true);
                });
            }
        } catch (e2) {}
        window.addEventListener('resize', function () {
            clearTimeout(scaleDebounce);
            scaleDebounce = setTimeout(function () {
                updateScale();
                scheduleApply(true);
            }, 120);
        });
        window.addEventListener('orientationchange', function () {
            clearTimeout(scaleDebounce);
            scaleDebounce = setTimeout(function () {
                updateScale();
                scheduleApply(true);
            }, 120);
        });
    }

    function boot() {
        if (started) return;
        started = true;
        initDefaults();
        addSettings();
        applyFullTemplate();
        injectStyle();
        updateScale();
        initTmdbSource();
        initInterfaceHooks();
        hookFullLogos();
        bindEvents();
        observeDom();
        scheduleApply(true);
    }

    if (window.appready) {
        boot();
    } else {
        try {
            if (Lampa.Listener && Lampa.Listener.follow) {
                Lampa.Listener.follow('app', function (event) {
                    if (event && event.type === 'ready') boot();
                });
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
