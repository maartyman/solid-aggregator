import {Aggregator} from "../aggregator/aggregator";


export class CustomMap extends Map {

  public set(key: String, value: Aggregator): this {
    if(super.has(key)){
      throw new TypeError("Key "+ key +" already exists!");
    }else{
      super.set(key,value);
    }
    return this;
  }
}
