# daign-dom-pool

[![CI][ci-icon]][ci-url]
[![Coverage][coveralls-icon]][coveralls-url]
[![NPM package][npm-icon]][npm-url]

### Helper for reusing DOM nodes.

For applications that are heavily creating and discarding DOM nodes
and don't want to relying on garbage collection to keep the performance up.

## Classes

+ **DomPool** - Managing a pool of plain DOM nodes.
+ **WrappedDomPool** - Managing a pool of WrappedNodes.
+ **WrappedNode** - Class that wraps a DOM node inside.
The wrapper keeps track of attributes that are set,
child notes that are attached and event listeners that are registered on the node,
so that they can be removed automatically.

## Installation

```sh
npm install @daign/dom-pool --save
```

## Usage example

```typescript
import { expect } from 'chai';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

// Get a wrapped node of the requested type.
const node1 = WrappedDomPool.get( 'div' );

expect( node1.nodeName ).to.equal( 'div' );
expect( node1 ).to.be.instanceof( WrappedNode );

// Access the domNode inside the wrapped node.
const div = node1.domNode;

// Set attributes to the node.
node1.setAttribute( 'id', 'SomeId' );

// Create a second node and attach it to the first.
const node2 = WrappedDomPool.get( 'div' );
node1.appendChild( node2 );

// Return the node to the pool. Attributes are cleared and children are removed.
WrappedDomPool.giveBack( node1 );

// There should be one node in the pool.
expect( WrappedDomPool.countNodes() ).to.equal( 1 );

// Getting another node now will return the node from the pool, ready to be reused.
const node3 = WrappedDomPool.get( 'div' );

// It has no children attached to it anymore.
expect( node3.children.length ).to.equal( 0 );

// The pool is now empty.
expect( WrappedDomPool.countNodes() ).to.equal( 0 );
```

## Scripts

```bash
# Build
npm run build

# Run lint analysis
npm run lint

# Run unit tests with code coverage
npm run test

# Get a full lcov report
npm run coverage
```

[ci-icon]: https://github.com/daign/daign-dom-pool/workflows/CI/badge.svg
[ci-url]: https://github.com/daign/daign-dom-pool/actions
[coveralls-icon]: https://coveralls.io/repos/github/daign/daign-dom-pool/badge.svg?branch=main
[coveralls-url]: https://coveralls.io/github/daign/daign-dom-pool?branch=main
[npm-icon]: https://img.shields.io/npm/v/@daign/dom-pool.svg
[npm-url]: https://www.npmjs.com/package/@daign/dom-pool
