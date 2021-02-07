import { expect } from 'chai';
import * as sinon from 'sinon';

import { MockDocument, MockNode } from '@daign/mock-dom';

import { WrappedNode } from '../lib';

declare var global: any;

describe( 'WrappedNode', (): void => {
  beforeEach( (): void => {
    global.document = new MockDocument();
  } );

  describe( 'get domNode', (): void => {
    it( 'should get the DOM node of type MockNode', (): void => {
      // Arrange
      const node = new WrappedNode( 'div' );

      // Act
      const result = node.domNode;

      // Assert
      expect( result ).to.be.instanceof( MockNode );
    } );
  } );

  describe( 'get children', (): void => {
    it( 'should get the children', (): void => {
      // Arrange
      const node1 = new WrappedNode( 'div' );
      const node2 = new WrappedNode( 'span' );
      const node3 = new WrappedNode( 'p' );
      node1.appendChild( node2 );
      node1.appendChild( node3 );

      // Act
      const result = node1.children;

      // Assert
      expect( result.length ).to.equal( 2 );
      expect( result[ 0 ].nodeName ).to.equal( 'span' );
    } );

    it( 'should not allow to modify the internal children array', (): void => {
      // Arrange
      const node1 = new WrappedNode( 'div' );
      const node2 = new WrappedNode( 'span' );
      node1.appendChild( node2 );

      // Act
      const result = node1.children;
      const node3 = new WrappedNode( 'p' );
      result.push( node3 );

      // Assert
      expect( result.length ).to.equal( 2 );
      expect( node1.children.length ).to.equal( 1 );
    } );
  } );

  describe( 'get nodeName', (): void => {
    it( 'should get the name of the node', (): void => {
      // Arrange
      const nodeName = 'div';
      const node = new WrappedNode( nodeName );

      // Act
      const result = node.nodeName;

      // Assert
      expect( result ).to.equal( nodeName );
    } );
  } );

  describe( 'get nameSpace', (): void => {
    it( 'should get the name space of the node', (): void => {
      // Arrange
      const nodeName = 'div';
      const nameSpace = 'http://www.w3.org/1999/xhtml';
      const node = new WrappedNode( nodeName, nameSpace );

      // Act
      const result = node.nameSpace;

      // Assert
      expect( result ).to.equal( nameSpace );
    } );
  } );

  describe( 'get style', (): void => {
    it( 'should get the style of the wrapped node', (): void => {
      // Arrange
      const node = new WrappedNode( 'div' );
      node.domNode.style.fontSize = '12px';

      // Act
      const result = node.style;

      // Assert
      expect( result.fontSize ).to.equal( '12px' );
    } );

    it( 'should add style to the used attributes', (): void => {
      // Arrange
      const node = new WrappedNode( 'div' );

      // Act
      node.style.fontSize = '12px';

      // Assert
      expect( ( node as any ).usedAttributes.has( 'style' ) ).to.be.true;
    } );
  } );

  describe( 'set textContent', (): void => {
    it( 'should set the text content of the wrapped node', (): void => {
      // Arrange
      const node = new WrappedNode( 'div' );
      const exampleText = 'Test Content';

      // Act
      node.textContent = exampleText;

      // Assert
      expect( node.domNode.textContent ).to.equal( exampleText );
    } );
  } );

  describe( 'constructor', (): void => {
    it( 'should create a node of type MockNode', (): void => {
      // Act
      const node = new WrappedNode( 'div' );

      // Assert
      expect( node.domNode ).to.be.instanceof( MockNode );
    } );

    it( 'should set the correct properties', (): void => {
      // Arrange
      const nodeName = 'div';
      const nameSpace = 'TestNameSpace';

      // Act
      const node = new WrappedNode( nodeName, nameSpace );

      // Assert
      expect( node.nodeName ).to.equal( nodeName );
      expect( node.nameSpace ).to.equal( nameSpace );
    } );

    it( 'should set the XHTML name space if no name space is specified', (): void => {
      // Arrange
      const nodeName = 'div';
      const nameSpace = 'http://www.w3.org/1999/xhtml';

      // Act
      const node = new WrappedNode( nodeName );

      // Assert
      expect( node.nameSpace ).to.equal( nameSpace );
    } );

    it( 'should call createElement if no name space is specified', (): void => {
      // Arrange
      const nodeName = 'div';
      const spy = sinon.spy( document, 'createElement' );

      // Act
      // tslint:disable-next-line:no-unused-expression-chai
      new WrappedNode( nodeName );

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should call createElementNS if name space is specified', (): void => {
      // Arrange
      const nodeName = 'div';
      const nameSpace = 'http://www.w3.org/1999/xhtml';
      const spy = sinon.spy( document, 'createElementNS' );

      // Act
      // tslint:disable-next-line:no-unused-expression-chai
      new WrappedNode( nodeName, nameSpace );

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );
  } );

  describe( 'appendChild', (): void => {
    it( 'should add the child node to the children of the node', (): void => {
      // Arrange
      const parent = new WrappedNode( 'div' );
      const child1 = new WrappedNode( 'span' );
      const child2 = new WrappedNode( 'p' );

      // Act
      parent.appendChild( child1 );
      parent.appendChild( child2 );

      // Assert
      const children = ( parent as any ).children;
      expect( children.length ).to.equal( 2 );
      expect( children[ 0 ].nodeName ).to.equal( 'span' );
      expect( children[ 1 ].nodeName ).to.equal( 'p' );
    } );

    it( 'should connect the wrapped nodes', (): void => {
      // Arrange
      const parent = new WrappedNode( 'div' );
      const child = new WrappedNode( 'div' );

      // Act
      parent.appendChild( child );

      // Assert
      const domNodeChildren = parent.domNode.children;
      expect( domNodeChildren.length ).to.equal( 1 );
      expect( domNodeChildren[ 0 ] ).to.equal( child.domNode );
    } );
  } );

  describe( 'clearChildren', (): void => {
    it( 'should clear child references', (): void => {
      // Arrange
      const parent = new WrappedNode( 'div' );
      const child1 = new WrappedNode( 'div' );
      const child2 = new WrappedNode( 'div' );
      parent.appendChild( child1 );
      parent.appendChild( child2 );

      // Act
      parent.clearChildren();

      // Assert
      expect( ( parent as any ).children.length ).to.equal( 0 );
      expect( parent.domNode.children.length ).to.equal( 0 );
    } );
  } );

  describe( 'setAttribute', (): void => {
    it( 'should call setAttribute on the DOM node', (): void => {
      // Arrange
      const node = new WrappedNode( 'div' );
      const spy = sinon.spy( node.domNode, 'setAttribute' );

      // Act
      node.setAttribute( 'id', 'SomeId' );

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should add the attributeName to the used attributes', (): void => {
      // Arrange
      const node = new WrappedNode( 'div' );

      // Act
      node.setAttribute( 'id', 'SomeId' );

      // Assert
      expect( ( node as any ).usedAttributes.has( 'id' ) ).to.be.true;
    } );
  } );

  describe( 'removeAttribute', (): void => {
    it( 'should call removeAttribute on the DOM node', (): void => {
      // Arrange
      const node = new WrappedNode( 'div' );
      const spy = sinon.spy( node.domNode, 'removeAttribute' );

      // Act
      node.removeAttribute( 'id' );

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );
  } );

  describe( 'addEventListener', (): void => {
    it( 'should call addEventListener on the DOM node', (): void => {
      // Arrange
      const node = new WrappedNode( 'div' );
      const spy = sinon.spy( node.domNode, 'addEventListener' );
      const listener = (): void => {};

      // Act
      node.addEventListener( 'mousedown', listener, false );

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should store a callback to remove the listener', (): void => {
      // Arrange
      const node = new WrappedNode( 'div' );
      const listener = (): void => {};

      // Act
      node.addEventListener( 'mousedown', listener, false );

      // Assert
      expect( ( node as any ).removeEventListenerCallbacks.length ).to.equal( 1 );
    } );

    it( 'should return a callback to remove the listener', (): void => {
      // Arrange
      const node = new WrappedNode( 'div' );
      const listener = (): void => {};
      const spy = sinon.spy( node.domNode, 'removeEventListener' );

      const callback = node.addEventListener( 'mousedown', listener, false );
      expect( ( node.domNode as any ).eventListeners.mousedown ).to.not.be.undefined;

      // Act
      callback();

      // Assert
      expect( spy.calledOnce ).to.be.true;
      expect( ( node.domNode as any ).eventListeners.mousedown ).to.be.undefined;
    } );
  } );

  describe( 'reset', (): void => {
    it( 'should clear child references', (): void => {
      // Arrange
      const parent = new WrappedNode( 'div' );
      const child1 = new WrappedNode( 'div' );
      const child2 = new WrappedNode( 'div' );
      parent.appendChild( child1 );
      parent.appendChild( child2 );

      // Act
      parent.reset();

      // Assert
      expect( ( parent as any ).children.length ).to.equal( 0 );
      expect( parent.domNode.children.length ).to.equal( 0 );
    } );

    it( 'should reset all attributes', (): void => {
      // Arrange
      const node = new WrappedNode( 'div' );
      node.textContent = 'SomeText';
      node.setAttribute( 'id', 'SomeId' );
      node.setAttribute( 'color', 'SomeColor' );
      const spy = sinon.spy( node, 'removeAttribute' );

      // Act
      node.reset();

      // Assert
      expect( node.domNode.textContent ).to.equal( '' );
      expect( spy.calledTwice ).to.be.true;
      expect( spy.calledWith( 'id' ) ).to.be.true;
      expect( spy.calledWith( 'color' ) ).to.be.true;
      expect( ( node as any ).usedAttributes.size ).to.equal( 0 );
    } );

    it( 'should remove eventListeners and clear remove callbacks', (): void => {
      // Arrange
      const node = new WrappedNode( 'div' );
      const listener = (): void => {};
      node.addEventListener( 'mousedown', listener, false );
      node.addEventListener( 'mouseup', listener, false );
      const spy = sinon.spy( node.domNode, 'removeEventListener' );

      // Act
      node.reset();

      // Assert
      expect( spy.calledTwice ).to.be.true;
      expect( ( node as any ).removeEventListenerCallbacks.length ).to.equal( 0 );
    } );
  } );

  describe( 'destroy', (): void => {
    it( 'should call reset', (): void => {
      // Arrange
      const node = new WrappedNode( 'div' );
      const spy = sinon.spy( node, 'reset' );

      // Act
      node.destroy();

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should set the DOM node reference to null', (): void => {
      // Arrange
      const node = new WrappedNode( 'div' );

      // Act
      node.destroy();

      // Assert
      expect( node.domNode ).to.be.null;
    } );
  } );
} );
