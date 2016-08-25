import { BST, AVL, RB } from '../src/';

let start, end;

function fillTree (Tree, values) {
  const tree = new Tree();
  for (let i = 0; i < values.length; i++) {
    tree.insert(values[i]);
  }
  return tree;
}

function fillTreeRandom(Tree, n, randoms) {
  const tree = new Tree();

  for (let i = 0; i < n; i++) {
    tree.insert(-500 + (1000 * Math.random()));
  }
}

function getRandoms(n, min = -500, max = 500) {
  let arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(min + ((max - min) * Math.random()));
  }
  return arr;
}

((N) => {
  console.log('Random fill, ', N, 'elements');
  const randoms = getRandoms(N);
  start = Date.now();
  fillTree(BST, randoms);
  console.log(' - BST', (Date.now() - start) / 1000, 's');

  start = Date.now();
  fillTree(AVL, randoms);
  console.log(' - AVL', (Date.now() - start) / 1000, 's');

  start = Date.now();
  fillTree(RB, randoms);
  console.log(' - RB ', (Date.now() - start) / 1000, 's');
})(100000);
