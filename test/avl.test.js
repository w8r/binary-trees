import test from 'blue-tape';
import Tree from '../src/avl';

const createTree = (comp) => {
  const tree = new Tree(comp);
  const data = { a: 3 };
  tree.insert(   1, data);
  tree.insert(   2, data);
  tree.insert(  -3, data);
  tree.insert(   0, data);
  tree.insert(-100, data);
  tree.insert(0.25, data);
  return tree;
};

const sanityCheck = (tree, ...args) => {
  const node = args.length === 2 ? args[1] : tree.root;
  // trival - no sanity check needed, as either the tree
  // is empty or there is only one node in the tree
  if (node === null || node.isLeaf() && node.parent === null) return true;

  const expectedHeight = Math.max(tree._height(node.left), tree._height(node.right)) + 1;
  console.log(expectedHeight, node.height, node.key);
  if (node.height !== expectedHeight) {
    throw new Error(['Invalid height for node ', node.key, ': ',
      node.height, ' instead of ', + expectedHeight].join(' '));
  }

  // balance factor
  const bFactor = Tree.balanceFactor(node);
  console.log(node.key, bFactor);
  if (bFactor < -1 || balFactor > 1) {
    throw new Error(['Balance factor for node ', node.key, 'is', bFactor].join(' '));
  }

  // no circular references
  if (node.left === node) {
    throw new Error(['Circular reference in left child of node', node.key].join(' '));
  }

  if (node.right === node) {
    throw new Error('Circular reference in right child of node', node.key);
  }

  if (node.left) {
    if (node.left.parent !== node) {
      throw new Error('left child detached');
    }

    if (tree.comparator(node.left.key, node.key) > 0) {
      throw new Error('left child has a greater key');
    }
    sanityCheck(tree, node.left);
  }

  if (node.right) {
    if (node.right.parent !== node) {
      throw new Error('right child detached');
    }

    if (tree.comparator(node.left.key, node.key) < 0) {
      throw new Error('right child has a lower key');
    }
    sanityCheck(tree, node.right);
  }
};


/**
 * Check the recorded height is correct for every node
 * Throws if one height doesn't match
 */
const checkHeightCorrect = (tree, node) => {
  if (!node) return;

  if (node.left && node.left.height === undefined) {
    throw new Error('Undefined height for node ' + node.left.key);
  }
  if (node.right && node.right.height === undefined) {
    throw new Error('Undefined height for node ' + node.right.key);
  }
  if (node.height === undefined) {
    throw new Error('Undefined height for node ' + node.key);
  }

  const leftH = node.left ? node.left.height : 0;
  const rightH = node.right ? node.right.height : 0;
  const expectedHeight = 1 + Math.max(leftH, rightH);

  if (node.height !== expectedHeight) {
    console.error('Height constraint failed for node ' + node.key + ' (' + node.height + ') ' + expectedHeight);
  }
  if (node.left)  checkHeightCorrect(tree, node.left);
  if (node.right) checkHeightCorrect(tree, node.right);
};


/**
 * Check that the balance factors are all between -1 and 1
 */
const checkBalanceFactors = (tree, node) => {
  if (Math.abs(Tree.balanceFactor(node)) > 1) {
    throw new Error('Tree is unbalanced at node ' + node.key);
  }
  if (node.left)  checkBalanceFactors(tree, node.left);
  if (node.right) checkBalanceFactors(tree, node.right);
};


/**
 * When checking if the BST conditions are met, also check that the heights are correct
 * and the tree is balanced
 */
const checkAVLTree = (tree) => {
  checkHeightCorrect(tree, tree.root);
  checkBalanceFactors(tree, tree.root);
};

