import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService<T> {

  constructor() { }

  savePageState(componentName:string ,page :T): void {
    const serializedData = JSON.stringify(page);
    sessionStorage.setItem(componentName, serializedData);

  }
  getPageState(componentName: string): T | null {
    const data = sessionStorage.getItem(componentName);
    if (data) {
      return JSON.parse(data) as T;
    }
    return null;
  }

    // إزالة البيانات إذا احتجت
    clearPageState(): void {
      sessionStorage.clear();
    }
}
