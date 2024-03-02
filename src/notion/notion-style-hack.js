// ==UserScript==
// @name         Notion Style Hack
// @namespace    http://tampermonkey.net/
// @version      2024.3.2-alpha.1
// @description  Notion Style Hack
// @author       Kyon45
// @match        *://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=notion.so
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @grant        none
// @updateURL    https://github.com/kyon45/tampermonkey-scripts/blob/main/meta/notion/notion-style-hack.js
// @downloadURL  https://github.com/kyon45/tampermonkey-scripts/blob/main/src/notion/notion-style-hack.js
// ==/UserScript==

(function() {
  'use strict';
  const _ = window._; // @require lodash

  const COLOR = (() => {
    const color = {
      GREY: '#ABB2BF',
      LINK: '#1D76DB',
    };
    const color_i = _.fromPairs(
      _.toPairs(color).map(([key, value]) => ([`${key}_!`, `${value} !important`])),
    );
    return _.merge(color, color_i);
  })();

  insertCSS(`
  .layout.layout-wide {
    /** 左右边距 */
    --margin-width: 36px;
  }

  /** Link */
  .notion-link-token {
    & > span {
      opacity: 1 !important;
      color: ${COLOR.LINK};
      border-color: ${COLOR['LINK_!']};

      &::after {
        content: " 🡕";
        display: inline;
      }
  }

  /** 安装 Notion Syntax Highlighter 暗色主题后，Code Block 切换语言、编辑器光标设为高亮色 */
  div.notion-selectable.notion-code-block > div:nth-child(1) > div > div:nth-child(1) > div {
    color: ${COLOR['GREY_!']};
    & > svg {
      fill: ${COLOR['GREY_!']};
    }
  }

  div.whenContentEditable div.line-numbers.notion-code-block {
    caret-color: ${COLOR.GREY};
  }

  `);
})();

function sleep(delay = 1000) {
  new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

function insertCSS(cssText = '') {
  const head = document.head;
  const styleEl = document.createElement('style');
  styleEl.textContent = cssText;
  head.appendChild(styleEl);
};

// ref: https://greasyfork.org/zh-CN/scripts/406498-notion-fixed-toc
/**
 * Helper function to wait for the element ready
 * @param {string[]} selectors
 * @returns {Promise<Element[]>}
 */
function waitForDOM(...selectors) {
  return new Promise(resolve => {
    const delay = 500;
    const f = () => {
      const elements = selectors.map(selector => document.querySelector(selector));
      if (elements.every(element => element != null)) {
        resolve(elements);
      } else {
        setTimeout(f, delay);
      }
    }
    f();
  });
}

function throttle(fn, feq=200) {
  let timer = null;
  return function (...args) {
    if (timer) return;
    setTimeout(() => {
      fn.call(this, ...args);
      clearTimeout(timer);
      timer = null;
    }, feq);
  };
}

