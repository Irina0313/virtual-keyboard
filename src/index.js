import '@babel/polyfill/lib';
import './index.html';
import './style.scss';

import { ElementBuilder } from './modules/elem-builder';
import {
  keyCodeLayout, engLayout, ruLayout, ruLayoutLoverCase, engLayoutLoverCase,
} from './modules/keyboards-layouts';

/*  create document strucrure  */
let lang = 'EN';
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
engLayout.forEach((item, i) => {
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
div = div.createElement();
div.innerText = 'Prodused by Iryna Kanavalchuk';

/*  function to change the layout  */

const changeLayout = (layoutRu, layoutEn) => {
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

/*  check if ShiftRight + AltRight were pressed  */

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
    if (lang === 'EN') {
      lang = 'RU';
    } else {
      lang = 'EN';
    }
    change(ruLayout, engLayout);
  });

  document.addEventListener('mousedown', (event) => {
    pressed.add(event.target.classList[1]);
    pressed.add(event.target.classList[2]);
    for (let i = 0; i < codes.length; i += 1) {
      if (!pressed.has(codes[i])) {
        return;
      }
    }
    pressed.clear();
    if (lang === 'EN') {
      lang = 'RU';
    } else {
      lang = 'EN';
    }
    change(ruLayout, engLayout);
  });
  document.addEventListener('keyup', (event) => {
    pressed.delete(event.code);
  });

  document.addEventListener('mouseup', (event) => {
    pressed.delete(event.target.classList[1]);
    pressed.delete(event.target.classList[2]);
  });
}

getPressedShiftAlt(
  changeLayout,
  'shiftleft',
  'altleft',
);

/*  check if CapsLock or Shift were pressed on physical or virtual keyboard  */

function getPressedCapsLock(change, ...codes) {
  let pressed = '';
  function runKeyDownFunction(event) {
    if (event.code === undefined && (event.target.innerText === 'CapsLock')) {
      pressed = event.target.innerText;
    } else if (event.code) {
      pressed = event.code;
    }
    if (!codes.includes(pressed)) {
      return;
    }

    pressed = '';
    if (capsLock === 'active' && event.repeat !== true) {
      capsLock = 'unactive';

      change(ruLayoutLoverCase, engLayoutLoverCase);
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
  document.addEventListener('keydown', (event) => {
    runKeyDownFunction(event);
  });
  document.addEventListener('mousedown', (event) => {
    runKeyDownFunction(event);
  });

  function runShiftUpFunction() {
    if (capsLock === 'active') {
      capsLock = 'unactive';
      change(ruLayoutLoverCase, engLayoutLoverCase);
    } else if (capsLock === 'unactive') {
      capsLock = 'active';
      change(ruLayout, engLayout);
    }
  }

  document.addEventListener('keyup', (ev) => {
    if (ev.code === 'ShiftRight' || ev.code === 'ShiftLeft') {
      runShiftUpFunction();
    }
  });
  document.addEventListener('mouseup', (event) => {
    if (event.target.innerText === 'ShiftRight' || event.target.innerText === 'ShiftLeft') {
      runShiftUpFunction();
    }
  });
}
getPressedCapsLock(
  changeLayout,
  'CapsLock',
  'ShiftRight',
  'ShiftLeft',
);

// let message = '';

/* function getNewText(pressedKey) {
  let key = pressedKey.innerText;
  let newText = '';
  if (/[a-zа-яё]/i.test(key) && key.length === 1) {
    newText += key;
  }
  if (pressedKey.classList.contains('space')) {
    newText += ' ';
  }
  return newText;
} */
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

let ind = textarea.value.length;

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
}

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
function deleteText(from, to) {
  const text = textarea.value;
  textarea.value = text.slice(0, from) + text.slice(to, text.length);
  textarea.innerText = textarea.value;
  start = 0;
  end = 0;
}
/* add animation after key put down on the keyboard */

// let position = getCaretPos(textarea)

document.addEventListener('keydown', (event) => {
  const ifTextSelected = getSelektedArea(start, end);
  if (ifTextSelected === true) {
    deleteText(start, end);
  }
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

      getMessage(target);
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

  if (event.key === 'Enter' || event.key === 'Backspace' || event.code === 'Space') {
    ind = position(textarea);
  }
});

keyboardSection.addEventListener('mousedown', (event) => {
  const { target } = event;
  for (let i = 0; i < keys.length; i += 1) {
    if (keys[i].classList.contains(target.classList[2]) && keys[i].classList[1] === 'shift') {
      keys[i].classList.add('key_active');
      getMessageNew(target);
    }
    if (keys[i].classList.contains(target.classList[1]) && keys[i].classList[1] !== 'shift') {
      keys[i].classList.add('key_active');
      getMessageNew(target);
    }
  }
});

document.addEventListener('mouseup', (event) => {
  const { target } = event;
  for (let i = 0; i < keys.length; i += 1) {
    if (keys[i].classList.contains(target.classList[1])) {
      keys[i].classList.remove('key_active');
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

  /* arrow down */

  /* if (event.target.classList[2] === 'arrowdown') {
    const prevText = (string, val) => string.slice(0, val);
    const restText = (string, val) => string.slice(val, textarea.value.length);
    const nextIndexOfBr = (str) => str.indexOf('\n');
    const prevIndexOfBr = (str) => str.lastIndexOf('\n');
    const prev = prevText(textarea.value, ind);
    const rest = restText(textarea.value, ind);
    let nextIndBr = nextIndexOfBr(rest);

    const restFromNextStr = restText(rest, nextIndBr + 1);
    if (prevIndexOfBr(prev) === -1) {
      const currInd = ind - nextIndexOfBr(prev);
      const prevLength = ind + nextIndBr;
      const pos = (currInd * nextIndexOfBr(restFromNextStr)) / (ind + nextIndexOfBr(rest));
      ind = prevLength + Math.round(pos);
    } else {
      const currInd = ind - prevIndexOfBr(prev) - 1;
      nextIndBr = nextIndexOfBr(rest);
      const curr = (prev.length - prevIndexOfBr(prev)) + nextIndBr;
      const prevLength = ind + nextIndBr;
      if (currInd === 0) {
        ind = prevLength + 1 + Math.round((currInd * nextIndexOfBr(restFromNextStr)) / curr);
      } else if (nextIndexOfBr(restFromNextStr) === -1) {
        ind = prevLength + Math.round((currInd * restFromNextStr.length) / curr);
      } else {
        ind = prevLength + 1 + Math.round((currInd * nextIndexOfBr(restFromNextStr)) / curr);
      }
    }
    textarea.selectionStart = ind;
    textarea.selectionEnd = textarea.selectionStart;
  } */

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
    ind = indexNextStrStart + ((posit * nextStrLength) / currStrLength);
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
    ind = indexNextStrStart + ((posit * nextStrLength) / currStrLength);
    textarea.selectionStart = ind;
    textarea.selectionEnd = textarea.selectionStart;
  }
});
