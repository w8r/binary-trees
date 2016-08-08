import test from 'blue-tape';
import Tree from '../src/tree';

const createTree = () => {
  const tree = new Tree();
  const data = { a: 3 };
  tree.insert(   1, data);
  tree.insert(   2, data);
  tree.insert(  -3, data);
  tree.insert(   0, data);
  tree.insert(-100, data);
  tree.insert(0.25, data);
  return tree;
};

test('Tree', (t) => {

  t.test('export class', (t) => {
    t.ok(Tree);

    t.end();
  });

  t.test('constructor', (t) => {
    let comparator = (a, b) => a - b;
    let tree = new Tree(comparator);
    t.equals(tree.root, null, 'root');
    t.equals(tree.size, 0, 'size');
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
    t.equals(tree.size, 1, 'size');


    tree.insert(2, { a: 3});
    t.equals(tree.root.right.key, 2);
    t.equals(tree.size, 2, 'size');

    tree.insert(-3, { a: 3});
    t.equals(tree.root.left.key, -3);
    t.equals(tree.size, 3, 'size');

    tree.insert(0, { a: 3});
    t.equals(tree.root.left.right.key, 0);
    t.equals(tree.size, 4, 'size');

    t.end();
  });

  t.test('for each', (t) => {
    const tree = createTree();

    let accum = [];
    tree.forEach((n) => accum.push(n.key));

    t.deepEquals(accum, [-100, -3, 0, 0.25, 1, 2], 'order');
    const ctx = { a: 1 };
    tree.forEach(function(n) { t.equals(this, ctx, 'context'); }, ctx);

    t.end();
  });

  t.test('remove', (t) => {
    const tree = createTree();
    t.equals(tree.size, 6, 'before size');
    t.equals(tree.remove(0.25), true, 'remove success');
    t.equals(tree.size, 5, 'after size');
    t.equals(tree.search(0.25), null, 'removed');
    t.equals(tree.remove(0.25), false, 'cannot remove what is not in the tree');

    t.end();
  });

  t.test('')

  t.end();
});
