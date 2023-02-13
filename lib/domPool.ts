/**
 * Static class for reusing dom nodes.
 */
export abstract class DomPool {
  public static readonly svgNamespace: string = 'http://www.w3.org/2000/svg';
  public static readonly xhtmlNamespace: string = 'http://www.w3.org/1999/xhtml';

  /**
   * Get a node object, either reusing one from the pool or creating a new one.
   * @param nodeName - The name of the node.
   * @param namespace - The namespace. Optional.
   * @returns A node object.
   */
  public static get( nodeName: string, namespace?: string ): any {
    const key = (
      namespace ? `${namespace}/${nodeName}` : `${DomPool.xhtmlNamespace}/${nodeName}`
    );

    // Reuse a node from the pool if possible.
    if ( this.pool[ key ] !== undefined && this.pool[ key ].length > 0 ) {
      return this.pool[ key ].pop();
    }

    // Create a new node with namespace.
    if ( namespace ) {
      return document.createElementNS( namespace, nodeName );
    }

    // Create a new node without namespace.
    return document.createElement( nodeName );
  }

  /**
   * Get a node object, always creating a new one.
   * @param nodeName - The name of the node.
   * @param namespace - The namespace. Optional.
   * @returns A node object.
   */
  public static getFresh( nodeName: string, namespace?: string ): any {
    // Create a new node with namespace.
    if ( namespace ) {
      return document.createElementNS( namespace, nodeName );
    }

    // Create a new node without namespace.
    return document.createElement( nodeName );
  }

  /**
   * Get an SVG node object, either reusing one from the pool or creating a new one.
   * @param nodeName - The name of the node.
   * @returns An SVG node object.
   */
  public static getSvg( nodeName: string ): any {
    return DomPool.get( nodeName, DomPool.svgNamespace );
  }

  /**
   * Get an SVG node object, always creating a new one.
   * @param nodeName - The name of the node.
   * @returns An SVG node object.
   */
  public static getFreshSvg( nodeName: string ): any {
    return DomPool.getFresh( nodeName, DomPool.svgNamespace );
  }

  /**
   * Return a node to the pool.
   * @param node - The node to return to the pool.
   */
  public static giveBack( node: any ): void {
    const nodeName = node.nodeName;
    const namespace = node.namespaceURI;
    const key = `${namespace}/${nodeName}`;

    // Create a new pool category if necessary.
    if ( this.pool[ key ] === undefined ) {
      this.pool[ key ] = [];
    }

    this.pool[ key ].push( node );
  }

  /**
   * The pool of dom nodes. Categorized by node name.
   */
  private static pool: { [ nodeName: string ]: any[] } = {};
}
