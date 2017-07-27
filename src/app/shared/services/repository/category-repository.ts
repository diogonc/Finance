import { Repository } from './repository';
import { Category } from '../../models/category';
import { Type } from '../../models/type';

export class CategoryRepository extends Repository {
  constructor() { super('category'); }

  getAll(): Array<Category> {
    let data = this.makeACopy(this.getData());
    let accounts = [];

    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      accounts.push(new Category(item.uuid, item.name, item.categoryType, item.priority));
    }

    return this.orderByPriorityAndName(accounts);
  }

  getCreditTransfer(): Category {
    return this.getFiltered(Type.CreditTransfer);
  }

  getDebitTransfer(): Category {
    return this.getFiltered(Type.DebitTransfer);
  }

  private orderByPriority(data: Array<Category>): Array<Category> {
    return data.sort(function (item, anotherItem) {
      return anotherItem.priority - item.priority;
    });
  }

  private orderByPriorityAndName(data: Array<Category>): Array<Category> {
    return data.sort(function (item, anotherItem) {
      if (anotherItem.priority - item.priority !== 0) {
        return anotherItem.priority - item.priority;
      }

      if (item.name > anotherItem.name) {
        return 1;
      }

      if (item.name < anotherItem.name) {
        return -1;
      }

      return 0;
    });
  }

  private getFiltered(categoryType: number): Category {
    let categories = this.getAll();
    let lenght = categories.length;

    for (let i = 0; i < lenght; i++) {
      let c = categories[i];

      if (c.categoryType === categoryType) {
        return c;
      }
    }
  }
}
