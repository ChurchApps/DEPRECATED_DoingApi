import {
  ActionRepository,
  AutomationRepository,
  ConditionRepository,
  ConjunctionRepository,
  TaskRepository,
  MembershipRepository
} from ".";

export class Repositories {
  public action: ActionRepository;
  public automation: AutomationRepository;
  public condition: ConditionRepository;
  public conjunction: ConjunctionRepository;
  public task: TaskRepository;

  public membershipRepository: MembershipRepository;

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

    this.membershipRepository = new MembershipRepository();
  }
}
