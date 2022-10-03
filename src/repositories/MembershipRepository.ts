import { injectable } from "inversify";
import { DBHelper } from "../helpers/DBHelper"
import { Condition } from "../models";

@injectable()
export class MembershipRepository {

  public loadIdsMatchingCondition(condition: Condition) {
    let sql = "select id from people where churchId=? AND ";
    const params = [condition.churchId];
    sql += condition.field + " " + condition.operator + " ?";

    return DBHelper.query("membership", sql, []);
  }


}
