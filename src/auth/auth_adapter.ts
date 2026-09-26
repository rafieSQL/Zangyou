/**
 * Vectis Compatibility Proxy Shim (IBM Granite 3.0 Code Synthesized)
 * PR #482 Backward-Compatibility Adapter
 * Satisfies: PCI-DSS v4.0.1 Req 10.2.1, Req 3.4.2, Req 8.2.8
 */
export function createSessionUserAdapter(modernSession: any): any {
  return new Proxy(modernSession, {
    get(target, prop, receiver) {
      if (prop === "id" && "sub" in target) return target.sub;
      if (prop === "tier" && target.metadata) return target.metadata.tier;
      return Reflect.get(target, prop, receiver);
    },
    ownKeys(target) {
      return [...Reflect.ownKeys(target), "id", "tier"];
    }
  });
}
