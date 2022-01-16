import { TestBed } from '@angular/core/testing';

import { BasicInterceptor } from './basic.interceptor';

describe('BasicInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      BasicInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: BasicInterceptor = TestBed.inject(BasicInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
