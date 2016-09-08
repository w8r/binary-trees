import tape from 'blue-tape';
import Tree from '../../src/avl';

const sanityCheck = (t, tree, ...args) => {
  const node = args.length === 3 ? args[2] : tree.root;
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
    sanityCheck(t, tree, node.left);
  }

  if (node.right) {
    if (node.right.parent !== node) {
      throw new Error('right child detached');
    }

    if (tree.comparator(node.left.key, node.key) < 0) {
      throw new Error('right child has a lower key');
    }
    sanityCheck(t, tree, node.right);
  }
};


/**
 * Check the recorded height is correct for every node
 * Throws if one height doesn't match
 */
const checkHeightCorrect = (tree, node, t) => {
  if (!node) return;

  if (node.left) t.ok(isFinite(node.left.height),
    'Defined height for node ' + node.left.key);

  if (node.right) t.ok(isFinite(node.right.height),
    'Defined height for node ' + node.right.key);

  t.ok(isFinite(node.height), 'defined height for node ' + node.key);

  const leftH  = node.left  ? node.left.height  : 0;
  const rightH = node.right ? node.right.height : 0;
  const expectedHeight = 1 + Math.max(leftH, rightH);

  t.equals(node.height, expectedHeight,
    'correct height for node ' + node.key +
    ' (' + node.height + ') ' + expectedHeight + ' ' + (node === tree.root));
  if (node.left)  checkHeightCorrect(tree, node.left, t);
  if (node.right) checkHeightCorrect(tree, node.right, t);
};


/**
 * Check that the balance factors are all between -1 and 1
 */
const checkBalanceFactors = (tree, node, t) => {
  const bf = Math.abs(Tree.balanceFactor(node));
  t.ok(bf <= 1, 'Tree is balanced at node ' + node.key + ' ' + bf);

  if (node.left)  checkBalanceFactors(tree, node.left, t);
  if (node.right) checkBalanceFactors(tree, node.right, t);
};


/**
 * When checking if the BST conditions are met, also check that
 * the heights are correct and the tree is balanced
 */
export default function checkAVLTree (tree, t) {
  (t || tape).test('AVL-ness', (t) => {
    checkHeightCorrect(tree, tree.root, t);
    checkBalanceFactors(tree, tree.root, t);

    t.end();
  });
};
