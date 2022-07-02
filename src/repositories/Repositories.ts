import {
  TaskRepository
} from ".";

export class Repositories {
  public task: TaskRepository;

  private static _current: Repositories = null;
  public static getCurrent = () => {
    if (Repositories._current === null) Repositories._current = new Repositories();
    return Repositories._current;
  }

  constructor() {
    this.task = new TaskRepository();
  }
}