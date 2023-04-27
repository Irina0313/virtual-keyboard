export class ElementBuilder {
  constructor(tag, parent, ...classNames) {
    this.tag = tag;
    this.classNames = classNames;
    this.parent = parent;
  }

  //  create element and put it inside the parent element
  createElement() {
    let elem = this.tag;

    elem = document.createElement(elem);
    this.parent.append(elem);
    if (this.classNames.length > 1) {
      this.classNames.forEach((el) => {
        elem.classList.add(el);
      });
    } else {
      elem.classList.add(this.classNames);
    }
    return elem;
  }
}
