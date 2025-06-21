import { Repositories } from "../repositories";
import { Action, Automation, Task } from "../models";
import { ConjunctionHelper } from "./ConjunctionHelper";

export class AutomationHelper {
  public static async checkAll() {
    const automations: Automation[] = await Repositories.getCurrent().automation.loadAllChurches();
    if (automations.length > 0) {
      for (const a of automations) {
        try {
          await AutomationHelper.check(a);
        } catch (e) {
          console.error("Error checking automation:", e);
        }
      }
    }
  }

  public static async check(automation: Automation) {
    const triggeredPeopleIds = await ConjunctionHelper.getPeopleIds(automation);
    // if * load all peopele

    if (triggeredPeopleIds.length > 0) {
      const existingTasks: Task[] = await Repositories.getCurrent().task.loadByAutomationIdContent(
        automation.churchId,
        automation.id,
        automation.recurs,
        "person",
        triggeredPeopleIds
      );
      for (const t of existingTasks) {
        const idx = triggeredPeopleIds.indexOf(t.associatedWithId);
        if (idx > -1) triggeredPeopleIds.splice(idx, 1);
      }
    }

    if (triggeredPeopleIds.length > 0) {
      const actions: Action[] = await Repositories.getCurrent().action.loadForAutomation(
        automation.churchId,
        automation.id
      );
      const people: { id: string; displayName: string }[] = (await Repositories.getCurrent().membership.loadPeople(
        automation.churchId,
        triggeredPeopleIds
      )) as { id: string; displayName: string }[];
      for (const action of actions) {
        if (action.actionType === "task") {
          await this.createTasks(automation, people, JSON.parse(action.actionData || "{}"));
        }
      }
    }
  }

  public static async createTasks(
    automation: Automation,
    people: { id: string; displayName: string }[],
    details: { assignedToType?: string; assignedToId?: string; assignedToLabel?: string; title?: string }
  ) {
    const result: Task[] = [];
    for (const p of people) {
      const task: Task = {
        churchId: automation.churchId,
        dateCreated: new Date(),
        associatedWithType: "person",
        associatedWithId: p.id,
        associatedWithLabel: p.displayName,
        createdByType: "system",
        createdByLabel: "System",
        assignedToType: details.assignedToType,
        assignedToId: details.assignedToId,
        assignedToLabel: details.assignedToLabel,
        status: "Open",
        automationId: automation.id,
        title: details.title
      };

      result.push(await Repositories.getCurrent().task.save(task));
    }
    return result;
  }
}
