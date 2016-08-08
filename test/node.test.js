import test from 'blue-tape';
import Node from '../src/node';

const getParent = () => {
  return new Node(1, 0,
    new Node(2, 0,
      new Node(3, 0, null, null),
      new Node(3, 0, null, null)
    ),
    new Node(5, 0,
      new Node(6, 0,
        new Node(7, 0, null, null),
        new Node(8, 0, null, null)
      ),
      new Node(9, 0, null, new Node(10, 0, null, null))
    ));
};

test('Node', (t) => {
  t.test('exports a class', (t) => {
    t.ok(Node);
    t.end();
  });

  t.test('constructor', (t) => {
    let left = {};
    let right = {};
    let parent = {};
    let data = { a : 1 };
    let key = 'key';
    let n = new Node(key, data, left, right, parent, 2);

    t.equals(n.parent, parent, 'parent');
    t.equals(n.left, left, 'left');
    t.equals(n.right, right, 'right');
    t.equals(n.height, 2, 'height');

    t.equals(left.parent, n, 'linked left');
    t.equals(right.parent, n, 'linked right');

    t.end();
  });

  t.test('is root', (t) => {
    t.ok(new Node(1, {}, null, null, null).isRoot());
    t.notOk(new Node(1, {}, null, null, {}).isRoot());

    t.end();
  });

  t.test('is leaf', (t) => {
    t.ok(new Node(1, {}, null, null, null).isLeaf());
    t.notOk(new Node(1, {}, null, {}, {}).isLeaf());
    t.notOk(new Node(1, {}, {}, null, {}).isLeaf());

    t.end();
  });

  t.test('is left', (t) => {
    let parent = new Node(0, {},
      new Node(1, {}, null, null),
      new Node(2, {}, null, null));

    t.ok(parent.left.isLeft());
    t.notOk(parent.isLeft());
    t.notOk(parent.right.isLeft());

    t.end();
  });

  t.test('is right', (t) => {
    let parent = new Node(0, {},
      new Node(1, {}, null, null),
      new Node(2, {}, null, null));

    t.ok(parent.right.isRight());
    t.notOk(parent.isRight());
    t.notOk(parent.left.isRight());

    t.end();
  });

  t.test('grandparent', (t) => {
    let parent = getParent();

    t.equals(parent.left.left.grandparent(), parent);
    t.notEquals(parent.right.left.left.grandparent(), parent);

    t.end();
  });

  t.test('sibling', (t) => {
    let parent = getParent();

    t.equals(parent.left.sibling(), parent.right);
    t.equals(parent.right.sibling(), parent.left);

    t.end();
  });
});
