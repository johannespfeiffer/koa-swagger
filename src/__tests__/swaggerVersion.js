import * as check from '../checkers';

describe('swaggerVersion', () => {
  it('should accept swagger 2.0', () => {
    check.swaggerVersion({
      swagger: '2.0',
    });
  });

  it('should refuse everything else', () => {
    expect(() => check.swaggerVersion({ swagger: '0.2' })).toThrow();
    expect(() => check.swaggerVersion({ swagger: '1.0' })).toThrow();
    expect(() => check.swaggerVersion({ swagger: '3.0' })).toThrow();
    expect(() => check.swaggerVersion({ swagger: '2.1' })).toThrow();
  });
});
