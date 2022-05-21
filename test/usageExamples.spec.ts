import { expect } from 'chai';

import { MockDocument } from '@daign/mock-dom';

import { WrappedDomPool, WrappedNode } from '../lib';

declare var global: any;

describe( 'UsageExamples', (): void => {
  beforeEach( (): void => {
    global.document = new MockDocument();

    WrappedDomPool.clear();
  } );

  describe( 'WrappedDomPool example', (): void => {
    it( 'should get and return nodes', (): void => {
      // Get a wrapped node of the requested type.
      const node1 = WrappedDomPool.get( 'div' );

      expect( node1.nodeName ).to.equal( 'div' );
      expect( node1 ).to.be.instanceof( WrappedNode );

      // Access the domNode inside the wrapped node.
      const div = node1.domNode;
      expect( div ).to.be.not.null;

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
    } );
  } );
} );
