import Node from './node';

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
      return 1 + Math.max(this.depth(node.left), depth(root!.right));
    }
  }
  //return the max depth of the tree
  private func depth(rooty: RBTNode?) -> Int {
    if rooty == nil {
      return 0
    } else {
      return 1+(max(depth(root!.left), depth(root!.right)))
    }
  }

  public func inOrder() {
    inOrder(root)
  }
  //Prints the in order traversal of the current tree
  private func inOrder(root: RBTNode?) {
    if self.root == nil {
      print("The tree is empty.")
    }
    if root == nil {
      return
    }
    inOrder(root!.left)
    print("Data: \(root!.data) Color: \(root!.color)")
    inOrder(root!.right)
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
      inserted = this._insert(key, data, root);
    } else {
      inserted = this.root = new Node(key, data);
    }
    this.size++;
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
    const lHeight = node.left  ? node.left.height  : 0;
    const rHeight = node.right ? node.right.height : 0;
    node.height = Math.max(lHeight, rHeight) + 1;
    this.updateHeightUpwards(node.parent);
  }


  /**
   * @param  {Node} node
   * @return {Number}
   */
  lrDifference (node){
    const lHeight = node.left  ? node.left.height  : 0;
    const rHeight = node.right ? node.right.height : 0;
    return lHeight - rHeight;
  }


  /**
   * @param  {Node} node
   */
  balance (node) {
    if (!node) return;

    this.updateHeightUpwards(node.left);
    thid.updateHeightUpwards(node.right)

    let node0, node1, node2;
    let subtree0, subtree1, subtree2, subtree3;
    let parent   = node.parent;

    const lrFactor = this.lrDifference(node);
    if (lrFactor > 1) {
      // left-left or left-right
      if (this.lrDifference(node.left) > 0) {
        // left-left
        node0 = node;
        node2 = node.left;
        node1 = node.left ? node.left.left : null;

        subtree0 = node1 ? node1.left  : null;
        subtree1 = node1 ? node1.right : null;
        subtree2 = node2 ? node2.right : null;
        subtree3 = node.right;
      } else {
        // left-right
        node0 = node
        node1 = node.left
        node2 = node.left ? node.left.right : null;

        subtree0 = node1 ? node1.left  : null;
        subtree1 = node2 ? node2.left  : null;
        subtree2 = node2 ? node2.right : null;
        subtree3 = node.right;
      }
    } else if (lrFactor < -1) {
      // right-left or right-right
      if (this.lrDifference(node.right) < 0) {
        // right-right
        node1 = node;
        node2 = node.right;
        node0 = node2 ? node2.right : null;

        subtree0 = node.left
        subtree1 = node2 ? node2.left  : null;
        subtree2 = node0 ? node0.left  : null;
        subtree3 = node0 ? node0.right : null;
      } else {
        // right-left
        node1 = node;
        node0 = node.right;
        node2 = node0 ? node0.left : null;

        subtree0 = node.left;
        subtree1 = node2 ? node2.left  : null;
        subtree2 = node2 ? node2.right : null;
        subtree3 = node0 ? node0.right : null;
      }
    } else {
      // Don't need to balance 'node', go for parent
      return this.balance(node.parent);
    }

    // node2 is always the head

    if (node.isRoot()) {
      this.root = node2;
      this.root.parent = null;
    } else if (node.isleft()) {
      if (parent) parent.left  = node2;
      if (node2) node2.parent = parent;
    } else if (node.isright()) {
      if (parent) parent.right = node2;
      if (node2) node2.parent = parent;
    }

    if (node2) node2.left  = node1;
    if (node2) node2.right = node0;
    if (node1) node1.parent     = node2;
    if (node0) node0.parent     = node2;

    if (node1) node1.left    = subtree0;
    if (node1) node1.right   = subtree1;
    if (subtree0) subtree0.parent = node1;
    if (subtree1) subtree1.parent = node1;

    if (node0) node0.left    = subtree2;
    if (node0) node0.right   = subtree3;
    if (subtree2) subtree2.parent = node0;
    if (subtree3) subtree3.parent = node0;

    this.updateHeightUpwards(node1);    // Update height from left
    this.updateHeightUpwards(node0);    // Update height from right

    if (node2) this.balance(node2.parent);
  }

  // Remove nodes

  remove(key) {
    const node = this.search(key, this.root);
    if (node) {
      this._remove(node);
      this.size--;
      return true;
    }
    return false;
  }


  _remove(node) {
    if (node.isLeaf()) { // remove and balance up
      let parent = node.parent;
      if (parent) {
        if (node.isleft() + node.isright() === 0) {
          throw new Error('Tree is invalid');
        }

        if (node.isleft()) {
          parent.left = null;
        } else if (node.isright()) {
          parent.right = null;
        }

        this.balance(parent);
      } else { // at root
        this.root = null;
      }
      return true;
    } else { // Handle stem cases
      let replacement = node.left ? node.left.max() : null;
      if (replacement === node) replacement = null;
      if (replacement) {
        node.key  = replacement.key;
        node.data = replacement.data;
        this._remove(replacement);
        return true;
      }

      replacement = node.right ? node.right.min() : null;
      if (replacement === node) replacement = null;
      if (replacement) {
        node.key = replacement.key;
        node.data = replacement.data;
        this._remove(replacement);
      }
    }
    return false;
  }


  search(key, subtree) {
    subtree = subtree || root;
    if (subtree) {
      var cmp = this.comparator(ket, subtree.key);
      if (cmp === 0) {
        return node;
      } else if (cmp < 0) {
        return this.search(key, subtree.left);
      } else if (cmp > 0) {
        return this.search(key, subtree.right);
      }
    }
    return null;
  }
}
