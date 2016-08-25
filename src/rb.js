import Node from './rbnode';
import { RED, BLACK } from './rbcolors';
import BST from './bst';

export default class RBTree extends BST {

  constructor (comparator) {
    super (comparator);
  }


  /**
   * @param {Number} key
   * @param {*=} data
   * @return {Node|null}
   */
  insert (key, data) {
    if (this.root === null) {
      this.root = new Node(key, data, null, null, null, BLACK);
      this.length++;
      return this.root;
    } else {
      return this.insertNode(key, data, this.root);
    }
  }


  /**
   * Insert case 2
   * @param {*} key
   * @param {*=} data
   */
  insertNode (key, data, root) {
    let node = BST.prototype.insertNode.call(this, key, data, root);
    if (node) this.insertFixup(node);
    return node;
  }


  createNode (key, data, left, right, parent, color) {
    return new Node(key, data, left, right, parent, color);
  }


  insertFixup (node) {
    for (let parent = node.parent;
             parent && parent.color === RED;
             parent = node.parent) {
		  if (parent === parent.parent.left) {
			  let uncle = parent.parent.right;
			  if (uncle && uncle.color === RED) {
				  parent.color = BLACK;
				  uncle.color  = BLACK;
				  parent.parent.color = RED;
				  node = parent.parent;
			  } else if (node === parent.right) {
				  node = parent;
				  this.rotateLeft(node);
			  } else {
				  parent.color        = BLACK;
				  parent.parent.color = RED;
				  this.rotateRight(parent.parent);
			  }
		  } else {
			  let uncle = parent.parent.left;
			  if (uncle && uncle.color === RED) {
				  parent.color = BLACK;
				  uncle.color  = BLACK;
				  parent.parent.color = RED;
				  node = parent.parent;
			  } else if (node === parent.left) {
				  node = parent;
				  this.rotateRight(node);
			  } else {
				  parent.color = BLACK;
				  parent.parent.color = RED;
				  this.rotateLeft(parent.parent);
			  }
		  }
	  }
	  this.root.color = BLACK;
  }


  /**
   * Rotate the node with its right child.
   * @param node {Node} The node to rotate.
   */
  rotateLeft (node) {
	  let child = node.right;
  	node.right = child.left;

  	if (child.left) child.left.parent = node;
  	child.parent = node.parent;

    if (node.parent === null) {
  		this.root = child;
    } else if (node === node.parent.left) {
  		node.parent.left = child;
  	} else {
  		node.parent.right = child;
    }

  	node.parent = child;
  	child.left = node;
  }

  /**
   * Rotate the node with its left child.
   * @param node {Node} The node to rotate.
   * @return {void}
   */
  rotateRight (node) {
  	let child = node.left;
  	node.left = child.right;

  	if (child.right) child.right.parent = node;
  	child.parent = node.parent;

  	if (node.parent === null) {
  		this.root = child;
  	} else if (node === node.parent.left) {
  		node.parent.left = child;
  	} else {
  		node.parent.right = child;
    }
  	node.parent = child;
  	child.right = node;
  }


  removeNode (node, parent) {
    let successor;
    this.length--;
	  if (!node.left || !node.right) {
		  successor = node;
	  } else {
		  successor = this.next(node);
		  node.key = successor.key;
		  node.data = successor.data;
	  }
	  let child;
	  if (!successor.left) {
		  child = successor.right;
	  } else {
		  child = successor.left;
    }

    if (child) child.parent = successor.parent;
	  if (!successor.parent) {
		  this.root = child;
    } else if (successor === successor.parent.left) {
		  successor.parent.left = child;
	  } else {
		  successor.parent.right = child;
    }

	  if (successor.color === BLACK) this.removeFixup(child, successor.parent);
  }


  removeFixup (node, parent) {
    while (node !== this.root && (!node || node.color === BLACK)) {
		  if (node === parent.left) {
			  let sibling = parent.right;
			  if (sibling && sibling.color === RED) {
  				sibling.color = BLACK;
  				parent.color = RED;
  				this.rotateLeft(parent);
  				sibling = parent.right;
  			}

    		if (sibling &&
          (!sibling.left  || sibling.left.color === BLACK) &&
          (!sibling.right || sibling.right.color === BLACK)) {
    			sibling.color = RED;
    			node = parent;
    		} else {
    			if (!sibling.right || sibling.right.color === BLACK) {
    				sibling.left.color = BLACK;
    				sibling.color = RED;
    				this.rotateRight(sibling);
    				sibling = parent.right;
    			}
    			sibling.color = parent.color;
    			parent.color = BLACK;
    			sibling.right.color = BLACK;
    			this.rotateLeft(parent);
    			node = this.root;
    		}
  		} else {
  			let sibling = parent.left;
  			if (sibling && sibling.color === RED) {
  				sibling.color = BLACK;
  				parent.color = RED;
  				this.rotateRight(parent);
  				sibling = parent.left;
  			}

  			if (sibling &&
          (!sibling.left  || sibling.left.color  === BLACK) &&
          (!sibling.right || sibling.right.color === BLACK)) {
  				sibling.color = RED;
  				node = parent;
  			} else {
  				if (!sibling.left || sibling.left.color === BLACK) {
  					sibling.right.color = BLACK;
  					sibling.color = RED;
  					this.rotateLeft(sibling);
  					sibling = parent.left;
  				}
  				sibling.color = parent.color;
  				parent.color = BLACK;
  				sibling.left.color = BLACK;
  				this.rotateRight(parent);
  				node = this.root;
  			}
  		}
  		parent = node.parent;
  	}
  	if (node) node.color = BLACK;
  }


  clear () {
    this.root = null;
    this.length = 0;
    return this;
  }

}
