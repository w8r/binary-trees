import tape from 'blue-tape';
import { RED, BLACK } from '../../src/rbcolors';

export default function testRedBlackBalance (tree) {
  tape.test('red-blackness', (t) => {
    // Root node should always be black
    t.equals(tree.root.color, BLACK, 'root is black');

    function checkColor(node) {
      if (node === null) return;
      t.ok(node.color === RED || node.color === BLACK, 'node ' + node.key + ' has color');

      if (node.color === RED) {
        if (node.left)  t.equals(node.left.color, BLACK, 'left child of red is black');
        if (node.right) t.equals(node.right.color, BLACK, 'right child of red is black');
      }

      checkColor(node.left);
      checkColor(node.right);
    }
    // recursively check colors
    checkColor(tree.root);

    // All paths to leaf should have the same number of black nodes
    function check(node, total, path) {
      if (node === null) {
        if (path === -1) return total;
        t.equals(total, path, 'path equal');
        return path;
      }

      if (node.color === BLACK) total++;

      path = check(node.left, total, path);
      path = check(node.right, total, path);

      return path;
    }
    check(tree.root, 0, -1);

    function checkBlackHeight (root) {
      if (root === null) return 1;
      let leftBlackHeight = checkBlackHeight(root.left);
      if (leftBlackHeight === 0) return leftBlackHeight;

      let rightBlackHeight = checkBlackHeight(root.right);
      if (rightBlackHeight === 0) return rightBlackHeight;

      if (leftBlackHeight !== rightBlackHeight) return 0;
      else return leftBlackHeight + (root.color === BLACK ? 1 : 0);
    }

    t.ok(checkBlackHeight(tree.root) > 0, 'black height > 0');

    t.end();
  });
}
