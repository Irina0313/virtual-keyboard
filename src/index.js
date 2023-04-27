/* eslint-disable no-console */
import '@babel/polyfill/lib';
import './index.html';
import './style.scss';

import { ElementBuilder } from './modules/elem-builder';

/*  create document strucrure  */
let lang = 'EN';
const body = document.querySelector('body');

/*  header  */

let header = new ElementBuilder('header', body, 'header', 'header__wrapper');
header = header.createElement();

let h1 = new ElementBuilder('h1', header, 'title');
h1 = h1.createElement();
h1.innerText = 'Type something amazing :)';

/*  main  */

let main = new ElementBuilder('main', body, 'main', 'main__wrapper');
main = main.createElement();

let section = new ElementBuilder('section', main, 'section', 'letter');
section = section.createElement();

let div = new ElementBuilder('div', section, 'letter__container');
div = div.createElement();

let textarea = new ElementBuilder('textarea', div, 'letter__input');
textarea = textarea.createElement();
textarea.setAttribute('name', 'letter');
textarea.setAttribute('id', 'letter');
textarea.setAttribute('cols', '30');
textarea.setAttribute('rows', '10');

section = new ElementBuilder('section', main, 'section', 'keyboard');
section = section.createElement();

div = new ElementBuilder('div', section, 'keyboard__container');
const keyboardSection = div.createElement();

let keyRow;
for (let i = 0; i < 5; i += 1) {
  keyRow = new ElementBuilder('div', keyboardSection, 'keyboard__row');
  keyRow = keyRow.createElement();
}
const keyCodeLayout = ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace', 'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Delete', 'CapsLock', 'Keya', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Backslash', 'Enter', 'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight', 'ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ControlRight'];

const engLayout = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', 'Del'],
  ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", '\\', 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', '', 'Shift'],
  ['Ctrl', 'Win', 'Alt', '', 'Alt', '', '', '', 'Ctrl'],
];

keyRow = document.querySelectorAll('.keyboard__row');
let span;
engLayout.forEach((item, i) => {
  item.forEach((el) => {
    span = new ElementBuilder('span', keyRow[i], 'key');
    span = span.createElement();
    span.innerText = el;
    if (el === 'Backspace' || el === 'Tab' || el === 'CapsLock' || el === 'Enter' || el === 'Shift') {
      span.classList.add(el.toLowerCase());
    }
  });
});

const spaceKey = keyRow[4].children[3];
spaceKey.classList.add('space');

const upKey = keyRow[3].children[11];
upKey.innerHTML = '&#9650;';

const leftKey = keyRow[4].children[5];
leftKey.innerHTML = '&#9668;';

const downKey = keyRow[4].children[6];
downKey.innerHTML = '&#9660;';

const rightKey = keyRow[4].children[7];
rightKey.innerHTML = '&#9658;';

/*  footer  */

let footer = new ElementBuilder('footer', body, 'footer');
footer = footer.createElement();

div = new ElementBuilder('div', footer, 'footer__row');
div = div.createElement();
div.innerText = 'Prodused by Iryna Kanavalchuk';

/* add animation after key put down on the keyboard */

let keyArr = document.querySelectorAll('.key');

document.addEventListener('keydown', (event) => {
  keyCodeLayout.forEach((el, i) => {
    if (event.code === el) {
      keyArr[i].classList.add('key_active');
    }
  });
});

document.addEventListener('keyup', (event) => {
  keyCodeLayout.forEach((el, i) => {
    if (event.code === el) {
      keyArr[i].classList.remove('key_active');
    }
  });
});
