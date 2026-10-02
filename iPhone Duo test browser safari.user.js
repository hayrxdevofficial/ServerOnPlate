// ==UserScript==
// @name         Roblox 2008 Classic Theme (Play / Like / Dislike / Favorite)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Возвращает классический вид Roblox 2008: чистая зелёная кнопка Play, зелёный лайк, красный дизлайк, жёлтый Фаворит
// @author       You
// @match        https://www.roblox.com/*
// @match        https://web.roblox.com/*
// @match        https://roblox.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // ==== ЦВЕТА КЛАССИКИ 2008 ====
    const COLORS = {
        playTop:    '#3CB043',  // основной зелёный
        playBottom: '#2E8B2E',  // нижний оттенок (лёгкий бевел)
        playBorder: '#1B5E1B',
        like:       '#4CAF50',  // зелёный лайк
        dislike:    '#D32F2F',  // красный дизлайк
        favorite:   '#FFC107',  // жёлтый Фаворит
        favoriteBorder: '#E0A800',
        barBg:      '#C62828',  // фон полосы голосования (красный)
    };

    const css = `
        /* ============================================
           PLAY BUTTON — классическая зелёная 2008
           ============================================ */
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
            background: linear-gradient(to bottom, ${COLORS.playTop} 0%, ${COLORS.playBottom} 100%) !important;
            border: 2px solid ${COLORS.playBorder} !important;
            border-radius: 4px !important;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.35),
                        0 2px 3px rgba(0,0,0,0.35) !important;
            color: #FFFFFF !important;
            text-shadow: 1px 1px 0 ${COLORS.playBorder} !important;
            font-weight: bold !important;
        }
        .btn-common-play-game-lg:hover,
        .btn-growth-lg:hover,
        .game-play-button-container .btn-primary-lg:hover,
        button[data-testid="play-button"]:hover {
            background: linear-gradient(to bottom, #4FCC57 0%, #359B35 100%) !important;
        }

        /* ============================================
           VOTE BAR — полоса голосования
           ============================================ */
        .vote-percentage-bar,
        .ex-vote-percentage-bar,
        [class*="vote-percentage-bar"],
        [class*="VotePercentageBar"] {
            background-color: ${COLORS.barBg} !important;
            border-radius: 2px !important;
            height: 8px !important;
        }
        .vote-percentage-bar .vote-percentage,
        .ex-vote-percentage-bar .ex-vote-percentage,
        [class*="vote-percentage"]:not([class*="bar"]),
        [class*="VotePercentageFill"] {
            background-color: ${COLORS.like} !important;
            border-radius: 2px !important;
        }

        /* ============================================
           LIKE (палец вверх) — зелёный
           ============================================ */
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
        }
        .icon-like svg, .vote-up-button svg,
        [class*="icon-like"]:not([class*="dislike"]) svg,
        button[data-testid="upvote-button"] svg {
            fill: ${COLORS.like} !important;
            stroke: ${COLORS.like} !important;
        }

        /* ============================================
           DISLIKE (палец вниз) — красный
           ============================================ */
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
        }
        .icon-dislike svg, .vote-down-button svg,
        [class*="icon-dislike"] svg,
        button[data-testid="downvote-button"] svg {
            fill: ${COLORS.dislike} !important;
            stroke: ${COLORS.dislike} !important;
        }

        /* ============================================
           FAVORITE / ИЗБРАННОЕ — жёлтый
           ============================================ */
        .icon-favorite,
        .icon-favorite-selected,
        #favorite-button,
        #favorite-button.btn-primary,
        [class*="favorite-button"],
        [class*="favoriteButton"],
        button[data-testid="favorite-button"],
        .favorite-button,
        .favorite {
            color: ${COLORS.favorite} !important;
        }
        .icon-favorite svg,
        .icon-favorite-selected svg,
        #favorite-button svg,
        [class*="favorite-button"] svg,
        button[data-testid="favorite-button"] svg {
            fill: ${COLORS.favorite} !important;
            stroke: ${COLORS.favoriteBorder} !important;
        }
        #favorite-button,
        button[data-testid="favorite-button"] {
            background-color: ${COLORS.favorite} !important;
            border: 2px solid ${COLORS.favoriteBorder} !important;
            border-radius: 4px !important;
            color: #3A2A00 !important;
            text-shadow: none !important;
            font-weight: bold !important;
        }
        #favorite-button:hover,
        button[data-testid="favorite-button"]:hover {
            background-color: #FFD54F !important;
        }

        /* ============================================
           UNFAVORITE — если кнопка уже выбрана
           ============================================ */
        .icon-unfavorite,
        [class*="unfavorite"] {
            color: #9E9E9E !important;
        }
        .icon-unfavorite svg,
        [class*="unfavorite"] svg {
            fill: #9E9E9E !important;
        }
    `;

    // ==== Внедрение CSS (совместимо с iOS-расширениями) ====
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

    // ==== Реакция на динамическую подгрузку SPA Roblox ====
    // Roblox подгружает кнопки асинхронно, поэтому без этого
    // часть стилей может не примениться до перезагрузки.
    const observer = new MutationObserver(() => {
        // Ничего делать не нужно — CSS уже применён ко всему документу.
        // Observer нужен, только если хочешь вручную инжектить классы.
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // ==== Ранняя инъекция до <head> (для iOS Safari) ====
    if (!document.head) {
        const earlyStyle = document.createElement('style');
        earlyStyle.textContent = css;
        document.documentElement.appendChild(earlyStyle);
    }
})();
