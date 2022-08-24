import { injectable } from "inversify";
import { UniqueIdHelper } from "../apiBase"
import { DB } from "../apiBase/db"
import { Condition } from "../models";

@injectable()
export class ConditionRepository {

  public save(condition: Condition) {
    return condition.id ? this.update(condition) : this.create(condition);
  }

  private async create(condition: Condition) {
    condition.id = UniqueIdHelper.shortId();

    const sql = "INSERT INTO conditions (id, churchId, conditionGroupId, field, fieldData, operator, value) VALUES (?, ?, ?, ?, ?, ?, ?);";
    const params = [condition.id, condition.churchId, condition.conditionGroupId, condition.field, condition.fieldData, condition.operator, condition.value];
    await DB.query(sql, params);
    return condition;
  }

  private async update(condition: Condition) {
    const sql = "UPDATE conditions SET conditionGroupId=?, field=?, fieldData=?, operator=?, value=? WHERE id=? and churchId=?";
    const params = [condition.conditionGroupId, condition.field, condition.fieldData, condition.operator, condition.value, condition.id, condition.churchId];
    await DB.query(sql, params);
    return condition;
  }

  public delete(churchId: string, id: string) {
    return DB.query("DELETE FROM conditions WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public load(churchId: string, id: string) {
    return DB.queryOne("SELECT * FROM conditions WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public loadForAutomation(churchId: string, automationId: string) {
    return DB.query("SELECT * FROM conditions WHERE conditionGroupId IN (SELECT id FROM conditionGroups WHERE automationId=?) AND churchId=?;", [automationId, churchId]);
  }

}
