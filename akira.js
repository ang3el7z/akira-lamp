(function () {
    'use strict';

    if (typeof Lampa === 'undefined') return;

    var CONFIG = {
        id: 'akira',
        guard: '__AKIRA_UI_V2__',
        name: 'Akira',
        brand: 'AKIRA',
        styleId: 'akira-ui-style',
        bodyClass: 'akira-ui',
        settingsComponent: 'akira',
        sourceKey: 'akira_tmdb',
        sourceLabel: 'AKIRA',
        prefix: 'akira_',
        defaultTheme: 'red_premium',
        defaultCardSize: 'md',
        defaultNav: ['main', 'movie', 'tv', 'anime', 'release', 'favorite'],
        tmdbKey: '4ef0d7355d9ffb5151e987764708ce96',
        copy: {
            ru: {
                about: 'Netflix-подача, большой hero-блок, верхнее меню, логотипы и подборки TMDB.',
                enabled: 'Включить Akira',
                theme: 'Стиль',
                topbar: 'Верхний бар как Apple TV',
                hero: 'Большая карточка на главной',
                heroLogo: 'Логотип в большой карточке',
                logoLang: 'Язык логотипов',
                cards: 'Широкие карточки с описанием',
                cardLogo: 'Логотипы в карточках',
                fullLogo: 'Логотип внутри карточки фильма',
                splitButtons: 'Раздельные кнопки в карточке фильма',
                cardSize: 'Размер карточек',
                perf: 'Производительность',
                tmdbRows: 'Подборки TMDB на главной',
                topnavOpen: 'Настроить пункты верхнего бара',
                topnavTitle: 'Пункты верхнего бара',
                reset: 'Сбросить настройки Akira',
                reloadHint: 'Изменения подборок применятся после перезагрузки главной.',
                open: 'Открыть'
            },
            en: {
                about: 'Netflix-style home, large hero, Apple TV top bar, logos, and TMDB rows.',
                enabled: 'Enable Akira',
                theme: 'Style',
                topbar: 'Apple TV style top bar',
                topbarAlign: 'Top bar position',
                hero: 'Large hero card on home',
                heroLogo: 'Logo in hero card',
                logoLang: 'Logo language',
                cards: 'Wide cards with metadata',
                cardLogo: 'Logos in cards',
                fullLogo: 'Logo inside full card',
                splitButtons: 'Separate buttons in full card',
                cardSize: 'Card size',
                perf: 'Performance',
                tmdbRows: 'TMDB rows on home',
                topnavOpen: 'Configure top bar items',
                topnavTitle: 'Top bar items',
                reset: 'Reset Akira settings',
                reloadHint: 'Collection changes apply after reloading home.',
                open: 'Open'
            },
            uk: {
                about: 'Netflix-подача, великий hero-блок, верхнє меню, логотипи та добірки TMDB.',
                enabled: 'Увімкнути Akira',
                theme: 'Стиль',
                topbar: 'Верхній бар як Apple TV',
                hero: 'Велика картка на головній',
                heroLogo: 'Логотип у великій картці',
                logoLang: 'Мова логотипів',
                cards: 'Широкі картки з описом',
                cardLogo: 'Логотипи в картках',
                fullLogo: 'Логотип у картці фільму',
                splitButtons: 'Окремі кнопки в картці фільму',
                cardSize: 'Розмір карток',
                perf: 'Продуктивність',
                tmdbRows: 'Добірки TMDB на головній',
                topnavOpen: 'Налаштувати пункти верхнього бара',
                topnavTitle: 'Пункти верхнього бара',
                reset: 'Скинути налаштування Akira',
                reloadHint: 'Зміни добірок застосуються після перезавантаження головної.',
                open: 'Відкрити'
            }
        },
        themes: {
            red_premium: {
                label: { ru: 'Netflix Premium', en: 'Netflix Premium', uk: 'Netflix Premium' },
                accent: '#e50914',
                accent2: '#ff3b47',
                focusText: '#ffffff',
                bg: '#070707',
                bg2: '#121212',
                panel: 'rgba(14,14,16,.78)',
                panel2: 'rgba(24,24,26,.88)',
                edge: 'rgba(255,255,255,.12)',
                soft: 'rgba(229,9,20,.20)'
            },
            graphite_red: {
                label: { ru: 'Graphite Red', en: 'Graphite Red', uk: 'Graphite Red' },
                accent: '#f04444',
                accent2: '#f59e0b',
                focusText: '#ffffff',
                bg: '#090b0f',
                bg2: '#171a21',
                panel: 'rgba(18,20,27,.78)',
                panel2: 'rgba(26,29,38,.90)',
                edge: 'rgba(255,255,255,.12)',
                soft: 'rgba(240,68,68,.18)'
            },
            cinema_mint: {
                label: { ru: 'Cinema Mint', en: 'Cinema Mint', uk: 'Cinema Mint' },
                accent: '#35c7a5',
                accent2: '#6ee7b7',
                focusText: '#061413',
                bg: '#071416',
                bg2: '#122022',
                panel: 'rgba(8,23,25,.80)',
                panel2: 'rgba(16,32,35,.90)',
                edge: 'rgba(255,255,255,.12)',
                soft: 'rgba(53,199,165,.18)'
            },
            ice_cyan: {
                label: { ru: 'Ice Cyan', en: 'Ice Cyan', uk: 'Ice Cyan' },
                accent: '#22d3ee',
                accent2: '#60a5fa',
                focusText: '#03131b',
                bg: '#06131d',
                bg2: '#101f2b',
                panel: 'rgba(7,20,30,.80)',
                panel2: 'rgba(13,31,44,.90)',
                edge: 'rgba(255,255,255,.12)',
                soft: 'rgba(34,211,238,.18)'
            }
        }
    };

    if (window[CONFIG.guard]) return;
    window[CONFIG.guard] = true;

    mountAkira(CONFIG);

    function mountAkira(cfg) {
        var cssName = cfg.id.replace(/_/g, '-');
        var attrTopbar = 'data-' + cssName + '-topbar';
        var attrTopbarAlign = 'data-' + cssName + '-topbar-align';
        var attrCards = 'data-' + cssName + '-cards';
        var attrPerf = 'data-' + cssName + '-perf';
        var attrCardSize = 'data-' + cssName + '-card-size';
        var attrUiScale = 'data-' + cssName + '-ui-scale';

        var KEY = {
            enabled: cfg.prefix + 'enabled',
            theme: cfg.prefix + 'theme',
            brandName: cfg.prefix + 'brand_name',
            topbar: cfg.prefix + 'topbar',
            topbarAlign: cfg.prefix + 'topbar_align',
            hero: cfg.prefix + 'hero',
            heroLogo: cfg.prefix + 'hero_logo',
            cards: cfg.prefix + 'cards',
            cardLogo: cfg.prefix + 'card_logo',
            fullLogo: cfg.prefix + 'full_logo',
            splitButtons: cfg.prefix + 'split_buttons',
            cardSize: cfg.prefix + 'card_size',
            uiScale: cfg.prefix + 'ui_scale',
            perf: cfg.prefix + 'perf',
            tmdbRows: cfg.prefix + 'tmdb_rows',
            tmdbPrefix: cfg.prefix + 'tmdb_collection_',
            topnavItems: cfg.prefix + 'topnav_items',
            logoLang: cfg.prefix + 'logo_lang'
        };

        var TMDB_COLLECTIONS = makeCollections();
        var TOPBAR_FALLBACK = [
            { action: 'main', labelKey: 'menu_main', fallback: { ru: 'Главная', en: 'Home', uk: 'Головна' } },
            { action: 'movie', labelKey: 'menu_movies', fallback: { ru: 'Фильмы', en: 'Movies', uk: 'Фільми' } },
            { action: 'tv', labelKey: 'menu_tv', fallback: { ru: 'Сериалы', en: 'TV', uk: 'Серіали' } },
            { action: 'anime', labelKey: 'menu_anime', fallback: { ru: 'Аниме', en: 'Anime', uk: 'Аніме' } },
            { action: 'cartoon', labelKey: 'menu_multmovie', fallback: { ru: 'Мультфильмы', en: 'Cartoons', uk: 'Мультфільми' } },
            { action: 'release', labelKey: 'title_new', fallback: { ru: 'Новинки', en: 'New', uk: 'Новинки' } },
            { action: 'collections', labelKey: 'menu_collections', fallback: { ru: 'Коллекции', en: 'Collections', uk: 'Колекції' } },
            { action: 'favorite', labelKey: 'menu_bookmark', fallback: { ru: 'Закладки', en: 'Bookmarks', uk: 'Закладки' } }
        ];

        var GENRES = {
            ru: {
                12: 'приключения', 14: 'фэнтези', 16: 'анимация', 18: 'драма', 27: 'ужасы',
                28: 'боевик', 35: 'комедия', 36: 'история', 53: 'триллер', 80: 'криминал',
                99: 'документальное', 878: 'фантастика', 10749: 'мелодрама', 10751: 'семейное',
                10752: 'военный', 10759: 'боевик', 10765: 'фантастика', 9648: 'детектив'
            },
            en: {
                12: 'Adventure', 14: 'Fantasy', 16: 'Animation', 18: 'Drama', 27: 'Horror',
                28: 'Action', 35: 'Comedy', 36: 'History', 53: 'Thriller', 80: 'Crime',
                99: 'Documentary', 878: 'Sci-Fi', 10749: 'Romance', 10751: 'Family',
                10752: 'War', 10759: 'Action', 10765: 'Sci-Fi', 9648: 'Mystery'
            },
            uk: {
                12: 'пригоди', 14: 'фентезі', 16: 'анімація', 18: 'драма', 27: 'жахи',
                28: 'бойовик', 35: 'комедія', 36: 'історія', 53: 'трилер', 80: 'кримінал',
                99: 'документальне', 878: 'фантастика', 10749: 'мелодрама', 10751: 'сімейне',
                10752: 'військове', 10759: 'бойовик', 10765: 'фантастика', 9648: 'детектив'
            }
        };

        var logoCache = {};
        var logoPending = {};
        var logoResolveCache = {};
        var logoResolvePending = {};
        var detailsCache = {};
        var detailsPending = {};
        var domObserver = null;
        var scheduled = false;
        var listenersBound = false;
        var settingsReady = false;
        var tmdbReady = false;
        var heroTimer = null;
        var clockTimer = null;

        var state = {
            hero: null,
            heroKey: '',
            heroTargetKey: '',
            heroReq: 0,
            fullMovie: null,
            fullMovieKey: '',
            fullFogTick: false,
            lastCard: null
        };

        function makeCollections() {
            var today = new Date().toISOString().slice(0, 10);
            var year = new Date().getFullYear();
            var lastYear = year - 1;
            return [
                {
                    id: 'hot_new',
                    icon: '🎬',
                    title: { ru: 'Свежие премьеры', en: 'Fresh premieres', uk: 'Свіжі прем’єри' },
                    request: 'discover/movie?sort_by=primary_release_date.desc&with_release_type=4|5|6&primary_release_date.lte=' + today + '&vote_count.gte=50&vote_average.gte=6&with_runtime.gte=40&without_genres=99&region=RU'
                },
                {
                    id: 'trend_movies',
                    icon: '🔥',
                    title: { ru: 'Фильмы недели', en: 'Movies trending this week', uk: 'Фільми тижня' },
                    request: 'trending/movie/week'
                },
                {
                    id: 'watching_now',
                    icon: '👀',
                    title: { ru: 'Сейчас смотрят', en: 'Watching now', uk: 'Зараз дивляться' },
                    request: 'discover/movie?sort_by=popularity.desc&with_release_type=4|5|6&primary_release_date.lte=' + today + '&vote_count.gte=50&vote_average.gte=6&with_runtime.gte=40&without_genres=99&region=RU'
                },
                {
                    id: 'best_year',
                    icon: '🌟',
                    title: { ru: 'Лучшее кино ' + year, en: 'Best movies of ' + year, uk: 'Найкраще кіно ' + year },
                    request: 'discover/movie?primary_release_year=' + year + '&sort_by=vote_average.desc&vote_count.gte=300&region=RU'
                },
                {
                    id: 'best_last_year',
                    icon: '🏆',
                    title: { ru: 'Лучшие фильмы ' + lastYear, en: 'Best movies of ' + lastYear, uk: 'Найкращі фільми ' + lastYear },
                    request: 'discover/movie?primary_release_year=' + lastYear + '&sort_by=vote_average.desc&vote_count.gte=500&region=RU'
                },
                {
                    id: 'animation',
                    icon: '🎨',
                    title: { ru: 'Анимация с высоким рейтингом', en: 'Top animation', uk: 'Анімація з високим рейтингом' },
                    request: 'discover/movie?with_genres=16&sort_by=popularity.desc&vote_average.gte=7&vote_count.gte=500'
                },
                {
                    id: 'documentary',
                    icon: '🔬',
                    title: { ru: 'Документальные', en: 'Documentaries', uk: 'Документальні' },
                    request: 'discover/movie?with_genres=99&sort_by=popularity.desc&vote_count.gte=20&with_translations=ru&include_translations=ru'
                },
                {
                    id: 'russian_movies',
                    icon: '🇷🇺',
                    title: { ru: 'Новинки российского кино', en: 'New Russian movies', uk: 'Новинки російського кіно' },
                    request: 'discover/movie?with_original_language=ru&sort_by=primary_release_date.desc&with_release_type=4|5|6&primary_release_date.lte=' + today + '&with_runtime.gte=40&without_genres=99&region=RU'
                },
                {
                    id: 'trend_tv',
                    icon: '🔥',
                    title: { ru: 'Сериалы недели', en: 'TV trending this week', uk: 'Серіали тижня' },
                    request: 'trending/tv/week'
                },
                {
                    id: 'world_series',
                    icon: '🌍',
                    title: { ru: 'Мировые сериалы 2020+', en: 'World TV hits 2020+', uk: 'Світові серіали 2020+' },
                    request: 'discover/tv?with_origin_country=US|CA|GB|AU|IE|DE|FR|NL|SE|NO|DK|FI|ES|IT|KR|JP&sort_by=last_air_date.desc&vote_average.gte=7&vote_count.gte=500&first_air_date.gte=2020-01-01&first_air_date.lte=' + today + '&without_genres=16|99|10762|10763|10764|10766|10767|10768'
                },
                {
                    id: 'netflix_tv',
                    icon: 'N',
                    title: { ru: 'Сериалы Netflix', en: 'Netflix TV hits', uk: 'Серіали Netflix' },
                    request: 'discover/tv?with_networks=213&sort_by=last_air_date.desc&first_air_date.gte=2020-01-01&last_air_date.lte=' + today + '&vote_count.gte=500&vote_average.gte=7&without_genres=16|99|10751|10762|10763|10764|10766|10767|10768'
                },
                {
                    id: 'mini_series',
                    icon: '💎',
                    title: { ru: 'Мини-сериалы', en: 'Mini-series hits', uk: 'Мінісеріали' },
                    request: 'discover/tv?with_type=2&sort_by=popularity.desc&vote_average.gte=7&vote_count.gte=200&without_genres=10764,10767'
                }
            ];
        }

        function qs(selector, root) {
            return (root || document).querySelector(selector);
        }

        function qsa(selector, root) {
            return Array.prototype.slice.call((root || document).querySelectorAll(selector));
        }

        function langCode() {
            var raw = 'en';
            try {
                raw = String(Lampa.Storage.get('language', 'en') || 'en').toLowerCase();
            } catch (e) {}
            if (raw.indexOf('ru') === 0 || raw === 'be') return 'ru';
            if (raw.indexOf('uk') === 0 || raw === 'ua') return 'uk';
            return 'en';
        }

        function localize(value, fallback) {
            if (!value) return fallback || '';
            if (typeof value === 'string') return value;
            var lang = langCode();
            return value[lang] || value.ru || value.en || fallback || '';
        }

        function text(key) {
            var pack = cfg.copy[langCode()] || cfg.copy.en;
            return pack[key] || cfg.copy.en[key] || key;
        }

        function tr(key, fallback) {
            try {
                if (Lampa.Lang && typeof Lampa.Lang.translate === 'function') {
                    var value = Lampa.Lang.translate(key);
                    if (value && value !== key) return value;
                }
            } catch (e) {}
            return fallback || key;
        }

        function get(name, fallback) {
            try {
                if (!Lampa.Storage || typeof Lampa.Storage.get !== 'function') return fallback;
                var value = Lampa.Storage.get(name, fallback);
                return typeof value === 'undefined' ? fallback : value;
            } catch (e) {
                return fallback;
            }
        }

        function set(name, value) {
            try {
                if (Lampa.Storage && typeof Lampa.Storage.set === 'function') Lampa.Storage.set(name, value);
            } catch (e) {}
        }

        function isOn(name, fallbackOn) {
            var fallback = fallbackOn ? 'on' : 'off';
            var value = get(name, fallback);
            if (typeof value === 'boolean') return value;
            value = String(value);
            return value !== 'off' && value !== 'false' && value !== '0';
        }

        function normalizeOnOff(value, fallbackOn) {
            if (typeof value === 'undefined' || value === null || value === '') return fallbackOn ? 'on' : 'off';
            if (value === true) return 'on';
            if (value === false) return 'off';
            value = String(value).toLowerCase();
            if (value === 'undefined' || value === 'null') return fallbackOn ? 'on' : 'off';
            if (value === 'off' || value === 'false' || value === '0') return 'off';
            return 'on';
        }

        function ensureValue(name, fallback, allowed) {
            var value = get(name, undefined);
            var next = typeof value === 'undefined' || value === null || value === '' ? fallback : String(value);
            if (next === 'undefined' || next === 'null') next = fallback;
            if (allowed && allowed.indexOf(next) === -1) next = fallback;
            if (value !== next) set(name, next);
            return next;
        }

        function ensureOnOff(name, fallbackOn) {
            var value = get(name, undefined);
            var next = normalizeOnOff(value, fallbackOn);
            if (value !== next) set(name, next);
            return next;
        }

        function notify(message) {
            try {
                if (Lampa.Noty && typeof Lampa.Noty.show === 'function') Lampa.Noty.show(message);
            } catch (e) {}
        }

        function escapeHtml(value) {
            var div = document.createElement('div');
            div.appendChild(document.createTextNode(String(value || '')));
            return div.innerHTML;
        }

        function clean(value) {
            return String(value || '').replace(/\s+/g, ' ').trim();
        }

        function pluginEnabled() {
            return isOn(KEY.enabled, true);
        }

        function currentThemeName() {
            var name = String(get(KEY.theme, cfg.defaultTheme) || cfg.defaultTheme);
            return cfg.themes[name] ? name : cfg.defaultTheme;
        }

        function theme() {
            return cfg.themes[currentThemeName()] || cfg.themes[cfg.defaultTheme];
        }

        function perfMode() {
            var value = String(get(KEY.perf, 'balanced') || 'balanced');
            if (value === 'quality' || value === 'balanced' || value === 'economy') return value;
            return 'balanced';
        }

        function cardSize() {
            var value = String(get(KEY.cardSize, cfg.defaultCardSize) || cfg.defaultCardSize);
            if (value === 'sm' || value === 'md' || value === 'lg') return value;
            return cfg.defaultCardSize;
        }

        function uiScaleValue() {
            var value = String(get(KEY.uiScale, 'auto') || 'auto');
            if (value === 'off' || value === 'auto') return value;
            if (/^(12|14|16|18|20|22|24|28|32)$/.test(value)) return value;
            return 'auto';
        }

        function viewportWidth() {
            try {
                if (window.visualViewport && window.visualViewport.width) return window.visualViewport.width;
            } catch (e) {}
            return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 1920;
        }

        function autoUiScale() {
            var width = viewportWidth();
            if (width < 1160) return '12';
            if (width < 1360) return '14';
            if (width < 1600) return '16';
            if (width < 1920) return '18';
            if (width < 2560) return '20';
            if (width < 3200) return '22';
            if (width < 3840) return '24';
            if (width < 4480) return '28';
            return '32';
        }

        function appliedUiScale() {
            var value = uiScaleValue();
            if (value === 'off') return '';
            return value === 'auto' ? autoUiScale() : value;
        }

        function topbarAlign() {
            var value = String(get(KEY.topbarAlign, 'start') || 'start');
            return value === 'center' ? 'center' : 'start';
        }

        function brandName() {
            var value = clean(get(KEY.brandName, cfg.brand) || cfg.brand);
            return value || cfg.brand;
        }

        function setBrandNameValue(value) {
            value = clean(value);
            if (!value) value = cfg.brand;
            set(KEY.brandName, value);
            schedulePatch(true);
        }

        function openBrandNameInput() {
            var current = brandName();
            var title = brandNameSettingName();
            var result;
            try {
                result = window.prompt(title, current);
            } catch (e) {
                result = null;
            }
            if (result !== null && typeof result !== 'undefined') setBrandNameValue(result);
        }

        function tmdbKey() {
            try {
                if (Lampa.TMDB && typeof Lampa.TMDB.key === 'function') return Lampa.TMDB.key();
            } catch (e) {}
            return cfg.tmdbKey;
        }

        function tmdbImage(path, size) {
            if (!path) return '';
            if (/^https?:\/\//i.test(String(path))) return String(path);
            var normalized = String(path).charAt(0) === '/' ? String(path) : '/' + String(path);
            normalized = normalized.replace(/\.svg$/i, '.png');
            var target = size || 'w780';
            try {
                if (Lampa.TMDB && typeof Lampa.TMDB.image === 'function') {
                    return Lampa.TMDB.image('/t/p/' + target + normalized);
                }
            } catch (e) {}
            return 'https://image.tmdb.org/t/p/' + target + normalized;
        }

        function tmdbApi(path) {
            try {
                if (Lampa.TMDB && typeof Lampa.TMDB.api === 'function') return Lampa.TMDB.api(path);
            } catch (e) {}
            var cleanPath = String(path || '').replace(/^\/+/, '');
            return 'https://api.themoviedb.org/3/' + cleanPath;
        }

        function movieType(item) {
            if (!item) return 'movie';
            if (item.media_type === 'tv' || item.name || item.first_air_date) return 'tv';
            return 'movie';
        }

        function movieTitle(item, fallback) {
            return clean((item && (item.title || item.name || item.original_title || item.original_name)) || fallback || '');
        }

        function movieYear(item) {
            var date = item && (item.release_date || item.first_air_date);
            return date ? String(date).slice(0, 4) : '';
        }

        function movieKey(item) {
            if (!item) return '';
            return movieType(item) + ':' + (item.id || movieTitle(item, ''));
        }

        function mediaBadge(item) {
            var type = movieType(item);
            var lang = langCode();
            if (type === 'tv') {
                if (lang === 'en') return 'Series';
                if (lang === 'uk') return '\u0421\u0435\u0440\u0456\u0430\u043b';
                return '\u0421\u0435\u0440\u0438\u0430\u043b';
            }
            if (lang === 'en') return 'Movie';
            if (lang === 'uk') return '\u0424\u0456\u043b\u044c\u043c';
            return '\u0424\u0438\u043b\u044c\u043c';
        }

        function genreNames(item) {
            var out = [];
            if (!item) return out;
            if (item.genres && item.genres.length) {
                item.genres.forEach(function (genre) {
                    if (genre && genre.name) out.push(genre.name);
                });
                return out;
            }
            var map = GENRES[langCode()] || GENRES.en;
            if (item.genre_ids && item.genre_ids.length) {
                item.genre_ids.slice(0, 3).forEach(function (id) {
                    if (map[id]) out.push(map[id]);
                });
            }
            return out;
        }

        function bulletJoin(items) {
            return (items || []).filter(Boolean).join(' \u2022 ');
        }

        function mergeMovieData(item, details) {
            var merged = {};
            try { Object.assign(merged, item || {}, details || {}); } catch (e) {}
            return merged;
        }

        function countryLabel(code) {
            code = String(code || '').toUpperCase();
            var ru = {
                US: '\u0421\u0428\u0410',
                RU: '\u0420\u043e\u0441\u0441\u0438\u044f',
                GB: '\u0412\u0435\u043b\u0438\u043a\u043e\u0431\u0440\u0438\u0442\u0430\u043d\u0438\u044f',
                FR: '\u0424\u0440\u0430\u043d\u0446\u0438\u044f',
                DE: '\u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044f',
                KR: '\u042e\u0436\u043d\u0430\u044f \u041a\u043e\u0440\u0435\u044f',
                JP: '\u042f\u043f\u043e\u043d\u0438\u044f',
                CN: '\u041a\u0438\u0442\u0430\u0439',
                CA: '\u041a\u0430\u043d\u0430\u0434\u0430',
                AU: '\u0410\u0432\u0441\u0442\u0440\u0430\u043b\u0438\u044f',
                ES: '\u0418\u0441\u043f\u0430\u043d\u0438\u044f',
                IT: '\u0418\u0442\u0430\u043b\u0438\u044f',
                IN: '\u0418\u043d\u0434\u0438\u044f',
                TR: '\u0422\u0443\u0440\u0446\u0438\u044f',
                UA: '\u0423\u043a\u0440\u0430\u0438\u043d\u0430'
            };
            if (langCode() === 'ru' && ru[code]) return ru[code];
            return code;
        }

        function movieCountries(item) {
            var out = [];
            function push(code, name) {
                var value = (langCode() === 'ru' && code) ? countryLabel(code) : (name || countryLabel(code));
                if (value && out.indexOf(value) === -1) out.push(value);
            }
            if (!item) return out;
            if (item.production_countries && item.production_countries.length) {
                item.production_countries.forEach(function (country) {
                    if (country) push(country.iso_3166_1, country.name);
                });
            }
            if (!out.length && item.origin_country && item.origin_country.length) {
                item.origin_country.forEach(function (country) { push(country); });
            }
            if (!out.length && item.production_country) push(item.production_country);
            return out;
        }

        function movieRuntime(item) {
            if (!item) return '';
            var value = item.runtime || item.duration || item.time || '';
            if (!value && item.episode_run_time && item.episode_run_time.length) value = item.episode_run_time[0];
            if (!value) return '';
            if (typeof value === 'string' && value.indexOf(':') > -1) return value;
            value = parseInt(value, 10);
            if (!value || value < 1) return '';
            var hours = Math.floor(value / 60);
            var minutes = value % 60;
            return (hours ? String(hours).padStart(2, '0') + ':' : '00:') + String(minutes).padStart(2, '0');
        }

        function movieQuality(item, card) {
            var candidates = [
                item && item.quality,
                item && item.video_quality,
                item && item.source_quality,
                item && item.release_quality
            ];
            if (card) {
                var node = qs('.card__quality, .quality, .card__type', card);
                if (node) candidates.push(node.textContent);
            }
            for (var i = 0; i < candidates.length; i++) {
                var value = clean(candidates[i]);
                if (value && value.length < 18) return value.toUpperCase();
            }
            return '';
        }

        function certificationFromDetails(details, type) {
            if (!details) return '';
            var wanted = ['RU', 'US'];
            if (type === 'tv' && details.content_ratings && details.content_ratings.results) {
                for (var w = 0; w < wanted.length; w++) {
                    for (var i = 0; i < details.content_ratings.results.length; i++) {
                        var item = details.content_ratings.results[i];
                        if (item && item.iso_3166_1 === wanted[w] && item.rating) return item.rating;
                    }
                }
            }
            if (details.release_dates && details.release_dates.results) {
                for (var rw = 0; rw < wanted.length; rw++) {
                    for (var r = 0; r < details.release_dates.results.length; r++) {
                        var group = details.release_dates.results[r];
                        if (!group || group.iso_3166_1 !== wanted[rw] || !group.release_dates) continue;
                        for (var d = 0; d < group.release_dates.length; d++) {
                            if (group.release_dates[d].certification) return group.release_dates[d].certification;
                        }
                    }
                }
            }
            return '';
        }

        function ratingValue(item, keys) {
            for (var i = 0; i < keys.length; i++) {
                var value = parseFloat(item && item[keys[i]]);
                if (value > 0) return value.toFixed(1);
            }
            return '';
        }

        function detailInfo(item, details, card) {
            var data = mergeMovieData(item, details);
            var year = movieYear(data);
            var countries = movieCountries(data).slice(0, 2);
            var head = [year, countries.join(', ')].filter(Boolean).join(', ');
            var ratings = [];
            var tmdb = ratingValue(data, ['vote_average', 'tmdb_rating']);
            var imdb = ratingValue(data, ['imdb_rating', 'imdb', 'imdb_vote_average']);
            var kp = ratingValue(data, ['kp_rating', 'kinopoisk_rating', 'kinopoisk', 'rating_kp']);
            if (tmdb) ratings.push({ label: 'TMDB', value: tmdb });
            if (imdb) ratings.push({ label: 'IMDB', value: imdb });
            if (kp) ratings.push({ label: 'KP', value: kp });

            var facts = [];
            var runtime = movieRuntime(data);
            var genres = genreNames(data).slice(0, 3).join(' | ');
            var quality = movieQuality(data, card);
            var age = certificationFromDetails(details, movieType(data));
            if (runtime) facts.push(runtime);
            if (genres) facts.push(genres);
            if (age) facts.push({ age: age });
            if (quality) facts.push((langCode() === 'en' ? 'Quality: ' : '\u041a\u0430\u0447\u0435\u0441\u0442\u0432\u043e: ') + quality);
            return {
                head: head,
                ratings: ratings,
                facts: facts,
                tagline: clean(data.tagline || data.slogan || ''),
                description: clean(data.overview || item && item.overview || '') || tr('full_notext', 'Description is missing')
            };
        }

        function normalizeLogoCandidate(value) {
            if (!value) return '';
            if (typeof value === 'object') value = value.url || value.file_path || value.logo || value.path || '';
            value = String(value || '');
            if (!value || value === 'null' || value === 'none') return '';
            if (/^https?:\/\//i.test(value) || /^data:image\//i.test(value)) return value;
            if (value.charAt(0) === '/') return tmdbImage(value.replace(/\.svg$/i, '.png'), 'w500');
            return '';
        }

        function directLogo(item) {
            if (!item) return '';
            var direct = [item.logo, item.logo_path, item.clearlogo, item.clear_logo, item.img_logo, item.image_logo];
            if (item.images) direct.push(item.images.logo, item.images.clearlogo, item.images.clear_logo);
            if (item.logos && item.logos.length) direct.push(item.logos[0]);
            for (var i = 0; i < direct.length; i++) {
                var found = normalizeLogoCandidate(direct[i]);
                if (found) return found;
            }
            return '';
        }

        function pickLogo(logos, lang) {
            if (!logos || !logos.length) return '';
            var sorted = logos.slice().sort(function (a, b) {
                var ap = String((a && a.file_path) || '').toLowerCase();
                var bp = String((b && b.file_path) || '').toLowerCase();
                var as = ap.indexOf('.svg') > -1;
                var bs = bp.indexOf('.svg') > -1;
                return as === bs ? 0 : (as ? 1 : -1);
            });
            var wanted = [lang];
            if (lang === 'uk' || lang === 'ua') wanted.push('ru');
            if (lang !== 'en') wanted.push('en');
            wanted.push(null);
            for (var w = 0; w < wanted.length; w++) {
                for (var i = 0; i < sorted.length; i++) {
                    if (!sorted[i] || !sorted[i].file_path) continue;
                    if (sorted[i].iso_639_1 === wanted[w]) return sorted[i].file_path;
                }
            }
            return sorted[0] && sorted[0].file_path ? sorted[0].file_path : '';
        }

        function textLogo(title) {
            title = clean(title || cfg.brand || 'AKIRA');
            var shortTitle = title.length > 34 ? title.slice(0, 32) + '..' : title;
            var size = shortTitle.length > 18 ? 68 : 86;
            var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="260" viewBox="0 0 900 260">' +
                '<defs><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000" flood-opacity=".55"/></filter></defs>' +
                '<rect width="900" height="260" fill="none"/>' +
                '<text x="22" y="156" fill="#fff" font-family="Arial Black, Arial, sans-serif" font-size="' + size + '" font-weight="900" letter-spacing="0" filter="url(#s)">' +
                escapeHtml(shortTitle).replace(/&nbsp;/g, ' ') +
                '</text></svg>';
            return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        }

        function logoLang() {
            var forced = String(get(KEY.logoLang, 'auto') || 'auto').toLowerCase();
            if (forced === 'ru' || forced === 'en' || forced === 'uk') return forced;
            return langCode();
        }

        function tmdbLanguage() {
            return langCode() === 'en' ? 'en-US' : (langCode() === 'uk' ? 'uk-UA' : 'ru-RU');
        }

        function resolveLogoItem(item, done) {
            if (!item) {
                done(null);
                return;
            }
            if (item.id) {
                done(item);
                return;
            }

            var title = movieTitle(item, '');
            if (!title) {
                done(null);
                return;
            }

            var type = movieType(item);
            var year = movieYear(item);
            var lang = tmdbLanguage();
            var cacheKey = type + ':' + title.toLowerCase() + ':' + year + ':' + lang;
            if (Object.prototype.hasOwnProperty.call(logoResolveCache, cacheKey)) {
                done(logoResolveCache[cacheKey]);
                return;
            }
            if (logoResolvePending[cacheKey]) {
                logoResolvePending[cacheKey].push(done);
                return;
            }
            logoResolvePending[cacheKey] = [done];

            function flush(found) {
                logoResolveCache[cacheKey] = found || null;
                var queue = logoResolvePending[cacheKey] || [];
                delete logoResolvePending[cacheKey];
                queue.forEach(function (cb) {
                    try { cb(logoResolveCache[cacheKey]); } catch (e) {}
                });
            }

            function query(kind, callback) {
                var params = 'api_key=' + encodeURIComponent(tmdbKey()) +
                    '&query=' + encodeURIComponent(title) +
                    '&language=' + encodeURIComponent(lang) +
                    '&include_adult=false';
                if (year) params += kind === 'tv' ? '&first_air_date_year=' + encodeURIComponent(year) : '&year=' + encodeURIComponent(year);
                var url = tmdbApi('search/' + kind + '?' + params);

                function success(json) {
                    var list = json && json.results ? json.results : [];
                    var picked = list && list.length ? list[0] : null;
                    if (picked) picked.media_type = kind;
                    callback(picked || null);
                }

                function fail() {
                    callback(null);
                }

                try {
                    if (window.$ && typeof $.get === 'function') {
                        $.get(url, success).fail(fail);
                        return;
                    }
                } catch (e) {}

                if (typeof fetch === 'function') {
                    fetch(url).then(function (response) {
                        return response.json();
                    }).then(success).catch(fail);
                } else {
                    fail();
                }
            }

            query(type, function (found) {
                if (found) {
                    flush(found);
                    return;
                }
                query(type === 'tv' ? 'movie' : 'tv', flush);
            });
        }

        function fetchLogo(item, done) {
            var direct = directLogo(item);
            if (direct) {
                done(direct);
                return;
            }
            if (!item || !item.id) {
                resolveLogoItem(item, function (resolved) {
                    if (resolved && resolved.id) fetchLogo(resolved, done);
                    else done('');
                });
                return;
            }

            var type = movieType(item);
            var lang = logoLang();
            var cacheKey = type + ':' + item.id + ':' + lang;
            if (Object.prototype.hasOwnProperty.call(logoCache, cacheKey)) {
                done(logoCache[cacheKey]);
                return;
            }
            if (logoPending[cacheKey]) {
                logoPending[cacheKey].push(done);
                return;
            }
            logoPending[cacheKey] = [done];

            var langs = [lang];
            if (lang === 'uk' || lang === 'ua') langs.push('ru');
            if (lang !== 'en') langs.push('en');
            langs.push('null');

            var path = type + '/' + item.id + '/images?api_key=' + encodeURIComponent(tmdbKey()) + '&include_image_language=' + langs.join(',');
            var url = tmdbApi(path);

            function success(json) {
                var logo = '';
                var picked = json && json.logos ? pickLogo(json.logos, lang) : '';
                if (picked) logo = tmdbImage(picked, 'w500');
                logoCache[cacheKey] = logo;
                flushLogo(cacheKey, logo);
            }

            function fail() {
                logoCache[cacheKey] = '';
                flushLogo(cacheKey, '');
            }

            try {
                if (window.$ && typeof $.get === 'function') {
                    $.get(url, success).fail(fail);
                    return;
                }
            } catch (e) {}

            if (typeof fetch === 'function') {
                fetch(url).then(function (response) {
                    return response.json();
                }).then(success).catch(fail);
            } else {
                fail();
            }
        }

        function flushLogo(cacheKey, logo) {
            var queue = logoPending[cacheKey] || [];
            delete logoPending[cacheKey];
            queue.forEach(function (cb) {
                try { cb(logo); } catch (e) {}
            });
        }

        function fetchDetails(item, done) {
            if (!item || !item.id) {
                done(null);
                return;
            }
            var type = movieType(item);
            var lang = tmdbLanguage();
            var cacheKey = type + ':' + item.id + ':' + lang;
            if (Object.prototype.hasOwnProperty.call(detailsCache, cacheKey)) {
                done(detailsCache[cacheKey]);
                return;
            }
            if (detailsPending[cacheKey]) {
                detailsPending[cacheKey].push(done);
                return;
            }
            detailsPending[cacheKey] = [done];

            var append = type === 'tv' ? 'content_ratings' : 'release_dates';
            var path = type + '/' + item.id + '?api_key=' + encodeURIComponent(tmdbKey()) + '&language=' + encodeURIComponent(lang) + '&append_to_response=' + append;
            var url = tmdbApi(path);

            function success(json) {
                detailsCache[cacheKey] = json || null;
                flushDetails(cacheKey, detailsCache[cacheKey]);
            }

            function fail() {
                detailsCache[cacheKey] = null;
                flushDetails(cacheKey, null);
            }

            try {
                if (window.$ && typeof $.get === 'function') {
                    $.get(url, success).fail(fail);
                    return;
                }
            } catch (e) {}

            fetch(url).then(function (response) {
                return response.json();
            }).then(success).catch(fail);
        }

        function flushDetails(cacheKey, details) {
            var queue = detailsPending[cacheKey] || [];
            delete detailsPending[cacheKey];
            queue.forEach(function (cb) {
                try { cb(details); } catch (e) {}
            });
        }

        function extractCardData(card) {
            if (!card) return null;
            try { if (card.card_data) return card.card_data; } catch (e) {}
            try { if (card.data) return card.data; } catch (e) {}
            try { if (card.movie) return card.movie; } catch (e) {}
            try { if (card._data) return card._data; } catch (e) {}
            try {
                if (window.$) {
                    var data = $(card).data('card') || $(card).data('json') || $(card).data('item');
                    if (data) return data;
                }
            } catch (e) {}
            return null;
        }

        function backdrop(item, size) {
            if (!item) return '';
            if (item.backdrop_path) return tmdbImage(item.backdrop_path, size || 'w1280');
            if (item.poster_path) return tmdbImage(item.poster_path, size || 'w780');
            return '';
        }

        function setImage(img, url) {
            if (!img || !url) return;
            if (img.tagName === 'IMG') {
                if (!img.hasAttribute('data-akira-original-src')) img.setAttribute('data-akira-original-src', img.getAttribute('src') || '');
                img.src = url;
                img.style.objectFit = 'cover';
                img.style.objectPosition = 'center';
            } else {
                if (!img.hasAttribute('data-akira-original-bg')) img.setAttribute('data-akira-original-bg', img.style.backgroundImage || '');
                img.style.backgroundImage = 'url(' + url + ')';
                img.style.backgroundSize = 'cover';
                img.style.backgroundPosition = 'center';
            }
        }

        function preloadImage(url, done) {
            if (!url) {
                done('');
                return;
            }
            var img = new Image();
            img.onload = function () { done(url); };
            img.onerror = function () { done(''); };
            img.src = url;
        }

        function restoreCard(card) {
            if (!card) return;
            var img = qs('.card__img', card);
            if (img) {
                var originalSrc = img.getAttribute('data-akira-original-src');
                var originalBg = img.getAttribute('data-akira-original-bg');
                if (originalSrc !== null && img.tagName === 'IMG') img.src = originalSrc;
                if (originalBg !== null) img.style.backgroundImage = originalBg;
                img.style.objectFit = '';
                img.style.objectPosition = '';
                img.style.backgroundSize = '';
                img.style.backgroundPosition = '';
                img.removeAttribute('data-akira-original-src');
                img.removeAttribute('data-akira-original-bg');
            }
            qsa('.akira-card-overlay, .akira-card-badge, .akira-card-rating', card).forEach(function (node) { node.remove(); });
            card.removeAttribute('data-akira-card-key');
        }

        function processCard(card) {
            if (!card || !isOn(KEY.cards, true)) return;
            var item = extractCardData(card);
            if (!item) return;
            var key = movieKey(item);
            if (key && card.getAttribute('data-akira-card-key') === key) return;
            restoreCard(card);
            if (key) card.setAttribute('data-akira-card-key', key);

            var img = qs('.card__img', card);
            var bg = backdrop(item, 'w780');
            if (img && bg) setImage(img, bg);

            var view = qs('.card__view', card);
            if (!view) return;

            var title = movieTitle(item, qs('.card__title', card) ? qs('.card__title', card).textContent : '');
            var meta = [];
            var year = movieYear(item);
            var vote = parseFloat(item.vote_average || 0);
            if (year) meta.push(year);
            genreNames(item).slice(0, 2).forEach(function (name) { meta.push(name); });

            var overlay = document.createElement('div');
            overlay.className = 'akira-card-overlay';
            overlay.innerHTML =
                '<div class="akira-card-overlay__title">' + escapeHtml(title || '') + '</div>' +
                (meta.length ? '<div class="akira-card-overlay__meta">' + escapeHtml(meta.join(' • ')) + '</div>' : '');
            view.appendChild(overlay);

            if (isOn(KEY.cardLogo, true)) {
                var requestKey = key;
                fetchLogo(item, function (url) {
                    if (card.getAttribute('data-akira-card-key') !== requestKey) return;
                    var titleNode = qs('.akira-card-overlay__title', overlay);
                    if (!titleNode) return;
                    url = url || textLogo(title);
                    var logo = document.createElement('img');
                    logo.className = 'akira-card-overlay__logo';
                    logo.alt = title || '';
                    logo.loading = 'lazy';
                    logo.onload = function () {
                        if (card.getAttribute('data-akira-card-key') !== requestKey) return;
                        titleNode.style.transition = 'opacity 0.18s ease';
                        titleNode.style.opacity = '0';
                        setTimeout(function () {
                            if (card.getAttribute('data-akira-card-key') !== requestKey) return;
                            titleNode.replaceWith(logo);
                            logo.style.opacity = '0';
                            logo.style.transition = 'opacity 0.28s ease';
                            requestAnimationFrame(function () {
                                requestAnimationFrame(function () { logo.style.opacity = '1'; });
                            });
                        }, 180);
                    };
                    logo.onerror = function () {
                        titleNode.style.opacity = '';
                        titleNode.style.transition = '';
                    };
                    logo.src = url;
                });
            }

            var badge = document.createElement('div');
            badge.className = 'akira-card-badge';
            badge.textContent = mediaBadge(item);
            view.appendChild(badge);

            if (vote > 0) {
                var rating = document.createElement('div');
                rating.className = 'akira-card-rating';
                rating.textContent = vote.toFixed(1);
                view.appendChild(rating);
            }
        }

        function extractEpisodeShowInfo(card, data) {
            if (data) {
                if (data.serial && data.serial.id) return { id: data.serial.id, name: data.serial.name || data.serial.original_name || '', media_type: 'tv' };
                if (data.show && data.show.id) return { id: data.show.id, name: data.show.name || data.show.original_name || '', media_type: 'tv' };
                if (data.tv && data.tv.id) return { id: data.tv.id, name: data.tv.name || data.tv.original_name || '', media_type: 'tv' };
                if (data.tv_id) return { id: data.tv_id, name: data.tv_name || data.name || '', media_type: 'tv' };
                if (data.source_id) return { id: data.source_id, name: data.source_name || '', media_type: 'tv' };
                if (data.id && (data.name || data.original_name) && (data.first_air_date || data.episode_run_time || data.number_of_seasons)) {
                    return { id: data.id, name: data.name || data.original_name, media_type: 'tv' };
                }
            }
            var title = qs('.card-episode__footer .card__title, .full-episode__footer .card__title, .card__title', card);
            return title ? { id: null, name: clean(title.textContent), media_type: 'tv' } : null;
        }

        function processEpisodeCard(card) {
            if (!card || !isOn(KEY.cards, true)) return;
            if (card.getAttribute('data-akira-episode') === '1') return;
            var data = extractCardData(card) || {};
            var body = qs('.full-episode__body', card);
            if (!body) return;
            card.setAttribute('data-akira-episode', '1');

            var image = qs('.full-episode__img, .card__img', card);
            var imageUrl = '';
            if (data.backdrop_path) imageUrl = tmdbImage(data.backdrop_path, 'w780');
            else if (data.still_path) imageUrl = tmdbImage(data.still_path, 'w780');
            if (image && imageUrl) setImage(image, imageUrl);

            var fullEpisode = qs('.full-episode', card);
            var numberNode = qs('.full-episode__num', card);
            if (fullEpisode && numberNode && numberNode.parentNode !== fullEpisode) fullEpisode.appendChild(numberNode);

            var show = extractEpisodeShowInfo(card, data);
            if (!show || (!show.id && !show.name)) return;
            if (qs('.akira-episode-logo, .akira-episode-title', body)) return;

            var titleNode = document.createElement('div');
            titleNode.className = 'akira-episode-title';
            titleNode.textContent = show.name || '';
            if (titleNode.textContent) body.insertBefore(titleNode, body.firstChild);

            if (show.id && isOn(KEY.cardLogo, true)) {
                fetchLogo(show, function (url) {
                    var host = qs('.full-episode__body', card);
                    if (!host) return;
                    var existing = qs('.akira-episode-title', host);
                    url = url || textLogo(show.name || '');
                    var logo = document.createElement('img');
                    logo.className = 'akira-episode-logo';
                    logo.alt = show.name || '';
                    logo.loading = 'lazy';
                    logo.onload = function () {
                        if (existing && existing.parentNode) existing.replaceWith(logo);
                        else host.insertBefore(logo, host.firstChild);
                    };
                    logo.onerror = function () { if (existing) existing.style.display = ''; };
                    logo.src = url;
                });
            }
        }

        function processCards(root) {
            if (!root || !pluginEnabled()) return;
            qsa('.card', root).forEach(processCard);
            qsa('.card-episode', root).forEach(processEpisodeCard);
        }

        function activeContentHost() {
            return qs('.activity--active .activity__body') ||
                qs('.activity--active .scroll__content') ||
                qs('.activity--active .scroll__body') ||
                qs('.activity--active');
        }

        function activeCard() {
            return qs('.activity--active .card.focus') ||
                qs('.activity--active .card.hover') ||
                qs('.activity--active .card.traverse') ||
                qs('.activity--active .items-cards .card') ||
                qs('.activity--active .items-line .card');
        }

        function heroInsertPoint(host) {
            if (!host) return null;
            var children = host.children || [];
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (!child || !child.classList) continue;
                if (child.classList.contains('items-line') ||
                    child.classList.contains('scroll__content') ||
                    child.classList.contains('scroll__body') ||
                    child.classList.contains('items-cards') ||
                    child.classList.contains('mapping--grid')) {
                    return child;
                }
            }
            return host.firstElementChild || host.firstChild;
        }

        function ensureHero() {
            if (!pluginEnabled() || !isOn(KEY.hero, true)) {
                removeHero();
                return null;
            }
            if (qs('.activity--active .full-start, .activity--active .full-start-new')) {
                removeHero();
                return null;
            }
            var host = activeContentHost();
            if (!host || !qs('.card', host)) return null;
            host.classList.add('akira-home-host');

            if (!state.hero) {
                var hero = document.createElement('div');
                hero.className = 'akira-hero is-entering';
                hero.innerHTML =
                    '<img class="akira-hero__bg akira-hero__bg--current" alt="">' +
                    '<img class="akira-hero__bg akira-hero__bg--next" alt="">' +
                    '<div class="akira-hero__shade"></div>' +
                    '<div class="akira-hero__content">' +
                    '  <div class="akira-hero__head"></div>' +
                    '  <img class="akira-hero__logo" alt="">' +
                    '  <div class="akira-hero__title"></div>' +
                    '  <div class="akira-hero__tagline"></div>' +
                    '  <div class="akira-hero__ratings"></div>' +
                    '  <div class="akira-hero__facts"></div>' +
                    '  <div class="akira-hero__desc"><div class="akira-hero__desc-text"></div></div>' +
                    '</div>';
                state.hero = hero;
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        hero.classList.remove('is-entering');
                    });
                });
            }

            if (state.hero.parentNode !== host) {
                host.insertBefore(state.hero, heroInsertPoint(host));
            } else if (host.firstElementChild !== state.hero) {
                host.insertBefore(state.hero, heroInsertPoint(host));
            }
            return state.hero;
        }

        function removeHero() {
            if (state.heroDelay) {
                clearTimeout(state.heroDelay);
                state.heroDelay = null;
            }
            if (state.hero && state.hero.parentNode) state.hero.parentNode.removeChild(state.hero);
            state.hero = null;
            state.heroKey = '';
            state.heroTargetKey = '';
        }

        function updateHero() {
            var hero = ensureHero();
            if (!hero) return;
            var card = activeCard();
            if (!card) return;
            state.lastCard = card;
            var item = extractCardData(card);
            if (!item) return;
            var key = movieKey(item);
            if (!key || key === state.heroKey || key === state.heroTargetKey) return;
            state.heroTargetKey = key;

            var title = movieTitle(item, '');
            var bg = backdrop(item, 'w1280');
            var vote = parseFloat(item.vote_average || 0);
            var meta = [];
            var year = movieYear(item);
            if (year) meta.push(year);
            if (vote > 0) meta.push(vote.toFixed(1) + ' TMDB');
            var genres = genreNames(item).slice(0, 3).join(' • ');
            if (genres) meta.push(genres);

            var currentBg = qs('.akira-hero__bg--current', hero) || qs('.akira-hero__bg', hero);
            var nextBg = qs('.akira-hero__bg--next', hero);
            var logoNode = qs('.akira-hero__logo', hero);
            var titleNode = qs('.akira-hero__title', hero);
            var headNode = qs('.akira-hero__head', hero);
            var taglineNode = qs('.akira-hero__tagline', hero);
            var ratingsNode = qs('.akira-hero__ratings', hero);
            var factsNode = qs('.akira-hero__facts', hero);
            var descNode = qs('.akira-hero__desc', hero);
            var descTextNode = qs('.akira-hero__desc-text', hero) || descNode;
            var metaNode = { textContent: '' };

            var requestId = ++state.heroReq;
            if (state.heroDelay) clearTimeout(state.heroDelay);
            hero.classList.add('is-changing');

            state.heroDelay = setTimeout(function () {
                if (requestId !== state.heroReq || state.heroTargetKey !== key) return;

                var ready = { bg: '', logo: '', details: null };
                var wait = 3;

                function done(part, value) {
                    ready[part] = value || '';
                    wait -= 1;
                    if (wait > 0) return;
                    if (requestId !== state.heroReq || state.heroTargetKey !== key) return;

                    titleNode.textContent = title;
                    titleNode.style.display = '';
                    titleNode.style.opacity = '';
                    titleNode.style.transition = '';
                    metaNode.textContent = meta.join(' • ');
                    descNode.textContent = clean(item.overview || '') || tr('full_notext', 'Description is missing');
                    var info = detailInfo(item, ready.details, card);
                    if (headNode) headNode.textContent = info.head || '';
                    if (taglineNode) {
                        taglineNode.textContent = info.tagline ? '\u00ab' + info.tagline + '\u00bb' : '';
                        taglineNode.style.display = info.tagline ? '' : 'none';
                    }
                    if (ratingsNode) {
                        ratingsNode.innerHTML = info.ratings.map(function (rating) {
                            return '<span class="akira-hero__rating"><b>' + escapeHtml(rating.value) + '</b><span>' + escapeHtml(rating.label) + '</span></span>';
                        }).join('');
                    }
                    if (factsNode) {
                        factsNode.innerHTML = info.facts.map(function (fact) {
                            if (fact && typeof fact === 'object' && fact.age) return '<span class="akira-hero__age">' + escapeHtml(fact.age) + '</span>';
                            return '<span>' + escapeHtml(fact) + '</span>';
                        }).join('<i></i>');
                    }
                    if (descNode) {
                        descNode.classList.toggle('is-scrollable', info.description.length > 155);
                        descNode.innerHTML = '<div class="akira-hero__desc-text"></div>';
                        descTextNode = qs('.akira-hero__desc-text', hero) || descNode;
                    }
                    if (descTextNode) descTextNode.textContent = info.description;

                    logoNode.style.display = 'none';
                    logoNode.style.opacity = '0';
                    logoNode.style.transition = '';
                    logoNode.removeAttribute('src');
                    if (ready.logo && isOn(KEY.heroLogo, true)) {
                        logoNode.onload = function () {
                            if (requestId !== state.heroReq || state.heroTargetKey !== key) return;
                            titleNode.style.transition = 'opacity 0.2s ease';
                            titleNode.style.opacity = '0';
                            setTimeout(function () {
                                if (requestId !== state.heroReq || state.heroTargetKey !== key) return;
                                titleNode.style.display = 'none';
                                logoNode.style.display = 'block';
                                logoNode.style.transition = 'opacity 0.35s ease';
                                requestAnimationFrame(function () {
                                    requestAnimationFrame(function () { logoNode.style.opacity = '1'; });
                                });
                            }, 200);
                        };
                        logoNode.onerror = function () {
                            logoNode.style.display = 'none';
                            titleNode.style.display = '';
                            titleNode.style.opacity = '';
                            titleNode.style.transition = '';
                        };
                        logoNode.src = ready.logo;
                    }

                    if (currentBg && ready.bg) {
                        if (nextBg) {
                            nextBg.src = ready.bg;
                            nextBg.classList.add('is-loaded');
                            requestAnimationFrame(function () {
                                if (requestId !== state.heroReq || state.heroTargetKey !== key) return;
                                nextBg.classList.add('is-visible');
                            });
                            setTimeout(function () {
                                if (requestId !== state.heroReq || state.heroKey !== key) return;
                                nextBg.classList.remove('akira-hero__bg--next');
                                nextBg.classList.add('akira-hero__bg--current');
                                nextBg.classList.remove('is-visible');
                                currentBg.classList.remove('akira-hero__bg--current');
                                currentBg.classList.add('akira-hero__bg--next');
                                currentBg.classList.remove('is-loaded');
                                currentBg.removeAttribute('src');
                                currentBg = nextBg;
                                nextBg = qs('.akira-hero__bg--next', hero);
                            }, perfMode() === 'economy' ? 120 : 520);
                        } else {
                            currentBg.src = ready.bg;
                            currentBg.classList.add('is-loaded');
                        }
                    } else if (currentBg) {
                        currentBg.removeAttribute('src');
                        currentBg.classList.remove('is-loaded');
                    }

                    state.heroKey = key;
                    state.heroTargetKey = '';
                    hero.classList.remove('is-changing');
                }

                preloadImage(bg, function (url) { done('bg', url); });
                if (isOn(KEY.heroLogo, true)) {
                    fetchLogo(item, function (url) {
                        preloadImage(url || textLogo(title), function (logoUrl) { done('logo', logoUrl); });
                    });
                } else {
                    done('logo', '');
                }
                fetchDetails(item, function (details) { done('details', details); });
            }, perfMode() === 'economy' ? 120 : 320);
            return;

            state.heroDelay = setTimeout(function () {
                if (requestId !== state.heroReq || state.heroKey !== key) return;

                if (bgNode && bg) {
                    var probe = new Image();
                    probe.onload = function () {
                        if (requestId !== state.heroReq || state.heroKey !== key) return;
                        bgNode.src = bg;
                        bgNode.classList.add('is-loaded');
                    };
                    probe.onerror = function () {
                        if (requestId !== state.heroReq || state.heroKey !== key) return;
                        bgNode.src = bg || '';
                    };
                    probe.src = bg;
                } else if (bgNode) {
                    bgNode.removeAttribute('src');
                    bgNode.classList.remove('is-loaded');
                }
            titleNode.textContent = title;
            titleNode.style.display = 'block';
            metaNode.textContent = meta.join(' • ');
            descNode.textContent = clean(item.overview || '') || tr('full_notext', 'Description is missing');
            logoNode.style.display = 'none';
            logoNode.removeAttribute('src');
            hero.classList.remove('is-changing');

            if (isOn(KEY.heroLogo, true)) {
                fetchLogo(item, function (url) {
                    if (requestId !== state.heroReq || state.heroKey !== key) return;
                    url = url || textLogo(title);
                    logoNode.onload = function () {
                        if (requestId !== state.heroReq || state.heroKey !== key) return;
                        logoNode.style.display = 'block';
                        titleNode.style.display = 'none';
                    };
                    logoNode.onerror = function () {
                        logoNode.style.display = 'none';
                        titleNode.style.display = 'block';
                    };
                    logoNode.src = url;
                });
            }
            }, perfMode() === 'economy' ? 120 : 320);
        }

        function startHeroLoop() {
            if (heroTimer) return;
            heroTimer = setInterval(function () {
                if (pluginEnabled() && isOn(KEY.hero, true)) updateHero();
            }, 700);
        }

        function stopHeroLoop() {
            if (!heroTimer) return;
            clearInterval(heroTimer);
            heroTimer = null;
        }

        function restoreFullTitle(node) {
            if (!node || (!node.classList.contains('akira-full-title') && !node.classList.contains('akira-full-title-pending'))) return;
            var original = node.getAttribute('data-akira-title') || node.textContent || '';
            node.classList.remove('akira-full-title');
            node.classList.remove('akira-full-title-pending');
            node.classList.remove('is-ready');
            node.classList.remove('is-swapping');
            node.removeAttribute('data-akira-movie-key');
            node.removeAttribute('data-akira-logo-src');
            node.style.height = '';
            node.style.overflow = '';
            node.style.removeProperty('transition');
            node.style.removeProperty('opacity');
            node.textContent = original;
        }

        function activeFullRoot() {
            return qs('.activity--active .full-start-new') || qs('.activity--active .full-start');
        }

        function syncFullBackdrop(movie) {
            var root = activeFullRoot();
            if (!root || !movie) return;
            var bg = backdrop(movie, 'original') || backdrop(movie, 'w1280');
            if (!bg) {
                var fallback = qs('.full-start-new__left img, .full-start__left img, .full-start-new__poster img, .full-start__poster img', root);
                if (fallback) bg = fallback.getAttribute('src') || '';
            }
            if (bg) root.style.setProperty('--akira-full-mobile-bg', 'url(' + bg + ')');
        }

        function updateFullFog(target) {
            if (!pluginEnabled()) return;
            var scroll = target && target.classList && target.classList.contains('scroll__body') ? target : null;
            if (!scroll && target && target.closest) scroll = target.closest('.scroll__body');
            var root = scroll && scroll.querySelector ? (scroll.querySelector('.full-start-new') || scroll.querySelector('.full-start')) : activeFullRoot();
            if (!root) return;
            var top = scroll ? scroll.scrollTop : 0;
            var opacity = Math.min(0.94, 0.58 + Math.max(0, top) / 520);
            root.style.setProperty('--akira-full-fog', String(opacity));
        }

        function prepareFullLogoImage(img) {
            img.className = 'akira-full-logo';
            img.style.opacity = '0';
        }

        function animateFullLogoSwap(node, img, key) {
            if (!node || !img) return;
            if (node.classList.contains('is-swapping')) return;
            node.classList.add('is-swapping');

            var FADE_OUT = 270;
            var MORPH    = 440;
            var FADE_IN  = 380;

            var startH = 0;
            try { startH = Math.ceil(node.getBoundingClientRect().height || 0); } catch (e) {}

            img.className = 'akira-full-logo';
            img.style.opacity = '0';
            img.style.display = 'block';

            // 1. Fade out existing text
            node.style.transition = 'opacity ' + (FADE_OUT / 1000) + 's ease';
            node.style.opacity = '0';

            setTimeout(function () {
                if ((node.getAttribute('data-akira-movie-key') || '') !== key) {
                    node.style.transition = '';
                    node.style.opacity = '';
                    node.classList.remove('is-swapping');
                    return;
                }

                // 2. Swap content while invisible
                node.innerHTML = '<div class="akira-full-logo-holder"></div>';
                var holder = qs('.akira-full-logo-holder', node);
                if (holder) holder.appendChild(img);
                node.classList.remove('akira-full-title-pending');
                node.classList.add('akira-full-title', 'is-ready');
                node.setAttribute('data-akira-logo-src', img.src || '');
                node.style.transition = 'none';
                node.style.opacity = '1';

                // 3. Measure and morph height
                node.style.overflow = 'hidden';
                node.style.boxSizing = 'border-box';
                if (startH) node.style.height = startH + 'px';
                void node.offsetHeight;

                var targetH = 0;
                try { node.style.height = 'auto'; targetH = Math.ceil(node.getBoundingClientRect().height || 0); } catch (e) {}

                if (startH && targetH && Math.abs(startH - targetH) > 4) {
                    node.style.height = startH + 'px';
                    void node.offsetHeight;
                    node.style.transition = 'height ' + (MORPH / 1000) + 's cubic-bezier(.4,0,.2,1)';
                    requestAnimationFrame(function () { node.style.height = targetH + 'px'; });
                } else {
                    node.style.height = '';
                    node.style.overflow = '';
                    node.style.boxSizing = '';
                }

                // 4. Fade in logo partway through morph
                setTimeout(function () {
                    if ((node.getAttribute('data-akira-movie-key') || '') !== key) return;
                    img.style.transition = 'opacity ' + (FADE_IN / 1000) + 's ease';
                    img.style.opacity = '1';
                }, Math.max(0, MORPH - 140));

                // 5. Cleanup
                setTimeout(function () {
                    if ((node.getAttribute('data-akira-movie-key') || '') !== key) return;
                    node.style.height = '';
                    node.style.overflow = '';
                    node.style.boxSizing = '';
                    node.style.transition = '';
                    node.style.opacity = '';
                    img.style.transition = '';
                    img.style.opacity = '';
                    node.classList.remove('is-swapping');
                }, MORPH + FADE_IN + 80);

            }, FADE_OUT);
        }

        function applyFullLogo(movie) {
            var titles = qsa('.full-start-new__title, .full-start__title');
            if (!titles.length) return;
            if (!pluginEnabled() || !isOn(KEY.fullLogo, true)) {
                titles.forEach(restoreFullTitle);
                return;
            }
            if (!movie) movie = state.fullMovie;
            syncFullBackdrop(movie);
            var fallbackTitle = titles[0].getAttribute('data-akira-title') || titles[0].textContent;
            var title = movieTitle(movie, fallbackTitle);
            var key = movieKey(movie) || title;
            if (key) state.fullMovieKey = key;

            titles.forEach(function (node) {
                if (!node.getAttribute('data-akira-title')) node.setAttribute('data-akira-title', node.textContent || title);
                if (node.getAttribute('data-akira-movie-key') === key && node.classList.contains('akira-full-title')) return;
                node.classList.add('akira-full-title-pending');
                node.setAttribute('data-akira-movie-key', key);
            });

            fetchLogo(movie, function (url) {
                url = url || textLogo(title);
                if (state.fullMovieKey && key && state.fullMovieKey !== key) return;
                qsa('.akira-full-title, .akira-full-title-pending').forEach(function (node) {
                    if ((node.getAttribute('data-akira-movie-key') || '') !== key) return;
                    if (node.classList.contains('akira-full-title') && qs('.akira-full-logo', node)) return;
                    var img = new Image();
                    img.alt = title || '';
                    prepareFullLogoImage(img);
                    img.onload = function () {
                        if ((node.getAttribute('data-akira-movie-key') || '') !== key) return;
                        if (node.getAttribute('data-akira-logo-src') === img.src && qs('.akira-full-logo', node)) return;
                        animateFullLogoSwap(node, img, key);
                    };
                    img.onerror = function () {
                        restoreFullTitle(node);
                    };
                    img.src = url;
                });
            });
        }

        function moveSplitButtons() {
            if (!pluginEnabled() || !isOn(KEY.splitButtons, true)) return;
            var root = qs('.activity--active .full-start-new') || qs('.activity--active .full-start');
            if (!root) return;
            var main = qs('.full-start-new__buttons, .full-start__buttons', root);
            if (!main) return;
            var container = qs('.buttons--container', root);

            var moved = [];
            var anchor = null;
            var allSelectors = ['.button--play', '.view--online', '.view--torrent', '.view--trailer', '.button--book', '.button--reaction', '.button--subscribe', '.button--options'];

            function doMove(button, isPrimary) {
                if (moved.indexOf(button) > -1) return;
                if (button.parentNode === main) { anchor = button; return; }
                moved.push(button);
                button.classList.remove('hide');
                if (!button.classList.contains('selector')) button.classList.add('selector');
                button.setAttribute('data-selector', 'true');
                if (!isPrimary) button.classList.add('akira-moved-button');
                if (anchor && anchor.parentNode === main && anchor.nextSibling) main.insertBefore(button, anchor.nextSibling);
                else if (anchor && anchor.parentNode === main) main.appendChild(button);
                else main.insertBefore(button, main.firstChild);
                anchor = button;
            }

            if (container) {
                allSelectors.forEach(function (sel) {
                    qsa(sel, container).forEach(function (btn) {
                        doMove(btn, sel === '.button--play' || sel === '.view--online');
                    });
                });
                container.classList.add('hide');
            }

            qsa('.button--play', main).forEach(function (btn) {
                if (btn.parentNode !== main) return;
                var hasText = (btn.textContent || '').trim();
                var hasIcon = qs('svg, img', btn);
                if (!hasText && !hasIcon) btn.style.display = 'none';
            });
        }

        function triggerEvent(node, name) {
            if (!node || !name) return false;
            try {
                if (window.$) {
                    $(node).trigger(name);
                    return true;
                }
            } catch (e) {}
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

        function normalizeAction(action) {
            var value = String(action || '').trim().toLowerCase();
            if (!value) return '';
            if (value === 'release' || value === 'releases') return 'relise';
            if (value === 'bookmarks') return 'favorite';
            if (value === 'schedule') return 'timetable';
            if (value === 'collections' || value === 'collection') return 'catalog';
            return value;
        }

        function menuItem(action) {
            return qs('.menu .menu__item.selector[data-action="' + normalizeAction(action) + '"]');
        }

        function nativeBackButton() {
            return qs('.head__backward');
        }

        function goBack() {
            var nativeBack = nativeBackButton();
            if (!nativeBack) return false;
            if (clickNode(nativeBack)) return true;
            return selectorEnter(nativeBack);
        }

        function openAction(action) {
            var normalized = normalizeAction(action);
            var nativeItem = menuItem(normalized);
            if (nativeItem && selectorEnter(nativeItem)) return true;
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
                        title: (normalized === 'movie' ? Lampa.Lang.translate('menu_movies') : normalized === 'anime' ? Lampa.Lang.translate('menu_anime') : Lampa.Lang.translate('menu_tv')) + ' - ' + String(source || '').toUpperCase(),
                        component: 'category',
                        source: normalized === 'anime' ? 'cub' : source,
                        page: 1
                    });
                    return true;
                }
                if (normalized === 'cartoon') {
                    Lampa.Activity.push({
                        url: 'movie',
                        title: Lampa.Lang.translate('menu_multmovie') + ' - ' + String(source || '').toUpperCase(),
                        component: 'category',
                        genres: 16,
                        page: 1
                    });
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
                if (Lampa.Search && typeof Lampa.Search.open === 'function') {
                    Lampa.Search.open();
                    return true;
                }
            } catch (e) {}
            return false;
        }

        function openSettings() {
            var nativeItem = menuItem('settings');
            if (nativeItem && selectorEnter(nativeItem)) return true;
            try {
                if (Lampa.Settings && typeof Lampa.Settings.create === 'function') {
                    Lampa.Settings.create(cfg.settingsComponent);
                    return true;
                }
            } catch (e) {}
            return false;
        }

        function settingsSection(name) {
            return cfg.settingsComponent + '_' + name;
        }

        function openSettingsSection(component) {
            if (!component) return false;
            try {
                if (Lampa.Settings && typeof Lampa.Settings.create === 'function') {
                    setTimeout(function () {
                        try {
                            Lampa.Settings.create(component, {
                                onBack: function () {
                                    Lampa.Settings.create(cfg.settingsComponent);
                                    schedulePatch(true);
                                }
                            });
                        } catch (e) {}
                    }, 0);
                    return true;
                }
            } catch (e) {}
            return false;
        }

        function openFavorite() {
            var nativeItem = menuItem('favorite');
            if (nativeItem && selectorEnter(nativeItem)) return true;
            try {
                if (Lampa.Activity && Lampa.Lang) {
                    Lampa.Activity.push({ component: 'bookmarks', title: Lampa.Lang.translate('settings_input_links') });
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

        function translatedMenuLabel(item) {
            var value = tr(item.labelKey, '');
            if (value && value !== item.labelKey) return value;
            return localize(item.fallback, item.action);
        }

        function availableTopbarItems() {
            var found = [];
            var seen = {};
            qsa('.menu .menu__item.selector[data-action]').forEach(function (item) {
                var action = item.getAttribute('data-action');
                if (!action || seen[action] || action === 'search' || action === 'settings') return;
                var labelNode = qs('.menu__text, .menu__item-name, .menu__item-text, .menu__item-title', item);
                var label = clean(labelNode ? labelNode.textContent : item.textContent) || action;
                seen[action] = true;
                found.push({ action: action, label: label });
            });
            TOPBAR_FALLBACK.forEach(function (item) {
                if (seen[item.action]) return;
                seen[item.action] = true;
                found.push({ action: item.action, label: translatedMenuLabel(item) });
            });
            return found;
        }

        function storedTopbarActions() {
            var value = get(KEY.topnavItems, null);
            if (value === null || typeof value === 'undefined') return cfg.defaultNav.slice();
            if (value === 'undefined' || value === 'null') return cfg.defaultNav.slice();
            if (typeof value === 'string') {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    value = value.split(',').map(function (item) { return clean(item); }).filter(Boolean);
                }
            }
            return Array.isArray(value) && value.length ? value : cfg.defaultNav.slice();
        }

        function setTopbarAction(action, enabled) {
            var order = availableTopbarItems().map(function (item) { return item.action; });
            var selected = storedTopbarActions().filter(function (item, index, arr) {
                return item && arr.indexOf(item) === index;
            });
            if (enabled && selected.indexOf(action) === -1) selected.push(action);
            if (!enabled) selected = selected.filter(function (item) { return item !== action; });
            selected.sort(function (a, b) {
                var ai = order.indexOf(a);
                var bi = order.indexOf(b);
                if (ai === -1) ai = 999;
                if (bi === -1) bi = 999;
                return ai - bi;
            });
            set(KEY.topnavItems, selected);
        }

        function selectedTopbarItems() {
            var map = {};
            availableTopbarItems().forEach(function (item) { map[item.action] = item; });
            return storedTopbarActions().map(function (action) { return map[action]; }).filter(Boolean);
        }

        function updateClock() {
            var clock = qs('.akira-topbar__clock');
            if (!clock) return;
            var date = new Date();
            clock.textContent = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
        }

        function startClock() {
            updateClock();
            if (!clockTimer) clockTimer = setInterval(updateClock, 20000);
        }

        function stopClock() {
            if (!clockTimer) return;
            clearInterval(clockTimer);
            clockTimer = null;
        }

        function openMenu() {
            try {
                if (Lampa.Controller && typeof Lampa.Controller.toggle === 'function') {
                    Lampa.Controller.toggle('menu');
                    return true;
                }
            } catch (e) {}
            return false;
        }

        function syncBrandWidth(icon) {
            if (!icon) return;
            requestAnimationFrame(function () {
                try {
                    var width = Math.ceil(icon.getBoundingClientRect().width || 0);
                    if (width > 0) document.documentElement.style.setProperty('--akira-brand-w', width + 'px');
                } catch (e) {}
            });
        }

        function patchMenuBrand(head) {
            var icon = qs('.head__menu-icon', head) || qs('.head__menu-icon');
            if (!icon) return;
            if (!icon.getAttribute('data-akira-original-html')) {
                icon.setAttribute('data-akira-original-html', icon.innerHTML || '');
            }
            try {
                if (window.$) $(icon).off('.akira');
            } catch (e) {}
            icon.removeAttribute('data-akira-bound');
            icon.classList.add('akira-head-brand');
            icon.classList.add('selector');
            icon.setAttribute('data-selector', 'true');
            icon.setAttribute('tabindex', '0');
            icon.innerHTML = '<span>' + escapeHtml(brandName()) + '</span>';
            syncBrandWidth(icon);
        }

        function restoreMenuBrand() {
            var icon = qs('.head__menu-icon.akira-head-brand');
            if (!icon) return;
            var original = icon.getAttribute('data-akira-original-html');
            if (original !== null) icon.innerHTML = original;
            icon.classList.remove('akira-head-brand');
            icon.removeAttribute('data-akira-original-html');
            icon.removeAttribute('data-akira-bound');
            try { document.documentElement.style.removeProperty('--akira-brand-w'); } catch (e) {}
            try {
                if (window.$) $(icon).off('.akira');
            } catch (e) {}
        }

        function patchTopbar() {
            var old = qs('.akira-topbar');
            if (!pluginEnabled() || !isOn(KEY.topbar, true)) {
                if (old) old.remove();
                restoreMenuBrand();
                stopClock();
                return;
            }
            var head = qs('.head__body') || qs('.head');
            if (!head) return;
            patchMenuBrand(head);
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

            if (nativeBackButton()) {
                var backButton = document.createElement('div');
                backButton.className = 'akira-topbar__item akira-topbar__icon selector';
                backButton.setAttribute('data-selector', 'true');
                backButton.setAttribute('data-role', 'back');
                backButton.setAttribute('tabindex', '0');
                backButton.innerHTML = iconBackward();
                bindAction(backButton, goBack);
                itemsNode.appendChild(backButton);
            }

            selectedTopbarItems().forEach(function (item) {
                var button = document.createElement('div');
                button.className = 'akira-topbar__item selector';
                button.setAttribute('data-selector', 'true');
                button.setAttribute('data-action', item.action);
                button.setAttribute('tabindex', '0');
                button.textContent = item.label;
                bindAction(button, function () { openAction(item.action); });
                itemsNode.appendChild(button);
            });

            [
                { role: 'search', icon: iconSearch(), handler: openSearch },
                { role: 'favorite', icon: iconBookmark(), handler: openFavorite },
                { role: 'settings', icon: iconSettings(), handler: openSettings }
            ].forEach(function (item) {
                var button = document.createElement('div');
                button.className = 'akira-topbar__item akira-topbar__icon selector';
                button.setAttribute('data-selector', 'true');
                button.setAttribute('data-role', item.role);
                button.setAttribute('tabindex', '0');
                button.innerHTML = item.icon;
                bindAction(button, item.handler);
                rightNode.appendChild(button);
            });

            var clock = document.createElement('div');
            clock.className = 'akira-topbar__clock selector';
            clock.setAttribute('data-selector', 'true');
            clock.setAttribute('tabindex', '0');
            bindAction(clock, openSettings);
            rightNode.appendChild(clock);
            startClock();

            qsa('.akira-topbar__item[data-action]', bar).forEach(function (button) {
                var nativeItem = menuItem(button.getAttribute('data-action'));
                button.classList.remove('is-active');
                if (nativeItem && (nativeItem.classList.contains('active') || nativeItem.classList.contains('focus') || nativeItem.classList.contains('hover'))) {
                    button.classList.add('is-active');
                }
            });
        }

        function cssCardHeight() {
            var size = cardSize();
            if (size === 'sm') return '10.4em';
            if (size === 'lg') return '14.2em';
            return '12.2em';
        }

        function injectStyle() {
            var p = theme();
            var style = document.getElementById(cfg.styleId) || document.createElement('style');
            style.id = cfg.styleId;
            var cardH = cssCardHeight();
            var css = [
                'body.' + cfg.bodyClass + ' { --akira-card-h: ' + cardH + '; --akira-card-w: calc(var(--akira-card-h) * 1.7778); color: #f7f7f7 !important; background: linear-gradient(180deg, ' + p.bg + ' 0%, ' + p.bg2 + ' 100%) !important; }',
                'body.' + cfg.bodyClass + '[' + attrUiScale + '="auto"], body.' + cfg.bodyClass + '[' + attrUiScale + '="12"], body.' + cfg.bodyClass + '[' + attrUiScale + '="14"], body.' + cfg.bodyClass + '[' + attrUiScale + '="16"], body.' + cfg.bodyClass + '[' + attrUiScale + '="18"], body.' + cfg.bodyClass + '[' + attrUiScale + '="20"], body.' + cfg.bodyClass + '[' + attrUiScale + '="22"], body.' + cfg.bodyClass + '[' + attrUiScale + '="24"], body.' + cfg.bodyClass + '[' + attrUiScale + '="28"], body.' + cfg.bodyClass + '[' + attrUiScale + '="32"] { font-size: var(--akira-ui-font-size) !important; }',
                'body.' + cfg.bodyClass + ' .card--category { width: 16em !important; }',
                'body.' + cfg.bodyClass + ' .background__gradient { background: linear-gradient(90deg, rgba(0,0,0,.96) 0%, rgba(0,0,0,.72) 42%, rgba(0,0,0,.20) 100%) !important; }',
                'body.' + cfg.bodyClass + '[' + attrTopbar + '="on"] .head, body.' + cfg.bodyClass + '[' + attrTopbar + '="on"] .head__body, body.' + cfg.bodyClass + '[' + attrTopbar + '="on"] .head__wrapper { background: transparent !important; box-shadow: none !important; overflow: visible !important; }',
                'body.' + cfg.bodyClass + '[' + attrTopbar + '="on"] .head__title, body.' + cfg.bodyClass + '[' + attrTopbar + '="on"] .head__time, body.' + cfg.bodyClass + '[' + attrTopbar + '="on"] .head__split, body.' + cfg.bodyClass + '[' + attrTopbar + '="on"] .head__logo, body.' + cfg.bodyClass + '[' + attrTopbar + '="on"] .open--search, body.' + cfg.bodyClass + '[' + attrTopbar + '="on"] .head__settings { display: none !important; }',
                'body.' + cfg.bodyClass + ' .akira-topbar { position: absolute; left: 1.1em; right: 1.1em; top: .54em; z-index: 40; pointer-events: none; }',
                'body.' + cfg.bodyClass + ' .akira-topbar__inner { height: 2.8em; display: flex; align-items: center; gap: .46em; pointer-events: auto; }',
                'body.' + cfg.bodyClass + ' .akira-topbar__brand { height: 2.42em; display: inline-flex; align-items: center; padding: 0 .95em; border-radius: 8px; background: linear-gradient(92deg, ' + p.accent + ', ' + p.accent2 + '); color: ' + p.focusText + '; font-size: .9em; font-weight: 900; letter-spacing: 0; box-shadow: 0 10px 28px ' + p.soft + '; }',
                'body.' + cfg.bodyClass + ' .akira-topbar__items, body.' + cfg.bodyClass + ' .akira-topbar__right { display: inline-flex; align-items: center; gap: .18em; height: 2.62em; padding: .18em; border-radius: 8px; background: ' + p.panel + '; border: 1px solid ' + p.edge + '; backdrop-filter: blur(18px) saturate(130%); -webkit-backdrop-filter: blur(18px) saturate(130%); box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 10px 26px rgba(0,0,0,.22); }',
                'body.' + cfg.bodyClass + ' .akira-topbar__right { margin-left: auto; }',
                'body.' + cfg.bodyClass + ' .akira-topbar__item { height: 2.18em; min-width: 2.18em; display: inline-flex; align-items: center; justify-content: center; padding: 0 .88em; border-radius: 7px; color: rgba(255,255,255,.9); font-size: .84em; font-weight: 700; white-space: nowrap; transition: background .18s ease, transform .18s ease, color .18s ease; }',
                'body.' + cfg.bodyClass + ' .akira-topbar__icon { width: 2.18em; padding: 0; }',
                'body.' + cfg.bodyClass + ' .akira-topbar__icon svg { width: 1.08em; height: 1.08em; }',
                'body.' + cfg.bodyClass + ' .akira-topbar__clock { height: 2.18em; min-width: 4.1em; display: inline-flex; align-items: center; justify-content: center; padding: 0 .72em; border-radius: 7px; color: rgba(255,255,255,.9); font-size: .84em; font-weight: 800; }',
                'body.' + cfg.bodyClass + ' .akira-topbar__item.focus, body.' + cfg.bodyClass + ' .akira-topbar__item.hover, body.' + cfg.bodyClass + ' .akira-topbar__item.is-active, body.' + cfg.bodyClass + ' .akira-topbar__clock.focus, body.' + cfg.bodyClass + ' .akira-topbar__clock.hover { background: rgba(255,255,255,.15); color: #fff; transform: translateY(-1px); }',
                'body.' + cfg.bodyClass + ' .akira-hero { position: relative; height: clamp(300px, 42vh, 640px); margin: .6em 1.1em 1.05em; border-radius: 10px; overflow: hidden; background: #111; box-shadow: 0 18px 54px rgba(0,0,0,.38); isolation: isolate; }',
                'body.' + cfg.bodyClass + '[' + attrTopbar + '="on"] .akira-hero { margin-top: 4.05em; }',
                'body.' + cfg.bodyClass + ' .akira-hero__bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform: scale(1.01); opacity: .86; }',
                'body.' + cfg.bodyClass + ' .akira-hero__shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,.95) 0%, rgba(0,0,0,.72) 42%, rgba(0,0,0,.12) 100%), linear-gradient(0deg, rgba(0,0,0,.84) 0%, rgba(0,0,0,0) 48%); }',
                'body.' + cfg.bodyClass + ' .akira-hero__content { position: relative; z-index: 2; height: 100%; width: min(56em, 64%); display: flex; flex-direction: column; justify-content: flex-end; padding: clamp(1.15em, 2.3vw, 2.4em); box-sizing: border-box; }',
                'body.' + cfg.bodyClass + ' .akira-hero__brand { display: none !important; }',
                'body.' + cfg.bodyClass + ' .akira-hero__logo { max-width: min(27em, 90%); max-height: 8.5em; width: auto; height: auto; object-fit: contain; object-position: left bottom; margin-bottom: .74em; filter: drop-shadow(0 8px 20px rgba(0,0,0,.75)); }',
                'body.' + cfg.bodyClass + ' .akira-hero__title { color: #fff; font-size: clamp(2.05em, 4vw, 4.6em); line-height: .98; font-weight: 900; letter-spacing: 0; margin-bottom: .18em; text-shadow: 0 12px 28px rgba(0,0,0,.56); }',
                'body.' + cfg.bodyClass + ' .akira-hero__meta { color: rgba(255,255,255,.82); font-size: clamp(.92em, 1.15vw, 1.12em); font-weight: 700; line-height: 1.35; margin-bottom: .65em; }',
                'body.' + cfg.bodyClass + ' .akira-hero__desc { color: rgba(255,255,255,.82); max-width: 44em; font-size: clamp(.92em, 1.12vw, 1.12em); line-height: 1.46; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }',
                'body.' + cfg.bodyClass + ' .akira-hero__head { min-height: 1.2em; margin-bottom: .72em; color: rgba(255,255,255,.86); font-size: .9em; line-height: 1.2; font-weight: 800; }',
                'body.' + cfg.bodyClass + ' .akira-hero__tagline { margin: -.12em 0 .72em; color: rgba(255,255,255,.78); font-size: .9em; line-height: 1.25; font-weight: 700; }',
                'body.' + cfg.bodyClass + ' .akira-hero__ratings { display: flex; align-items: center; flex-wrap: wrap; gap: .9em; margin: .12em 0 .58em; color: rgba(255,255,255,.88); }',
                'body.' + cfg.bodyClass + ' .akira-hero__rating { display: inline-flex; align-items: baseline; gap: .36em; line-height: 1; font-size: 1.02em; font-weight: 800; }',
                'body.' + cfg.bodyClass + ' .akira-hero__rating b { font-size: 1.18em; color: #fff; }',
                'body.' + cfg.bodyClass + ' .akira-hero__facts { display: flex; align-items: center; flex-wrap: wrap; gap: .42em .56em; margin-bottom: .66em; color: rgba(255,255,255,.82); font-size: .88em; line-height: 1.25; font-weight: 750; }',
                'body.' + cfg.bodyClass + ' .akira-hero__facts i { width: .24em; height: .24em; border-radius: 50%; background: rgba(255,255,255,.6); }',
                'body.' + cfg.bodyClass + ' .akira-hero__age { min-width: 2.2em; height: 1.75em; display: inline-flex; align-items: center; justify-content: center; padding: 0 .35em; border: 1px solid rgba(255,255,255,.62); color: #fff; box-sizing: border-box; }',
                'body.' + cfg.bodyClass + ' .akira-hero__desc-text { display: block; will-change: transform; }',
                'body.' + cfg.bodyClass + ' .akira-hero__desc.is-scrollable .akira-hero__desc-text { animation: akira-desc-scroll 18s linear 4s infinite alternate; }',
                'body.' + cfg.bodyClass + ' .akira-hero__actions { display: flex; gap: .5em; margin-top: 1.05em; }',
                'body.' + cfg.bodyClass + ' .akira-hero__button { min-height: 2.45em; display: inline-flex; align-items: center; justify-content: center; padding: 0 1.35em; border-radius: 7px; background: #fff; color: #050505; font-weight: 900; font-size: .96em; transition: transform .18s ease, box-shadow .18s ease; }',
                'body.' + cfg.bodyClass + ' .akira-hero__button.focus, body.' + cfg.bodyClass + ' .akira-hero__button.hover { transform: translateY(-1px); box-shadow: 0 0 0 2px ' + p.accent + ', 0 10px 24px ' + p.soft + '; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .items-cards, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .items-line { gap: .72em !important; overflow: visible !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .items-cards .card, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .items-line .card { width: var(--akira-card-w) !important; min-width: var(--akira-card-w) !important; height: var(--akira-card-h) !important; overflow: visible !important; border-radius: 8px !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card__view { height: 100% !important; padding-bottom: 0 !important; border-radius: 8px !important; overflow: hidden !important; background: #151515 !important; border: 1px solid rgba(255,255,255,.08) !important; box-shadow: 0 8px 18px rgba(0,0,0,.35) !important; transition: transform .24s ease, border-color .24s ease, box-shadow .24s ease !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card__img { width: 100% !important; height: 100% !important; object-fit: cover !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card__title { display: none !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card.focus .card__view, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card.hover .card__view, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card:hover .card__view { transform: scale(1.06); border-color: ' + p.accent + ' !important; box-shadow: 0 18px 42px rgba(0,0,0,.58), 0 0 0 2px ' + p.accent + ' !important; }',
                'body.' + cfg.bodyClass + ' .akira-card-overlay { position: absolute; left: 0; right: 0; bottom: 0; z-index: 3; padding: 3.8em .82em .82em; background: linear-gradient(0deg, rgba(0,0,0,.94) 0%, rgba(0,0,0,.58) 58%, rgba(0,0,0,0) 100%); pointer-events: none; box-sizing: border-box; }',
                'body.' + cfg.bodyClass + ' .akira-card-overlay__title { color: #fff; font-size: .96em; line-height: 1.12; font-weight: 900; letter-spacing: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }',
                'body.' + cfg.bodyClass + ' .akira-card-overlay__meta { margin-top: .25em; color: rgba(255,255,255,.74); font-size: .72em; line-height: 1.18; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
                'body.' + cfg.bodyClass + ' .akira-card-overlay__logo { max-width: 78%; max-height: 2.65em; object-fit: contain; object-position: left bottom; display: block; filter: drop-shadow(0 4px 10px rgba(0,0,0,.7)); }',
                'body.' + cfg.bodyClass + ' .akira-card-rating { position: absolute; right: .68em; top: .62em; z-index: 4; padding: .26em .52em; border-radius: 6px; background: rgba(0,0,0,.62); border: 1px solid rgba(255,255,255,.16); color: #fff; font-size: .72em; font-weight: 900; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }',
                'body.' + cfg.bodyClass + ' .full-start, body.' + cfg.bodyClass + ' .full-start-new { background: transparent !important; }',
                'body.' + cfg.bodyClass + ' .full-start__button, body.' + cfg.bodyClass + ' .simple-button, body.' + cfg.bodyClass + ' .full-descr__tag, body.' + cfg.bodyClass + ' .settings-param, body.' + cfg.bodyClass + ' .settings-folder, body.' + cfg.bodyClass + ' .selectbox-item { border-radius: 8px !important; border: 1px solid rgba(255,255,255,.10) !important; transition: transform .18s ease, background .18s ease, border-color .18s ease, box-shadow .18s ease !important; }',
                'body.' + cfg.bodyClass + ' .full-start__button.focus, body.' + cfg.bodyClass + ' .simple-button.focus, body.' + cfg.bodyClass + ' .full-descr__tag.focus, body.' + cfg.bodyClass + ' .settings-param.focus, body.' + cfg.bodyClass + ' .settings-folder.focus, body.' + cfg.bodyClass + ' .selectbox-item.focus, body.' + cfg.bodyClass + ' .menu__item.focus, body.' + cfg.bodyClass + ' .menu__item.hover { background: linear-gradient(92deg, ' + p.accent + ', ' + p.accent2 + ') !important; color: ' + p.focusText + ' !important; border-color: ' + p.accent + ' !important; box-shadow: 0 0 0 1px ' + p.accent + ', 0 12px 28px ' + p.soft + ' !important; transform: translateY(-1px); }',
                'body.' + cfg.bodyClass + ' .full-start-new__buttons, body.' + cfg.bodyClass + ' .full-start__buttons { display: flex !important; flex-wrap: wrap !important; gap: .55em !important; align-items: center !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__buttons .full-start__button span { display: inline !important; }',
                'body.' + cfg.bodyClass + ' .akira-full-title { min-height: clamp(92px, 12vw, 190px) !important; display: flex !important; align-items: flex-end !important; color: transparent !important; text-shadow: none !important; }',
                'body.' + cfg.bodyClass + ' .akira-full-logo-holder { width: min(92vw, 980px); max-width: 100%; display: inline-flex; align-items: flex-end; }',
                'body.' + cfg.bodyClass + ' .akira-full-logo { width: auto; max-width: 100%; max-height: clamp(86px, 13vw, 220px); object-fit: contain; filter: drop-shadow(0 8px 22px rgba(0,0,0,.76)); }',
                'body.' + cfg.bodyClass + ' .settings__content, body.' + cfg.bodyClass + ' .selectbox__content, body.' + cfg.bodyClass + ' .settings-input__content { background: ' + p.panel2 + ' !important; border: 1px solid ' + p.edge + ' !important; backdrop-filter: blur(18px) saturate(130%); -webkit-backdrop-filter: blur(18px) saturate(130%); }',
                'body.' + cfg.bodyClass + '[' + attrPerf + '="economy"] * { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }',
                'body.' + cfg.bodyClass + '[' + attrPerf + '="economy"] .card__view, body.' + cfg.bodyClass + '[' + attrPerf + '="economy"] .akira-topbar__items, body.' + cfg.bodyClass + '[' + attrPerf + '="economy"] .akira-topbar__right { transition-duration: .08s !important; box-shadow: none !important; }',
                '@keyframes akira-desc-scroll { 0%, 28% { transform: translateY(0); } 100% { transform: translateY(calc(-100% + 3.05em)); } }',
                '@media (max-width: 900px) { body.' + cfg.bodyClass + ' .akira-topbar__items { display: none !important; } body.' + cfg.bodyClass + ' .akira-hero { height: clamp(280px, 42vh, 460px); margin-left: .65em; margin-right: .65em; } body.' + cfg.bodyClass + ' .akira-hero__content { width: 100%; padding: 1.05em; } body.' + cfg.bodyClass + ' .akira-hero__desc { -webkit-line-clamp: 2; } }',
                '@media (max-width: 560px) { body.' + cfg.bodyClass + ' .akira-topbar__brand { font-size: .78em; padding: 0 .7em; } body.' + cfg.bodyClass + ' .akira-topbar { left: .65em; right: .65em; } body.' + cfg.bodyClass + ' .akira-hero__title { font-size: 2em; } }',
                '@media (min-width: 2000px) { body.' + cfg.bodyClass + ' .akira-hero { height: clamp(400px, 44vh, 760px); } body.' + cfg.bodyClass + ' .akira-hero__content { width: min(72em, 66%); } body.' + cfg.bodyClass + ' .akira-hero__logo { max-height: 11em; } body.' + cfg.bodyClass + ' .akira-hero__title { font-size: clamp(2.4em, 3.8vw, 5em); } }',
                '@media (min-width: 2560px) { body.' + cfg.bodyClass + ' .akira-hero { height: clamp(480px, 46vh, 900px); } body.' + cfg.bodyClass + ' .akira-hero__logo { max-height: 13em; } body.' + cfg.bodyClass + '[' + attrCards + '="on"] .scroll__body.mapping--grid { grid-template-columns: repeat(auto-fill, minmax(22em, 1fr)) !important; } }'
            ].join('\n');
            css += '\n' + [
                'body.' + cfg.bodyClass + '[' + attrTopbar + '="on"] .head__body { position: relative !important; z-index: 48 !important; min-height: 0 !important; height: 0 !important; padding: 0 !important; overflow: visible !important; }',
                'body.' + cfg.bodyClass + '[' + attrTopbar + '="on"] .head__history, body.' + cfg.bodyClass + '[' + attrTopbar + '="on"] .head__source, body.' + cfg.bodyClass + '[' + attrTopbar + '="on"] .head__markers, body.' + cfg.bodyClass + '[' + attrTopbar + '="on"] .head__backward, body.' + cfg.bodyClass + '[' + attrTopbar + '="on"] .settings-icon-holder, body.' + cfg.bodyClass + '[' + attrTopbar + '="on"] .head__action, body.' + cfg.bodyClass + '[' + attrTopbar + '="on"] .head__button { display: none !important; }',
                'body.' + cfg.bodyClass + ' .head__menu-icon.akira-head-brand { position: absolute !important; left: 1.05em !important; top: .54em !important; z-index: 50 !important; width: auto !important; max-width: min(30vw, 22em) !important; min-width: 4.4em !important; height: 2.62em !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; padding: 0 .95em !important; margin: 0 !important; border-radius: 8px !important; background: linear-gradient(92deg, ' + p.accent + ', ' + p.accent2 + ') !important; color: ' + p.focusText + ' !important; border: 1px solid rgba(255,255,255,.12) !important; box-shadow: 0 10px 28px ' + p.soft + ' !important; transform: none !important; overflow: hidden !important; }',
                'body.' + cfg.bodyClass + ' .head__menu-icon.akira-head-brand span { display: block !important; max-width: 100% !important; overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important; font-size: .88em !important; line-height: 1 !important; font-weight: 900 !important; letter-spacing: 0 !important; color: inherit !important; }',
                'body.' + cfg.bodyClass + ' .head__menu-icon.akira-head-brand.focus, body.' + cfg.bodyClass + ' .head__menu-icon.akira-head-brand.hover { box-shadow: 0 0 0 2px rgba(255,255,255,.18), 0 12px 30px ' + p.soft + ' !important; transform: translateY(-1px) !important; }',
                'body.' + cfg.bodyClass + ' .akira-topbar { left: calc(var(--akira-brand-w, 5.2em) + 1.55em) !important; top: .54em !important; right: 1.05em !important; z-index: 49 !important; }',
                'body.' + cfg.bodyClass + ' .akira-topbar__inner { gap: .34em !important; }',
                'body.' + cfg.bodyClass + ' .akira-topbar__items { max-width: calc(100vw - var(--akira-brand-w, 5.2em) - 17em) !important; overflow: hidden !important; }',
                'body.' + cfg.bodyClass + ' .akira-topbar__brand { display: none !important; }',
                'body.' + cfg.bodyClass + ' .akira-home-host { position: relative !important; overflow: visible !important; }',
                'body.' + cfg.bodyClass + ' .akira-hero { display: block !important; width: calc(100% - 2.2em) !important; flex: 0 0 auto !important; clear: both !important; z-index: 6 !important; margin: 4.25em 1.1em 1.45em !important; }',
                'body.' + cfg.bodyClass + '[' + attrTopbar + '="off"] .akira-hero { margin-top: .85em !important; }',
                'body.' + cfg.bodyClass + ' .akira-hero.is-entering { max-height: 0 !important; opacity: 0 !important; margin-top: 0 !important; margin-bottom: 0 !important; overflow: hidden !important; }',
                'body.' + cfg.bodyClass + ' .akira-hero { max-height: clamp(300px, 42vh, 640px) !important; transition: max-height .58s cubic-bezier(.22,.61,.36,1), margin .58s cubic-bezier(.22,.61,.36,1), opacity .38s ease .08s !important; }',
                'body.' + cfg.bodyClass + ' .akira-hero + .items-line, body.' + cfg.bodyClass + ' .akira-hero + .scroll__body, body.' + cfg.bodyClass + ' .akira-hero ~ .items-line, body.' + cfg.bodyClass + ' .akira-hero ~ .scroll__body { position: relative !important; z-index: 1 !important; clear: both !important; }',
                'body.' + cfg.bodyClass + ' .items-line__head, body.' + cfg.bodyClass + ' .items-line__body, body.' + cfg.bodyClass + ' .items-cards { position: relative !important; z-index: 1 !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .scroll__body.mapping--grid { display: grid !important; grid-template-columns: repeat(auto-fill, minmax(var(--akira-card-w), 1fr)) !important; gap: 1.05em .78em !important; align-items: start !important; padding-left: 1.1em !important; padding-right: 1.1em !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .scroll__body.mapping--grid .card { width: 100% !important; min-width: 0 !important; height: var(--akira-card-h) !important; margin: 0 !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card.card--small .card__view, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card--wide .card__view { padding-bottom: 0 !important; height: 100% !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new, body.' + cfg.bodyClass + ' .full-start { background: linear-gradient(90deg, rgba(5,5,6,.90), rgba(5,5,6,.44), rgba(5,5,6,.10)) !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__body { align-items: center !important; gap: 2.2em !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__right { max-width: min(58em, 66vw) !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__tagline, body.' + cfg.bodyClass + ' .full-start__title-original { color: rgba(255,255,255,.78) !important; text-shadow: 0 2px 10px rgba(0,0,0,.48) !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__buttons .full-start__button, body.' + cfg.bodyClass + ' .full-start__buttons .full-start__button { min-height: 2.72em !important; padding: 0 .96em !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; gap: .48em !important; background: rgba(255,255,255,.10) !important; color: #fff !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__buttons .full-start__button span, body.' + cfg.bodyClass + ' .full-start__buttons .full-start__button span { display: inline !important; max-width: 12em !important; overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__buttons .button--play, body.' + cfg.bodyClass + ' .full-start__buttons .button--play { background: #fff !important; color: #050505 !important; border-color: #fff !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__buttons .button--play, body.' + cfg.bodyClass + ' .full-start__buttons .button--play, body.' + cfg.bodyClass + ' .full-start-new__buttons .view--online, body.' + cfg.bodyClass + ' .full-start__buttons .view--online { order: 0 !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__buttons .akira-moved-button, body.' + cfg.bodyClass + ' .full-start__buttons .akira-moved-button { order: 1 !important; position: relative !important; z-index: 3 !important; }',
                'body.' + cfg.bodyClass + ' .buttons--container.hide { display: none !important; }',
                'body.' + cfg.bodyClass + ' .buttons--container:not(.hide) { display: flex !important; flex-wrap: wrap !important; gap: .62em !important; align-items: center !important; margin-top: .42em !important; }',
                'body.' + cfg.bodyClass + '[' + attrTopbarAlign + '="center"] .akira-topbar { left: 0 !important; right: 0 !important; top: .54em !important; z-index: 49 !important; pointer-events: none !important; }',
                'body.' + cfg.bodyClass + '[' + attrTopbarAlign + '="center"] .akira-topbar__inner { position: relative !important; width: 100% !important; justify-content: center !important; pointer-events: none !important; }',
                'body.' + cfg.bodyClass + '[' + attrTopbarAlign + '="center"] .akira-topbar__items { position: absolute !important; left: 50% !important; top: 0 !important; transform: translateX(-50%) !important; max-width: calc(100vw - 23em) !important; pointer-events: auto !important; }',
                'body.' + cfg.bodyClass + '[' + attrTopbarAlign + '="center"] .akira-topbar__right { position: absolute !important; right: 1.05em !important; top: 0 !important; margin-left: 0 !important; pointer-events: auto !important; }',
                'body.' + cfg.bodyClass + ' .akira-topbar__item svg { stroke-linecap: round !important; stroke-linejoin: round !important; }',
                'body.' + cfg.bodyClass + ' .akira-hero { margin-bottom: 2.45em !important; box-shadow: 0 24px 70px rgba(0,0,0,.52) !important; }',
                'body.' + cfg.bodyClass + ' .akira-hero__content { transition: opacity .28s ease, transform .36s cubic-bezier(.22,.61,.36,1) !important; }',
                'body.' + cfg.bodyClass + ' .akira-hero.is-changing .akira-hero__content { opacity: .48 !important; transform: translateX(.65em) !important; }',
                'body.' + cfg.bodyClass + ' .akira-hero__bg { opacity: .9 !important; transform: scale(1.012) translateX(0) !important; transition: opacity .55s ease, transform .75s cubic-bezier(.22,.61,.36,1) !important; }',
                'body.' + cfg.bodyClass + ' .akira-hero__bg--current { z-index: 0 !important; }',
                'body.' + cfg.bodyClass + ' .akira-hero__bg--next { z-index: 1 !important; opacity: 0 !important; transform: scale(1.035) translateX(1.2em) !important; }',
                'body.' + cfg.bodyClass + ' .akira-hero__bg--next.is-visible { opacity: .9 !important; transform: scale(1.012) translateX(0) !important; }',
                'body.' + cfg.bodyClass + ' .akira-hero__shade { z-index: 2 !important; }',
                'body.' + cfg.bodyClass + ' .akira-hero__content { z-index: 3 !important; }',
                'body.' + cfg.bodyClass + ' .akira-hero__actions, body.' + cfg.bodyClass + ' .akira-hero__button { display: none !important; }',
                'body.' + cfg.bodyClass + ' .akira-hero__title { max-width: min(11.5em, 100%) !important; display: -webkit-box !important; -webkit-line-clamp: 2 !important; -webkit-box-orient: vertical !important; overflow: hidden !important; font-size: clamp(1.85em, 3.2vw, 3.8em) !important; line-height: 1.05 !important; }',
                'body.' + cfg.bodyClass + ' .akira-hero__desc { max-width: min(44em, 100%) !important; -webkit-line-clamp: 2 !important; min-height: 2.9em !important; }',
                'body.' + cfg.bodyClass + ' .akira-hero__desc { display: block !important; max-height: 3.05em !important; min-height: 3.05em !important; overflow: hidden !important; -webkit-line-clamp: unset !important; -webkit-box-orient: unset !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .items-line { margin-bottom: 2.25em !important; overflow: visible !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .items-line__body { overflow: visible !important; padding: .45em 0 1.1em !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .items-line__body .card:not(.card-episode) { flex: 0 0 var(--akira-card-w) !important; width: var(--akira-card-w) !important; min-width: var(--akira-card-w) !important; height: var(--akira-card-h) !important; min-height: var(--akira-card-h) !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card--small:not(.card-episode) { width: var(--akira-card-w) !important; min-width: var(--akira-card-w) !important; height: var(--akira-card-h) !important; min-height: var(--akira-card-h) !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card-episode { flex: none !important; width: auto !important; min-width: 0 !important; height: auto !important; min-height: 0 !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card__img img, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card__img picture { width: 100% !important; height: 100% !important; object-fit: cover !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .items-cards { gap: 1.12em !important; padding: .2em 1.3em .9em !important; align-items: flex-start !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .items-cards .card, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .items-line .card { margin-right: .42em !important; margin-bottom: 1.45em !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card { --akira-card-r: 8px !important; border-radius: var(--akira-card-r) !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card__view, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card__img, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card__view-shadow { border-radius: var(--akira-card-r) !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card__view { overflow: hidden !important; box-shadow: 0 8px 18px rgba(0,0,0,.35) !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card.focus .card__view, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card.hover .card__view, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card:hover .card__view { border-color: ' + p.accent + ' !important; box-shadow: 0 18px 42px rgba(0,0,0,.58), inset 0 0 0 2px ' + p.accent + ' !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card__view::before, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card__view::after { border-radius: var(--akira-card-r) !important; inset: 0 !important; box-sizing: border-box !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card.focus .card__view::after, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card.hover .card__view::after, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card:hover .card__view::after { border-radius: var(--akira-card-r) !important; box-shadow: inset 0 0 0 2px ' + p.accent + ' !important; border-color: transparent !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card__vote, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card__quality, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card__type, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card__age, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card__promo, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card__promo-text, body.' + cfg.bodyClass + '[' + attrCards + '="on"] .card__promo-title { display: none !important; }',
                'body.' + cfg.bodyClass + ' .akira-card-overlay { padding: 3.9em .95em .9em !important; background: linear-gradient(0deg, rgba(0,0,0,.91) 0%, rgba(0,0,0,.62) 43%, rgba(0,0,0,.18) 72%, rgba(0,0,0,0) 100%) !important; }',
                'body.' + cfg.bodyClass + ' .akira-card-overlay__title { font-size: .94em !important; line-height: 1.16 !important; white-space: normal !important; overflow-wrap: break-word !important; word-break: normal !important; hyphens: auto !important; }',
                'body.' + cfg.bodyClass + ' .akira-card-overlay__meta { max-width: 100% !important; white-space: normal !important; display: -webkit-box !important; -webkit-line-clamp: 1 !important; -webkit-box-orient: vertical !important; }',
                'body.' + cfg.bodyClass + ' .akira-card-overlay__logo { max-width: 82% !important; max-height: 3.05em !important; margin-bottom: .22em !important; }',
                'body.' + cfg.bodyClass + ' .akira-card-badge { position: absolute !important; left: .78em !important; top: .68em !important; z-index: 4 !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; height: 1.75em !important; padding: 0 .72em !important; border-radius: 999px !important; background: rgba(0,0,0,.58) !important; border: 1px solid rgba(255,255,255,.14) !important; color: rgba(255,255,255,.94) !important; font-size: .68em !important; font-weight: 800 !important; backdrop-filter: blur(10px) saturate(140%) !important; -webkit-backdrop-filter: blur(10px) saturate(140%) !important; pointer-events: none !important; }',
                'body.' + cfg.bodyClass + ' .akira-card-rating { top: .68em !important; right: .72em !important; border-radius: 999px !important; color: #fff !important; background: rgba(0,0,0,.58) !important; }',
                'body.' + cfg.bodyClass + ' .card-episode .full-episode { overflow: hidden !important; border-radius: var(--akira-card-r) !important; }',
                'body.' + cfg.bodyClass + ' .card-episode .full-episode__img, body.' + cfg.bodyClass + ' .card-episode .card__img { object-fit: cover !important; background-size: cover !important; background-position: center !important; }',
                'body.' + cfg.bodyClass + ' .akira-episode-title { max-width: 82% !important; color: #fff !important; font-size: .9em !important; line-height: 1.15 !important; font-weight: 900 !important; text-shadow: 0 6px 16px rgba(0,0,0,.8) !important; display: -webkit-box !important; -webkit-line-clamp: 2 !important; -webkit-box-orient: vertical !important; overflow: hidden !important; }',
                'body.' + cfg.bodyClass + ' .akira-episode-logo { display: block !important; max-width: 78% !important; max-height: 3.1em !important; object-fit: contain !important; object-position: left bottom !important; filter: drop-shadow(0 5px 12px rgba(0,0,0,.78)) !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .scroll__body.mapping--grid { display: grid !important; grid-template-columns: repeat(auto-fill, minmax(18.5em, 1fr)) !important; grid-auto-rows: var(--akira-card-h) !important; gap: 2.15em 1.18em !important; align-items: start !important; padding: .8em 1.3em 2.2em !important; }',
                'body.' + cfg.bodyClass + '[' + attrCards + '="on"] .scroll__body.mapping--grid .card:not(.card-episode) { width: 100% !important; min-width: 0 !important; min-height: var(--akira-card-h) !important; height: var(--akira-card-h) !important; margin: 0 !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new, body.' + cfg.bodyClass + ' .full-start { position: relative !important; overflow: hidden !important; min-height: 80vh !important; margin: 0 !important; padding: 0 !important; background: transparent !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new .full-start-new__background, body.' + cfg.bodyClass + ' .full-start-new .full-start__background, body.' + cfg.bodyClass + ' .full-start__background { position: absolute !important; inset: -6em 0 auto 0 !important; width: 100% !important; height: calc(100% + 6em) !important; margin: 0 !important; padding: 0 !important; mask-image: none !important; -webkit-mask-image: none !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new .full-start-new__background img, body.' + cfg.bodyClass + ' .full-start-new .full-start__background img, body.' + cfg.bodyClass + ' .full-start__background img { width: 100% !important; height: 100% !important; object-fit: cover !important; filter: none !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new::before, body.' + cfg.bodyClass + ' .full-start::before { content: "" !important; display: block !important; position: absolute !important; inset: -6em 0 0 0 !important; z-index: 1 !important; background: linear-gradient(90deg, rgba(0,0,0,.92) 0%, rgba(0,0,0,.58) 44%, rgba(0,0,0,.12) 100%), linear-gradient(0deg, ' + p.bg + ' 0%, rgba(0,0,0,.72) 22%, rgba(0,0,0,0) 70%) !important; pointer-events: none !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new::after, body.' + cfg.bodyClass + ' .full-start::after, body.' + cfg.bodyClass + ' .full-start-new__gradient, body.' + cfg.bodyClass + ' .full-start__gradient, body.' + cfg.bodyClass + ' .full-start-new__mask, body.' + cfg.bodyClass + ' .full-start__mask { display: none !important; content: none !important; background: none !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__body, body.' + cfg.bodyClass + ' .full-start__body { position: relative !important; z-index: 2 !important; display: flex !important; align-items: flex-end !important; min-height: 80vh !important; padding: 6em 5% 2.25em !important; background: none !important; box-sizing: border-box !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__left, body.' + cfg.bodyClass + ' .full-start__left { display: none !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__right, body.' + cfg.bodyClass + ' .full-start__right { position: relative !important; z-index: 3 !important; max-width: 650px !important; display: flex !important; flex-direction: column !important; align-items: flex-start !important; justify-content: flex-end !important; gap: 0 !important; background: none !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__title, body.' + cfg.bodyClass + ' .full-start__title { font-weight: 900 !important; font-size: 2.65em !important; line-height: 1.06 !important; color: #fff !important; text-shadow: 0 2px 10px rgba(0,0,0,.72), 0 8px 26px rgba(0,0,0,.78) !important; margin: 0 0 .22em !important; background: none !important; box-shadow: none !important; max-width: 100% !important; transition: opacity .22s ease, transform .26s ease !important; }',
                'body.' + cfg.bodyClass + ' .akira-full-title-pending { opacity: .62 !important; transform: translateY(.08em) !important; }',
                'body.' + cfg.bodyClass + ' .akira-full-title.is-ready { opacity: 1 !important; transform: none !important; }',
                'body.' + cfg.bodyClass + ' .akira-full-logo-holder { width: min(92vw, 720px) !important; max-width: 100% !important; display: inline-flex !important; align-items: flex-end !important; background: none !important; box-shadow: none !important; }',
                'body.' + cfg.bodyClass + ' .akira-full-logo { width: auto !important; max-width: 100% !important; max-height: clamp(88px, 12vw, 210px) !important; object-fit: contain !important; filter: none !important; background: none !important; box-shadow: none !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__head, body.' + cfg.bodyClass + ' .full-start__head, body.' + cfg.bodyClass + ' .full-start-new__rate-line, body.' + cfg.bodyClass + ' .full-start__rate-line, body.' + cfg.bodyClass + ' .full-start-new__details, body.' + cfg.bodyClass + ' .full-start__details, body.' + cfg.bodyClass + ' .full-start-new__tagline, body.' + cfg.bodyClass + ' .full-start__title-original { font-weight: 600 !important; font-size: .86em !important; line-height: 1.32 !important; color: rgba(255,255,255,.72) !important; text-shadow: 0 2px 6px rgba(0,0,0,.55) !important; margin: 0 0 .26em !important; background: none !important; box-shadow: none !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__text, body.' + cfg.bodyClass + ' .full-start__text, body.' + cfg.bodyClass + ' .full-start-new__description, body.' + cfg.bodyClass + ' .full-start__description { max-width: 520px !important; margin: .22em 0 .72em !important; font-size: .9em !important; line-height: 1.44 !important; color: rgba(255,255,255,.76) !important; text-shadow: 0 2px 6px rgba(0,0,0,.55) !important; display: -webkit-box !important; -webkit-line-clamp: 4 !important; -webkit-box-orient: vertical !important; overflow: hidden !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__reactions, body.' + cfg.bodyClass + ' .full-start__reactions, body.' + cfg.bodyClass + ' .full-start__status { display: none !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__buttons, body.' + cfg.bodyClass + ' .full-start__buttons { display: flex !important; flex-wrap: wrap !important; gap: .62em !important; align-items: center !important; margin-top: .42em !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__buttons .full-start__button, body.' + cfg.bodyClass + ' .full-start__buttons .full-start__button, body.' + cfg.bodyClass + ' .full-start-new__button { min-height: 2.76em !important; padding: 0 1.02em !important; border-radius: 8px !important; border: 1px solid rgba(255,255,255,.13) !important; background: rgba(120,120,120,.2) !important; color: rgba(255,255,255,.86) !important; box-shadow: 0 4px 16px rgba(0,0,0,.3) !important; backdrop-filter: blur(10px) !important; -webkit-backdrop-filter: blur(10px) !important; transform: none !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__buttons .full-start__button.focus, body.' + cfg.bodyClass + ' .full-start__buttons .full-start__button.focus, body.' + cfg.bodyClass + ' .full-start-new__buttons .full-start__button:hover, body.' + cfg.bodyClass + ' .full-start__buttons .full-start__button:hover { background: linear-gradient(92deg, ' + p.accent + ', ' + p.accent2 + ') !important; color: #fff !important; border-color: rgba(255,255,255,.28) !important; box-shadow: 0 0 20px ' + p.soft + ', 0 8px 28px rgba(0,0,0,.42) !important; transform: scale(1.035) !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new, body.' + cfg.bodyClass + ' .full-start { min-height: clamp(560px, 82vh, 920px) !important; isolation: isolate !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new .full-start-new__background, body.' + cfg.bodyClass + ' .full-start-new .full-start__background, body.' + cfg.bodyClass + ' .full-start__background { top: -6em !important; inset: -6em 0 auto 0 !important; height: calc(100% + 6em) !important; opacity: .98 !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new .full-start-new__background img, body.' + cfg.bodyClass + ' .full-start-new .full-start__background img, body.' + cfg.bodyClass + ' .full-start__background img { transform: scale(1.006) !important; filter: saturate(1.02) contrast(1.03) brightness(.92) !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new::before, body.' + cfg.bodyClass + ' .full-start::before { inset: -6em 0 0 0 !important; height: calc(100% + 6em) !important; background: linear-gradient(to top, ' + p.bg + ' 0%, rgba(7,7,7,.86) 28%, rgba(7,7,7,.28) 64%, rgba(7,7,7,0) 88%), linear-gradient(90deg, rgba(0,0,0,.72) 0%, rgba(0,0,0,.35) 36%, rgba(0,0,0,.04) 78%) !important; opacity: var(--akira-full-fog, .58) !important; transition: opacity .12s linear !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__body, body.' + cfg.bodyClass + ' .full-start__body { min-height: clamp(560px, 82vh, 920px) !important; padding: clamp(5.8em, 9vh, 8em) 5% clamp(2.1em, 4.6vh, 3.6em) !important; align-items: flex-end !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__right, body.' + cfg.bodyClass + ' .full-start__right { width: min(650px, 48vw) !important; max-width: min(650px, 48vw) !important; padding: 0 !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__title, body.' + cfg.bodyClass + ' .full-start__title { font-size: clamp(2.05em, 3.7vw, 4.2em) !important; font-weight: 850 !important; line-height: 1.06 !important; margin: 0 0 .24em !important; text-shadow: 0 2px 10px rgba(0,0,0,.70), 0 6px 24px rgba(0,0,0,.82) !important; }',
                'body.' + cfg.bodyClass + ' .akira-full-title { min-height: clamp(110px, 13vw, 230px) !important; }',
                'body.' + cfg.bodyClass + ' .akira-full-title.is-swapping { opacity: 1 !important; }',
                'body.' + cfg.bodyClass + ' .akira-full-title-pending { opacity: .58 !important; transform: translateY(.08em) !important; }',
                'body.' + cfg.bodyClass + ' .akira-full-logo-holder { width: min(92vw, 820px) !important; max-width: 100% !important; min-height: 0 !important; display: inline-flex !important; align-items: flex-end !important; }',
                'body.' + cfg.bodyClass + ' .akira-full-logo { width: auto !important; max-width: 100% !important; max-height: clamp(120px, 15vw, 240px) !important; object-fit: contain !important; object-position: left bottom !important; filter: none !important; background: none !important; box-shadow: none !important; padding-bottom: .08em !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__head, body.' + cfg.bodyClass + ' .full-start__head { order: -2 !important; font-size: .86em !important; font-weight: 650 !important; color: rgba(255,255,255,.82) !important; margin: 0 0 .46em !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__tagline, body.' + cfg.bodyClass + ' .full-start__tagline, body.' + cfg.bodyClass + ' .full-start__title-original { font-size: .88em !important; font-weight: 550 !important; font-style: italic !important; line-height: 1.32 !important; color: rgba(255,255,255,.68) !important; margin: 0 0 .34em !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__rate-line, body.' + cfg.bodyClass + ' .full-start__rate-line { display: flex !important; flex-wrap: wrap !important; align-items: center !important; gap: .58em !important; margin: .16em 0 .34em !important; font-size: .84em !important; color: rgba(255,255,255,.86) !important; }',
                'body.' + cfg.bodyClass + ' .full-start__rate, body.' + cfg.bodyClass + ' .full-start-new__rate { display: inline-flex !important; align-items: baseline !important; gap: .3em !important; padding: 0 !important; border: 0 !important; background: transparent !important; color: rgba(255,255,255,.9) !important; box-shadow: none !important; }',
                'body.' + cfg.bodyClass + ' .full-start__rate > div:first-child, body.' + cfg.bodyClass + ' .full-start-new__rate > div:first-child { font-size: 1.18em !important; font-weight: 850 !important; color: #fff !important; }',
                'body.' + cfg.bodyClass + ' .full-start__rate .source--name, body.' + cfg.bodyClass + ' .full-start-new__rate .source--name { font-size: .78em !important; font-weight: 750 !important; color: rgba(255,255,255,.72) !important; text-transform: uppercase !important; }',
                'body.' + cfg.bodyClass + ' .full-start__pg, body.' + cfg.bodyClass + ' .full-start-new__pg { min-width: 2.2em !important; height: 1.72em !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; padding: 0 .35em !important; border: 1px solid rgba(255,255,255,.62) !important; background: transparent !important; color: #fff !important; border-radius: 0 !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__details, body.' + cfg.bodyClass + ' .full-start__details { max-width: 100% !important; margin: 0 0 .34em !important; font-size: .84em !important; font-weight: 560 !important; color: rgba(255,255,255,.76) !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__text, body.' + cfg.bodyClass + ' .full-start__text, body.' + cfg.bodyClass + ' .full-start-new__description, body.' + cfg.bodyClass + ' .full-start__description { max-width: 540px !important; margin: .08em 0 .8em !important; font-size: .88em !important; line-height: 1.42 !important; color: rgba(255,255,255,.78) !important; -webkit-line-clamp: 4 !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__buttons, body.' + cfg.bodyClass + ' .full-start__buttons { gap: .68em !important; margin-top: .22em !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__buttons .full-start__button, body.' + cfg.bodyClass + ' .full-start__buttons .full-start__button, body.' + cfg.bodyClass + ' .full-start-new__button { min-height: 2.8em !important; padding: 0 1.08em !important; border-radius: 8px !important; border: 1px solid rgba(255,255,255,.11) !important; background: rgba(118,118,118,.20) !important; color: rgba(255,255,255,.84) !important; text-shadow: 0 2px 4px rgba(0,0,0,.5) !important; box-shadow: 0 4px 16px rgba(0,0,0,.30) !important; transition: background .3s ease, transform .2s ease, box-shadow .3s ease, border-color .3s ease !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__buttons .button--play, body.' + cfg.bodyClass + ' .full-start__buttons .button--play { background: rgba(255,255,255,.94) !important; color: #050505 !important; border-color: rgba(255,255,255,.82) !important; text-shadow: none !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__buttons .full-start__button.focus, body.' + cfg.bodyClass + ' .full-start__buttons .full-start__button.focus, body.' + cfg.bodyClass + ' .full-start-new__buttons .full-start__button:hover, body.' + cfg.bodyClass + ' .full-start__buttons .full-start__button:hover { background: linear-gradient(92deg, ' + p.accent + ', ' + p.accent2 + ') !important; color: #fff !important; border-color: rgba(255,255,255,.30) !important; box-shadow: 0 0 20px ' + p.soft + ', 0 8px 28px rgba(0,0,0,.40) !important; transform: scale(1.04) !important; }',
                'body.' + cfg.bodyClass + ' .full-start-new__buttons .full-start__button.focus *, body.' + cfg.bodyClass + ' .full-start__buttons .full-start__button.focus *, body.' + cfg.bodyClass + ' .full-start-new__buttons .full-start__button:hover *, body.' + cfg.bodyClass + ' .full-start__buttons .full-start__button:hover * { color: #fff !important; fill: #fff !important; }',
                '@media (max-width: 768px) { body.' + cfg.bodyClass + ' .full-start-new__background, body.' + cfg.bodyClass + ' .full-start__background { display: none !important; } body.' + cfg.bodyClass + ' .full-start-new, body.' + cfg.bodyClass + ' .full-start { background-image: var(--akira-full-mobile-bg) !important; background-size: cover !important; background-position: center top !important; background-repeat: no-repeat !important; } body.' + cfg.bodyClass + ' .full-start-new__body, body.' + cfg.bodyClass + ' .full-start__body { min-height: 76vh !important; padding-left: 4% !important; padding-right: 4% !important; } body.' + cfg.bodyClass + ' .full-start-new__right, body.' + cfg.bodyClass + ' .full-start__right { width: 92vw !important; max-width: 92vw !important; } body.' + cfg.bodyClass + ' .akira-full-logo { max-height: 130px !important; } }',
                '@media (min-width: 1920px) { body.' + cfg.bodyClass + ' .full-start-new__right, body.' + cfg.bodyClass + ' .full-start__right { width: min(980px, 50vw) !important; max-width: min(980px, 50vw) !important; } body.' + cfg.bodyClass + ' .akira-full-logo { max-height: clamp(170px, 13vw, 310px) !important; } }',
                '@media (min-width: 2000px) { body.' + cfg.bodyClass + ' .akira-hero { max-height: clamp(400px, 44vh, 760px) !important; } body.' + cfg.bodyClass + ' .akira-hero__content { width: min(72em, 66%) !important; } body.' + cfg.bodyClass + ' .akira-hero__logo { max-height: 11em !important; } body.' + cfg.bodyClass + ' .akira-hero__title { font-size: clamp(2.4em, 3.8vw, 5em) !important; } body.' + cfg.bodyClass + ' .full-start-new__right, body.' + cfg.bodyClass + ' .full-start__right { width: min(1100px, 52vw) !important; max-width: min(1100px, 52vw) !important; } }',
                '@media (min-width: 2560px) { body.' + cfg.bodyClass + ' .akira-hero { max-height: clamp(480px, 46vh, 900px) !important; } body.' + cfg.bodyClass + ' .akira-hero__logo { max-height: 13em !important; } body.' + cfg.bodyClass + '[' + attrCards + '="on"] .scroll__body.mapping--grid { grid-template-columns: repeat(auto-fill, minmax(22em, 1fr)) !important; } body.' + cfg.bodyClass + ' .full-start-new__right, body.' + cfg.bodyClass + ' .full-start__right { width: min(1280px, 54vw) !important; max-width: min(1280px, 54vw) !important; } body.' + cfg.bodyClass + ' .akira-full-logo { max-height: clamp(200px, 14vw, 360px) !important; } }',
                '@media (max-width: 900px) { body.' + cfg.bodyClass + ' .akira-topbar { left: .75em !important; right: .75em !important; top: 3.65em !important; } body.' + cfg.bodyClass + ' .akira-topbar__right { margin-left: auto !important; } body.' + cfg.bodyClass + ' .head__menu-icon.akira-head-brand { left: .75em !important; top: .55em !important; } body.' + cfg.bodyClass + ' .akira-hero { width: calc(100% - 1.3em) !important; margin: 6.65em .65em 1.1em !important; } }'
            ].join('\n');
            if (style.textContent !== css) style.textContent = css;
            if (!style.parentNode) (document.head || document.body).appendChild(style);
        }

        function syncBodyState() {
            if (!document.body) return;
            if (!pluginEnabled()) {
                document.body.classList.remove(cfg.bodyClass);
                document.body.removeAttribute(attrTopbar);
                document.body.removeAttribute(attrTopbarAlign);
                document.body.removeAttribute(attrCards);
                document.body.removeAttribute(attrPerf);
                document.body.removeAttribute(attrCardSize);
                document.body.removeAttribute(attrUiScale);
                document.body.removeAttribute('data-' + cssName + '-ui-scale-applied');
                try { document.documentElement.style.removeProperty('--akira-ui-font-size'); } catch (e) {}
                return;
            }
            var scale = appliedUiScale();
            document.body.classList.add(cfg.bodyClass);
            document.body.setAttribute(attrTopbar, isOn(KEY.topbar, true) ? 'on' : 'off');
            document.body.setAttribute(attrTopbarAlign, topbarAlign());
            document.body.setAttribute(attrCards, isOn(KEY.cards, true) ? 'on' : 'off');
            document.body.setAttribute(attrPerf, perfMode());
            document.body.setAttribute(attrCardSize, cardSize());
            document.body.setAttribute(attrUiScale, uiScaleValue());
            document.body.setAttribute('data-' + cssName + '-ui-scale-applied', scale || 'off');
            try {
                if (scale) document.documentElement.style.setProperty('--akira-ui-font-size', scale + 'px');
                else document.documentElement.style.removeProperty('--akira-ui-font-size');
            } catch (e) {}
        }

        function removePluginUi() {
            var style = document.getElementById(cfg.styleId);
            if (style) style.remove();
            if (document.body) {
                document.body.classList.remove(cfg.bodyClass);
                document.body.removeAttribute(attrTopbar);
                document.body.removeAttribute(attrTopbarAlign);
                document.body.removeAttribute(attrCards);
                document.body.removeAttribute(attrPerf);
                document.body.removeAttribute(attrCardSize);
                document.body.removeAttribute(attrUiScale);
                document.body.removeAttribute('data-' + cssName + '-ui-scale-applied');
            }
            try { document.documentElement.style.removeProperty('--akira-ui-font-size'); } catch (e) {}
            try { document.documentElement.style.removeProperty('--akira-brand-w'); } catch (e) {}
            var topbar = qs('.akira-topbar');
            if (topbar) topbar.remove();
            restoreMenuBrand();
            removeHero();
            stopHeroLoop();
            stopClock();
            qsa('.akira-full-title').forEach(restoreFullTitle);
            qsa('.card[data-akira-card-key]').forEach(restoreCard);
        }

        function topbarItemValues() {
            var lang = langCode();
            if (lang === 'ru') return { on: '\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c', off: '\u0421\u043a\u0440\u044b\u0442\u044c' };
            if (lang === 'uk') return { on: '\u041f\u043e\u043a\u0430\u0437\u0443\u0432\u0430\u0442\u0438', off: '\u0421\u0445\u043e\u0432\u0430\u0442\u0438' };
            return { on: 'Show', off: 'Hide' };
        }

        function topbarSettingKey(action) {
            return cfg.prefix + 'topnav_item_' + String(action || '').replace(/[^a-z0-9_-]/gi, '_');
        }

        function initDefaultSettings() {
            ensureOnOff(KEY.enabled, true);
            ensureValue(KEY.theme, cfg.defaultTheme, Object.keys(cfg.themes));
            ensureValue(KEY.brandName, cfg.brand);
            ensureOnOff(KEY.topbar, true);
            ensureValue(KEY.topbarAlign, 'start', ['start', 'center']);
            ensureOnOff(KEY.hero, true);
            ensureOnOff(KEY.heroLogo, true);
            ensureOnOff(KEY.cards, true);
            ensureOnOff(KEY.cardLogo, true);
            ensureOnOff(KEY.fullLogo, true);
            ensureOnOff(KEY.splitButtons, true);
            ensureValue(KEY.cardSize, cfg.defaultCardSize, ['sm', 'md', 'lg']);
            ensureValue(KEY.perf, 'balanced', ['quality', 'balanced', 'economy']);
            ensureValue(KEY.uiScale, 'auto', ['off', 'auto', '12', '14', '16', '18', '20', '22', '24', '28', '32']);
            ensureValue(KEY.logoLang, 'auto', ['auto', 'ru', 'en', 'uk']);
            ensureOnOff(KEY.tmdbRows, true);
            var topnavStored = get(KEY.topnavItems, undefined);
            if (typeof topnavStored === 'undefined' || topnavStored === null || topnavStored === '' || topnavStored === 'undefined' || topnavStored === 'null') set(KEY.topnavItems, cfg.defaultNav.slice());
            TMDB_COLLECTIONS.forEach(function (collection) {
                ensureOnOff(KEY.tmdbPrefix + collection.id, true);
            });
        }

        function addTopbarItemSettings() {
            var component = settingsSection('topnav');
            addParamTo(component, { type: 'title' }, { name: text('topnavTitle') });
            availableTopbarItems().forEach(function (item) {
                var selected = storedTopbarActions().indexOf(item.action) > -1 ? 'on' : 'off';
                var settingKey = topbarSettingKey(item.action);
                set(settingKey, selected);
                addParamTo(
                    component,
                    { name: settingKey, type: 'select', values: topbarItemValues(), default: selected },
                    { name: item.label, description: item.action },
                    function (value) {
                        setTopbarAction(item.action, value !== 'off' && value !== false);
                        schedulePatch(true);
                    }
                );
            });
        }

        function addTmdbCollectionSettings() {
            var component = settingsSection('tmdb');
            addParamTo(component, { type: 'title' }, { name: text('tmdbRows') });
            addParamTo(component, { name: KEY.tmdbRows, type: 'select', values: onOffValues(), default: 'on' }, { name: text('tmdbRows'), description: text('reloadHint') }, function () { notify(text('reloadHint')); });
            TMDB_COLLECTIONS.forEach(function (collection) {
                addParamTo(
                    component,
                    { name: KEY.tmdbPrefix + collection.id, type: 'select', values: onOffValues(), default: 'on' },
                    { name: collection.icon + ' ' + localize(collection.title, collection.id), description: text('tmdbRows') },
                    function () { notify(text('reloadHint')); }
                );
            });
        }

        function addSettings() {
            if (settingsReady || !Lampa.SettingsApi || typeof Lampa.SettingsApi.addParam !== 'function') return;
            settingsReady = true;
            initDefaultSettings();
            try {
                if (Lampa.Template && typeof Lampa.Template.add === 'function') {
                    Lampa.Template.add('settings_' + cfg.settingsComponent, '<div></div>');
                    Lampa.Template.add('settings_' + settingsSection('topnav'), '<div></div>');
                    Lampa.Template.add('settings_' + settingsSection('tmdb'), '<div></div>');
                }
            } catch (e) {}

            var themeValues = {};
            Object.keys(cfg.themes).forEach(function (name) {
                themeValues[name] = localize(cfg.themes[name].label, name);
            });

            Lampa.SettingsApi.addComponent({
                component: cfg.settingsComponent,
                name: cfg.name,
                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v3H4V4Zm0 6h10v3H4v-3Zm0 6h16v4H4v-4Z"></path></svg>'
            });

            addParam({ name: cfg.prefix + 'about', type: 'static' }, { name: cfg.name, description: text('about') });
            addParam({ type: 'title' }, { name: cfg.name });
            addParam({ name: KEY.enabled, type: 'select', values: onOffValues(), default: 'on' }, { name: text('enabled') }, function () { schedulePatch(true); });
            addParam({ name: KEY.theme, type: 'select', values: themeValues, default: cfg.defaultTheme }, { name: text('theme') }, function () { schedulePatch(true); });
            addParam({ name: KEY.cardSize, type: 'select', values: { sm: 'S', md: 'M', lg: 'L' }, default: cfg.defaultCardSize }, { name: text('cardSize') }, function () { schedulePatch(true); });
            addParam({ name: KEY.perf, type: 'select', values: { quality: 'Quality', balanced: 'Balanced', economy: 'Economy' }, default: 'balanced' }, { name: text('perf') }, function () { schedulePatch(true); });
            addParam({ type: 'title' }, { name: 'UI' });
            addParam({ name: cfg.prefix + 'brand_name_edit', type: 'button' }, { name: brandNameSettingName(), description: brandName() }, openBrandNameInput);
            addParam({ name: KEY.topbar, type: 'select', values: onOffValues(), default: 'on' }, { name: text('topbar') }, function () { schedulePatch(true); });
            addParam({ name: KEY.topbarAlign, type: 'select', values: topbarAlignValues(), default: 'start' }, { name: topbarAlignName() }, function () { schedulePatch(true); });
            addParam({ name: KEY.uiScale, type: 'select', values: uiScaleValues(), default: 'auto' }, { name: uiScaleName() }, function () {
                syncBodyState();
                schedulePatch(true);
                try {
                    if (Lampa.Layer && typeof Lampa.Layer.update === 'function') Lampa.Layer.update();
                } catch (e) {}
            });
            addParam({ name: KEY.hero, type: 'select', values: onOffValues(), default: 'on' }, { name: text('hero') }, function () { schedulePatch(true); });
            addParam({ name: KEY.heroLogo, type: 'select', values: onOffValues(), default: 'on' }, { name: text('heroLogo') }, function () { logoCache = {}; logoResolveCache = {}; schedulePatch(true); });
            addParam({ name: KEY.logoLang, type: 'select', values: { auto: 'Auto', ru: 'RU', en: 'EN', uk: 'UK' }, default: 'auto' }, { name: text('logoLang') }, function () { logoCache = {}; logoResolveCache = {}; schedulePatch(true); });
            addParam({ name: KEY.cards, type: 'select', values: onOffValues(), default: 'on' }, { name: text('cards') }, function () { qsa('.card[data-akira-card-key]').forEach(restoreCard); schedulePatch(true); });
            addParam({ name: KEY.cardLogo, type: 'select', values: onOffValues(), default: 'on' }, { name: text('cardLogo') }, function () { logoCache = {}; logoResolveCache = {}; qsa('.card[data-akira-card-key]').forEach(restoreCard); schedulePatch(true); });
            addParam({ name: KEY.fullLogo, type: 'select', values: onOffValues(), default: 'on' }, { name: text('fullLogo') }, function () { logoCache = {}; logoResolveCache = {}; schedulePatch(true); });
            addParam({ name: KEY.splitButtons, type: 'select', values: onOffValues(), default: 'on' }, { name: text('splitButtons') }, function () { schedulePatch(true); });
            addParam({ name: cfg.prefix + 'open_topnav_settings', type: 'button' }, { name: text('topnavOpen'), description: text('topnavTitle') }, function () { openSettingsSection(settingsSection('topnav')); });
            addParam({ name: cfg.prefix + 'open_tmdb_settings', type: 'button' }, { name: tmdbSettingsOpenName(), description: text('reloadHint') }, function () { openSettingsSection(settingsSection('tmdb')); });
            addTopbarItemSettings();
            addTmdbCollectionSettings();
            addParam({ name: cfg.prefix + 'reset', type: 'button' }, { name: text('reset') }, resetSettings);

        }

        function addParamTo(component, param, field, onChange) {
            Lampa.SettingsApi.addParam({
                component: component,
                param: param,
                field: field,
                onChange: onChange
            });
        }

        function addParam(param, field, onChange) {
            addParamTo(cfg.settingsComponent, param, field, onChange);
        }

        function onOffValues() {
            return {
                on: tr('extensions_enable', 'On'),
                off: tr('extensions_disable', 'Off')
            };
        }

        function uiScaleValues() {
            var lang = langCode();
            var values = {
                auto: lang === 'ru' ? '\u0410\u0432\u0442\u043e' : (lang === 'uk' ? '\u0410\u0432\u0442\u043e' : 'Auto'),
                off: lang === 'ru' ? '\u0412\u044b\u043a\u043b\u044e\u0447\u0435\u043d\u043e' : (lang === 'uk' ? '\u0412\u0438\u043c\u043a\u043d\u0435\u043d\u043e' : 'Off')
            };
            ['12', '14', '16', '18', '20', '22', '24', '28', '32'].forEach(function (size) {
                values[size] = size + 'px';
            });
            return values;
        }

        function uiScaleName() {
            var lang = langCode();
            if (lang === 'ru') return '\u041c\u0430\u0441\u0448\u0442\u0430\u0431 \u0438\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430';
            if (lang === 'uk') return '\u041c\u0430\u0441\u0448\u0442\u0430\u0431 \u0456\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0443';
            return 'Interface scale';
        }

        function topbarAlignValues() {
            var lang = langCode();
            if (lang === 'ru') return { start: '\u0421\u043b\u0435\u0432\u0430', center: '\u041f\u043e \u0446\u0435\u043d\u0442\u0440\u0443' };
            if (lang === 'uk') return { start: '\u0417\u043b\u0456\u0432\u0430', center: '\u041f\u043e \u0446\u0435\u043d\u0442\u0440\u0443' };
            return { start: 'Left', center: 'Center' };
        }

        function topbarAlignName() {
            var lang = langCode();
            if (lang === 'ru') return '\u041f\u043e\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u0432\u0435\u0440\u0445\u043d\u0435\u0433\u043e \u0431\u0430\u0440\u0430';
            if (lang === 'uk') return '\u041f\u043e\u043b\u043e\u0436\u0435\u043d\u043d\u044f \u0432\u0435\u0440\u0445\u043d\u044c\u043e\u0433\u043e \u0431\u0430\u0440\u0430';
            return text('topbarAlign');
        }

        function tmdbSettingsOpenName() {
            var lang = langCode();
            if (lang === 'ru') return '\u041d\u0430\u0441\u0442\u0440\u043e\u0438\u0442\u044c \u043f\u043e\u0434\u0431\u043e\u0440\u043a\u0438 TMDB';
            if (lang === 'uk') return '\u041d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u0442\u0438 \u0434\u043e\u0431\u0456\u0440\u043a\u0438 TMDB';
            return 'Configure TMDB rows';
        }

        function brandNameSettingName() {
            var lang = langCode();
            if (lang === 'ru') return '\u041d\u0430\u0434\u043f\u0438\u0441\u044c \u0431\u0440\u0435\u043d\u0434\u0430';
            if (lang === 'uk') return '\u041d\u0430\u0434\u043f\u0438\u0441 \u0431\u0440\u0435\u043d\u0434\u0443';
            return 'Brand label';
        }

        function resetSettings() {
            set(KEY.enabled, 'on');
            set(KEY.theme, cfg.defaultTheme);
            set(KEY.brandName, cfg.brand);
            set(KEY.topbar, 'on');
            set(KEY.topbarAlign, 'start');
            set(KEY.uiScale, 'auto');
            set(KEY.hero, 'on');
            set(KEY.heroLogo, 'on');
            set(KEY.logoLang, 'auto');
            set(KEY.cards, 'on');
            set(KEY.cardLogo, 'on');
            set(KEY.fullLogo, 'on');
            set(KEY.splitButtons, 'on');
            set(KEY.cardSize, cfg.defaultCardSize);
            set(KEY.perf, 'balanced');
            set(KEY.tmdbRows, 'on');
            set(KEY.topnavItems, cfg.defaultNav.slice());
            TMDB_COLLECTIONS.forEach(function (collection) { set(KEY.tmdbPrefix + collection.id, 'on'); });
            logoCache = {};
            logoResolveCache = {};
            schedulePatch(true);
            notify(cfg.name + ': OK');
        }

        function createTmdbMain(parent, originalMain) {
            return function () {
                var owner = this;
                var args = Array.prototype.slice.call(arguments);
                var params = args[0] || {};
                var oncomplete = args[1];
                var onerror = args[2];
                var parts = [];

                TMDB_COLLECTIONS.forEach(function (collection) {
                    if (!isOn(KEY.tmdbPrefix + collection.id, true)) return;
                    parts.push(function (call) {
                        parent.get(collection.request, params, function (json) {
                            json.title = collection.icon + ' ' + localize(collection.title, collection.id);
                            if (Lampa.Utils && typeof Lampa.Utils.addSource === 'function') Lampa.Utils.addSource(json, 'tmdb');
                            call(json);
                        }, function () {
                            call({ source: 'tmdb', results: [], title: collection.icon + ' ' + localize(collection.title, collection.id) });
                        });
                    });
                });

                if (!parts.length) return originalMain.apply(owner, args);
                var runner = Lampa.Api && (Lampa.Api.sequentials || Lampa.Api.partNext);
                if (!runner) return originalMain.apply(owner, args);
                runner(parts, parts.length, oncomplete, onerror);
                return function () {};
            };
        }

        function initTmdbSource(retry) {
            if (tmdbReady) return true;
            if (!Lampa.Api || !Lampa.Api.sources || !Lampa.Api.sources.tmdb) {
                if (retry !== false) setTimeout(function () { initTmdbSource(false); }, 900);
                return false;
            }
            try {
                var original = Lampa.Api.sources.tmdb;
                var originalMain = original.main;
                var source = Object.assign({}, original);
                source.main = function () {
                    if (pluginEnabled() && isOn(KEY.tmdbRows, true) && this.type !== 'movie' && this.type !== 'tv') {
                        return createTmdbMain(source, originalMain).apply(this, arguments);
                    }
                    return originalMain.apply(this, arguments);
                };
                Lampa.Api.sources[cfg.sourceKey] = source;
                try {
                    Object.defineProperty(Lampa.Api.sources, cfg.sourceKey, {
                        configurable: true,
                        get: function () { return source; }
                    });
                } catch (e) {}
                try {
                    var sources = Lampa.Params.values && Lampa.Params.values.source ? Lampa.Params.values.source : {};
                    if (!sources[cfg.sourceKey]) {
                        sources[cfg.sourceKey] = cfg.sourceLabel;
                        Lampa.Params.select('source', sources, 'tmdb');
                    }
                } catch (e) {}
                tmdbReady = true;
                return true;
            } catch (e) {
                return false;
            }
        }

        function observeDom() {
            if (domObserver || !window.MutationObserver || !document.body) return;
            var pending = false;
            domObserver = new MutationObserver(function (mutations) {
                if (!pluginEnabled()) return;
                var shouldPatch = false;
                for (var i = 0; i < mutations.length && !shouldPatch; i++) {
                    for (var j = 0; j < mutations[i].addedNodes.length; j++) {
                        var node = mutations[i].addedNodes[j];
                        if (!node || node.nodeType !== 1) continue;
                        if ((node.classList && (node.classList.contains('card') || node.classList.contains('card-episode') || node.classList.contains('full-start-new') || node.classList.contains('head__backward'))) || (node.querySelector && node.querySelector('.card, .card-episode, .full-start-new, .head__body, .head__backward'))) {
                            shouldPatch = true;
                            break;
                        }
                    }
                }
                if (!shouldPatch || pending) return;
                pending = true;
                setTimeout(function () {
                    pending = false;
                    schedulePatch();
                }, perfMode() === 'economy' ? 220 : 90);
            });
            domObserver.observe(document.body, { childList: true, subtree: true });
        }

        function bindListeners() {
            if (listenersBound) return;
            listenersBound = true;
            try {
                if (Lampa.Listener && typeof Lampa.Listener.follow === 'function') {
                    Lampa.Listener.follow('activity', function (event) {
                        if (event.type === 'start' || event.type === 'activity') {
                            state.heroKey = '';
                            schedulePatch();
                            setTimeout(updateHero, 180);
                        }
                    });
                    Lampa.Listener.follow('full', function (event) {
                        if (event && event.data && event.data.movie) {
                            state.fullMovie = event.data.movie;
                            state.fullMovieKey = movieKey(state.fullMovie);
                        }
                        if (event.type === 'complite' || event.type === 'activity' || event.type === 'start') {
                            setTimeout(function () { applyFullLogo(state.fullMovie); moveSplitButtons(); }, 40);
                            setTimeout(function () { applyFullLogo(state.fullMovie); moveSplitButtons(); }, 260);
                            setTimeout(function () { applyFullLogo(state.fullMovie); moveSplitButtons(); }, 640);
                        }
                    });
                }
            } catch (e) {}

            try {
                if (Lampa.Storage && Lampa.Storage.listener && typeof Lampa.Storage.listener.follow === 'function') {
                    Lampa.Storage.listener.follow('change', function (event) {
                        if (!event || !event.name || event.name.indexOf(cfg.prefix) !== 0) return;
                        if (event.name === KEY.logoLang || event.name === KEY.heroLogo || event.name === KEY.cardLogo || event.name === KEY.fullLogo) logoCache = {};
                        if (event.name === KEY.enabled && !pluginEnabled()) {
                            removePluginUi();
                            return;
                        }
                        if (event.name === KEY.cards || event.name === KEY.cardLogo) qsa('.card[data-akira-card-key]').forEach(restoreCard);
                        schedulePatch(true);
                    });
                }
            } catch (e) {}

            document.addEventListener('mouseover', function (event) {
                var card = event.target && event.target.closest ? event.target.closest('.card') : null;
                if (card) {
                    state.lastCard = card;
                    updateHero();
                }
            }, true);

            document.addEventListener('focusin', function (event) {
                var card = event.target && event.target.closest ? event.target.closest('.card') : null;
                if (card) {
                    state.lastCard = card;
                    updateHero();
                }
            }, true);

            document.addEventListener('scroll', function (event) {
                if (state.fullFogTick) return;
                state.fullFogTick = true;
                var target = event.target;
                requestAnimationFrame(function () {
                    state.fullFogTick = false;
                    updateFullFog(target);
                });
            }, true);

            window.addEventListener('resize', function () { syncBodyState(); schedulePatch(true); });
            window.addEventListener('orientationchange', function () { syncBodyState(); schedulePatch(true); });
            try {
                if (window.visualViewport) window.visualViewport.addEventListener('resize', function () { syncBodyState(); schedulePatch(true); });
            } catch (e) {}
        }

        function safePatch() {
            scheduled = false;
            if (!pluginEnabled()) {
                removePluginUi();
                return;
            }
            injectStyle();
            syncBodyState();
            patchTopbar();
            processCards(document.body);
            updateHero();
            updateFullFog();
            applyFullLogo(state.fullMovie);
            moveSplitButtons();
            startHeroLoop();
        }

        function schedulePatch(now) {
            if (scheduled && !now) return;
            scheduled = true;
            setTimeout(safePatch, now ? 10 : 120);
        }

        function startPlugin() {
            addSettings();
            initTmdbSource();
            bindListeners();
            if (!pluginEnabled()) {
                removePluginUi();
                return;
            }
            injectStyle();
            syncBodyState();
            observeDom();
            schedulePatch(true);
        }

        function boot() {
            startPlugin();
        }

        if (window.appready) {
            boot();
        } else {
            try {
                if (Lampa.Listener && typeof Lampa.Listener.follow === 'function') {
                    Lampa.Listener.follow('app', function (event) {
                        if (event.type === 'ready') boot();
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
    }
})();
