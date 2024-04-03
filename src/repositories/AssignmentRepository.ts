import { injectable } from "inversify";
import { UniqueIdHelper } from "@churchapps/apihelper"
import { DB } from "@churchapps/apihelper"
import { Assignment } from "../models";

@injectable()
export class AssignmentRepository {

  public save(assignment: Assignment) {
    return assignment.id ? this.update(assignment) : this.create(assignment);
  }

  private async create(assignment: Assignment) {
    assignment.id = UniqueIdHelper.shortId();

    const sql = "INSERT INTO assignments (id, churchId, positionId, personId, status) VALUES (?, ?, ?, ?, ?);";
    const params = [assignment.id, assignment.churchId, assignment.positionId, assignment.personId, assignment.status];
    await DB.query(sql, params);
    return assignment;
  }

  private async update(assignment: Assignment) {
    const sql = "UPDATE assignments SET positionId=?, personId=?, status=? WHERE id=? and churchId=?";
    const params = [assignment.positionId, assignment.personId, assignment.status, assignment.id, assignment.churchId];
    await DB.query(sql, params);
    return assignment;
  }

  public delete(churchId: string, id: string) {
    return DB.query("DELETE FROM assignments WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public deleteByPlanId(churchId: string, planId: string) {
    return DB.query("DELETE FROM assignments WHERE churchId=? and positionId IN (SELECT id from positions WHERE planId=?);", [churchId, planId]);
  }

  public load(churchId: string, id: string) {
    return DB.queryOne("SELECT * FROM assignments WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public loadByPlanId(churchId: string, planId: string) {
    return DB.query("SELECT a.* FROM assignments a INNER JOIN positions p on p.id=a.positionId WHERE a.churchId=? AND p.planId=?;", [churchId, planId]);
  }

  public loadByByPersonId(churchId: string, personId: string) {
    console.log("SELECT * FROM assignments WHERE churchId=? AND personId=?;", [churchId, personId]);
    return DB.query("SELECT * FROM assignments WHERE churchId=? AND personId=?;", [churchId, personId]);
  }

}
