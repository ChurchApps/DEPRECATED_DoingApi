import { injectable } from "inversify";
import { DBHelper } from "../helpers/DBHelper"
import { Condition } from "../models";

@injectable()
export class MembershipRepository {

  public async loadIdsMatchingCondition(condition: Condition) {
    let sql = "select id from people where churchId = ? AND ";
    const params = [condition.churchId];
    sql += condition.field + " " + condition.operator + " ?";
    params.push(condition.value)

    const result: string[] = []
    const rows = await DBHelper.query("membership", sql, params);
    rows.forEach((r: any) => result.push(r.id));
    return result;
  }


}
