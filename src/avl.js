import Node from './node';
import BST  from './bst';


/**
 * @param  {Node|null} node
 * @return {Number}
 */
const height = (node) => (node === null) ? 0 : node.height;


/**
 * @param  {Node} node
 * @return {Number}
 */
const balanceFactor = (node) => height(node.left) - height(node.right);


export default class Tree extends BST {

  /**
   * @class AVL
   * @param  {Function=} comparator
   */
  constructor(comparator) {
    super(comparator);
  }


  static height = height

  static balanceFactor = balanceFactor


  /**
   * Max depth of the tree
   * @return {Number}
   */
  depth () {
    return this._height(this.root);
  }


  _height (node) {
    return node ? (1 + Math.max(height(node.left), height(node.right))) : 0;
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
  _insert (key, data, subtree) {
    var cmp = this.comparator(key, subtree.key);
    if (cmp < 0) {
      if (subtree.left) {
        return this._insert(key, data, subtree.left);
      } else {
        let child = new Node(key, data, null, null, subtree);
        subtree.left = child;
        subtree.height = Math.max(height(subtree.left), height(subtree.right)) + 1;
        this.balance(subtree);
        return child;
      }
    } else {
      if (subtree.right) {
        return this._insert(key, data, subtree.right);
      } else {
        let child = new Node(key, data, null, null, subtree);
        subtree.right = child;
        subtree.height = Math.max(height(subtree.left), height(subtree.right)) + 1;
        this.balance(subtree);
        return child;
      }
    }
  }

  // Balancing tree

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
        node.right = this.rotateLeft(node.right);
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
      this.removeNode(node, node.parent);
    }
    return node;
  }


  removeNode (node, parent) {
    if (node.isLeaf()) { // remove and balance up
      if (parent) {
        if (node.isLeft()) {
          parent.left = null;
        } else if (node.isRight()) {
          parent.right = null;
        }
        this.balance(parent);
      } else { // at root, smart huh
        this.root = null;
      }
    } else if (node.left && node.right) { // two ancestors
      let replacement = node.left;

      // Special case: the in-order predecessor
      // is right below the node to delete
      if (!replacement.right) {
        node.key  = replacement.key;
        node.data = replacement.data;
        node.left = replacement.left;
        if (replacement.left) {
          replacement.left.parent = node;
        }
      } else {

        // After this loop, replacement is the right-most leaf in the left subtree
        // and deletePath the path from the root (inclusive) to replacement (exclusive)
        replacement = this_max(replacement);
        node.key    = replacement.key;
        node.data   = replacement.data;

        replacement.parent.right = replacement.left;
        if (replacement.left) replacement.left.parent = replacement.parent;
      }
      this.balance(parent);
    } else { // 1 ancestor
      let replacement = node.left || node.right;

      if (!parent) {
        this.root = replacement;
        replacement.parent = null;
      } else {
        if (node.isLeft()) {
          parent.left = replacement;
        } else {
          parent.right = replacement;
        }
        replacement.parent = parent;
        this.balance(parent);
      }
    }
    this.length--;
  }
}
