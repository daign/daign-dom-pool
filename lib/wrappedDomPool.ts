import { WrappedNode } from './wrappedNode';

/**
 * Static class for reusing wrapped dom nodes.
 */
export abstract class WrappedDomPool {
  public static readonly svgNamespace: string = 'http://www.w3.org/2000/svg';
  public static readonly xhtmlNamespace: string = 'http://www.w3.org/1999/xhtml';
  public static readonly xlinkNamespace: string = 'http://www.w3.org/1999/xlink';

  /**
   * Get a wrapped node object, either reusing one from the pool or creating a new one.
   * @param nodeName - The name of the node.
   * @param namespace - The namespace. Optional.
   * @returns A wrapped node object.
   */
  public static get( nodeName: string, namespace?: string ): WrappedNode {
    const key = (
      namespace ? `${namespace}/${nodeName}` : `${WrappedDomPool.xhtmlNamespace}/${nodeName}`
    );

    // Reuse a node from the pool if possible.
    if ( this.pool[ key ] !== undefined ) {
      // Will return undefined if the category is empty.
      const node = this.pool[ key ].pop();

      if ( node !== undefined ) {
        return node;
      }
    }

    // Create a new wrapped node with namespace.
    if ( namespace ) {
      return new WrappedNode( nodeName, namespace );
    }

    // Create a new wrapped node without namespace.
    return new WrappedNode( nodeName );
  }

  /**
   * Get a wrapped node object, always creating a new one.
   * @param nodeName - The name of the node.
   * @param namespace - The namespace. Optional.
   * @returns A wrapped node object.
   */
  public static getFresh( nodeName: string, namespace?: string ): WrappedNode {
    // Create a new wrapped node with namespace.
    if ( namespace ) {
      return new WrappedNode( nodeName, namespace );
    }

    // Create a new wrapped node without namespace.
    return new WrappedNode( nodeName );
  }

  /**
   * Get a wrapped SVG node object, either reusing one from the pool or creating a new one.
   * @param nodeName - The name of the node.
   * @returns A wrapped node object.
   */
  public static getSvg( nodeName: string ): WrappedNode {
    return WrappedDomPool.get( nodeName, WrappedDomPool.svgNamespace );
  }

  /**
   * Get a wrapped SVG node object, always creating a new one.
   * @param nodeName - The name of the node.
   * @returns A wrapped node object.
   */
  public static getFreshSvg( nodeName: string ): WrappedNode {
    return WrappedDomPool.getFresh( nodeName, WrappedDomPool.svgNamespace );
  }

  /**
   * Return a wrapped node to the pool.
   * @param node - The node to return to the pool.
   */
  public static giveBack( node: WrappedNode ): void {
    const nodeName = node.nodeName;
    const namespace = node.namespace;
    const key = `${namespace}/${nodeName}`;

    // Create a new pool category if necessary.
    if ( this.pool[ key ] === undefined ) {
      this.pool[ key ] = [];
    }

    // Remove all child nodes and event listeners from the node, reset all attributes.
    node.reset();

    this.pool[ key ].push( node );
  }

  /**
   * Remove and destroy all wrapped nodes from the pool.
   */
  public static clear(): void {
    for ( const key of Object.keys( this.pool ) ) {
      this.pool[ key ].forEach( ( node: WrappedNode ): void => {
        node.destroy();
      } );
      delete this.pool[ key ];
    }
  }

  /**
   * Get the number of nodes in the pool.
   * @returns The number of nodes.
   */
  public static countNodes(): number {
    let count = 0;

    for ( const key of Object.keys( this.pool ) ) {
      count += this.pool[ key ].length;
    }
    return count;
  }

  /**
   * Get the number of node types in the pool.
   * @returns The number of node types.
   */
  public static countTypes(): number {
    return Object.keys( this.pool ).length;
  }

  /**
   * The pool of wrapped nodes. Categorized by node name.
   */
  private static pool: { [ nodeName: string ]: WrappedNode[] } = {};
}
