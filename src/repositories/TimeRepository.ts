import { injectable } from "inversify";
import { UniqueIdHelper } from "@churchapps/apihelper"
import { DB } from "@churchapps/apihelper"
import { Time } from "../models";

@injectable()
export class TimeRepository {

  public save(time: Time) {
    return time.id ? this.update(time) : this.create(time);
  }

  private async create(time: Time) {
    time.id = UniqueIdHelper.shortId();
    const sql = "INSERT INTO times (id, churchId, planId, startTime, endTime) VALUES (?, ?, ?, ?, ?);";
    const params = [time.id, time.churchId, time.planId, time.startTime, time.endTime];
    await DB.query(sql, params);
    return time;
  }

  private async update(time: Time) {
    const sql = "UPDATE times SET planId=?, startTime=?, endTime=? WHERE id=? and churchId=?";
    const params = [time.planId, time.startTime, time.endTime, time.id, time.churchId];
    await DB.query(sql, params);
    return time;
  }

  public delete(churchId: string, id: string) {
    return DB.query("DELETE FROM times WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public load(churchId: string, id: string) {
    return DB.queryOne("SELECT * FROM times WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public loadByPlanId(churchId: string, planId: string) {
    return DB.query("SELECT * FROM times WHERE churchId=? AND planId=?;", [churchId, planId]);
  }

}