test('AVL', (t) => {

  t.test('export class', (t) => {
    t.ok(Tree);

    t.end();
  });


  t.test('constructor', (t) => {
    let comparator = (a, b) => a - b;
    let tree = new Tree(comparator);
    t.equals(tree.root, null, 'root');
    t.equals(tree.length, 0, 'size');
    t.equals(tree.comparator, comparator, 'comparator');
    t.equals(typeof (new Tree()).comparator, 'function', 'default comparator');

    t.end();
  });


  t.test('insert', (t) => {
    const tree = new Tree();
    const data = { a: 1 };

    tree.insert(1, data);
    t.equals(tree.root.key, 1, 'key');
    t.equals(tree.root.data, data, 'data');
    t.equals(tree.length, 1, 'size');


    tree.insert(2, { a: 3});
    t.equals(tree.root.right.key, 2);
    t.equals(tree.length, 2, 'size');

    tree.insert(-3, { a: 3});
    t.equals(tree.root.left.key, -3);
    t.equals(tree.length, 3, 'size');

    tree.insert(0, { a: 3});
    t.equals(tree.root.left.right.key, 0);
    t.equals(tree.length, 4, 'size');

    t.end();
  });

  t.test('for each', (t) => {
    const tree = createTree();

    let accum = [];
    tree.forEach((n) => accum.push(n.key));

    // tree.forEach((n) => console.log(n.height));
    // console.log(tree.depth());

    t.deepEquals(accum, [-100, -3, 0, 0.25, 1, 2], 'order');
    const ctx = { a: 1 };
    tree.forEach(function(n) { t.equals(this, ctx, 'context'); }, ctx);

    t.end();
  });

  t.test('remove', (t) => {
    const tree = createTree();
    t.equals(tree.length, 6, 'before size');
    t.equals(tree.remove(0.25).key, 0.25, 'remove success');
    t.equals(tree.length, 5, 'after size');
    t.equals(tree.find(0.25), null, 'removed');
    t.equals(tree.remove(0.25), null, 'cannot remove what is not in the tree');
    tree.remove(-100);
    tree.remove(0);
    tree.remove(-3);
    tree.remove(2);
    tree.remove(1);

    t.equals(tree.length, 0, 'empty');
    t.equals(tree.root, null, 'null root');

    t.end();
  });


  t.test('min', (t) => {
    let tree = createTree();
    t.equals(tree.min().key, -100, 'min');
    tree.remove(-100);
    t.equals(tree.min().key, -3, 'min');
    tree.remove(0.25);
    tree.remove(0);
    tree.remove(1);
    tree.remove(-3);
    tree.remove(2);
    t.equals(tree.min(), null, 'empty');
    t.end();
  });


  t.test('max', (t) => {
    let tree = createTree();
    t.equals(tree.max().key, 2, 'max');
    tree.remove(2);
    t.equals(tree.max().key, 1, 'max');
    tree.remove(0.25);
    console.log(tree.remove(0), tree.toArray());
    tree.remove(-3);
    tree.remove(-100);
    tree.remove(1);
    t.equals(tree.max(), null, 'empty');
    console.log(tree.toArray());
    t.end();
  });


  t.test('next', (t) => {
    let tree = createTree();

    t.equals(tree.next(tree.find(1)).key, 2, 'one');
    t.equals(tree.next(tree.find(-100)).key, -3, 'another');
    t.equals(tree.next(tree.find(2)), null, 'at end');

    tree.remove(-3);
    t.equals(tree.next(tree.find(-100)).key, 0);

    t.end();
  });


  t.test('prev', (t) => {
    let tree = createTree();

    t.equals(tree.prev(tree.find(1)).key, 0.25, 'one');
    t.equals(tree.prev(tree.find(0.25)).key, 0, 'another');
    t.equals(tree.prev(tree.find(-3)).key, -100, 'second');
    t.equals(tree.prev(tree.find(-100)), null, 'at begin');

    tree.remove(-3);
    t.equals(tree.prev(tree.find(0)).key, -100);

    t.end();
  });


  t.test('find', (t) => {
    let tree = createTree();
    t.equals(tree.find(20), null);
    t.equals(tree.find(1).key, 1);
    t.equals(tree.find(-100).key, -100);
    t.equals(tree.find(-3).key, -3);

    tree.remove(10);
    t.equals(tree.find(10), null);

    t.end();
  });


  t.test('pop', (t) => {
    const tree = createTree();
    t.equals(tree.pop().key, 2, 'top');
    t.equals(tree.length, 5, 'length reduced');
    t.equals(tree.max().key, 1, 'top moved');

    t.end();
  });


  t.test('shift', (t) => {
    const tree = createTree();
    t.equals(tree.shift().key, -100, 'top');
    t.equals(tree.length, 5, 'length reduced');
    t.equals(tree.min().key, -3, 'bottom moved');

    t.end();
  });

  // t.test('balanced', (t) => {
  //   const tree = createTree();
  //
  //   setTimeout(() => checkAVLTree(tree));
  //
  //   t.end();
  // });

  t.end();
});
