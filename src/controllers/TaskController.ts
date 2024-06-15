import { controller, httpPost, httpGet, interfaces, requestParam } from "inversify-express-utils";
import express from "express";
import { FileStorageHelper } from "@churchapps/apihelper";
import { DoingBaseController } from "./DoingBaseController"
import { Task } from "../models"
import { Environment } from "../helpers";

@controller("/tasks")
export class TaskController extends DoingBaseController {

  @httpGet("/timeline")
  public async getTimeline(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      const taskIds = req.query.taskIds ? req.query.taskIds.toString().split(",") : [];
      return await this.repositories.task.loadTimeline(au.churchId, au.personId, taskIds);
    });
  }

  @httpGet("/closed")
  public async getForPersonClosed(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.task.loadForPerson(au.churchId, au.personId, "Closed");
    });
  }

  @httpGet("/:id")
  public async get(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.task.load(au.churchId, id);
    });
  }

  @httpGet("/")
  public async getForPerson(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.task.loadForPerson(au.churchId, au.personId, "Open");
    });
  }

  @httpPost("/loadForGroups")
  public async loadForGroups(req: express.Request<{}, {}, { groupIds: string[], status: string }>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.task.loadForGroups(au.churchId, req.body.groupIds, req.body.status);
    });
  }

  @httpPost("/")
  public async save(req: express.Request<{}, {}, Task[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      const result: Task[] = []
      for (const task of req.body) {
        task.churchId = au.churchId;
        if (req.query?.type === "directoryUpdate") await this.handleDirectoryUpdate(au.churchId, task);
        result.push(await this.repositories.task.save(task));
      }
      return result;
    });
  }

  /*
  @httpDelete("/:id")
  public async delete(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      await this.repositories.task.delete(au.churchId, id);
    });
  }
  */

  private async savePhoto(churchId: string, base64Str: string, task: Task) {
    const base64 = base64Str.split(",")[1];
    const key = "/" + churchId + "/membership/people/" + task.associatedWithId + ".png";
    await FileStorageHelper.store(key, "image/png", Buffer.from(base64, "base64"));
    const photoUpdated = new Date();
    const photo: string = Environment.contentRoot + key + "?dt=" + photoUpdated.getTime().toString();
    return photo;
  }

  private async handleDirectoryUpdate (churchId: string, task: Task) {
    if (task.status === "Open") {
      const data = JSON.parse(task.data);
      for (const d of data) {
        if (d.field === "photo" && d.value !== undefined) {
          d.value = await this.savePhoto(churchId, d.value, task);
        }
      }
      task.data = JSON.stringify(data);
      task.taskType = "directoryUpdate";
    }
  }

}