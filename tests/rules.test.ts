import { getRulesForLevel } from '../src/rules';

describe('getRulesForLevel', () => {
  it('level 1 has fewest rules', () => {
    const l1 = getRulesForLevel(1);
    const l2 = getRulesForLevel(2);
    const l3 = getRulesForLevel(3);
    expect(l1.length).toBeLessThan(l2.length);
    expect(l2.length).toBeLessThan(l3.length);
  });

  it('level 2 includes all level 1 rules', () => {
    const l1 = getRulesForLevel(1);
    const l2 = getRulesForLevel(2);
    for (const rule of l1) {
      expect(l2).toContain(rule);
    }
  });

  it('level 3 includes all level 2 rules', () => {
    const l2 = getRulesForLevel(2);
    const l3 = getRulesForLevel(3);
    for (const rule of l2) {
      expect(l3).toContain(rule);
    }
  });

  it('all rules have three elements', () => {
    for (const level of [1, 2, 3] as const) {
      for (const rule of getRulesForLevel(level)) {
        expect(rule).toHaveLength(3);
        expect(rule[0]).toBeInstanceOf(RegExp);
        expect(typeof rule[1]).toBe('string');
        expect(typeof rule[2]).toBe('string');
      }
    }
  });
});
