import { Injectable } from '@angular/core';
import { Transaction } from '../../shared/models/transaction';
import { CategoryType } from '../../shared/models/categoryType';
import { MyArray } from '../../shared/util/my-array';
import { MyDate } from '../../shared/util/my-date';
import { BalancePerCategoryRow } from './balance-per-category-row';

@Injectable()
export class BalancePerCategoryReport {
    public credits: Array<BalancePerCategoryRow>;
    public debits: Array<BalancePerCategoryRow>;
    public totalCredits: BalancePerCategoryRow;
    public totalDebits: BalancePerCategoryRow;
    public totalBalance: BalancePerCategoryRow;

    constructor() {
        this.credits = [];
        this.debits = [];
        this.totalCredits = new BalancePerCategoryRow('0', 'Créditos');
        this.totalDebits = new BalancePerCategoryRow('1', 'Débitos');
        this.totalBalance = new BalancePerCategoryRow('2', 'Saldo');
    }

    public addTransaction(transaction: Transaction): void {
        let categoryRow: BalancePerCategoryRow;
        const date = MyDate.firstDayOfMonth(transaction.date);
        const value = transaction.value;
        if (transaction.category.categoryType === CategoryType.Credit) {
            categoryRow = this.getCreditCategoriesRows(transaction.category.uuid, transaction.category.name);

            categoryRow.add(value, date);
            this.totalCredits.add(value, date);
            this.totalBalance.add(value, date);
        } else if (transaction.category.categoryType === CategoryType.Debit) {
            categoryRow = this.getDebitCategoriesRows(transaction.category.uuid, transaction.category.name);

            categoryRow.add(value, date);
            this.totalDebits.add(value, date);
            this.totalBalance.add((value * -1), date);
        }
    }

    public fillEmptyCells() {
        this.fillEmptyCellsFromRows(this.credits);
        this.fillEmptyCellsFromRows(this.debits);
        this.fillEmptyCellsInARow(this.totalCredits);
        this.fillEmptyCellsInARow(this.totalDebits);
    }

    public sortCells() {
        this.totalCredits.sortCells();
        this.totalDebits.sortCells();
        this.credits.forEach(row => {
            row.sortCells();
        });
        this.debits.forEach(row => {
            row.sortCells();
        });
    }

    public sortRows() {
        this.debits = this.debits.sort(this.sortRow);
        this.credits = this.credits.sort(this.sortRow);
    }

    private sortRow(row, anotherRow) {
        return anotherRow.total - row.total;
    }

    private fillEmptyCellsFromRows(list: Array<BalancePerCategoryRow>) {
        const length = list.length;
        for (let i = 0; i < length; i++) {
            const row = list[i];
            this.fillEmptyCellsInARow(row);
        }
    }

    private fillEmptyCellsInARow(row: BalancePerCategoryRow) {
        const totalMonths = this.totalBalance.balances.length;
        for (let i = 0; i < totalMonths; i++) {
            const month = this.totalBalance.balances[i].date;
            row.add(0, month);
        }
    }

    private getCreditCategoriesRows(uuid: string, categoryName: string): BalancePerCategoryRow {
        return this.getCategoryRow(uuid, categoryName, this.credits);
    }

    private getDebitCategoriesRows(uuid: string, categoryName: string): BalancePerCategoryRow {
        return this.getCategoryRow(uuid, categoryName, this.debits);
    }

    private getCategoryRow(uuid: string, categoryName: string, array: Array<BalancePerCategoryRow>): BalancePerCategoryRow {
        const categoryIndex = MyArray.findIndex(uuid, array);
        if (categoryIndex === -1) {
            const row = new BalancePerCategoryRow(uuid, categoryName);
            array.push(row);
            return row;
        }
        return array[categoryIndex];
    }
}
