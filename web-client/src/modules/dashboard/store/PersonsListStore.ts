import { makeAutoObservable } from 'mobx';

import { IPerson } from '@/shared/types/person.types';

export class PersonsListStore {
    isLoading = true;
    list: IPerson[] = [];

    constructor() {
        makeAutoObservable(this);
    }
    
    setList ({
        persons
    }:{ persons: IPerson[] }) {
        this.isLoading = false;
        this.list = persons;
    }
}