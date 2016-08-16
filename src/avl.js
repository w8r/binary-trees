import Node from './node';
import BST  from './bst';


/**
 * @param  {Node|null} node
 * @return {Number}
 */
const height = (node) => {
  return (node === null) ? -1 : node.height;
};

export default class Tree extends BST {

  /**
   * @class AVL
   * @param  {Function=} comparator
   */
  constructor(comparator) {
    super(comparator);
  }


  static height = height


  /**
   * Max depth of the tree
   * @return {Number}
   */
  depth (node = this.root) {
    if (!node) {
      return 0;
    } else {
      return 1 + Math.max(this.depth(node.left), this.depth(node.right));
    }
  }

  // instertion

  /**
   * @param  {*}    key
   * @param  {*=}   data
   * @return {Node|null}
   */
  insert (key, data = null) {
    let inserted;
    if (this.root) {
      inserted = this._insert(key, data, this.root);
    } else {
      inserted = this.root = new Node(key, data);
    }
    this.length++;
    return inserted;
  }


  /**
   * @param  {*}    key
   * @param  {*=}   data
   * @param  {Node} subtree
   * @return {Node|null}
   */
  _insert(key, data, subtree) {
    var cmp = this.comparator(key, subtree.key);
    if (cmp < 0) {
      if (subtree.left) {
        return this._insert(key, data, subtree.left);
      } else {
        let child = new Node(key, data, null, null, subtree, 1);
        subtree.left = child;
        this.balance(child);
        return child;
      }
    } else {
      if (subtree.right) {
        return this._insert(key, data, subtree.right);
      } else {
        let child = new Node(key, data, null, null, subtree, 1);
        subtree.right = child;
        this.balance(child);
        return child;
      }
    }
  }

  // Balancing tree

  /**
   * @param  {Node} node
   */
  updateHeightUpwards (node) {
    if (!node) return;

    const lHeight = node.left  ? node.left.height  : 0;
    const rHeight = node.right ? node.right.height : 0;
    node.height = Math.max(lHeight, rHeight) + 1;
    this.updateHeightUpwards(node.parent);
  }


  /**
   * @param  {Node} node
   * @return {Number}
   */
  lrDifference (node) {
    if (!node) return 0;

    const lHeight = node.left  ? node.left.height  : 0;
    const rHeight = node.right ? node.right.height : 0;
    return lHeight - rHeight;
  }


  /**
   * @param  {Node} node
   */
  balance (node) {
    if (node === null) return;
    if (height(node.left) - height(node.right) > 1) {
      if (height(node.left.left) - height(node.left.right) > 1) {
        node.left = this.rotateRight(node.left);
      }
      node = this.rotateLeft(node);
    } else if (height(node.right) - height(node.left) > 1) {
      if (height(node.right.right) - height(node.right.left) > 1) {
        node.right = rotateLeft(node.right);
      }
      node = this.rotateRight(node);
    }
    node.height = Math.max(height(node.left), height(node.right)) + 1;
    return node;
  }


  rotateLeft (node) {
    let left    = node.left;
    node.left   = left.right;
    left.right  = node;

    node.height = Math.max(height(node.left), height(node.right)) + 1;
    left.height = Math.max(height(left.left), height(left.right)) + 1;

    return left;
  }


  rotateRight (node) {
    let right    = node.right;
    node.right   = right.left;
    right.left   = node;

    node.height  = Math.max(height(node.left), height(node.right)) + 1;
    right.height = Math.max(height(right.left), height(right.right)) + 1;
    return right;
  }


  // Remove nodes

  remove (key) {
    const node = this.find(key, this.root);
    if (node) {
      this._remove(node);
      return node;
    }
    return null;
  }


  _remove (node) {
    if (node.isLeaf()) { // remove and balance up
      let parent = node.parent;
      if (parent) {
        if (node.isLeft() + node.isRight() === 0) {
          throw new Error('Tree is invalid');
        }

        if (node.isLeft()) {
          parent.left = null;
        } else if (node.isRight()) {
          parent.right = null;
        }

        this.balance(parent);
      } else { // at root, smart huh
        this.root = null;
      }
    } else { // Handle stem cases
      let replacement = this.next(node);
      if (replacement === node) replacement = null;
      if (replacement) {
        node.key  = replacement.key;
        node.data = replacement.data;
        this._remove(replacement);
      }

      replacement = this.prev(node);
      if (replacement === node) replacement = null;
      if (replacement) {
        node.key = replacement.key;
        node.data = replacement.data;
        this._remove(replacement);
      }
    }
    this.length--;
  }

}
