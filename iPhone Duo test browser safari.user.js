// ==UserScript==
// @name         Roblox 2008 Ultimate Retro Edition
// @namespace    http://tampermonkey.net
// @version      5.0
// @description  Классика Roblox 2008: синяя шапка, Tix вместо Robux, старый логотип, Comic Sans, квадратный UI.
// @author       AI Ultimate Customizer
// @match        https://*.roblox.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    /* Иконка Tix (жёлтый билет) и логотип ROBLOX как SVG data-URI */
    const TIX_ICON = "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 20'>
  <rect x='1' y='2' width='30' height='16' fill='#FFD34D' stroke='#7A5A00' stroke-width='1.5'/>
  <circle cx='5' cy='10' r='2.5' fill='#E3E3E3' stroke='#7A5A00'/>
  <circle cx='27' cy='10' r='2.5' fill='#E3E3E3' stroke='#7A5A00'/>
  <text x='16' y='15' text-anchor='middle' font-family='Arial Black,Arial' font-size='9'
        font-weight='900' fill='#7A5A00'>TIX</text>
</svg>`);

    const ROBLOX_LOGO = "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 50'>
  <g font-family='Arial Black,Arial,sans-serif' font-size='40' font-weight='900'
     fill='#FFFFFF' stroke='#001A4D' stroke-width='1.5' letter-spacing='-2'>
    <text x='110' y='38' text-anchor='middle'>ROBLOX</text>
  </g>
</svg>`);

    const css = `
        /* ==================== БАЗА ==================== */
        html, body, #wrap, #container, #master-container, #root {
            background: #E3E3E3 !important;
            color: #000 !important;
            font-family: "Comic Sans MS", "Comic Sans", "Lucida Sans", Arial, sans-serif !important;
        }
        *, *::before, *::after {
            border-radius: 0 !important;
            box-shadow: none !important;
            text-shadow: none !important;
        }

        /* Ссылки — как в 2008: подчёркнутые синие */
        a, a:visited { color: #0000CC !important; text-decoration: underline !important; }
        a:hover, a:focus { color: #FF0000 !important; }

        /* Заголовки — Comic Sans, жирные, без капса */
        h1, h2, h3, h4, h5, h6,
        [class*="text-title"], [class*="game-name"],
        [class*="GameCardName"], [class*="game-card-name"] {
            font-family: "Comic Sans MS", Arial, sans-serif !important;
            font-weight: bold !important;
            color: #000 !important;
        }

        /* ==================== СИНЯЯ ШАПКА 2008 ==================== */
        header, #header, #navigation, .navbar, nav[class*="navbar"],
        [class*="navigation-container"], [class*="NavigationBar"],
        [class*="rbx-header"], .rbx-header {
            background: #003399 !important;
            background-image: linear-gradient(#003399 0%, #002266 100%) !important;
            border-bottom: 3px solid #001A4D !important;
            color: #FFFFFF !important;
        }
        header a, #header a, #navigation a, .navbar a,
        nav[class*="navbar"] a, [class*="rbx-header"] a {
            color: #FFFFFF !important;
            text-decoration: none !important;
            font-family: Arial, sans-serif !important;
            font-weight: bold !important;
        }
        header a:hover, #navigation a:hover { color: #FFD34D !important; }

        /* ==================== ЛОГОТИП ROBLOX 2008 ==================== */
        .icon-logo-rblx, .icon-logo, .rbx-logo,
        [class*="logo"][class*="rbx"], [class*="navbar-logo"],
        [class*="NavLogo"], a[href="/home"] > svg {
            background: none !important;
            background-image: url("${ROBLOX_LOGO}") !important;
            background-size: contain !important;
            background-position: left center !important;
            background-repeat: no-repeat !important;
            width: 160px !important;
            height: 40px !important;
            font-size: 0 !important;
            color: transparent !important;
            overflow: hidden !important;
        }
        .icon-logo-rblx svg, .rbx-logo svg,
        [class*="navbar-logo"] svg { display: none !important; }

        /* ==================== ПАНЕЛИ, КАРТОЧКИ И БЛОКИ ==================== */
        .container, .content, .section, .game-card, .item-card-container,
        .game-card-container, .section-content, .game-cards,
        [class*="card"], [class*="Card"],
        [class*="panel"], [class*="Panel"],
        [class*="content-container"], [class*="ContentContainer"] {
            background: #FFFFFF !important;
            border: 1px solid #808080 !important;
            border-radius: 0 !important;
        }

        /* Тонкая рамка вокруг аватаров и превью — как в старом UI */
        img, .avatar-card-image, .game-card-thumb,
        [class*="avatar"], [class*="Avatar"], .avatar-back {
            border-radius: 0 !important;
            border: 1px solid #A0A0A0 !important;
        }

        /* ==================== ГЛАВНАЯ КНОПКА PLAY (объёмная) ==================== */
        .btn-common-play-game-lg, .btn-common-play-game,
        .game-play-button-container .btn-primary-lg,
        #game-details-play-button-container button,
        button[data-testid="play-button"], .xcon-playv2, .play-button {
            background: #00E600 !important;
            border-top:    3px solid #66FF66 !important;
            border-left:   3px solid #66FF66 !important;
            border-bottom: 3px solid #008000 !important;
            border-right:  3px solid #008000 !important;
            border-radius: 0 !important;
            color: #000 !important;
            font-family: "Comic Sans MS", sans-serif !important;
            font-weight: bold !important;
            font-size: 20px !important;
            text-transform: none !important;
        }
        button[data-testid="play-button"]:hover { background: #33FF33 !important; }
        button[data-testid="play-button"] svg,
        button[data-testid="play-button"] .icon-play { display: none !important; }

        /* ==================== ОБЫЧНЫЕ КНОПКИ (как в Windows XP) ==================== */
        button:not([data-testid="play-button"]):not(.play-button),
        .btn, .btn-primary, .btn-secondary, .btn-common,
        [class*="btn-primary"], [class*="btn-secondary"],
        [class*="btn-common"], input[type="submit"], input[type="button"] {
            background: #E1E1E1 !important;
            border-top:    2px solid #FFFFFF !important;
            border-left:   2px solid #FFFFFF !important;
            border-bottom: 2px solid #717171 !important;
            border-right:  2px solid #717171 !important;
            border-radius: 0 !important;
            color: #000 !important;
            font-family: "Comic Sans MS", Arial, sans-serif !important;
        }
        button:not([data-testid="play-button"]):active {
            border-top:    2px solid #717171 !important;
            border-left:   2px solid #717171 !important;
            border-bottom: 2px solid #FFFFFF !important;
            border-right:  2px solid #FFFFFF !important;
        }

        /* ==================== ROBUX → TIX (жёлтые билеты) ==================== */
        .icon-robux, .icon-robux-gray, .icon-nav-robux,
        [class*="robux-icon"], [class*="RobuxIcon"] {
            background-image: url("${TIX_ICON}") !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            color: transparent !important;
            width: 24px !important;
            height: 16px !important;
        }
        [class*="robux-text"], [class*="RobuxText"], #nav-robux-balance,
        [class*="robux-amount"], [class*="RobuxAmount"] {
            color: #7A5A00 !important;
            font-weight: bold !important;
            font-family: "Comic Sans MS", Arial, sans-serif !important;
        }

        /* ==================== ФОРМЫ / ИНПУТЫ ==================== */
        input[type="text"], input[type="search"], input[type="email"],
        input[type="password"], textarea, select {
            background: #FFFFFF !important;
            border: 2px inset #A0A0A0 !important;
            border-radius: 0 !important;
            font-family: "Comic Sans MS", Arial, sans-serif !important;
            color: #000 !important;
        }

        /* Скроллбары в стиле WinXP (в webkit) */
        ::-webkit-scrollbar { width: 16px; height: 16px; }
        ::-webkit-scrollbar-track { background: #E1E1E1; border: 1px solid #A0A0A0; }
        ::-webkit-scrollbar-thumb {
            background: #C0C0C0;
            border-top:    1px solid #FFF;
            border-left:   1px solid #FFF;
            border-bottom: 1px solid #707070;
            border-right:  1px solid #707070;
        }
        ::-webkit-scrollbar-thumb:hover { background: #D0D0D0; }
    `;

    function inject() {
        if (document.getElementById('roblox-2008-theme')) return;
        const style = document.createElement('style');
        style.id = 'roblox-2008-theme';
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        (document.head || document.documentElement).appendChild(style);
    }

    inject();
    document.addEventListener('DOMContentLoaded', inject);

    const observer = new MutationObserver(inject);
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
