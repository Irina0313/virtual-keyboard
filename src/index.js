import '@babel/polyfill/lib';
import './index.html';
import './style.scss';

import { ElementBuilder } from './modules/elem-builder';
import {
  keyCodeLayout,
  engLayout,
  ruLayout,
  ruLayoutLowerCase,
  engLayoutLowerCase,
  engLayoutShiftPressed,
  ruLayoutShiftPressed,
  engLayoutShiftPressedLowerCase,
  ruLayoutShiftPressedLowerCase,
} from './modules/keyboards-layouts';

/*  create document strucrure  */
if (!localStorage.lang || localStorage.lang === '') {
  localStorage.setItem('lang', 'EN');
}

function getLang() {
  return localStorage.getItem('lang');
}
let capsLock = 'active';
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

keyRow = document.querySelectorAll('.keyboard__row');
let span;
let currentLayout = '';
let lang = getLang();
if (lang === 'EN') {
  currentLayout = engLayout;
} else {
  currentLayout = ruLayout;
}
currentLayout.forEach((item, i) => {
  item.forEach((el) => {
    span = new ElementBuilder('span', keyRow[i], 'key');
    span = span.createElement();
    span.innerText = el;
    if (el === 'Backspace' || el === 'Tab' || el === 'CapsLock' || el === 'Enter' || el === 'Shift') {
      span.classList.add(el.toLowerCase());
    }
    if (el === 'CapsLock') {
      span.classList.add('capslock_active');
    }
  });
});

const spaceKey = keyRow[4].children[3];
spaceKey.classList.add('space');

const setArrows = () => {
  const upKey = keyRow[3].children[11];
  upKey.innerHTML = '&#9650;';
  upKey.classList.add('arrow');

  const leftKey = keyRow[4].children[5];
  leftKey.classList.add('arrow');
  leftKey.innerHTML = '&#9668;';

  const downKey = keyRow[4].children[6];
  downKey.innerHTML = '&#9660;';
  downKey.classList.add('arrow');

  const rightKey = keyRow[4].children[7];
  rightKey.innerHTML = '&#9658;';
  rightKey.classList.add('arrow');
};
setArrows();

const keys = document.querySelectorAll('.key');
for (let i = 0; i < keys.length; i += 1) {
  keys[i].classList.add(keyCodeLayout[i].toLowerCase());
}

/*  footer  */

let footer = new ElementBuilder('footer', body, 'footer');
footer = footer.createElement();

div = new ElementBuilder('div', footer, 'footer__row');
const footerRow = div.createElement();

span = new ElementBuilder('span', footerRow, 'footer__item');
span = span.createElement();

span = new ElementBuilder('span', footerRow, 'footer__item');
span = span.createElement();

const footerItems = document.querySelectorAll('.footer__item');
const [language, system] = footerItems;
language.innerText = 'Change language: Ctrl+Alt (right or left)';
system.innerText = 'designed for Windows keyboard layout';

/*  function to change the layout  */

const changeLayout = (layoutRu, layoutEn) => {
  lang = getLang();
  for (let i = 0; i < keyRow.length; i += 1) {
    for (let k = 0; k < keyRow[i].childElementCount; k += 1) {
      if (lang === 'RU') {
        keyRow[i].children[k].innerText = layoutRu[i][k];
      } else {
        keyRow[i].children[k].innerText = layoutEn[i][k];
      }
    }
  }
  setArrows();
};

/*  Changing of the layout by Ctrl + Alt press (both left or right)  */

function getPressedShiftAlt(change, ...codes) {
  const pressed = new Set();
  document.addEventListener('keydown', (event) => {
    pressed.add(event.code.toLowerCase());
    for (let i = 0; i < codes.length; i += 1) {
      if (!pressed.has(codes[i])) {
        return;
      }
    }
    pressed.clear();
    lang = getLang();
    if (lang === 'EN') {
      localStorage.lang = 'RU';
    } else {
      localStorage.lang = 'EN';
    }
    if (capsLock === 'active' && event.repeat !== true) {
      change(ruLayout, engLayout);
    } else {
      change(ruLayoutLowerCase, engLayoutLowerCase);
    }
  });

  document.addEventListener('mousedown', (event) => {
    pressed.add(event.target.classList[1]);
    for (let i = 0; i < codes.length; i += 1) {
      if (!pressed.has(codes[i])) {
        return;
      }
    }
    pressed.clear();
    lang = getLang();
    if (lang === 'EN') {
      localStorage.lang = 'RU';
    } else {
      localStorage.lang = 'EN';
    }

    if (capsLock === 'active' && event.repeat !== true) {
      change(ruLayout, engLayout);
    } else {
      change(ruLayoutLowerCase, engLayoutLowerCase);
    }
  });
  document.addEventListener('keyup', (event) => {
    pressed.delete(event.code);
  });

  document.addEventListener('mouseup', (event) => {
    pressed.delete(event.target.classList[1]);
  });
}

