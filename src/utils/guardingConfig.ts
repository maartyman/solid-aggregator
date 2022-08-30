
export class GuardingConfig {
  //TODO use enum instead of string, implement the possibility of polling and sub/pub
  public readonly guardingType: string;
  public readonly args: any[];
  public static default = new GuardingConfig("none", []);

  constructor(guardingType: string, args: any[]) {
    this.guardingType = guardingType;
    this.args = args;
  }
}
