import test from 'blue-tape';
import Tree from '../src/tree';

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
    let tree = new Tree();

    tree.insert(1, { a: 1 });


    t.end();
  });

  t.end();
});
