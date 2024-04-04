import {
  ActionRepository,
  AutomationRepository,
  BlockoutDateRepository,
  ConditionRepository,
  ConjunctionRepository,
  TaskRepository,
  MembershipRepository,
  AssignmentRepository,
  PlanRepository,
  PositionRepository,
  TimeRepository
} from ".";

export class Repositories {
  public action: ActionRepository;
  public assignment: AssignmentRepository;
  public automation: AutomationRepository;
  public blockoutDate: BlockoutDateRepository;
  public condition: ConditionRepository;
  public conjunction: ConjunctionRepository;
  public plan: PlanRepository;
  public position: PositionRepository;
  public task: TaskRepository;
  public time: TimeRepository;

  public membership: MembershipRepository;

  private static _current: Repositories = null;
  public static getCurrent = () => {
    if (Repositories._current === null) Repositories._current = new Repositories();
    return Repositories._current;
  }

  constructor() {
    this.action = new ActionRepository();
    this.assignment = new AssignmentRepository();
    this.automation = new AutomationRepository();
    this.blockoutDate = new BlockoutDateRepository();
    this.condition = new ConditionRepository();
    this.conjunction = new ConjunctionRepository();
    this.plan = new PlanRepository();
    this.position = new PositionRepository();
    this.task = new TaskRepository();
    this.time = new TimeRepository();

    this.membership = new MembershipRepository();
  }
}
