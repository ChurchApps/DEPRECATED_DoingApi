import { injectable } from "inversify";
import { DBHelper } from "../helpers/DBHelper"
import { Condition } from "../models";

@injectable()
export class MembershipRepository {

  private async getDBField(condition: Condition) {
    const fieldData = (condition.fieldData) ? JSON.parse(condition.fieldData) : {}
    let result = condition.field;
    switch (fieldData.datePart) {
      case "dayOfWeek":
        result = "dayOfWeek(" + condition.field + ")";
        break;
      case "dayOfMonth":
        result = "dayOfMonth(" + condition.field + ")";
        break;
      case "month":
        result = "month(" + condition.field + ")";
        break;
      case "years":
        result = "TIMESTAMPDIFF(YEAR, " + condition.field + ", CURDATE())";
        break;
    }

    return result;
  }

  public async loadIdsMatchingCondition(condition: Condition) {
    let sql = "select id from people where churchId = ? AND removed = 0 AND ";
    const params = [condition.churchId];
    sql += this.getDBField(condition) + " " + condition.operator + " ?";
    params.push(condition.value)

    const result: string[] = []
    const rows = await DBHelper.query("membership", sql, params);
    rows.forEach((r: any) => result.push(r.id));
    return result;
  }

  public async loadPeople(churchId: string, personIds: string[]) {
    const sql = "select id, displayName from people where churchId = ? AND removed = 0 AND id in (?)";
    const params = [churchId, personIds];
    return DBHelper.query("membership", sql, params);
  }


}
