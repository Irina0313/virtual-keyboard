/* eslint-disable no-console */
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
  });
});

const spaceKey = keyRow[4].children[3];
spaceKey.classList.add('space');

const setArrows = () => {
  const upKey = keyRow[3].children[11];
  upKey.innerHTML = '&#9650;';

  const leftKey = keyRow[4].children[5];
  leftKey.innerHTML = '&#9668;';

  const downKey = keyRow[4].children[6];
  downKey.innerHTML = '&#9660;';

  const rightKey = keyRow[4].children[7];
  rightKey.innerHTML = '&#9658;';
};
setArrows();

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
    pressed.add(event.code);

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
}
getPressedShiftAlt(
  changeLayout,
  'ShiftLeft',
  'AltLeft',
);

/*  check if CapsLock Shift was pressed  */
function getPressedCapsLock(change, ...codes) {
  let pressed = '';
  document.addEventListener('keydown', (event) => {
    pressed = event.code;

    if (!codes.includes(pressed)) {
      return;
    }

    pressed = '';
    if (capsLock === 'active' && event.repeat !== true) {
      capsLock = 'unactive';
      change(ruLayoutLoverCase, engLayoutLoverCase);
    } else if (capsLock === 'unactive' && event.repeat !== true) {
      capsLock = 'active';
      change(ruLayout, engLayout);
    }
    console.log(event.repeat);
  });
  document.addEventListener('keyup', (ev) => {
    if (ev.code === 'ShiftRight' || ev.code === 'ShiftLeft') {
      if (capsLock === 'active') {
        capsLock = 'unactive';
        change(ruLayoutLoverCase, engLayoutLoverCase);
      } else if (capsLock === 'unactive') {
        capsLock = 'active';
        change(ruLayout, engLayout);
      }
    }
  });
}
getPressedCapsLock(
  changeLayout,
  'CapsLock',
  'ShiftRight',
  'ShiftLeft',
);

/* add animation after key put down on the keyboard */

const keyArr = document.querySelectorAll('.key');

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
