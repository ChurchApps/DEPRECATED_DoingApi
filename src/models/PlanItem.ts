export class PlanItem {
  public id?: string;
  public churchId?: string;
  public planId?: string;
  public parentId?: string;
  public sort?: number;
  public itemType?: string;
  public relatedId?: string;
  public label?: string;
  public description?: string;
  public seconds?: number;

  public children?: PlanItem[];
}