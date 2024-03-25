import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { DoingBaseController } from "./DoingBaseController"
import { Plan } from "../models"

@controller("/plans")
export class PlanController extends DoingBaseController {

  @httpGet("/:id")
  public async get(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.plan.load(au.churchId, id);
    });
  }

  @httpGet("/")
  public async getForAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.plan.loadAll(au.churchId);
    });
  }

  @httpPost("/")
  public async save(req: express.Request<{}, {}, Plan[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      const promises: Promise<Plan>[] = [];
      req.body.forEach(plan => {
        plan.churchId = au.churchId;
        promises.push(this.repositories.plan.save(plan));
      });
      const result = await Promise.all(promises);
      return result;
    });
  }

  @httpDelete("/:id")
  public async delete(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      await this.repositories.plan.delete(au.churchId, id);
    });
  }

}
