import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() { }

  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  get(key: string): any | undefined {
    try {
      const item = localStorage.getItem(key);
      if (!item) { return undefined; }
      return JSON.parse(item);
    } catch (error) {
      return undefined;
    }
  }

  isAllowed(): boolean {
    const test = 'test';
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
}
