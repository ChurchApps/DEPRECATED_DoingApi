import { injectable } from "inversify";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { DB } from "@churchapps/apihelper";
import { PlanType } from "../models";

@injectable()
export class PlanTypeRepository {
  public save(planType: PlanType) {
    return planType.id ? this.update(planType) : this.create(planType);
  }

  private async create(planType: PlanType) {
    planType.id = UniqueIdHelper.shortId();

    const sql =
      "INSERT INTO planTypes (id, churchId, ministryId, name) VALUES (?, ?, ?, ?);";
    const params = [
      planType.id,
      planType.churchId,
      planType.ministryId,
      planType.name
    ];
    await DB.query(sql, params);
    return planType;
  }

  private async update(planType: PlanType) {
    const sql =
      "UPDATE planTypes SET ministryId=?, name=? WHERE id=? and churchId=?";
    const params = [
      planType.ministryId,
      planType.name,
      planType.id,
      planType.churchId
    ];
    await DB.query(sql, params);
    return planType;
  }

  public delete(churchId: string, id: string) {
    return DB.query("DELETE FROM planTypes WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public load(churchId: string, id: string) {
    return DB.queryOne("SELECT * FROM planTypes WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public loadByIds(churchId: string, ids: string[]) {
    return DB.query("SELECT * FROM planTypes WHERE churchId=? and id in (?);", [churchId, ids]);
  }

  public loadAll(churchId: string) {
    return DB.query("SELECT * FROM planTypes WHERE churchId=?;", [churchId]);
  }
}