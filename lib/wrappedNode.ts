const xhtmlNameSpace = 'http://www.w3.org/1999/xhtml';

/**
 * Class that describes a wrapped DOM node.
 */
export class WrappedNode {
  // The wrapped DOM node.
  private _domNode: any;

  // The name of the node.
  private _nodeName: string;

  // The name space of the node.
  private _nameSpace: string;

  // References to the child nodes.
  private _children: WrappedNode[] = [];

  // The attributes that were set since the last reset.
  private usedAttributes: Set<string> = new Set<string>();

  // Callbacks to remove the event listeners on the node.
  private removeEventListenerCallbacks: ( () => void )[] = [];

  // Get the DOM node.
  public get domNode(): any {
    return this._domNode;
  }

  // Get the children.
  public get children(): WrappedNode[] {
    return [ ...this._children ];
  }

  // Get the name of the node.
  public get nodeName(): string {
    return this._nodeName;
  }

  // Get the name space of the node.
  public get nameSpace(): string {
    return this._nameSpace;
  }

  // Get the style of the wrapped node.
  public get style(): any {
    // Add to used attributes because style was accessed.
    this.usedAttributes.add( 'style' );
    return this._domNode.style;
  }

  // Set the text content of the wrapped node.
  public set textContent( value: string ) {
    this._domNode.textContent = value;
  }

  /**
   * Constructor.
   * @param nodeName - The name of the node.
   * @param nameSpace - The name space of the node. Optional.
   */
  public constructor( nodeName: string, nameSpace?: string ) {
    this._nodeName = nodeName;

    // Without a specified name space the XHTML name space is used for identification.
    this._nameSpace = nameSpace ? nameSpace : xhtmlNameSpace;

    if ( nameSpace ) {
      // Create a new node with name space.
      this._domNode = document.createElementNS( nameSpace, nodeName );
    } else {
      // Create a new node without name space.
      this._domNode = document.createElement( nodeName );
    }
  }

  /**
   * Append a child node to this node.
   * @param childNode - The child node.
   */
  public appendChild( childNode: WrappedNode ): void {
    this._children.push( childNode );
    // Also connects the wrapped nodes.
    this._domNode.appendChild( childNode.domNode );
  }

  /**
   * Remove all child nodes.
   */
  public clearChildren(): void {
    // Clear references to child WrappedNodes.
    this._children = [];

    // Remove child dom nodes from the wrapped dom node.
    while ( this._domNode.firstChild ) {
      this._domNode.removeChild( this._domNode.firstChild );
    }
  }

  /**
   * Set an attribute of the wrapped node.
   * @param attributeName - The attribute to modify.
   * @param value - The attribute value to set.
   */
  public setAttribute( attributeName: string, value: string ): void {
    this._domNode.setAttribute( attributeName, value );
    this.usedAttributes.add( attributeName );
  }

  /**
   * Remove an attribute of the wrapped node.
   * @param attributeName - The attribute to remove.
   */
  public removeAttribute( attributeName: string ): void {
    this._domNode.removeAttribute( attributeName );
  }

  /**
   * Add an event listener to the wrapped node.
   * A function to remove the event listener is returned and stored internally.
   * @param eventType - The event type to listen for.
   * @param listener - The function to call when the event is triggered.
   * @param useCapture - Whether the event will be triggered on the node before it is triggered on
   * its children.
   * @returns A function to remove the event listener.
   */
  public addEventListener(
    eventType: string, listener: ( event: any ) => void, useCapture: boolean
  ): () => void {
    this._domNode.addEventListener( eventType, listener, useCapture );

    // Create a callback to remove the event listener later.
    const removeCallback = (): void => {
      this._domNode.removeEventListener( eventType, listener, useCapture );
    };
    this.removeEventListenerCallbacks.push( removeCallback );
    return removeCallback;
  }

  /**
   * Remove all child nodes and event listeners from this node, reset all attributes.
   */
  public reset(): void {
    this.clearChildren();

    // Reset all attributes.
    this.textContent = '';
    this.usedAttributes.forEach( ( attributeName: string ): void => {
      this.removeAttribute( attributeName );
    } );
    this.usedAttributes.clear();

    // Remove all event listeners.
    this.removeEventListenerCallbacks.forEach( ( callback: () => void ): void => {
      callback();
    } );
    this.removeEventListenerCallbacks = [];
  }

  /**
   * Reset the node and release the reference to the DOM node.
   */
  public destroy(): void {
    this.reset();
    this._domNode = null;
  }
}
