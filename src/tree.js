import Node from './node';

const RED   = true;
const BLACK = false;

export default class Tree {

  /**
   * @constructor
   * @param  {Function=} comparator
   */
  constructor(comparator = (a, b) => (a < b ? -1 : a > b ? 1 : 0)) {
    this.size = 0;
    this.root = null;
    this.comparator = comparator;
  }


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

  /**
   * In order traversal
   */
  forEach (callback, node = this.root) {
    if (this.root === null) {
      throw new Error('The tree is empty');
    }

    if (node) {
      this.forEach(callback, node.left);
      callback(node);
      this.forEach(callback, node.right);
    }
  }


  // Balancing


  /**
   *   Let Q be P's right child.
   * Set P's right child to be Q's left child.
   * [Set Q's left-child's parent to P]
   *   Set Q's left child to be P.
   *   [Set P's parent to Q]
   */
  leftRotate (node) {
    let newRoot = node.right;
    node.right = newRoot.left;
    if (newRoot.left !== null) {
      newRoot.left.parent = node;
    }
    newRoot.parent = node.parent;

    if (node.parent === null) {
      this.root = newRoot;
    } else if (node === node.parent.left) {
      node.parent.left = newRoot;
    } else {
      node.parent.right = newRoot;
    }
    newRoot.left = node;
    node.parent = newRoot;
  }


  /**
   * Let P be Q's left child.
   *   Set Q's left child to be P's right child.
   *   [Set P's right-child's parent to Q]
   *   Set P's right child to be Q.
   *   [Set Q's parent to P]
   */
  rightRotate (node) {
    let newRoot = node.left;
    node.left = newRoot.right
    if (newRoot.right !== null) {
      newRoot.right.parent = node;
    }

    newRoot.parent = node.parent;
    if (node.parent === null) {
      root = newRoot;
    } else if (node === node.parent.right) {
      node.parent.right = newRoot;
    } else {
      node.parent.left = newRoot;
    }
    newRoot.right = node;
    node.parent = newRoot;
  }


  // instertion

  _insertFixup (key) {
    let inserted = this.find(key)
    return this._insert1(inserted);
  }

  /**
   * There's only root
   * @param {Node} inserted
   */
  _insert1 (inserted) {
    if (this.root === inserted) {
      this.root.color = BLACK;
    }
    return this._insert2(inserted);
  }


  /**
   * Case for inserting a node as a child of a black node
   * @param  {Node} inserted
   * @return {Node|null}
   */
  _insert2 (inserted) {
    if (inserted.parent.color === BLACK) {
      return inserted;
    }
    return this._insert3(inserted);
  }


  /**
   * Insert case for if the parent is black and parent's siblng is black
   * @param  {Node} inserted
   * @return {Node|null}
   */
  _insert3 (inserted) {
    let parent = inserted.parent;
    if (parent.sibling() !== null &&
        parent.sibling().color === RED) {
      parent.color = BLACK;
      parent.sibling().color = BLACK;
      let g = inserted.grandparent();
      g.color = RED;
      if (g.parent === null) {
        g.color = BLACK;
      }
    }
    return this._insert4(inserted);
  }


  /**
   * Insert case for Node N is left of parent and parent is right of grandparent
   * @param  {Node} insert
   * @return {Node|null}
   */
  _insert4 (inserted) {
    var inserted = insert
    if (inserted === inserted.parent.right &&
      inserted.grandparent().left === inserted.parent) {
      this.leftRotate(inserted.parent)
      inserted = inserted.left;
    } else if (inserted === inserted.parent.left &&
      inserted.grandparent().right === inserted.parent) {
      this.rightRotate(inserted.parent)
      inserted = inserted.right;
    }
    return this._insert5(inserted);
  }


