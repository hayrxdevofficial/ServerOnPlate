// ==UserScript==
// @name         Roblox 2008 Ultimate Retro Edition
// @namespace    http://tampermonkey.net
// @version      4.0
// @description  Абсолютное возвращение Roblox 2008: синяя шапка, Tix вместо Robux, старый логотип, Comic Sans, квадратный UI и максимальная оптимизация.
// @author       AI Ultimate Customizer
// @match        https://*://*
// @match        https://roblox.com*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Скомпилированный минифицированный CSS для максимального FPS и мгновенной загрузки
    const css = `
        html,body{background-color:#E3E3E3!important;color:#000!important;font-family:"Comic Sans MS","Lucida Sans",Arial,sans-serif!important;cursor:url('https://rbxcdn.com'),default!important}
        a,a:visited{color:#0000EE!important;text-decoration:underline!important}
        a:hover{color:#0000FF!important}
        h1,h2,h3,h4,h5,h6,.game-name,.text-title,[class*="game-card-name"],[class*="GameCardName"]{font-family:"Comic Sans MS",Arial,sans-serif!important;color:#000!important;font-weight:bold!important;text-shadow:none!important}
        
        /* ВЕРХНЯЯ СИНЯЯ ПАНЕЛЬ 2008 И СТАРЫЙ ЛОГОТИП */
        #navigation,.navbar,nav[class*="navbar"],[class*="navigation-container"],[class*="NavigationBar"],header[class*="navbar"]{background:#003399!important;border-bottom:3px solid #001A4D!important;box-shadow:none!important}
        #navigation a,.navbar a,nav[class*="navbar"] a{color:#FFF!important;font-family:Arial,sans-serif!important;font-weight:bold!important}
        #navigation a:hover,.navbar a:hover{background-color:#002266!important}
        
        /* Замена логотипа на каноничную надпись 2008 года */
        .icon-logo-rblx, .icon-logo, [class*="logo"], [class*="Logo"] {
            background-image: url('https://rbxcdn.com') !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            width: 130px !important;
            height: 35px !important;
        }

        /* Квадратные панели и карточки (Никакого плоского Flat-дизайна и скруглений) */
        .container,.content,.section,.game-card,[class*="card"],[class*="Card"],[class*="panel"],[class*="Panel"],.game-card-container,.item-card-container,.game-cards,.section-content{background:#FFF!important;border:2px solid #808080!important;border-radius:0!important;box-shadow:none!important}
        img,img[class*="avatar"],img[class*="thumbnail"],.avatar-card-image,.game-card-thumb,.game-card-thumb-container,[class*="avatar"], [class*="Avatar"]{border-radius:0!important;box-shadow:none!important;border:1px solid #A0A0A0!important}
        
        /* ОБЪЕМНАЯ ЗЕЛЕНАЯ КНОПКА PLAY (Светлый верх, темный низ) */
        .btn-common-play-game-lg,.btn-common-play-game,.btn-growth-lg,.btn-growth-md,.game-play-button-container .btn-primary-lg,.game-play-button-container .btn-primary-md,#game-details-play-button-container .btn-primary-lg,#game-details-play-button-container button,.play-button-container button,button[data-testid="play-button"]{background:#00E600!important;border-top:3px solid #66FF66!important;border-left:3px solid #66FF66!important;border-bottom:3px solid #008000!important;border-right:3px solid #008000!important;border-radius:0!important;box-shadow:none!important;color:#000!important;font-weight:bold!important;font-size:22px!important;font-family:"Comic Sans MS",sans-serif!important}
        .btn-common-play-game-lg:hover,button[data-testid="play-button"]:hover{background:#1AFF1A!important;border-top:3px solid #99FF99!important;border-bottom:3px solid #005900!important}
        button[data-testid="play-button"] .icon-play,button[data-testid="play-button"] span[class*="icon"]{display:none!important}

        /* ДРУГИЕ КНОПКИ В СТИЛЕ СТАРЫХ WINDOWS / ROBLOX */
        button,.btn,[class*="btn-primary"],[class*="btn-secondary"],[class*="btn-common"]{border-radius:0!important;box-shadow:none!important;background-color:#E1E1E1!important;border-top:2px solid #FFF!important;border-left:2px solid #FFF!important;border-bottom:2px solid #717171!important;border-right:2px solid #717171!important;color:#000!important}
        
        /* ИКОНКА ROBUX -> В КЛАССИЧЕСКИЕ БИЛЕТЫ (TIX) */
        .icon-robux, .icon-robux-gray, [class*="robux"], [class*="Robux"], .icon-nav-robux {
            background-image: url('https://rbxcdn.com') !important; /* Каноничный золотой/зеленый тикет */
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            color: #008000 !important; /* Зеленый баланс */
        }
        [class*="robux-text"], [class*="RobuxText"] { color: #008000 !important; font-weight: bold !important; }

        /* СТАРЫЙ ДИЗЛАЙК-БАР */
        .vote-percentage-bar,[class*="vote-percentage-bar"],[class*="VotePercentageBar"]{background-color:#CC0000!important;border:1px solid #000!important;border-radius:0!important;height:10px!important}
        .vote-percentage-bar .vote-percentage,[class*="vote-percentage"]:not([class*="bar"]),[class*="VotePercentageFill"]{background-color:#00CC00!important;border-radius:0!important}
        button[data-testid="upvote-button"],.vote-up-button,.upvote{color:#00CC00!important}
        button[data-testid="downvote-button"],.vote-down-button,.downvote{color:#FF0000!important}

        /* КНОПКА FAVORITE (Классический Оранжевый) */
        #favorite-button,[class*="favorite-button"],button[data-testid="favorite-button"]{background-color:#FFA500!important;border-top:2px solid #FFB732!important;border-left:2px solid #FFB732!important;border-bottom:2px solid #B37400!important;border-right:2px solid #B37400!important;border-radius:0!important;color:#000!important}
        
        /* ЖЕСТКИЙ СБРОС ВСЕХ СОВРЕМЕННЫХ СКРУГЛЕНИЙ (РАДИКАЛЬНЫЙ RETRO-ФИКС) */
        *, *::before, *::after { box-shadow:none!important; text-shadow:none!important; border-radius:0!important; }
    `;

    // Быстрое и безопасное внедрение стилей в DOM до начала рендеринга элементов
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        const root = document.head || document.documentElement;
        if (root) {
            root.appendChild(style);
        } else {
            document.addEventListener("DOMContentLoaded", () => document.head.appendChild(style));
        }
    }
})();
