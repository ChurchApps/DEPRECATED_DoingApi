import { Repositories } from "../repositories";
import { Condition } from "../models";


export class ConditionHelper {


  public static async getPeopleIdsMatchingConditions(conditions: Condition[]) {
    const promises: Promise<Condition>[] = [];
    conditions.forEach(c => promises.push(ConditionHelper.getPeopleIdsMatchingCondition(c)))
    const result = await Promise.all(promises);
  }


  private static async getPeopleIdsMatchingCondition(condition: Condition) {
    condition.matchingIds = [];

    switch (condition.field) {
      case "membershipStatus":
        condition.matchingIds = await Repositories.getCurrent().membership.loadIdsMatchingCondition(condition);
        break;
      case "dayOfMonth":
        condition.matchingIds = (this.evalSimpleCondition(condition)) ? ["*"] : [];
        break;
    }
    return condition;

  }

  private static evalSimpleCondition(condition: Condition) {
    let result = false;
    switch (condition.field) {
      case "dayOfMonth":
        const dom = new Date().getDate();
        result = ConditionHelper.evalNum(dom, condition.operator, parseInt(condition.value));
        break;
    }
    return result;
  }


  private static evalNum(val: number, operator: string, testVal: number) {
    let result = false;
    switch (operator) {
      case "<": result = val < testVal; break;
      case "<=": result = val <= testVal; break;
      case "=": result = val === testVal; break;
      case "!=": result = val !== testVal; break;
      case ">=": result = val >= testVal; break;
      case ">": result = val > testVal; break;
    }
    return result;
  }

}