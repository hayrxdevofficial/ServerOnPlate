// ==UserScript==
// @name         Roblox 2008 Classic Theme (Full Page)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Полностью классический вид Roblox 2008: плоские зелёные кнопки без теней, зелёный лайк, красный дизлайк, жёлтый Фаворит, старый серый фон
// @author       You
// @match        https://www.roblox.com/*
// @match        https://web.roblox.com/*
// @match        https://roblox.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const COLORS = {
        play:         '#3CB043',   // плоский зелёный
        playHover:    '#4FCC57',
        playBorder:   '#1B5E1B',
        like:         '#4CAF50',
        dislike:      '#D32F2F',
        favorite:     '#FFC107',   // жёлтый всегда
        favoriteHover:'#FFD54F',
        favoriteBord: '#E0A800',
        barBg:        '#C62828',
        pageBg:       '#E8E8E8',   // старый серый фон
        panelBg:      '#FFFFFF',
        panelBorder:  '#B0B0B0',
        headerBg:     '#1F1F1F',
        headerText:   '#FFFFFF',
        link:         '#0033CC',
        linkHover:    '#0055FF',
        text:         '#000000',
    };

    const css = `
        /* =========================================================
           БАЗОВЫЙ ФОН И ТЕКСТ — классика 2008
           ========================================================= */
        html, body {
            background-color: ${COLORS.pageBg} !important;
            color: ${COLORS.text} !important;
            font-family: Arial, Helvetica, sans-serif !important;
        }

        a, a:visited {
            color: ${COLORS.link} !important;
            text-decoration: underline !important;
        }
        a:hover {
            color: ${COLORS.linkHover} !important;
            text-decoration: underline !important;
        }

        h1, h2, h3 {
            font-family: "Comic Sans MS", "Arial", sans-serif !important;
            color: #222 !important;
            font-weight: bold !important;
            text-shadow: none !important;
        }

        /* =========================================================
           ВЕРХНЯЯ ПАНЕЛЬ (NAVIGATION)
           ========================================================= */
        #navigation,
        .navbar,
        nav[class*="navbar"],
        [class*="navigation-container"],
        [class*="NavigationBar"],
        header[class*="navbar"] {
            background: ${COLORS.headerBg} !important;
            background-image: none !important;
            border-bottom: 2px solid #000 !important;
            box-shadow: none !important;
        }
        #navigation a,
        .navbar a,
        nav[class*="navbar"] a {
            color: ${COLORS.headerText} !important;
            text-decoration: none !important;
        }
        #navigation a:hover,
        .navbar a:hover {
            text-decoration: underline !important;
        }

        /* =========================================================
           ПАНЕЛИ / КАРТОЧКИ — плоский белый прямоугольник
           ========================================================= */
        .container,
        .content,
        .section,
        .game-card,
        [class*="card"],
        [class*="Card"],
        [class*="panel"],
        [class*="Panel"],
        .game-card-container,
        .item-card-container,
        .game-cards,
        .section-content {
            background: ${COLORS.panelBg} !important;
            border: 1px solid ${COLORS.panelBorder} !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background-image: none !important;
        }

        /* Убираем скругления у всех иконок/аватаров на карточках (старый стиль) */
        img[class*="avatar"],
        img[class*="thumbnail"],
        .avatar-card-image,
        .game-card-thumb,
        .game-card-thumb-container {
            border-radius: 0 !important;
            box-shadow: none !important;
        }

        /* =========================================================
           PLAY BUTTON — плоская зелёная 2008, БЕЗ ТЕНЕЙ
           ========================================================= */
        .btn-common-play-game-lg,
        .btn-common-play-game,
        .btn-growth-lg,
        .btn-growth-md,
        .game-play-button-container .btn-primary-lg,
        .game-play-button-container .btn-primary-md,
        #game-details-play-button-container .btn-primary-lg,
        #game-details-play-button-container button,
        .play-button-container button,
        button[data-testid="play-button"] {
            background: ${COLORS.play} !important;
            background-image: none !important;
            border: 2px solid ${COLORS.playBorder} !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            color: #FFFFFF !important;
            text-shadow: none !important;
            font-weight: bold !important;
            font-family: Arial, sans-serif !important;
        }
        .btn-common-play-game-lg:hover,
        .btn-growth-lg:hover,
        .game-play-button-container .btn-primary-lg:hover,
        button[data-testid="play-button"]:hover {
            background: ${COLORS.playHover} !important;
            background-image: none !important;
            box-shadow: none !important;
        }

        /* =========================================================
           ВСЕ ОСТАЛЬНЫЕ КНОПКИ — ПЛОСКИЕ, БЕЗ ТЕНЕЙ
           ========================================================= */
        button,
        .btn,
        [class*="btn-primary"],
        [class*="btn-secondary"],
        [class*="btn-common"] {
            border-radius: 0 !important;
            box-shadow: none !important;
            text-shadow: none !important;
            background-image: none !important;
        }

        /* =========================================================
           VOTE BAR
           ========================================================= */
        .vote-percentage-bar,
        .ex-vote-percentage-bar,
        [class*="vote-percentage-bar"],
        [class*="VotePercentageBar"] {
            background-color: ${COLORS.barBg} !important;
            border-radius: 0 !important;
            height: 8px !important;
            box-shadow: none !important;
        }
        .vote-percentage-bar .vote-percentage,
        .ex-vote-percentage-bar .ex-vote-percentage,
        [class*="vote-percentage"]:not([class*="bar"]),
        [class*="VotePercentageFill"] {
            background-color: ${COLORS.like} !important;
            border-radius: 0 !important;
        }

        /* =========================================================
           LIKE — ЗЕЛЁНЫЙ
           ========================================================= */
        .icon-like,
        .enable-like,
        .icon-vote-up,
        [class*="icon-like"]:not([class*="dislike"]),
        [class*="vote-up"],
        [class*="VoteUp"],
        button[data-testid="upvote-button"],
        .vote-up-button,
        .upvote {
            color: ${COLORS.like} !important;
            fill: ${COLORS.like} !important;
            box-shadow: none !important;
        }
        .icon-like svg, .vote-up-button svg,
        [class*="icon-like"]:not([class*="dislike"]) svg,
        button[data-testid="upvote-button"] svg {
            fill: ${COLORS.like} !important;
            stroke: ${COLORS.like} !important;
        }

        /* =========================================================
           DISLIKE — КРАСНЫЙ
           ========================================================= */
        .icon-dislike,
        .enable-dislike,
        .icon-vote-down,
        [class*="icon-dislike"],
        [class*="vote-down"],
        [class*="VoteDown"],
        button[data-testid="downvote-button"],
        .vote-down-button,
        .downvote {
            color: ${COLORS.dislike} !important;
            fill: ${COLORS.dislike} !important;
            box-shadow: none !important;
        }
        .icon-dislike svg, .vote-down-button svg,
        [class*="icon-dislike"] svg,
        button[data-testid="downvote-button"] svg {
            fill: ${COLORS.dislike} !important;
            stroke: ${COLORS.dislike} !important;
        }

        /* =========================================================
           FAVORITE — ВСЕГДА ЖЁЛТЫЙ (и кнопка, и иконка)
           ========================================================= */
        .icon-favorite,
        .icon-favorite-selected,
        .icon-unfavorite,
        #favorite-button,
        #favorite-button.btn-primary,
        [class*="favorite-button"],
        [class*="favoriteButton"],
        button[data-testid="favorite-button"],
        .favorite-button,
        .favorite {
            color: ${COLORS.favorite} !important;
            background-color: ${COLORS.favorite} !important;
            background-image: none !important;
            border: 2px solid ${COLORS.favoriteBord} !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            text-shadow: none !important;
            font-weight: bold !important;
        }
        .icon-favorite svg,
        .icon-favorite-selected svg,
        .icon-unfavorite svg,
        #favorite-button svg,
        [class*="favorite-button"] svg,
        button[data-testid="favorite-button"] svg {
            fill: #FFFFFF !important;
            stroke: #FFFFFF !important;
        }
        #favorite-button:hover,
        button[data-testid="favorite-button"]:hover,
        [class*="favorite-button"]:hover {
            background-color: ${COLORS.favoriteHover} !important;
            box-shadow: none !important;
        }

        /* Если кнопка favorite — просто иконка в голосовании (без фона) */
        .icon-favorite:not([class*="button"]),
        .icon-favorite-selected:not([class*="button"]),
        .icon-unfavorite {
            background-color: transparent !important;
            border: none !important;
        }
        .icon-favorite:not([class*="button"]) svg,
        .icon-favorite-selected:not([class*="button"]) svg,
        .icon-unfavorite svg {
            fill: ${COLORS.favorite} !important;
            stroke: ${COLORS.favoriteBord} !important;
        }

        /* =========================================================
           ИНПУТЫ, СЕЛЕКТЫ — старый квадратный стиль
           ========================================================= */
        input[type="text"],
        input[type="search"],
        input[type="email"],
        input[type="password"],
        textarea,
        select {
            border: 1px solid #7A7A7A !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: #FFFFFF !important;
            background-image: none !important;
        }

        /* =========================================================
           УБИРАЕМ ВСЕ ТЕНИ И СКРУГЛЕНИЯ НА САЙТЕ (грубо, но радикально)
           ========================================================= */
        * {
            box-shadow: none !important;
            text-shadow: none !important;
        }
    `;

    function injectStyles() {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
        }
    }

    injectStyles();

    // Ранняя инъекция до появления <head>
    if (!document.head) {
        const earlyStyle = document.createElement('style');
        earlyStyle.textContent = css;
        document.documentElement.appendChild(earlyStyle);
    }
})();
