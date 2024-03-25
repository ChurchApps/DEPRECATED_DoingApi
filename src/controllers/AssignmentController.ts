import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { DoingBaseController } from "./DoingBaseController"
import { Assignment } from "../models"

@controller("/assignments")
export class AssignmentController extends DoingBaseController {

  @httpGet("/:id")
  public async get(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.assignment.load(au.churchId, id);
    });
  }

  @httpPost("/")
  public async save(req: express.Request<{}, {}, Assignment[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      const promises: Promise<Assignment>[] = [];
      req.body.forEach(assignment => {
        assignment.churchId = au.churchId;
        promises.push(this.repositories.assignment.save(assignment));
      });
      const result = await Promise.all(promises);
      return result;
    });
  }

  @httpDelete("/:id")
  public async delete(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      await this.repositories.assignment.delete(au.churchId, id);
    });
  }

}
