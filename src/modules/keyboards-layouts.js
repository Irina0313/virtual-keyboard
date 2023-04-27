/*  Array with codes of the keys */

export const keyCodeLayout = ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace', 'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Delete', 'CapsLock', 'Keya', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Backslash', 'Enter', 'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight', 'ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ControlRight'];

/*  Array for an English layout */

export const engLayout = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', 'Del'],
  ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", '\\', 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', '', 'Shift'],
  ['Ctrl', 'Win', 'Alt', '', 'Alt', '', '', '', 'Ctrl'],
];

export const engLayoutLoverCase = [];
engLayout.forEach((el) => {
  const row = [];
  el.forEach((key) => {
    if (/[a-zа-яё]/i.test(key) && key.length === 1) {
      row.push(key.toLowerCase());
    } else {
      row.push(key);
    }
  });
  engLayoutLoverCase.push(row);
});

/*  Array for an Russian layout */

export const ruLayout = [
  ['Ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ', 'Del'],
  ['CapsLock', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э', '\\', 'Enter'],
  ['Shift', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', '.', '', 'Shift'],
  ['Ctrl', 'Win', 'Alt', '', 'Alt', '', '', '', 'Ctrl'],
];

export const ruLayoutLoverCase = [];
ruLayout.forEach((el) => {
  const row = [];
  el.forEach((key) => {
    if (/[a-zа-яё]/i.test(key) && key.length === 1) {
      row.push(key.toLowerCase());
    } else {
      row.push(key);
    }
  });
  ruLayoutLoverCase.push(row);
});
