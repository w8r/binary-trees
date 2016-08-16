import test from 'blue-tape';
import { BST, AVL, Node } from '../src/';

test('expose', (t) => {
  t.equals(typeof AVL,  'function', 'AVL');
  t.equals(typeof BST,  'function', 'BST');
  t.equals(typeof Node, 'function', 'Node');

  t.end();
});