getPressedShiftAlt(
  changeLayout,
  'controlleft',
  'altleft',
);
getPressedShiftAlt(
  changeLayout,
  'controlright',
  'altright',
);

/*  check if CapsLock or Shift were pressed on physical or virtual keyboard  */

function getPressedCapsLock(change, ...codes) {
  let pressed = '';
  function runKeyDownFunction(event) {
    if (event.code === undefined && ((event.target.innerText === 'CapsLock'))) {
      pressed = event.target.innerText;
    } else if (event.target.innerText === 'Shift') {
      const [, , class2] = event.target.classList;
      pressed = class2;
    } else if (event.code) {
      pressed = event.code;
    }

    if (!codes.includes(pressed)) {
      return;
    }

    if (pressed === 'CapsLock') {
      if (capsLock === 'active' && event.repeat !== true) {
        capsLock = 'unactive';
        change(ruLayoutLowerCase, engLayoutLowerCase);
        for (let i = 0; i < keys.length; i += 1) {
          if (keys[i].innerText === 'CapsLock' && (event.key === 'CapsLock' || event.target.innerText === 'CapsLock')) {
            keys[i].classList.remove('capslock_active');
          }
        }
      } else if (capsLock === 'unactive' && event.repeat !== true) {
        capsLock = 'active';
        change(ruLayout, engLayout);
        for (let i = 0; i < keys.length; i += 1) {
          if (keys[i].innerText === 'CapsLock' && (event.key === 'CapsLock' || event.target.innerText === 'CapsLock')) {
            keys[i].classList.add('capslock_active');
          }
        }
      }
    }

    if (pressed.toLowerCase() === 'shiftleft' || pressed.toLowerCase() === 'shiftright') {
      if (capsLock === 'active' && event.repeat !== true) {
        change(ruLayoutShiftPressed, engLayoutShiftPressed);
      } else if (capsLock === 'unactive' && event.repeat !== true) {
        change(ruLayoutShiftPressedLowerCase, engLayoutShiftPressedLowerCase);
      }
    }

    pressed = '';
  }

  document.addEventListener('keydown', (event) => {
    runKeyDownFunction(event);
  });
  document.addEventListener('mousedown', (event) => {
    runKeyDownFunction(event);
  });

  function runShiftUpFunction() {
    if (capsLock === 'active') {
      change(ruLayout, engLayout);
    } else if (capsLock === 'unactive') {
      change(ruLayoutLowerCase, engLayoutLowerCase);
    }
  }

  document.addEventListener('keyup', (ev) => {
    if (ev.code === 'ShiftRight' || ev.code === 'ShiftLeft') {
      runShiftUpFunction();
    }
  });
  document.addEventListener('mouseup', (event) => {
    if (event.target.innerText === 'ShiftRight' || event.target.innerText === 'Shift') {
      runShiftUpFunction();
    }
  });
}
getPressedCapsLock(
  changeLayout,
  'CapsLock',
  'ShiftRight',
  'ShiftLeft',
  'shiftleft',
  'shiftright',
);

const position = (obj) => {
  obj.focus();
  if (obj.selectionStart) return obj.selectionStart;
  if (document.selection) {
    const sel = document.selection.createRange();
    const clone = sel.duplicate();
    sel.collapse(true);
    clone.moveToElementText(obj);
    clone.setEndPoint('EndToEnd', sel);
    return clone.text.length;
  }
  return 0;
};

/*  handle selected text  */

let start = 0;
let end = 0;
textarea.onselect = function textareaOnselect() {
  start = textarea.selectionStart;
  end = textarea.selectionEnd;
};

function getSelektedArea(from, to) {
  if ((to - from) > 0) {
    return true;
  }
  return false;
}
let ind = textarea.value.length;

