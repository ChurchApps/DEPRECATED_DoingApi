import { injectable } from "inversify";
import { UniqueIdHelper } from "../apiBase"
import { DB } from "../apiBase/db"
import { Task } from "../models";

@injectable()
export class TaskRepository {

  public save(task: Task) {
    return task.id ? this.update(task) : this.create(task);
  }

  private async create(task: Task) {
    task.id = UniqueIdHelper.shortId();

    const taskNumber = this.loadNextTaskNumber(task.churchId);
    const sql = "INSERT INTO tasks (id, churchId, taskNumber, taskType, dateCreated, dateClosed, associatedWithType, associatedWithId, createdByType, createdById, assignedToType, assignedToId, title, status) VALUES (?, ?, ?, ?, now(), ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    const params = [task.id, task.churchId, taskNumber, task.taskType, task.dateClosed, task.associatedWithType, task.associatedWithId, task.createdByType, task.createdById, task.assignedToType, task.assignedToId, task.title, task.status];
    await DB.query(sql, params);
    return task;
  }

  private async update(task: Task) {
    const sql = "UPDATE tasks SET taskType=?, dateCreated=?, dateClosed=?, associatedWithType=?, associatedWithId=?, createdByType=?, createdById=?, assignedToType=?, assignedToId=?, title=?, status=? WHERE id=? and churchId=?";
    const params = [task.taskType, task.dateCreated, task.dateClosed, task.associatedWithType, task.associatedWithId, task.createdByType, task.createdById, task.assignedToType, task.assignedToId, task.title, task.status, task.id, task.churchId];
    await DB.query(sql, params);
    return task;
  }

  public delete(churchId: string, id: string) {
    return DB.query("DELETE FROM tasks WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public load(churchId: string, id: string) {
    return DB.queryOne("SELECT * FROM tasks WHERE id=? AND churchId=?;", [id, churchId]);
  }

  private async loadNextTaskNumber(churchId: string) {
    const result = await DB.queryOne("select max(ifnull(taskNumber, 0)) + 1 from tasks where churchId=?", [churchId]);
    return result[0];
  }

  public loadForPerson(churchId: string, personId: string, status: string) {
    return DB.query("SELECT * FROM tasks WHERE churchId=? AND ((assignedToType='person' AND assignedToId=?) OR (createdByType='person' AND createdById=?)) and status=?;", [churchId, personId, personId, status]);
  }

  public loadAll(churchId: string) {
    return DB.query("SELECT * FROM tasks WHERE churchId=?;", [churchId]);
  }


}