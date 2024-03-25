import { injectable } from "inversify";
import { UniqueIdHelper } from "@churchapps/apihelper"
import { DB } from "@churchapps/apihelper"
import { Position } from "../models";

@injectable()
export class PositionRepository {

  public save(position: Position) {
    return position.id ? this.update(position) : this.create(position);
  }

  private async create(position: Position) {
    position.id = UniqueIdHelper.shortId();
    const sql = "INSERT INTO positions (id, churchId, planId, categoryName, name) VALUES (?, ?, ?, ?, ?);";
    const params = [position.id, position.churchId, position.planId, position.categoryName, position.name];
    await DB.query(sql, params);
    return position;
  }

  private async update(position: Position) {
    const sql = "UPDATE positions SET planId=?, categoryName=?, name=? WHERE id=? and churchId=?";
    const params = [position.planId, position.categoryName, position.name, position.id, position.churchId];
    await DB.query(sql, params);
    return position;
  }

  public delete(churchId: string, id: string) {
    return DB.query("DELETE FROM positions WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public load(churchId: string, id: string) {
    return DB.queryOne("SELECT * FROM positions WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public loadByPlanId(churchId: string, planId: string) {
    return DB.query("SELECT * FROM positions WHERE churchId=? AND planId=?;", [churchId, planId]);
  }

}