function deleteText(from, to) {
  const text = textarea.value;
  textarea.value = text.slice(0, from) + text.slice(to, text.length);
  textarea.innerText = textarea.value;
  start = ind;
  end = ind;
  textarea.selectionStart = ind;
  textarea.selectionEnd = textarea.selectionStart;
}

function getMessage(pressedKey) {
  if (pressedKey.innerText.length === 1 && !pressedKey.classList.contains('arrow')) {
    if (ind === textarea.value.length) {
      textarea.value += pressedKey.innerText;
      textarea.selectionStart = textarea.value.length;
      textarea.selectionEnd = textarea.selectionStart;
      ind = position(textarea);
    } else if (ind < textarea.value.length) {
      const text = textarea.value;
      textarea.value = text.substring(0, ind) + pressedKey.innerText;
      textarea.value += text.substring(ind, text.length);
      ind += 1;
      textarea.selectionStart = ind;
      textarea.selectionEnd = textarea.selectionStart;
    }
  }

  if (pressedKey.classList.contains('space')) {
    const ifTextSelected = getSelektedArea(start, end);
    if (ifTextSelected === true) {
      deleteText(start, end);
      return;
    }
    if (ind === textarea.value.length) {
      textarea.value += ' ';
      textarea.selectionStart = textarea.value.length;
      textarea.selectionEnd = textarea.selectionStart;
      ind = position(textarea);
    } else if (ind < textarea.value.length) {
      const text = textarea.value;
      textarea.value = `${text.substring(0, ind)} `;
      textarea.value += text.substring(ind, text.length);
      ind += 1;
      textarea.selectionStart = ind;
      textarea.selectionEnd = textarea.selectionStart;
    }
  }

  if (pressedKey.classList.contains('tab')) {
    if (ind === textarea.value.length) {
      textarea.value += '\t';
      textarea.selectionStart = textarea.value.length;
      textarea.selectionEnd = textarea.selectionStart;
      ind = position(textarea);
    } else if (ind < textarea.value.length) {
      const text = textarea.value;
      textarea.value = `${text.substring(0, ind)}\t`;
      textarea.value += text.substring(ind, text.length);
      ind += 1;
      textarea.selectionStart = ind;
      textarea.selectionEnd = textarea.selectionStart;
    }
  }
}

function getMessageNew(pressedKey) {
  if (pressedKey.innerText.length === 1 && !pressedKey.classList.contains('arrow')) {
    if (ind === textarea.value.length) {
      textarea.value += pressedKey.innerText;
      textarea.selectionStart = textarea.value.length;
      textarea.selectionEnd = textarea.selectionStart;
    } else if (ind < textarea.value.length) {
      const text = textarea.value;
      textarea.value = text.substring(0, ind) + pressedKey.innerText;
      textarea.value += text.substring(ind, text.length);
      textarea.selectionStart = ind + 1;
      textarea.selectionEnd = textarea.selectionStart;
    }
  }

  if (pressedKey.classList.contains('backspace')) {
    const ifTextSelected = getSelektedArea(start, end);
    if (ifTextSelected === true) {
      deleteText(start, end);
      return;
    }

    if (ind === textarea.value.length) {
      textarea.value = textarea.value.slice(0, -1);
      textarea.innerText = textarea.value;
      textarea.selectionStart = textarea.value.length;
      textarea.selectionEnd = textarea.selectionStart;
    } else if (ind < textarea.value.length) {
      const text = textarea.value;
      textarea.value = text.slice(0, ind - 1) + text.slice(ind, text.length);
      textarea.innerText = textarea.value;
      textarea.selectionStart = ind - 1;
      textarea.selectionEnd = textarea.selectionStart;
    }
  }
  if (pressedKey.classList.contains('delete')) {
    if (ind < textarea.value.length) {
      const text = textarea.value;
      textarea.value = text.slice(0, ind) + text.slice(ind + 1, text.length);
      textarea.innerText = textarea.value;
      textarea.selectionStart = ind;
      textarea.selectionEnd = textarea.selectionStart;
    }
  }
  if (pressedKey.classList.contains('space')) {
    const ifTextSelected = getSelektedArea(start, end);
    if (ifTextSelected === true) {
      deleteText(start, end);
      return;
    }
    if (ind === textarea.value.length) {
      textarea.value += ' ';
      textarea.selectionStart = textarea.value.length;
      textarea.selectionEnd = textarea.selectionStart;
      ind = position(textarea);
    } else if (ind < textarea.value.length) {
      const text = textarea.value;
      textarea.value = `${text.substring(0, ind)} `;
      textarea.value += text.substring(ind, text.length);
      ind += 1;
      textarea.selectionStart = ind;
      textarea.selectionEnd = textarea.selectionStart;
    }
  }

  if (pressedKey.classList.contains('enter')) {
    if (ind === textarea.value.length) {
      textarea.value += '\n';
      textarea.innerText = textarea.value;
    }

    if (ind < textarea.value.length) {
      const text = textarea.value;
      textarea.value = `${text.slice(0, ind)}\n${text.slice(ind, text.length)}`;
      textarea.innerText = textarea.value;
    }
  }

  if (pressedKey.classList.contains('tab')) {
    if (ind === textarea.value.length) {
      textarea.value += '\t';
      textarea.innerText = textarea.value;
    }

    if (ind < textarea.value.length) {
      const text = textarea.value;
      textarea.value = `${text.slice(0, ind)}\t${text.slice(ind, text.length)}`;
      textarea.innerText = textarea.value;
      textarea.selectionStart = ind + 1;
      textarea.selectionEnd = textarea.selectionStart;
    }
  }
}

