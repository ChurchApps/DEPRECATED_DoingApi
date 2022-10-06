import { injectable } from "inversify";
import { DBHelper } from "../helpers/DBHelper"
import { Condition } from "../models";

@injectable()
export class MembershipRepository {

  public async loadIdsMatchingCondition(condition: Condition) {
    let sql = "select id from people where churchId = ? AND removed = 0 AND ";
    const params = [condition.churchId];
    sql += condition.field + " " + condition.operator + " ?";
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
