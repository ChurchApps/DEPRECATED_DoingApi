export class Task {
  public id?: string;
  public churchId?: string;
  public taskType?: string;
  public dateCreated?: Date;
  public dateClosed?: Date;
  public associatedWithType?: string;
  public associatedWithId?: string;
  public createdByType?: string;
  public createdById?: string;
  public assignedToType?: string;
  public assignedToId?: string;
  public title?: string;
  public status?: string;
}