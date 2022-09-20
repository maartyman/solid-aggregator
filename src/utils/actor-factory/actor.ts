/**
 * @class
 * The Actor class hold links to the parent and child classes and ensures the instances are removed when delete is called.
 */
class Actor<
  KeyType,
  ParentType extends Actor<any, any, any>,
  ChildType extends Actor<any, any, any>> {
  static factory = new Factory<any, any>(Actor);
  private childActors = new Array<ChildType>();
  private parentActors = new Array<ParentType>();

  /**
   * The unique key for the instance.
   */
  public readonly key: KeyType;

  /**
   * The constructor to make the actor class.
   *
   * @param key - The unique key.
   */
  constructor(key: KeyType) {
    this.key = key;
  }

  private unsaveAddChild(childActor: ChildType) {
    this.childActors.push(childActor);
  }

  private unsaveAddParent(parentActor: ParentType) {
    this.parentActors.push(parentActor);
  }

  /**
   * The makeLink() method creates a 2 sided link between a parent and child.
   *
   * @param parentActor - The parent of the link.
   * @param childActor - The child of the link.
   */
  public makeLink(parentActor: ParentType, childActor: ChildType) {
    if (!parentActor.childActors.includes(childActor)) {
      parentActor.unsaveAddChild(childActor);
      childActor.unsaveAddParent(parentActor);
    }
  }

  /**
   * The getChildren() method returns an array of all the children.
   *
   * @return an array of children.
   */
  public getChildren(): ChildType[] {
    return this.childActors;
  }

  /**
   * The getParents() method returns an array of all the parents.
   *
   * @return an array of parents.
   */
  public getParents(): ParentType[] {
    return this.parentActors;
  }

  /**
   * Deletes an actor from memory. This method will fully delete the instance for all other actors.
   */
  public delete() {
    (<typeof Actor>this.constructor).factory.removeActorFromFactory(this.key);
    for (const parentActor of this.parentActors) {
      parentActor.removeChild(this);
    }
    this.childActors.forEach((childActor) => {
      childActor.deleteLink(this);
    });
  }

  /**
   * Deletes the link between this actor and the given parent actor. If the given actor is the only parent actor, this actor will be deleted from memory.
   *
   * @param parentActor - The parent actor to which the link needs to be removed.
   * @returns void
   */
  public deleteLink(parentActor: ParentType) {
    parentActor.removeChild(this);
    this.parentActors = this.parentActors.filter((el) => el !== parentActor);
    if (this.parentActors.length > 0) {
      return;
    }
    this.delete();
  }

  private removeChild(childActor: ChildType) {
    this.childActors = this.childActors.filter((el) => el !== childActor);
  }
}
