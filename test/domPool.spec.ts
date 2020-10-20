import { expect } from 'chai';
import * as sinon from 'sinon';

import { MockDocument, MockNode } from '@daign/mock-dom';

import { DomPool } from '../lib/domPool';

declare var global: any;

describe( 'DomPool', (): void => {
  beforeEach( (): void => {
    global.document = new MockDocument();
  } );

  describe( 'get', (): void => {
    it( 'should return a node of type MockNode', (): void => {
      // Act
      const node = DomPool.get( 'div' );

      // Assert
      expect( node ).to.be.instanceof( MockNode );
    } );

    it( 'should return a node with correct properties', (): void => {
      // Arrange
      const nodeName = 'div';
      const nameSpace = 'http://www.w3.org/1999/xhtml';

      // Act
      const node = DomPool.get( nodeName );

      // Assert
      expect( node.nodeName ).to.equal( nodeName );
      expect( node.namespaceURI ).to.equal( nameSpace );
    } );

    it( 'should return a node with correct name space if passed', (): void => {
      // Arrange
      const nodeName = 'circle';
      const nameSpace = 'http://www.w3.org/2000/svg';

      // Act
      const node = DomPool.get( nodeName, nameSpace );

      // Assert
      expect( node.nodeName ).to.equal( nodeName );
      expect( node.namespaceURI ).to.equal( nameSpace );
    } );

    it( 'should return a node that was previously added to the pool', (): void => {
      // Arrange
      const nodeName = 'circle';
      const nameSpace = 'http://www.w3.org/2000/svg';
      const node = DomPool.get( nodeName, nameSpace );
      DomPool.giveBack( node );

      // Act
      const newNode = DomPool.get( nodeName, nameSpace );

      // Assert
      expect( newNode === node ).to.be.true;
    } );

    it( 'should return multiple nodes added to the pool', (): void => {
      // Arrange
      const nodeName = 'circle';
      const nameSpace = 'http://www.w3.org/2000/svg';
      const node1 = DomPool.get( nodeName, nameSpace );
      const node2 = DomPool.get( nodeName, nameSpace );
      DomPool.giveBack( node1 );
      DomPool.giveBack( node2 );

      // Act
      const newNode2 = DomPool.get( nodeName, nameSpace );
      const newNode1 = DomPool.get( nodeName, nameSpace );

      // Assert
      expect( newNode1 === node1 ).to.be.true;
      expect( newNode2 === node2 ).to.be.true;
    } );

    it( 'should create a new node if category exists but is empty', (): void => {
      // Arrange
      const nodeName = 'div';

      // Create node.
      const node1 = DomPool.get( nodeName );
      // Return to pool.
      DomPool.giveBack( node1 );
      // Remove from pool. Category in pool remains.
      DomPool.get( nodeName );

      const spy = sinon.spy( document, 'createElement' );

      // Act
      DomPool.get( nodeName );

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );
  } );

  // This is for coverage of the abstract class definition.
  describe( 'class definition', (): void => {
    it( 'should be extendable', (): void => {
      // Act
      class Test extends DomPool {}
      const test = new Test();

      // Assert
      expect( test ).to.be.instanceof( Test );
    } );
  } );
} );
