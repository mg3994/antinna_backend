import { PropertyScope } from '../enums/property_scope';
import { ScriptProperties } from './script_properties';
import { UserProperties } from './user_properties';
import { DocumentProperties } from './document_properties';

export class PropertyManager {
  private scriptProps = new ScriptProperties();
  private userProps = new UserProperties();
  private docProps = new DocumentProperties();

  public getProperties(scope: PropertyScope = PropertyScope.SCRIPT) {
    switch (scope) {
      case PropertyScope.DOCUMENT:
        return this.docProps;
      case PropertyScope.USER:
        return this.userProps;
      case PropertyScope.SCRIPT:
      default:
        return this.scriptProps;
    }
  }
}
