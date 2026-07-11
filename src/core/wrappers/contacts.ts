export interface IContactWrapper {
  getId(): string;
  getFullName(): string;
  getEmails(): string[];
}

export class ContactWrapper implements IContactWrapper {
  constructor(private contact: GoogleAppsScript.Contacts.Contact) {}

  public getId(): string {
    return this.contact.getId();
  }

  public getFullName(): string {
    return this.contact.getFullName();
  }

  public getEmails(): string[] {
    return this.contact.getEmailAddresses();
  }
}

export class AppsScriptContacts {
  public static createContact(givenName: string, familyName: string, email: string): IContactWrapper {
    return new ContactWrapper(ContactsApp.createContact(givenName, familyName, email));
  }

  public static getContact(emailAddress: string): IContactWrapper | null {
    const contact = ContactsApp.getContact(emailAddress);
    return contact ? new ContactWrapper(contact) : null;
  }
}
