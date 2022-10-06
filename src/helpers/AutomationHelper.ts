import { Repositories } from "../repositories";
import { Automation, Task } from "../models";
import { ConjunctionHelper } from "./ConjunctionHelper";


export class AutomationHelper {

  public static async check(automation: Automation) {
    const triggeredPeopleIds = await ConjunctionHelper.getPeopleIds(automation);
    // if * load all peopele

    if (triggeredPeopleIds.length > 0) {
      const existingTasks: Task[] = await Repositories.getCurrent().task.loadByAutomationIdContent(automation.churchId, automation.id, "person", triggeredPeopleIds);
      for (const t of existingTasks) {
        const idx = triggeredPeopleIds.indexOf(t.associatedWithId);
        if (idx > -1) triggeredPeopleIds.splice(idx, 1);
      }
    }

    if (triggeredPeopleIds.length > 0) {
      const promises: Promise<Task>[] = [];
      triggeredPeopleIds.forEach(id => {
        const task: Task = {
          churchId: automation.churchId,
          dateCreated: new Date(),
          associatedWithType: "person",
          associatedWithId: id,
          associatedWithLabel: "TODO",
          createdByType: "system",
          createdByLabel: "System",
          assignedToLabel: "TODO",
          status: "Open",
          automationId: automation.id
        };
        promises.push(Repositories.getCurrent().task.save(task));
      });
      await Promise.all(promises);
    }


  }


}