import {
  ActionRepository,
  AutomationRepository,
  TaskRepository,
  ConditionRepository,
} from ".";

export class Repositories {
  public action: ActionRepository;
  public automation: AutomationRepository;
  public task: TaskRepository;
  public condition: ConditionRepository;

  private static _current: Repositories = null;
  public static getCurrent = () => {
    if (Repositories._current === null) Repositories._current = new Repositories();
    return Repositories._current;
  }

  constructor() {
    this.action = new ActionRepository();
    this.automation = new AutomationRepository();
    this.task = new TaskRepository();
    this.condition = new ConditionRepository();
  }
}