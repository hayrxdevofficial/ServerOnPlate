// ==UserScript==
// @name         Roblox Classic Buttons and Likes (iOS & Web)
// @namespace    http://tampermonkey.net
// @version      1.1
// @description  Возвращает классический стиль кнопкам и лайкам на сайте Roblox
// @author       You
// @match        https://*://*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Внедряем CSS-стили для классического вида
    const css = `
        /* СТИЛЬ КЛАССИЧЕСКОЙ ЗЕЛЕНОЙ КНОПКИ ИГРАТЬ */
        .btn-common-play-large, 
        .btn-to-show-play-large,
        .btn-growth-lg,
        button.btn-primary-md,
        .play-button-container button {
            background: linear-gradient(to bottom, #00E300 0%, #008A00 100%) !important;
            border: 2px solid #005F00 !important;
            border-radius: 4px !important;
            box-shadow: inset 0px 2px 0px rgba(255,255,255,0.4), 0px 2px 3px rgba(0,0,0,0.3) !important;
            text-shadow: 1px 1px 1px #003F00 !important;
            color: #FFFFFF !important;
            font-family: "Arial Black", Gadget, sans-serif !important;
            font-weight: bold !important;
        }

        /* КЛАССИЧЕСКАЯ ШКАЛА ЛАЙКОВ (ЗЕЛЕНЫЙ И КРАСНЫЙ) */
        .vote-percentage-bar .vote-percentage, 
        .ex-vote-percentage-bar .ex-vote-percentage {
            background-color: #02B702 !important; /* Старый зеленый */
        }
        
        .vote-percentage-bar, 
        .ex-vote-percentage-bar {
            background-color: #D10000 !important; /* Старый красный */
            border-radius: 0px !important;
            height: 8px !important;
        }

        /* ЦВЕТ ИКОНОК ЛАЙКА И ДИЗЛАЙКА */
        .icon-like, .enable-like, [class*="icon-vote-up"] {
            color: #02B702 !important;
        }

        .icon-dislike, .enable-dislike, [class*="icon-vote-down"] {
            color: #D10000 !important;
        }
    `;

    // Поддержка работы в расширении на iOS
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.documentElement.appendChild(style);
    }
})();
