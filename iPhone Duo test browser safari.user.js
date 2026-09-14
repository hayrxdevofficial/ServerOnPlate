// ==UserScript==
// @name         iPhone Duo Transition
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Имитация анимации перехода как в iPhone Duo (Duo/Meet) + затемнение при переходе в режим вкладок Safari
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const DURATION_IN  = 450; // мс — вход
    const DURATION_OUT = 380; // мс — выход
    const DURATION_TABSWITCH = 320; // мс — затемнение в режим вкладок

    // ---------- Стили ----------
    const style = document.createElement('style');
    style.textContent = `
        html, body {
            transition: opacity ${DURATION_IN}ms cubic-bezier(0.22, 0.61, 0.36, 1),
                        transform ${DURATION_IN}ms cubic-bezier(0.22, 0.61, 0.36, 1),
                        filter ${DURATION_IN}ms cubic-bezier(0.22, 0.61, 0.36, 1);
            transform-origin: center center;
            will-change: opacity, transform, filter;
            backface-visibility: hidden;
        }
        /* Начальное состояние "выхода" (переход по ссылке) */
        html.duo-leaving, html.duo-leaving body {
            opacity: 0;
            transform: scale(0.94);
            filter: blur(8px) brightness(1.1);
            transition-duration: ${DURATION_OUT}ms;
        }
        /* Начальное состояние "входа" — до первого кадра */
        html.duo-entering, html.duo-entering body {
            opacity: 0;
            transform: scale(1.06);
            filter: blur(8px) brightness(1.1);
            transition: none !important;
        }
        /* Плавное появление "чёрного стекла" поверх — как в Duo (при переходе по ссылке) */
        #duo-veil {
            position: fixed;
            inset: 0;
            pointer-events: none;
            background: radial-gradient(
                circle at center,
                rgba(0,0,0,0) 0%,
                rgba(0,0,0,0.35) 70%,
                rgba(0,0,0,0.55) 100%
            );
            opacity: 0;
            z-index: 2147483647;
            transition: opacity ${DURATION_OUT}ms ease-out;
        }
        #duo-veil.show { opacity: 1; }

        /* Отдельный полностью чёрный вуаль — для перехода в режим вкладок Safari
           (не навигация, просто скрытие/показ страницы) */
        #duo-tabswitch-veil {
            position: fixed;
            inset: 0;
            pointer-events: none;
            background: #000;
            opacity: 0;
            z-index: 2147483647;
            transition: opacity ${DURATION_TABSWITCH}ms ease-in-out;
        }
        #duo-tabswitch-veil.show { opacity: 1; }
    `;
    (document.head || document.documentElement).appendChild(style);

    // ---------- Оверлей-вуаль (для навигации по ссылкам) ----------
    const veil = document.createElement('div');
    veil.id = 'duo-veil';

    // ---------- Оверлей-вуаль (для режима вкладок) ----------
    const tabSwitchVeil = document.createElement('div');
    tabSwitchVeil.id = 'duo-tabswitch-veil';

    function mountVeils() {
        if (!document.body) return;
        document.body.appendChild(veil);
        document.body.appendChild(tabSwitchVeil);
    }

    // ---------- Вход ----------
    function playEnter() {
        document.documentElement.classList.add('duo-entering');
        // Форсируем reflow, чтобы transition не «схлопнулся»
        void document.documentElement.offsetHeight;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.documentElement.classList.remove('duo-entering');
            });
        });
    }

    // ---------- Выход (переход по ссылке) ----------
    function playLeave(url) {
        const root = document.documentElement;
        if (root.classList.contains('duo-leaving')) return;

        veil.classList.add('show');
        root.classList.add('duo-leaving');

        // Ждём завершения анимации, потом переходим
        const done = () => {
            window.location.href = url;
        };
        setTimeout(done, DURATION_OUT + 20);

        // На случай bfcache / отмены
        window.addEventListener('pageshow', () => {
            root.classList.remove('duo-leaving');
            veil.classList.remove('show');
        }, { once: true });
    }

    // ---------- Затемнение при переходе в режим вкладок Safari ----------
    // Срабатывает на visibilitychange: когда открывается сетка вкладок,
    // страница получает document.hidden = true, но НЕ выгружается и НЕ закрывается.
    function handleVisibilityChange() {
        if (document.hidden) {
            tabSwitchVeil.classList.add('show');
        } else {
            tabSwitchVeil.classList.remove('show');
        }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Подстраховка: некоторые версии Safari шлют pagehide с persisted=true
    // при сворачивании/переходе в таб-свитчер вместо/вместе с visibilitychange.
    window.addEventListener('pagehide', (e) => {
        if (e.persisted) {
            tabSwitchVeil.classList.add('show');
        }
    });
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            tabSwitchVeil.classList.remove('show');
        }
    });

    // ---------- Перехват переходов по ссылкам ----------
    function isModifiedClick(e) {
        return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
    }

    function isSameOrigin(url) {
        try {
            return new URL(url, location.href).origin === location.origin;
        } catch {
            return false;
        }
    }

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;
        if (link.target && link.target !== '_self') return;
        if (link.hasAttribute('download')) return;
        if (isModifiedClick(e)) return;

        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
        if (!isSameOrigin(href)) return; // внешние ссылки — оставляем как есть

        e.preventDefault();
        playLeave(link.href);
    }, true);

    // Переходы через history.pushState / popstate — просто перезапускаем вход
    window.addEventListener('popstate', () => {
        playEnter();
    });

    // ---------- Инициализация ----------
    // Ставим класс входа как можно раньше
    document.documentElement.classList.add('duo-entering');

    document.addEventListener('DOMContentLoaded', () => {
        mountVeils();
        playEnter();

        // Убираем вуали, если были активны
        veil.classList.remove('show');
        tabSwitchVeil.classList.remove('show');
        document.documentElement.classList.remove('duo-leaving');

        // Если страница уже скрыта на момент загрузки (маловероятно, но на всякий случай)
        if (document.hidden) {
            tabSwitchVeil.classList.add('show');
        }
    });

    // Страховка: если DOMContentLoaded не сработал по какой-то причине
    window.addEventListener('load', () => {
        mountVeils();
        document.documentElement.classList.remove('duo-entering');
    });
})();
