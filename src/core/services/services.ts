export interface IService {
  name: string;
}

export abstract class BaseService implements IService {
  constructor(public name: string) {}
}
