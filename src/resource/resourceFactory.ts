import {Resource} from "./resource";

export class ResourceFactory extends Factory<string, Resource> {
  constructor() {
    super(Resource);
  }
}
