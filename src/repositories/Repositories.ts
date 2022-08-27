import {
  ActionRepository,
  AutomationRepository,
  ConditionRepository,
  ConjunctionRepository,
  TaskRepository
} from ".";

export class Repositories {
  public action: ActionRepository;
  public automation: AutomationRepository;
  public condition: ConditionRepository;
  public conjunction: ConjunctionRepository;
  public task: TaskRepository;

  private static _current: Repositories = null;
  public static getCurrent = () => {
    if (Repositories._current === null) Repositories._current = new Repositories();
    return Repositories._current;
  }

  constructor() {
    this.action = new ActionRepository();
    this.automation = new AutomationRepository();
    this.condition = new ConditionRepository();
    this.conjunction = new ConjunctionRepository();
    this.task = new TaskRepository();
  }
}
