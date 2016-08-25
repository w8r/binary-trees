import test from 'blue-tape';
import { BST, AVL, RB, Node, RBNode } from '../src/';

test('expose', (t) => {
  t.equals(typeof AVL,  'function', 'AVL');
  t.equals(typeof BST,  'function', 'BST');
  t.equals(typeof RB,   'function', 'RB');
  t.equals(typeof Node, 'function', 'Node');
  t.equals(typeof RBNode, 'function', 'RBNode');

  t.end();
});
