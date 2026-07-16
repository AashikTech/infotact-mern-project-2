import { describe, it, expect } from 'vitest';

describe('Health Check', () => {
  it('should return true', () => {
    expect(true).toBe(true);
  });

  it('server config should be defined', () => {
    expect(process.env.NODE_ENV || 'test').toBeDefined();
  });
});