/* add animation after key put down on the keyboard */

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Shift') {
    for (let i = 0; i < keys.length; i += 1) {
      let target = null;
      if (
        (keys[i].classList.contains(event.code.toLowerCase()) || (keys[i].innerText === event.key && keys[i].innerText !== 'Alt')) && (!keys[i].classList.contains('shift') || keys[i].classList[2] === event.code.toLowerCase())) {
        target = keys[i];
      }
      if (target) {
        if (target.classList[1] === 'altleft') {
          const altLeft = document.querySelector('.altleft');
          altLeft.classList.add('key_active');
        } else if (target.classList[1] === 'altright') {
          const altRight = document.querySelector('.altright');
          altRight.classList.add('key_active');
        } else if (target.classList[1] !== 'altleft' && target.classList[1] !== 'altright') {
          target.classList.add('key_active');
        }

        if (target.innerText.length === 1 && !target.classList.contains('arrow') && !target.classList.contains('enter') && !target.classList.contains('alt')) {
          event.preventDefault();
        }
        if (target.classList.contains('tab') || target.classList.contains('altleft') || target.classList.contains('altright')) {
          event.preventDefault();
        }
        getMessage(target);
      }
    }
  }
});

document.addEventListener('keyup', (event) => {
  for (let i = 0; i < keys.length; i += 1) {
    let target = null;

    if ((keys[i].classList.contains(event.code.toLowerCase()) || keys[i].innerText === event.key) && (!keys[i].classList.contains('shift') || keys[i].classList[2] === event.code.toLowerCase())) {
      target = keys[i];
    }
    if (target) {
      target.classList.remove('key_active');
    }
  }
  if (event.code.slice(0, 5) === 'Arrow') {
    ind = position(textarea);
  }

  if (event.key === 'Enter' || event.key === 'Backspace' || event.code === 'Space' || event.key === 'Tab') {
    ind = position(textarea);
  }
});

keyboardSection.addEventListener('mousedown', (event) => {
  const { target } = event;
  for (let i = 0; i < keys.length; i += 1) {
    if (keys[i].classList.contains(target.classList[2]) && ((keys[i].classList[1] === 'shift') || (keys[i].classList[1] === 'arrow'))) {
      keys[i].classList.add('key_active');
      getMessageNew(target);
    }
    if (keys[i].classList.contains(target.classList[1]) && keys[i].classList[1] !== 'shift' && keys[i].classList[1] !== 'arrow') {
      keys[i].classList.add('key_active');
      getMessageNew(target);
    }
  }
});

