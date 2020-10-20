/**
 * Static class for reusing dom nodes.
 */
export abstract class DomPool {
  /**
   * Get a node object, either reusing one from the pool or creating a new one.
   * @param nodeName The name of the node.
   * @param nameSpace The name space. Optional.
   * @returns A node object.
   */
  public static get( nodeName: string, nameSpace?: string ): any {
    const key = (
      nameSpace ? `${nameSpace}/${nodeName}` : `http://www.w3.org/1999/xhtml/${nodeName}`
    );

    // Reuse a node from the pool if possible.
    if ( this.pool[ key ] !== undefined && this.pool[ key ].length > 0 ) {
      return this.pool[ key ].pop();
    }

    // Create a new node with name space.
    if ( nameSpace ) {
      return document.createElementNS( nameSpace, nodeName );
    }

    // Create a new node without name space.
    return document.createElement( nodeName );
  }

  /**
   * Return a node to the pool.
   * @param node The node to return to the pool.
   */
  public static giveBack( node: any ): void {
    const nodeName = node.nodeName;
    const nameSpace = node.namespaceURI;
    const key = `${nameSpace}/${nodeName}`;

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
