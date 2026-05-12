/* eslint-disable @typescript-eslint/no-require-imports */
const { ethers } = require('hardhat');

async function main() {
  const [owner, poster, worker] = await ethers.getSigners();

  const MockToken = await ethers.getContractFactory('MockToken');
  const token = await MockToken.deploy();
  const tokenAddress = await token.getAddress();

  const MiniGigs = await ethers.getContractFactory('MiniGigs');
  const miniGigs = await MiniGigs.deploy(tokenAddress);
  const miniGigsAddress = await miniGigs.getAddress();

  console.log('⛽ --- MiniGigs Gas Benchmarks ---');

  // 1. Post Gig
  const bounty = ethers.parseEther('10');
  await token.mint(poster.address, bounty * 100n);
  await token.connect(poster).approve(miniGigsAddress, bounty * 100n);

  const tx1 = await miniGigs.connect(poster).postGig('Task', 'Desc', bounty, 7);
  const receipt1 = await tx1.wait();
  console.log(`| Post Gig          | ${receipt1.gasUsed.toString().padStart(12)} |`);

  // 2. Accept Gig
  const tx2 = await miniGigs.connect(worker).acceptGig(1);
  const receipt2 = await tx2.wait();
  console.log(`| Accept Gig        | ${receipt2.gasUsed.toString().padStart(12)} |`);

  // 3. Submit Work
  const tx3 = await miniGigs.connect(worker).submitWork(1, 'ipfs://proof');
  const receipt3 = await tx3.wait();
  console.log(`| Submit Work       | ${receipt3.gasUsed.toString().padStart(12)} |`);

  // 4. Complete Gig
  const tx4 = await miniGigs.connect(poster).completeGig(1);
  const receipt4 = await tx4.wait();
  console.log(`| Complete Gig      | ${receipt4.gasUsed.toString().padStart(12)} |`);

  // 5. Batch Complete (5 Gigs)
  for (let i = 2; i <= 6; i++) {
    await miniGigs.connect(poster).postGig('Task ' + i, 'Desc', bounty, 7);
    await miniGigs.connect(worker).acceptGig(i);
    await miniGigs.connect(worker).submitWork(i, 'proof');
  }

  const tx5 = await miniGigs.connect(poster).batchCompleteGigs([2, 3, 4, 5, 6]);
  const receipt5 = await tx5.wait();
  console.log(`| Batch Complete(5) | ${receipt5.gasUsed.toString().padStart(12)} |`);
  console.log(`| Avg per Gig       | ${(receipt5.gasUsed / 5n).toString().padStart(12)} |`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
