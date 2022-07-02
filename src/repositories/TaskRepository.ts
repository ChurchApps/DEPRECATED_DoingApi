import { injectable } from "inversify";
import { UniqueIdHelper } from "../apiBase";
import { DB } from "../apiBase/db";
import { Task } from "../models";

@injectable()
export class TaskRepository {

  public save(task: Task) {
    return task.id ? this.update(task) : this.create(task);
  }

  private async create(task: Task) {
    task.id = UniqueIdHelper.shortId();
    const sql = "INSERT INTO tasks (id, churchId, taskType, dateCreated, dateClosed, associatedWithType, associatedWithId, createdByType, createdById, assignedToType, assignedToId, title, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    const params = [task.id, task.churchId, task.taskType, task.dateCreated, task.dateClosed, task.associatedWithType, task.associatedWithId, task.createdByType, task.createdById, task.assignedToType, task.assignedToId, task.title, task.details];
    await DB.query(sql, params);
    return task;
  }

  private async update(task: Task) {
    const sql = "UPDATE tasks SET taskType=?, dateCreated=?, dateClosed=?, associatedWithType=?, associatedWithId=?, createdByType=?, createdById=?, assignedToType=?, assignedToId=?, title=?, details=? WHERE id=? and churchId=?";
    const params = [task.taskType, task.dateCreated, task.dateClosed, task.associatedWithType, task.associatedWithId, task.createdByType, task.createdById, task.assignedToType, task.assignedToId, task.title, task.details, task.id, task.churchId];
    await DB.query(sql, params);
    return task;
  }

  public delete(churchId: string, id: string) {
    return DB.query("DELETE FROM tasks WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public load(churchId: string, id: string) {
    return DB.queryOne("SELECT * FROM tasks WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public loadAll(churchId: string) {
    return DB.query("SELECT * FROM tasks WHERE churchId=?;", [churchId]);
  }


}