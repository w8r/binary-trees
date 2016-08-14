import Node from './node';
import defaultCompare from './default_compare';

export default class BST {

  /**
   * @class BST
   * @param {Function=} comparator
   */
  constructor(comparator = defaultCompare) {
    this.root = null;
    this.comparator = comparator;
    this.length = 0;
  }


  /**
   * @param {Number} key
   * @param {*=} data
   * @return {Node|null}
   */
  insert (key, data) {
    if (this.root === null) {
      this.root = new Node(key, data);
      this.length++;
      return this.root;
    } else {
      return this.insertNode(key, data, this.root);
    }
  }


  /**
   * @param {Number} key
   * @param {*=} data
   * @param {Node} parent
   */
  insertNode (key, data, parent) {
    let node;
    while (true) {
      const cmp = this.comparator(key, parent.key);
      if (cmp === 0) {
        node = parent;
        return null;
      }
      if (cmp > 0) {
        if (parent.right !== null) {
          parent = parent.right;
        } else {
          node = new Node(key, data);
          node.parent = parent;
          parent.right = node;
          this.length++;
          break;
        }
      } else if (cmp < 0) {
        if (parent.left !== null) {
          parent = parent.left;
        } else {
          node = new Node(key, data);
          node.parent = parent;
          parent.left = node;
          this.length++;
          break;
        }
      }
    }
    return node;
  }


  /**
   * @param {Number} key
   * @return {Node|null}
   */
  remove (key) {
    if (!this.root) return null;
    let node = this.find(key);
    if (node) {
      let fakeParent = null;
      if (node === this.root) {
        fakeParent = { left : this.root };
      }

      this.removeNode(node, node.parent || fakeParent);

      if (fakeParent) {
        this.root = fakeParent.left;
        if (this.root) this.root.parent = null;
      }
      this.length--;
    }
    return node;
  }


  /**
   * @param {Node} node
   */
  removeNode(node, parent) {
    if (node.isLeaf()) {
      if (parent.left === node) {
        parent.left = null;
      }
      if (parent.right === node) {
        parent.right = null;
      }
    } else if (node.left && node.right) { // two ancestors
      let successor = this.next(node, parent)
      node.key  = successor.key;
      node.data = successor.data;
      if (successor.parent.left === successor) {
        successor.parent.left = successor.right;
        if (successor.right !== null) {
          successor.right.parent = successor.parent;
        }
      } else {
        successor.parent.right = successor.right;
        if (successor.right !== null) {
          successor.right.parent = successor.parent;
        }
      }
    } else { // one ancestor
      if (node.left === null) {
        if (parent.left === node) {
          parent.left = node.right;
        } else {
          parent.right = node.right;
        }
        node.right.parent = parent;
      } else {
        if (parent.left === node) {
          parent.left = node.left;
        } else {
          parent.right = node.left;
        }
        node.left.parent = parent;
      }
    }
  }


  /**
   * @param {Number} key
   * @return {Node|null}
   */
  find (key) {
    let current = this.root;

    if (!current) return current;
    while (current.key !== key) {
      if (this.comparator(key, current.key) < 0) {
        current = current.left;
      } else {
        current = current.right;
      }

      if (current === null) {
        return null;
      }
    }
    return current;
  }


  /**
   * @return {Node|null}
   */
  min() {
    return this.root ? this._min(this.root) : null;
  }


  /**
   * @return {Node|null}
   */
  max() {
    return this.root ? this._max(this.root) : null;
  }


  /**
   * @param {Node} node
   * @return {Node}
   */
  _min(node) {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  }


  /**
   * @param {Node} node
   * @return {Node}
   */
  _max(node) {
    let current = node;
    while (current.right !== null) {
      current = current.right;
    }
    return current;
  }


  /**
   * @param {Node} node
   * @return {Node}
   */
  next (node) {
    if (node.right !== null) {
      return this._min(node.right);
    }
    // step 2 of the above algorithm
    let parent = node.parent;
    while (parent !== null && node === parent.right) {
      node = parent;
      parent = parent.parent;
    }
    return parent;
  }


  /**
   * @param {Node} node
   * @return {Node}
   */
  prev (node) {
    if (node.left !== null) {
      return this._max(node.left);
    }

    let parent = node.parent;
    while (parent !== null && node === parent.left) {
      node = parent;
      parent = parent.parent;
    }
    return parent;
  }


  /**
   * @param {Function} callback
   * @param {*=} context
   * @return {BST} self
   */
  forEach (callback, context) {
    this.inOrder(this.root, callback, context);
    return this;
  }


  /**
   * @param {Node} node
   * @param {Function} callback
   * @param {*=} context
   */
  inOrder (node, callback, context) {
    if (node !== null) {
      this.inOrder(node.left, callback, context);
      callback.call(context, node);
      this.inOrder(node.right, callback, context);
    }
  }

}
