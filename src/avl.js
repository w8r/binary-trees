import Node from './avlnode';
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

  /**
   * @static
   * @type {Function}
   */
  static height = height


  /**
   * @static
   * @type {Function}
   */
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
      inserted = this.insertNode(key, data, this.root);
    } else {
      inserted = this.root = this.createNode(key, data);
      this.length++;
    }
    return inserted;
  }


  createNode (key, data, left, right, parent, height) {
    return new Node(key, data, left, right, parent, height);
  }


  /**
   * @param  {*}    key
   * @param  {*=}   data
   * @param  {Node} subtree
   * @return {Node|null}
   */
  insertNode (key, data, subtree) {
    let child = null;
    const cmp = this.comparator(key, subtree.key);
    if (cmp < 0) {
      if (subtree.left) {
        return this.insertNode(key, data, subtree.left);
      } else {
        child = this.createNode(key, data, null, null, subtree);
        subtree.left = child;
        subtree.height = Math.max(height(subtree.left), height(subtree.right)) + 1;
        this.balance(subtree);
        this.length++;
      }
    } else {
      if (subtree.right) {
        return this.insertNode(key, data, subtree.right);
      } else {
        child = this.createNode(key, data, null, null, subtree);
        subtree.right = child;
        subtree.height = Math.max(height(subtree.left), height(subtree.right)) + 1;
        this.balance(subtree);
        this.length++;
      }
    }
    return child;
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

  balance (node) {
    while (node) {
      var lh = node.left  ? node.left.height  : 0;
      var rh = node.right ? node.right.height : 0;

      if (lh - rh > 1) {
        if (node.left.right &&
            (!node.left.left || node.left.left.height < node.left.right.height)) {
          this.rotateLeft(node.left);
        }
        this.rotateRight(node);
      } else if (rh - lh > 1) {
        if (node.right.left &&
            (!node.right.right ||
             node.right.right.height < node.right.left.height)) {
          this.rotateRight(node.right);
        }
        this.rotateLeft(node);
      }

      // Recalculate the left and right node's heights
      lh = node.left  ? node.left.height  : 0;
      rh = node.right ? node.right.height : 0;

      // Set this node's height
      node.height = Math.max(lh, rh) + 1;

      node = node.parent;
    }
  }


  rotateLeft (node) {
    let left    = node.left;
    node.left   = left.right;
    if (node.left) node.left.parent = node;

    left.right  = node;
    if (left.right) left.right.parent = left;

    node.height = Math.max(height(node.left), height(node.right)) + 1;
    left.height = Math.max(height(left.left), height(left.right)) + 1;

    return left;
  }


  rotateLeft (node) {
      // Re-assign parent-child references for the parent of the node being removed
    if (node.isLeft()) {
      node.parent.left = node.right;
      node.right.parent = node.parent;
    } else if (node.isRight()) {
      node.parent.right = node.right;
      node.right.parent = node.parent;
    } else {
      this.root = node.right;
      this.root.parent = null;
    }

    // Re-assign parent-child references for the child of the node being removed
    var temp = node.right;
    node.right = node.right.left;
    if (node.right != null) node.right.parent = node;
    temp.left   = node;
    node.parent = temp;
  }


  rotateRight (node) {
    let right    = node.right;
    node.right   = right.left;
    if (node.right) node.right.parent = node;

    right.left   = node;
    if (right.left) right.left.parent = right;

    node.height  = Math.max(height(node.left), height(node.right)) + 1;
    right.height = Math.max(height(right.left), height(right.right)) + 1;
    return right;
  }


  rotateRight (node) {
    // Re-assign parent-child references for the parent of the node being removed
    if (node.isLeft()) {
      node.parent.left = node.left;
      node.left.parent = node.parent;
    } else if (node.isRight()) {
      node.parent.right = node.left;
      node.left.parent = node.parent;
    } else {
      this.root = node.left;
      this.root.parent = null;
    }

    // Re-assign parent-child references for the child of the node being removed
    var temp = node.left;
    node.left = node.left.right;
    if (node.left != null) node.left.parent = node;
    temp.right = node;
    node.parent = temp;
  }


  // Remove nodes

  remove (key) {
    const node = BST.prototype.remove.call(this, key);
    if (node) this.balance(node.parent);
    return node;
  }


  __removeNode (node, parent) {
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
        replacement = this._max(replacement);
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
