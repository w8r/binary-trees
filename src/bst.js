export default class BST {


  constructor(comparator) {
    this.root = null;
    this._compare = comparator || defaultComparator;
    this.length = 0;
  }


  insert(data) {
    const node = new Node(data);
    if (this.root === null) {
      this.root = node;
      this.length++;
    } else {
      this.insertNode(node, this.root);
    }
  }


  insertNode(node, parent) {
    while (true) {
      const cmp = this._compare(node.data, parent.data);
      if (cmp === 0) {
        break;
      }
      if (cmp > 0) {
        if (parent.right !== null) {
          parent = parent.right;
        } else {
          node.parent = parent;
          parent.right = node;
          this.length++;
          break;
        }
      } else if (cmp < 0) {
        if (parent.left !== null) {
          parent = parent.left;
        } else {
          node.parent = parent;
          parent.left = node;
          this.length++;
          break;
        }
      }
    }
  }

  remove(data) {
    let node = this.find(data);
    if (node) {
      this.removeNode(node, node.parent);
      this.length--;
    }
  }


  removeNode(node, parent) {
    let p = node.parent;

    // leaf
    if (node.left === null && node.right === null) {
      if (p.left === node) {
        p.left = null;
      }
      if (p.right === node) {
        p.right = null;
      }

    // one ancestor
    } else if (node.left === null || node.right === null) {
      if (node.left === null) {
        if (p.left === node) {
          p.left = node.right;
        } else {
          p.right = node.right;
        }
        node.right.parent = p;
      } else {
        if (p.left === node) {
          p.left = node.left;
        } else {
          p.right = node.left;
        }
        node.left.parent = p;
      }

    // 2 ancestors
    } else {
      let successor = this.next(node, parent)
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
    }
  }


  find(data) {
    let current = this.root;
    while (current.data !== data) {
      if (this._compare(data, current.data) < 0) {
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


  getMin() {
    return this._min(this.root).data;
  }


  getMax() {
    return this._max(this.root).data;
  }


  _min(node) {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  }


  _max(node) {
    let current = node;
    while (current.right !== null) {
      current = current.right;
    }
    return current;
  }


  next(node) {
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


  prev(node) {
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


  forEach(callback, context) {
    this.inOrder(this.root, callback, context);
  }


  inOrder(node, callback, context) {
    if (node !== null) {
      this.inOrder(node.left, callback, context);
      callback.call(context, node);
      this.inOrder(node.right, callback, context);
    }
  }

}
