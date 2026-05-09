declare module 'minigigs-sdk' {
  export const MINIGIGS_ADDRESS: string;
  export const CUSD_ADDRESS: string;
  export const MINIGIGS_ABI: readonly unknown[];
  export const ERC20_ABI: readonly unknown[];
  export function getMiniGigsContract(signerOrProvider: unknown): unknown;
  export function getCUSDContract(signerOrProvider: unknown): unknown;
}
