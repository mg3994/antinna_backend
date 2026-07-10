import { Person } from "@antinna/schema-ld-types";

const sheet = SpreadsheetApp.getActiveSpreadsheet();
ScriptApp.newTrigger("sync_calendar_events").timeBased().everyHours(1).create();
const person = {
	name: "John Doe",
};

const validatedPerson = Person.deserialize(person.toString());
ScriptApp.newTrigger(validatedPerson.name!.toString()).timeBased().everyHours(1).create();
