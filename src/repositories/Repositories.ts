import {
  ActionRepository,
  AutomationRepository,
  TaskRepository,
  TriggerRepository,
} from ".";

export class Repositories {
  public action: ActionRepository;
  public automation: AutomationRepository;
  public task: TaskRepository;
  public trigger: TriggerRepository;

  private static _current: Repositories = null;
  public static getCurrent = () => {
    if (Repositories._current === null) Repositories._current = new Repositories();
    return Repositories._current;
  }

  constructor() {
    this.action = new ActionRepository();
    this.automation = new AutomationRepository();
    this.task = new TaskRepository();
    this.trigger = new TriggerRepository();
  }
}