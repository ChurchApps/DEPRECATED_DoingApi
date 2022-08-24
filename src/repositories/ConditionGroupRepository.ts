import { injectable } from "inversify";
import { UniqueIdHelper } from "../apiBase"
import { DB } from "../apiBase/db"
import { ConditionGroup } from "../models";

@injectable()
export class ConditionGroupRepository {

  public save(conditionGroup: ConditionGroup) {
    return conditionGroup.id ? this.update(conditionGroup) : this.create(conditionGroup);
  }

  private async create(conditionGroup: ConditionGroup) {
    conditionGroup.id = UniqueIdHelper.shortId();

    const sql = "INSERT INTO conditionGroups (id, churchId, automationId, parentGroupId, groupType) VALUES (?, ?, ?, ?, ?);";
    const params = [conditionGroup.id, conditionGroup.churchId, conditionGroup.automationId, conditionGroup.parentGroupId, conditionGroup.groupType];
    await DB.query(sql, params);
    return conditionGroup;
  }

  private async update(conditionGroup: ConditionGroup) {
    const sql = "UPDATE conditionGroups SET automationId=?, parentGroupId=?, groupType=?, operator=?, value=? WHERE id=? and churchId=?";
    const params = [conditionGroup.automationId, conditionGroup.parentGroupId, conditionGroup.groupType, conditionGroup.id, conditionGroup.churchId];
    await DB.query(sql, params);
    return conditionGroup;
  }

  public delete(churchId: string, id: string) {
    return DB.query("DELETE FROM conditionGroups WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public load(churchId: string, id: string) {
    return DB.queryOne("SELECT * FROM conditionGroups WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public loadForAutomation(churchId: string, automationId: string) {
    return DB.query("SELECT * FROM conditionGroups WHERE conditionGroupGroupId IN (SELECT id FROM conditionGroupGroups WHERE automationId=?) AND churchId=?;", [automationId, churchId]);
  }

}
