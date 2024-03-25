import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { DoingBaseController } from "./DoingBaseController"
import { Position } from "../models"

@controller("/positions")
export class PositionController extends DoingBaseController {

  @httpGet("/:id")
  public async get(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.position.load(au.churchId, id);
    });
  }

  @httpGet("/plan/:planId")
  public async getForPlan(@requestParam("planId") planId: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.position.loadByPlanId(au.churchId, planId);
    });
  }

  @httpPost("/")
  public async save(req: express.Request<{}, {}, Position[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      const promises: Promise<Position>[] = [];
      req.body.forEach(position => {
        position.churchId = au.churchId;
        promises.push(this.repositories.position.save(position));
      });
      const result = await Promise.all(promises);
      return result;
    });
  }

  @httpDelete("/:id")
  public async delete(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      await this.repositories.position.delete(au.churchId, id);
    });
  }

}
