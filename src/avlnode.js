import Node from './node';

export default class AVLNode extends Node {
  constructor (key, value, left, right, parent, height) {
    super (key, value, left, right, parent);
    this.height = height || 1;
  }
}
