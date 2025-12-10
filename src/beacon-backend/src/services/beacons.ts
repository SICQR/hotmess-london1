import type { Beacon } from "../types/beacon";
import { getBeaconByCode as getMockBeaconByCode } from "../mockData";

export async function getBeaconByCode(code: string): Promise<Beacon | null> {
  const beacon = getMockBeaconByCode(code);
  return beacon || null;
}
