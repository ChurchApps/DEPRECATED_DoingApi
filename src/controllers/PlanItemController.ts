import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { DoingBaseController } from "./DoingBaseController"
import { PlanItem, Position, Time } from "../models"


@controller("/planItems")
export class PlanItemController extends DoingBaseController {

  @httpGet("/ids")
  public async getByIds(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      const idsString = req.query.ids as string;
      const ids = idsString.split(",");
      return await this.repositories.planItem.loadByIds(au.churchId, ids);
    });
  }

  @httpGet("/:id")
  public async get(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.planItem.load(au.churchId, id);
    });
  }

  @httpGet("/plan/:planId")
  public async getByPlan(@requestParam("planId") planId: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.planItem.loadForPlan(au.churchId, planId);
    });
  }

  @httpPost("/")
  public async save(req: express.Request<{}, {}, PlanItem[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      const promises: Promise<PlanItem>[] = [];
      req.body.forEach(planItem => {
        planItem.churchId = au.churchId;
        promises.push(this.repositories.planItem.save(planItem));
      });
      const result = await Promise.all(promises);
      return result;
    });
  }

  @httpDelete("/:id")
  public async delete(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      await this.repositories.planItem.delete(au.churchId, id);
      return this.json({});
    });
  }

}
