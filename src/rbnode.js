import Node from './node';
import { RED } from './rbcolors';

export default class RBNode extends Node {

  constructor (key, data, left, right, parent, color) {
    super(key, data, left, right, parent);
    this.color  = color === undefined ? RED : color;
  }
}
