import { injectable } from "inversify";
import { UniqueIdHelper } from "../apiBase"
import { DB } from "../apiBase/db"
import { Trigger } from "../models";

@injectable()
export class TriggerRepository {

  public save(trigger: Trigger) {
    return trigger.id ? this.update(trigger) : this.create(trigger);
  }

  private async create(trigger: Trigger) {
    trigger.id = UniqueIdHelper.shortId();

    const sql = "INSERT INTO triggers (id, churchId, automationId, field, fieldData, operator, value) VALUES (?, ?, ?, ?, ?, ?, ?);";
    const params = [trigger.id, trigger.churchId, trigger.automationId, trigger.field, trigger.fieldData, trigger.operator, trigger.value];
    await DB.query(sql, params);
    return trigger;
  }

  private async update(trigger: Trigger) {
    const sql = "UPDATE triggers SET automationId=?, field=?, fieldData=?, operator=?, value=? WHERE id=? and churchId=?";
    const params = [trigger.automationId, trigger.field, trigger.fieldData, trigger.operator, trigger.value, trigger.id, trigger.churchId];
    await DB.query(sql, params);
    return trigger;
  }

  public delete(churchId: string, id: string) {
    return DB.query("DELETE FROM triggers WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public load(churchId: string, id: string) {
    return DB.queryOne("SELECT * FROM triggers WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public loadForAutomation(churchId: string, automationId: string) {
    return DB.query("SELECT * FROM triggers WHERE automationId=? AND churchId=?;", [automationId, churchId]);
  }

}
