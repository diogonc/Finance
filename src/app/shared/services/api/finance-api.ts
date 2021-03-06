import { User } from '../../models/user';
import { UserRepository } from '../../services/repository/user-repository';
import { Transaction } from '../../models/transaction';
import { Category } from '../../models/category';
import { Account } from '../../models/account';
import { Group } from '../../models/group';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class FinanceApi {
    // private DEFAULT_URL = 'http://localhost:49590/api/';
    private DEFAULT_URL = 'http://corefinance.azurewebsites.net/api/';
    private http: HttpClient;
    private userRepository: UserRepository;

    constructor(http: HttpClient, userRepository: UserRepository) {
        this.http = http;
        this.userRepository = userRepository;
    }

    getOwners(success: (data: any) => any): void {
        this.get('owner', success, null);
    }

    getAccounts(success: (data: any) => any): void {
        this.get('account', success, null);
    }

    saveAccount(account: Account, success: (data: any) => any,
        error: (data: any) => any): void {
        this.post('account', account, success, error);
    }

    updateAccount(account: Account, success: (data: any) => any,
        error: (data: any) => any): void {
        this.put('account', account, success, error);
    }

    deleteAccount(accountUuid: string, success: (data: any) => any,
        error: (data: any) => any): void {
        this.delete('account', accountUuid, success, error);
    }

    getTransactions(success: (data: any) => any, error: (data: any) => any): void {
        this.get('transaction', success, error);
    }

    saveTransaction(transaction: Transaction, success: (data: any) => any,
        error: (data: any) => any): void {
        this.post('transaction', transaction, success, error);
    }

    updateTransaction(transaction: Transaction, success: (data: any) => any,
        error: (data: any) => any): void {
        this.put('transaction', transaction, success, error);
    }

    deleteTransaction(transactionUuid: string, success: (data: any) => any,
        error: (data: any) => any): void {
        this.delete('transaction', transactionUuid, success, error);
    }

    getCategories(success: (data: any) => any): void {
        this.get('category', success, null);
    }

    saveCategory(category: Category, success: (data: any) => any,
        error: (data: any) => any): void {
        this.post('category', category, success, error);
    }

    updateCategory(category: Category, success: (data: any) => any,
        error: (data: any) => any): void {
        this.put('category', category, success, error);
    }

    deleteCategory(categoryUuid: string, success: (data: any) => any,
        error: (data: any) => any): void {
        this.delete('category', categoryUuid, success, error);
    }

    getGroups(success: (data: any) => any): void {
        this.get('group', success, null);
    }

    saveGroup(group: Group, success: (data: any) => any,
        error: (data: any) => any): void {
        this.post('group', group, success, error);
    }

    updateGroup(group: Group, success: (data: any) => any,
        error: (data: any) => any): void {
        this.put('group', group, success, error);
    }

    deleteGroup(groupUuid: string, success: (data: any) => any,
        error: (data: any) => any): void {
        this.delete('group', groupUuid, success, error);
    }

    private createHeader(): HttpHeaders {
        const user = this.userRepository.getUser();

        return new HttpHeaders().set('username', user.login)
            .set('token', user.password)
            .set('propertyUuid', user.property)
            .set('Content-type', 'application/json');
    }

    private get(action: string, success: (data: any) => any, error: (data: any) => any): boolean {
        this.http
            .get(
            this.DEFAULT_URL + action,
            { headers: this.createHeader() })
            .subscribe(response => this.onSuccess(response, success), err => this.onError(err, error));
        return false;
    }

    private post(action: string, data: any, success: (response: any) => any,
        error: (data: any) => any): void {
        this.http
            .post(
            this.DEFAULT_URL + action, JSON.stringify(data),
            { headers: this.createHeader() })
            .subscribe(response => this.onSuccess(response, success), err => this.onError(err, error));
    }

    private put(action: string, data: any, success: (response: any) => any,
        error: (data: any) => any): void {
        success(1);
        this.http
            .put(
            this.DEFAULT_URL + action + '/' + data.uuid,
            JSON.stringify(data),
            {
                headers: this.createHeader(),
                responseType: 'text'
            })
            .subscribe(response => this.onSuccess(response, success), err => this.onError(err, error));
    }

    delete(action: string, uuid: string, success: (response: any) => any,
        error: (data: any) => any): void {
        success(1);
        this.http
            .delete(
            this.DEFAULT_URL + action + '/' + uuid,
            {
                headers: this.createHeader(),
                responseType: 'text'
            })
            .subscribe(response => this.onSuccess(response, success));
    }

    private onSuccess(response: any, success: (data: any) => any): void {
        success(response);
    }

    private onError(err: any, error: (data: any) => any) {
        if (error !== null) {
            error(err.message);
        }
        console.log('erro ao enviar a requisição: ' + err.message);
    }
}
