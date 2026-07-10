export interface IFormWrapper {
  getId(): string;
  getTitle(): string;
  addTextMessage(text: string): void;
}

export class FormWrapper implements IFormWrapper {
  constructor(private form: GoogleAppsScript.Forms.Form) {}

  public getId(): string {
    return this.form.getId();
  }

  public getTitle(): string {
    return this.form.getTitle();
  }

  public addTextMessage(text: string): void {
    // Basic form builder wrapper logic
    this.form.setDescription(text);
  }
}

export class AppsScriptFormApp {
  public static openById(id: string): IFormWrapper {
    return new FormWrapper(FormApp.openById(id));
  }

  public static create(title: string): IFormWrapper {
    return new FormWrapper(FormApp.create(title));
  }
}