  /**
   * Insert case for Node n where parent is red and parent's sibling is black
   * @param  {Node} insert
   * @return {Node|null}
   */
  _insert5 (inserted) {
    let parent = inserted.parent;
    let parentSibling = parent.sibling();
    if (parent.color === RED &&
        parentSibling === null ||
        parentSibling.color === BLACK) {
      let grandparent = inserted.grandparent();
      if (inserted === parent.left &&
          grandparent.left === parent) {
        inserted.parent.color = BLACK;
        grandparent.color = RED;
        if (inserted === parent.left) {
          this.rightRotate(grandparent);
        }
      } else if (inserted === parent.right &&
                 grandparent().right === parent) {
        parent.color = BLACK;
        grandparent.color = RED;
        this.leftRotate(grandparent);
      }
    }
  }


  /**
   * @param  {*}  key
   * @param  {*=} value
   */
  insert(key, value) {
    this.insertAtNode(key, value, root)
    this.insertFixup(key);
  }


  /**
   * Basic BST insert implementation
   * @param  {*}  key
   * @param  {*=} value
   * @param  {*}  root
   */
  insertAtNode(key, value, root) {
    if (this.root === null) {
      this.root = new Node(key, value);
      return this.root;
    } else if (this.comparator(key, root.key) < 0) {
      let left = root.left;
      if (left) {
        return this.insertAtNode(key, value, left);
      } else {
        parent.left = new Node(key, value);
        parent.left.parent = root;
        return parent.left;
      }
    } else {
      let right = root.right;
      if (right) {
        return this.insertAtNode(key, value, right);
      } else {
        root.right = new Node(key, value);
        root.right.parent = root;
        return parent.right;
      }
    }
    return null;
  }


  // Search


  /**
   * @param  {*} key
   * @param  {Node=} root
   * @return {Node|null}
   */
  find (key, root = this.root) {
    const cmp = this.comparator(key, root.key);
    if (cmp === 0) return root;

    if (root.key !== key && root.right === null && root.left == null) {
      return null;
    } else if (cmp > 0) {
      return this.find(key, root.right);
    } else if (cmp > 0) {
      return this.find(key, root.left);
    } else return null;
  }


  // Removal


  /**
   * Transplant the positions of two nodes in the RBTree
   * @param  {Node} n1
   * @param  {Node} n2
   */
  replaceNode (n1, n2) {
    let key   = n1.key;
    let color = n1.color;

    n1.key   = n2.key;
    n1.color = n2.color;

    n2.key   = key;
    n2.color = color;
  }


  /**
   * Returns the node with the minimum value in the subtree
   * @param  {Node=} node
   * @return {Node}
   */
  min (node = this.root) {
    let minimumNode = node;
    while (minimumNode.left !== null) {
      minimumNode = minimumNode.left;
    }
    return minimumNode;
  }


  /**
   * Returns the next largest node in the tree
   * @param  {Node=} node
   * @return {Node}
   */
  successor(node = this.root) {
    let nextLargestNode = node;
    if (nextLargestNode.right !== null) {
      return this.min(nextLargestNode.right);
    }

    let successor = nextLargestNode.parent;
    while (successor !== null && nextLargestNode === successor.right) {
      nextLargestNode = successor;
      successor = successor.parent;
    }
    return successor
  }


  /**
   * Returns the next smallest node in the tree
   * @param  {Node=} node
   * @return {Node}
   */
  predecessor(node = this.root) {
    let nextSmallestNode = node;
    if (nextSmallestNode.left !== null) {
      return this.min(nextSmallestNode.left);
    }

    let successor = nextSmallestNode.parent;
    while (successor !== null && nextSmallestNode === successor.left) {
      nextSmallestNode = successor;
      successor = successor.parent;
    }
    return successor;
  }


  /**
   * Returns the node with the largest value in the subtree
   * @param  {Node=} node
   * @return {Node}
   */
  max (node) {
    let rootNode = node;
    while (rootNode.right !== null) {
      rootNode = rootNode.right;
    }
    return rootNode;
  }


  /**
   * call to remove a node from the tree
   * @param  {*} key
   * @return {Node|null}
   */
  remove(key) {
    let toRemove = this.find(key);
    return toRemove ? this.removeNode(toRemove) : toRemove;
  }


