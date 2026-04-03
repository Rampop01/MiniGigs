import hre from "hardhat";

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying MiniGigs with the account:", deployer.address);

    // cUSD address on Celo Mainnet
    // On Alfajores testnet: 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
    const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

    const MiniGigs = await hre.ethers.getContractFactory("MiniGigs");
    const miniGigs = await MiniGigs.deploy(CUSD_ADDRESS);

    await miniGigs.waitForDeployment();

    console.log("MiniGigs deployed to:", await miniGigs.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
