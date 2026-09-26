/**
 * Vectis Compatibility Proxy Shim (IBM Granite 3.0 Code Synthesized)
 * PR #482 Backward-Compatibility Adapter
 * Satisfies: PCI-DSS v4.0.1 Req 10.2.1, Req 3.4.2, Req 8.2.8
 */

export interface SessionUser {
  sub: string;
  email: string;
  metadata: {
    tier: "free" | "pro" | "enterprise";
    organizationId: string;
  };
  scopes: string[];
}

export interface User extends SessionUser {
  /** @deprecated PCI-DSS §8.2.8 bridge: maps to .sub */
  id: string;
  /** @deprecated PCI-DSS §8.2.8 bridge: maps to .metadata.tier */
  tier: "free" | "pro" | "enterprise";
  /** @deprecated PCI-DSS §8.2.8 bridge: maps to .scopes */
  roles: string[];
}

export function createBackwardCompatibilityProxy(session: SessionUser): User {
  return new Proxy(session as any, {
    get(target, prop, receiver) {
      if (prop === "id") return target.sub;
      if (prop === "tier") return target.metadata?.tier;
      if (prop === "roles") return target.scopes;
      if (prop === "toJSON") {
        return () => ({
          ...target,
          id: target.sub,
          tier: target.metadata?.tier,
          roles: target.scopes,
        });
      }
      return Reflect.get(target, prop, receiver);
    },
    has(target, prop) {
      if (prop === "id" || prop === "tier" || prop === "roles") return true;
      return Reflect.has(target, prop);
    },
    ownKeys(target) {
      return [...Reflect.ownKeys(target), "id", "tier", "roles"];
    },
    getOwnPropertyDescriptor(target, prop) {
      if (prop === "id") {
        return { value: target.sub, writable: false, enumerable: true, configurable: true };
      }
      if (prop === "tier") {
        return { value: target.metadata?.tier, writable: false, enumerable: true, configurable: true };
      }
      if (prop === "roles") {
        return { value: target.scopes, writable: false, enumerable: true, configurable: true };
      }
      return Reflect.getOwnPropertyDescriptor(target, prop);
    }
  });
}
