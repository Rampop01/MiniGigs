declare module 'minigigs-sdk' {
    export const MINIGIGS_ADDRESS: string;
    export const CUSD_ADDRESS: string;
    export const MINIGIGS_ABI: any[];
    export const ERC20_ABI: any[];
    export function getMiniGigsContract(signerOrProvider: any): any;
    export function getCUSDContract(signerOrProvider: any): any;
}