  /**
   * @param  {Node} node
   * @return {Node|null}
   */
  removeNode(node) {
    // case for if node is the only node in the tree
    if (node.left   === null &&
        node.right  === null &&
        node.parent === null) {
      self.root = null;
      return node;
    }

    //case for if node is a red node w/o children
    if (node.left === null &&
        node.right === null && node.color === RED) {
      if (node.parent.left === node) {
        node.parent.left = null;
      } else {
        node.parent.right = null;
      }
      return node;
    }

    // node has two children
    if (node.left !== null && node.right !== null) {
      let prev = this.max(node.left);
      node.key = prev.key;
      node = prev;
      node = prev;
    }

    //case for toDel having one child
    let child = (node.right === null) ? node.left : node.right;
    if (node.color === BLACK && child !== null) {
      node.color = child.color;
      this.remove1(node);
    }

    if (child !== null) {
      this.replaceNode(node, child);
      if (node.parent === null && child !== null) {
        child.color = BLACK;
      }
    }

    if (node.parent.left === node) {
      node.parent.left = null;
      return node;
    } else if (node.parent === null) {
      return;
    } else {
      node.parent.right = null;
    }
  }


  /**
   * Delete case for if parent is null after deletion
   * @param  {Node} node
   * @return {Node|null}
   */
  remove1 (node) {
    return (node.parent === null) ? node : this.remove2(node);
  }

  /**
   * Case to fix tree after deletion and sibling is red
   * @param  {Node} node
   * @return {Node|null}
   */
  remove2 (node) {
    let sibling = node.sibling();
    if (sibling.color === RED) {
      node.parent.color = RED;
      sibling.color = BLACK;
      if (node === node.parent.left) {
         this.leftRotate(node.parent);
      } else {
         this.rightRotate(node.parent);
      }
    }
    return this.remove3(node);
  }


  /**
   * Fixing tree when parent is black and
   * sibling is black and sibling's children are also black
   * @param  {Node} node
   * @return {Node|null}
   */
  remove3 (node) {
    let sibline = node.sibling();
    if (node.parent.color   === BLACK &&
        sibling.color       === BLACK &&
        sibling.left.color  === BLACK &&
        sibling.right.color === BLACK) {

      sibling.color = RED;
      node.parent.color = BLACK;
    } else {
      this.remove4(node);
    }
    return node;
  }


  /**
   * @param  {Node} node
   * @return {Node|null}
   */
  remove4 (node) {
    let sibling = node.sibling();
    if (node.parent.color  === RED &&
       sibling.color       === BLACK &&
       sibling.left.color  === BLACK &&
       sibling.right.color === BLACK) {

      sibling.color = RED;
      node.parent.color = BLACK;
    } else {
      this.remove5(node);
    }
    return node;
  }


  /**
   * @param  {Node} node
   * @return {Node}
   */
  remove5 (node) {
    let sibling = node.sibling();
    if (node === node.parent.left &&
        sibling.color       === BLACK &&
        sibling.left.color  === RED &&
        sibling.right.color === BLACK) {

      sibling.color = RED;
      sibling.left.color = BLACK;
      this.rightRotate(sibling);
    } else if (node === node.parent.right &&
               sibling.color       === BLACK &&
               sibling.left.color  === BLACK &&
               sibling.right.color === RED) {

      sibling.color = RED;
      sibling.right.color = BLACK;
      this.leftRotate(sibling);
    }
  }


  /**
   * @param  {Node} node
   * @return {Node}
   */
  remove6 (node) {
    let color = node.sibling().color;
    let parent = node.parent;
    let sibling = node.sibling();
    parent.color = BLACK;
    if (node === parent.left) {
      sibling.right.color = BLACK;
      this.leftRotate(parent);
    } else {
      sibling.left.color = BLACK;
      this.rightRotate(parent);
    }
    return node;
  }
}