document.addEventListener('mouseup', (event) => {
  const { target } = event;
  for (let i = 0; i < keys.length; i += 1) {
    if (!keys[i].classList.contains('capslock')) {
      keys[i].classList.remove('key_active');
    }
    if (target.classList.contains('capslock') && keys[i].classList.contains('capslock')) {
      keys[i].classList.toggle('key_active');
    }
  }

  if (event.target.innerText === 'Enter') {
    ind += 1;
    textarea.selectionStart = ind;
    textarea.selectionEnd = textarea.selectionStart;
    ind = position(textarea);
  } else {
    ind = position(textarea);
  }

  if (event.target.classList[2] === 'arrowleft') {
    start = textarea.selectionStart;
    end = textarea.selectionEnd;
    if (ind > 0) {
      ind -= 1;
    } else {
      ind = 0;
    }
    textarea.selectionStart = ind;
    textarea.selectionEnd = textarea.selectionStart;
  }
  if (event.target.classList[2] === 'arrowright') {
    start = textarea.selectionStart;
    end = textarea.selectionEnd;
    if (ind < textarea.value.length) {
      ind += 1;
    } else {
      ind = textarea.value.length;
    }

    textarea.selectionStart = ind;
    textarea.selectionEnd = textarea.selectionStart;
  }

  /* arrow UP  */

  if (event.target.classList[2] === 'arrowup') {
    const prevText = (string, val) => string.slice(val, string.length);
    const lastIndexOfBr = (str) => str.lastIndexOf('\n');
    const prev = prevText(textarea.value, ind);
    const firstIndexOfBr = (str) => str.indexOf('\n');
    const nextText = (string, val) => string.slice(0, val);
    const next = nextText(textarea.value, ind);
    const indexNextStrEnd = lastIndexOfBr(next);
    const indexNextStrStart = lastIndexOfBr(next.slice(0, indexNextStrEnd)) + 1;
    const nextStrLength = indexNextStrEnd - indexNextStrStart;
    let indexCurrStrEnd = 0;
    if (firstIndexOfBr(prev) === -1) {
      indexCurrStrEnd = textarea.value.length;
    } else {
      indexCurrStrEnd = next.length + firstIndexOfBr(prev);
    }
    let indexCurrStrStart = 0;
    if (firstIndexOfBr(next) === -1) {
      indexCurrStrStart = 0;
    } else {
      indexCurrStrStart = lastIndexOfBr(next) + 1;
    }
    const currStrLength = indexCurrStrEnd - indexCurrStrStart;
    const posit = ind - indexCurrStrStart;

    if (posit === 0) {
      ind = indexNextStrStart;
    } else if (nextStrLength === 0) {
      ind = indexNextStrStart;
    } else if (posit !== 0 && nextStrLength !== 0) {
      ind = indexNextStrStart + ((posit * nextStrLength) / currStrLength);
    }

    textarea.selectionStart = ind;
    textarea.selectionEnd = textarea.selectionStart;
  }

  /* arrow DOWN  */

  if (event.target.classList[2] === 'arrowdown') {
    const prevText = (string, val) => string.slice(0, val);
    const nextText = (string, val) => string.slice(val, string.length);
    const firstIndexOfBr = (str) => str.indexOf('\n');
    const lastIndexOfBr = (str) => str.lastIndexOf('\n');
    const prev = prevText(textarea.value, ind);

    const next = nextText(textarea.value, ind);

    const indexNextStrStart = prev.length + firstIndexOfBr(next) + 1;

    let indexNextStrEnd = 0;
    if (firstIndexOfBr(textarea.value.slice(indexNextStrStart, textarea.value.length)) === -1) {
      indexNextStrEnd = textarea.value.length;
    } else {
      indexNextStrEnd += indexNextStrStart;
      const pos = textarea.value.slice(indexNextStrStart, textarea.value.length);
      indexNextStrEnd += firstIndexOfBr(pos);
    }

    const nextStrLength = indexNextStrEnd - indexNextStrStart;

    let indexCurrStrStart = 0;
    if (firstIndexOfBr(prev) === -1) {
      indexCurrStrStart = 0;
    } else {
      indexCurrStrStart = lastIndexOfBr(prev) + 1;
    }

    let indexCurrStrEnd = 0;
    if (firstIndexOfBr(next) === -1) {
      indexCurrStrEnd = textarea.value.length;
    } else {
      indexCurrStrEnd = prev.length + firstIndexOfBr(next);
    }

    const currStrLength = indexCurrStrEnd - indexCurrStrStart;
    const posit = ind - indexCurrStrStart;

    if (posit === 0) {
      ind = indexNextStrStart;
    } else if (nextStrLength === 0) {
      ind = indexNextStrStart;
    } else if (posit !== 0 && nextStrLength !== 0) {
      ind = indexNextStrStart + ((posit * nextStrLength) / currStrLength);
    }
    textarea.selectionStart = ind;
    textarea.selectionEnd = textarea.selectionStart;
  }
});
