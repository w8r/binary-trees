export default class Node {

  /**
   * @constructor
   * @param  {*}       key
   * @param  {*}       data
   * @param  {Node}    left
   * @param  {Node}    right
   * @param  {Node}    parent
   * @param  {Number}  height
   */
  constructor(key, data, left, right, parent, height) {
    this.key    = key;
    this.data   = data;
    this.left   = left;
    this.right  = right;
    this.parent = parent;
    this.height = height;

    if (left)  left.parent  = this;
    if (right) right.parent = this;
  }

  /**
   * @return {Boolean}
   */
  isRoot () {
    return !this.parent;
  }


  /**
   * @return {Boolean}
   */
  isLeaf () {
    return !this.right && !this.left;
  }


  /**
   * @return {Boolean}
   */
  isLeft () {
    return this.parent ? this.parent.left === this : false;
  }


  /**
   * @return {Boolean}
   */
  isRight () {
    return this.parent ? this.parent.right === this : false;
  }


  /**
   * @return {Node|null}
   */
  grandparent () {
    if (this.parent === null || this.parent.parent === null) {
      return null;
    }
    return this.parent.parent;
  }


  /**
   * @return {Node|null}
   */
  sibling () {
    if (this.parent === null ||
        this.parent.right === null ||
        this.parent.left === null) {
      return null;
    }

    return (this === this.parent.left) ? this.parent.right : this.parent.left;
  }
}
