import test from 'blue-tape';
import RB  from '../src/rb';
import balanceTest from './helpers/rb_test_balance';

false && test('Red-black', (t) => {

  const createTree = (comp) => {
    let tree = new RB(comp);

    tree.insert(1);
    tree.insert(-10);
    tree.insert(30);
    tree.insert(10);

    return tree;
  };

  t.test('insert & compare', (t) => {
    let tree = createTree();

    let sorted = [-10, 1, 10, 30];

    tree.forEach((n) => {
      t.equals(n.key, sorted.shift(), 'key');
    });
    t.equals(tree.length, 4, 'length');

    sorted = [30, 10, 1, -10];
    tree = createTree((a, b) => {
      return a > b ? -1 : a === b ? 0 : 1;
    });

    tree.forEach((n) => {
      t.equals(n.key, sorted.shift(), 'key');
    });
    t.equals(tree.length, 4, 'length');

    t.equals(tree.insert(30), null, 'cannot insert twice');

    t.end();
  });


  t.test('remove', (t) => {
    let tree = createTree();

    let sorted = [-10, 1, 10, 30], i;

    tree.remove(1);
    t.equals(tree.length, 3, 'length');

    sorted.splice(1, 1);
    i = 0;
    tree.forEach((n) => {
      t.equals(n.key, sorted[i++], 'key');
    });

    tree.remove(30);
    t.equals(tree.length, 2, 'length');

    sorted.splice(2, 1);
    i = 0;
    tree.forEach((n) => {
      t.equals(n.key, sorted[i++], 'key');
    });

    tree.remove(10);
    t.equals(tree.length, 1, 'length');
    t.equals(tree.remove(-10).key, -10, 'returns removed node');
    t.equals(tree.length, 0, 'empty');
    t.equals(tree.remove(-10), null, 'remove what is not in the tree');

    tree = createTree();
    let l = tree.length;
    tree.clear();
    // console.log(tree.length, tree);
    t.equals(tree.length, 0, 'empty');

    t.end();
  });


  t.test('min', (t) => {
    let tree = createTree();
    t.equals(tree.min().key, -10, 'min');
    tree.remove(-10);
    t.equals(tree.min().key, 1, 'min');
    tree.remove(1);
    tree.remove(10);
    tree.remove(30);
    t.equals(tree.min(), null, 'empty');
    t.end();
  });


  t.test('max', (t) => {
    let tree = createTree();
    t.equals(tree.max().key, 30, 'max');
    tree.remove(30);
    t.equals(tree.max().key, 10, 'max');
    tree.remove(10);
    tree.remove(1);
    tree.remove(-10);
    t.equals(tree.max(), null, 'empty');
    t.end();
  });


  t.test('next', (t) => {
    let tree = createTree();

    t.equals(tree.next(tree.find(1)).key, 10);
    t.equals(tree.next(tree.find(10)).key, 30);
    t.equals(tree.next(tree.find(30)), null);

    tree.remove(10);
    t.equals(tree.next(tree.find(1)).key, 30);

    t.end();
  });


  t.test('prev', (t) => {
    let tree = createTree();

    t.equals(tree.prev(tree.find(1)).key, -10);
    t.equals(tree.prev(tree.find(10)).key, 1);
    t.equals(tree.prev(tree.find(30)).key, 10);
    t.equals(tree.prev(tree.find(-10)), null);

    tree.remove(1);
    t.equals(tree.prev(tree.find(10)).key, -10);

    t.end();
  });


  t.test('find', (t) => {
    let tree = createTree();
    t.equals(tree.find(20), null);
    t.equals(tree.find(-10).key, -10);
    t.equals(tree.find(1).key, 1);
    t.equals(tree.find(10).key, 10);
    t.equals(tree.find(30).key, 30);

    tree.remove(10);
    t.equals(tree.find(10), null);

    t.end();
  });


  t.test('clear', (t) => {
    const tree = createTree();
    t.equals(tree.length, 4, 'before');
    tree.clear();
    t.equals(tree.length, 0, 'after');
    t.equals(tree.root, null, 'root');

    t.end();
  });


  t.test('pop', (t) => {
    const tree = createTree();
    t.equals(tree.pop().key, 30, 'top');
    t.equals(tree.length, 3, 'length reduced');
    t.equals(tree.max().key, 10, 'top moved');

    t.end();
  });


  t.test('shift', (t) => {
    const tree = createTree();
    t.equals(tree.shift().key, -10, 'top');
    t.equals(tree.length, 3, 'length reduced');
    t.equals(tree.min().key, 1, 'bottom moved');

    t.end();
  });

  t.test('forEach', (t) => {
    const tree = createTree();
    let sorted = [-10, 1, 10, 30];
    tree.forEach((n) => {
      t.equals(n.key, sorted.shift(), 'key');
    });

    t.end();
  });

  t.test('forEach', (t) => {
    const tree = createTree();
    let sorted = [-10, 1, 10, 30];
    const ctx = {};
    tree.forEach(function (n) {
      t.equals(n.key, sorted.shift(), 'key');
      t.equals(this, ctx, 'context');
    }, ctx);

    t.end();
  });

  t.test('inorderNonRecursive', (t) => {
    const tree = createTree();
    let sorted = [-10, 1, 10, 30];
    const ctx = {};
    tree.inorderNonRecursive(function (n) {
      t.equals(n.key, sorted.shift(), 'key');
      t.equals(this, ctx, 'context');
    }, ctx);

    t.end();
  });

  balanceTest(createTree());

  t.end();
});
