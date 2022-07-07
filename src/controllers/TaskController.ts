import { controller, httpPost, httpGet, interfaces, requestParam } from "inversify-express-utils";
import express from "express";
import { DoingBaseController } from "./DoingBaseController"
import { Task } from "../models"

@controller("/tasks")
export class TaskController extends DoingBaseController {

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

  @httpPost("/")
  public async save(req: express.Request<{}, {}, Task[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      const promises: Promise<Task>[] = [];
      req.body.forEach(task => {
        task.churchId = au.churchId;
        promises.push(this.repositories.task.save(task));
      });
      const result = await Promise.all(promises);
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

}