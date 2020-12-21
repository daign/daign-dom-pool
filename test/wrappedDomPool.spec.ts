import { expect } from 'chai';
import * as sinon from 'sinon';

import { MockDocument } from '@daign/mock-dom';

import { WrappedDomPool, WrappedNode } from '../lib';

declare var global: any;

describe( 'WrappedDomPool', (): void => {
  beforeEach( (): void => {
    global.document = new MockDocument();

    WrappedDomPool.clear();
  } );

  describe( 'get', (): void => {
    it( 'should return a node of type WrappedNode', (): void => {
      // Act
      const node = WrappedDomPool.get( 'div' );

      // Assert
      expect( node ).to.be.instanceof( WrappedNode );
    } );

    it( 'should return a node with correct properties', (): void => {
      // Arrange
      const nodeName = 'div';
      const nameSpace = 'http://www.w3.org/1999/xhtml';

      // Act
      const node = WrappedDomPool.get( nodeName );

      // Assert
      expect( node.nodeName ).to.equal( nodeName );
      expect( node.nameSpace ).to.equal( nameSpace );
    } );

    it( 'should return a node with correct name space if passed', (): void => {
      // Arrange
      const nodeName = 'circle';
      const nameSpace = 'http://www.w3.org/2000/svg';

      // Act
      const node = WrappedDomPool.get( nodeName, nameSpace );

      // Assert
      expect( node.nodeName ).to.equal( nodeName );
      expect( node.nameSpace ).to.equal( nameSpace );
    } );

    it( 'should return a node that was previously added to the pool', (): void => {
      // Arrange
      const nodeName = 'circle';
      const nameSpace = 'http://www.w3.org/2000/svg';
      const node = WrappedDomPool.get( nodeName, nameSpace );
      WrappedDomPool.giveBack( node );

      // Act
      const newNode = WrappedDomPool.get( nodeName, nameSpace );

      // Assert
      expect( newNode === node ).to.be.true;
    } );

    it( 'should return multiple nodes added to the pool', (): void => {
      // Arrange
      const nodeName = 'circle';
      const nameSpace = 'http://www.w3.org/2000/svg';
      const node1 = WrappedDomPool.get( nodeName, nameSpace );
      const node2 = WrappedDomPool.get( nodeName, nameSpace );
      WrappedDomPool.giveBack( node1 );
      WrappedDomPool.giveBack( node2 );

      // Act
      const newNode2 = WrappedDomPool.get( nodeName, nameSpace );
      const newNode1 = WrappedDomPool.get( nodeName, nameSpace );

      // Assert
      expect( newNode1 === node1 ).to.be.true;
      expect( newNode2 === node2 ).to.be.true;
    } );

    it( 'should create a new node if category exists but is empty', (): void => {
      // Arrange
      const nodeName = 'div';

      // Create node.
      const node1 = WrappedDomPool.get( nodeName );
      // Return to pool.
      WrappedDomPool.giveBack( node1 );
      // Remove from pool. Category in pool remains.
      WrappedDomPool.get( nodeName );

      const spy = sinon.spy( document, 'createElement' );

      // Act
      WrappedDomPool.get( nodeName );

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );
  } );

  describe( 'getFresh', (): void => {
    it( 'should return a node of type WrappedNode', (): void => {
      // Act
      const node = WrappedDomPool.getFresh( 'div' );

      // Assert
      expect( node ).to.be.instanceof( WrappedNode );
    } );

    it( 'should return a node with correct properties', (): void => {
      // Arrange
      const nodeName = 'div';
      const nameSpace = 'http://www.w3.org/1999/xhtml';

      // Act
      const node = WrappedDomPool.getFresh( nodeName );

      // Assert
      expect( node.nodeName ).to.equal( nodeName );
      expect( node.nameSpace ).to.equal( nameSpace );
    } );

    it( 'should return a node with correct name space if passed', (): void => {
      // Arrange
      const nodeName = 'circle';
      const nameSpace = 'http://www.w3.org/2000/svg';

      // Act
      const node = WrappedDomPool.getFresh( nodeName, nameSpace );

      // Assert
      expect( node.nodeName ).to.equal( nodeName );
      expect( node.nameSpace ).to.equal( nameSpace );
    } );

    it( 'should create a new node even if there is one in the pool', (): void => {
      // Arrange
      const nodeName = 'div';

      // Create node.
      const node1 = WrappedDomPool.get( nodeName );
      // Return to pool.
      WrappedDomPool.giveBack( node1 );

      const spy = sinon.spy( document, 'createElement' );

      // Act
      WrappedDomPool.getFresh( nodeName );

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );
  } );

  describe( 'getSvg', (): void => {
    it( 'should call get with correct name space', (): void => {
      // Arrange
      const spy = sinon.spy( WrappedDomPool, 'get' );

      // Act
      WrappedDomPool.getSvg( 'circle' );

      // Assert
      expect( spy.calledOnce ).to.be.true;
      expect( spy.calledWith( 'circle', WrappedDomPool.svgNameSpace ) ).to.be.true;
    } );
  } );

  describe( 'getFreshSvg', (): void => {
    it( 'should call getFresh with correct name space', (): void => {
      // Arrange
      const spy = sinon.spy( WrappedDomPool, 'getFresh' );

      // Act
      WrappedDomPool.getFreshSvg( 'circle' );

      // Assert
      expect( spy.calledOnce ).to.be.true;
      expect( spy.calledWith( 'circle', WrappedDomPool.svgNameSpace ) ).to.be.true;
    } );
  } );

  describe( 'giveBack', (): void => {
    it( 'should add the node to the pool', (): void => {
      // Arrange
      const nodeName = 'div';
      const node = WrappedDomPool.get( nodeName );

      // Act
      WrappedDomPool.giveBack( node );

      // Assert
      expect( WrappedDomPool.countNodes() ).to.equal( 1 );
    } );

    it( 'should call reset on the returned node', (): void => {
      // Arrange
      const nodeName = 'div';
      const node = WrappedDomPool.get( nodeName );
      const spy = sinon.spy( node, 'reset' );

      // Act
      WrappedDomPool.giveBack( node );

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should create a new pool category if necessary', (): void => {
      // Arrange
      const nodeName = 'circle';
      const nameSpace = 'http://www.w3.org/2000/svg';
      const key = `${nameSpace}/${nodeName}`;
      const node = WrappedDomPool.get( nodeName, nameSpace );
      expect( ( WrappedDomPool as any ).pool[ key ] ).to.be.undefined;

      // Act
      WrappedDomPool.giveBack( node );

      // Assert
      expect( ( WrappedDomPool as any ).pool[ key ] ).to.not.be.undefined;
    } );
  } );

  describe( 'clear', (): void => {
    it( 'should call destroy on a node in the pool', (): void => {
      // Arrange
      const nodeName = 'div';
      const node = WrappedDomPool.get( nodeName );
      WrappedDomPool.giveBack( node );
      const spy = sinon.spy( node, 'destroy' );

      // Act
      WrappedDomPool.clear();

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should remove all pool categories', (): void => {
      // Arrange
      const nodeName1 = 'circle';
      const nodeName2 = 'line';
      const nameSpace = 'http://www.w3.org/2000/svg';
      const key1 = `${nameSpace}/${nodeName1}`;
      const key2 = `${nameSpace}/${nodeName2}`;

      const node1 = WrappedDomPool.get( nodeName1, nameSpace );
      const node2 = WrappedDomPool.get( nodeName2, nameSpace );
      WrappedDomPool.giveBack( node1 );
      WrappedDomPool.giveBack( node2 );

      // Act
      WrappedDomPool.clear();

      // Assert
      expect( ( WrappedDomPool as any ).pool[ key1 ] ).to.be.undefined;
      expect( ( WrappedDomPool as any ).pool[ key2 ] ).to.be.undefined;
      expect( WrappedDomPool.countTypes() ).to.equal( 0 );
    } );
  } );

  describe( 'countNodes', (): void => {
    it( 'should return 0 for an unused pool', (): void => {
      // Act
      const result = WrappedDomPool.countNodes();

      // Assert
      expect( result ).to.equal( 0 );
    } );

    it( 'should count all nodes', (): void => {
      // Arrange
      const nodeName1 = 'circle';
      const nodeName2 = 'line';
      const nameSpace = 'http://www.w3.org/2000/svg';

      const node1 = WrappedDomPool.get( nodeName1, nameSpace );
      const node2 = WrappedDomPool.get( nodeName2, nameSpace );
      const node3 = WrappedDomPool.get( nodeName2, nameSpace );
      WrappedDomPool.giveBack( node1 );
      WrappedDomPool.giveBack( node2 );
      WrappedDomPool.giveBack( node3 );

      // Act
      const result = WrappedDomPool.countNodes();

      // Assert
      expect( result ).to.equal( 3 );
    } );
  } );

  describe( 'countTypes', (): void => {
    it( 'should return 0 for an unused pool', (): void => {
      // Act
      const result = WrappedDomPool.countTypes();

      // Assert
      expect( result ).to.equal( 0 );
    } );

    it( 'should count all node types', (): void => {
      // Arrange
      const nodeName1 = 'circle';
      const nodeName2 = 'line';
      const nameSpace = 'http://www.w3.org/2000/svg';

      const node1 = WrappedDomPool.get( nodeName1, nameSpace );
      const node2 = WrappedDomPool.get( nodeName2, nameSpace );
      const node3 = WrappedDomPool.get( nodeName2, nameSpace );
      WrappedDomPool.giveBack( node1 );
      WrappedDomPool.giveBack( node2 );
      WrappedDomPool.giveBack( node3 );

      // Act
      const result = WrappedDomPool.countTypes();

      // Assert
      expect( result ).to.equal( 2 );
    } );
  } );

  // This is for coverage of the abstract class definition.
  describe( 'class definition', (): void => {
    it( 'should be extendable', (): void => {
      // Act
      class Test extends WrappedDomPool {}
      const test = new Test();

      // Assert
      expect( test ).to.be.instanceof( Test );
    } );
  } );
} );
