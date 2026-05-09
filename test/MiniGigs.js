import { expect } from 'chai';
import pkg from 'hardhat';
const { ethers } = pkg;

describe('MiniGigs', function () {
  let MiniGigs, miniGigs, MockToken, token, owner, poster, worker;

  beforeEach(async function () {
    [owner, poster, worker] = await ethers.getSigners();

    MockToken = await ethers.getContractFactory('MockToken');
    token = await MockToken.deploy();

    MiniGigs = await ethers.getContractFactory('MiniGigs');
    miniGigs = await MiniGigs.deploy(await token.getAddress());

    // Give some tokens to poster
    await token.mint(poster.address, ethers.parseEther('1000'));
  });

  it('Should set the right stablecoin address', async function () {
    expect(await miniGigs.stablecoin()).to.equal(await token.getAddress());
  });

  it('Should allow a poster to post a gig', async function () {
    const bounty = ethers.parseEther('10');
    await token.connect(poster).approve(await miniGigs.getAddress(), bounty);

    await expect(miniGigs.connect(poster).postGig('Test Gig', 'Description', bounty, 7))
      .to.emit(miniGigs, 'GigPosted')
      .withArgs(1, poster.address, bounty, 'Test Gig');

    const gig = await miniGigs.gigs(1);
    expect(gig.title).to.equal('Test Gig');
    expect(gig.bounty).to.equal(bounty);
    expect(gig.status).to.equal(0); // Open
  });

  it('Should allow a worker to accept and submit work', async function () {
    const bounty = ethers.parseEther('10');
    await token.connect(poster).approve(await miniGigs.getAddress(), bounty);
    await miniGigs.connect(poster).postGig('Task', 'Desc', bounty, 7);

    // Accept
    await expect(miniGigs.connect(worker).acceptGig(1))
      .to.emit(miniGigs, 'GigAccepted')
      .withArgs(1, worker.address, poster.address);

    let gig = await miniGigs.gigs(1);
    expect(gig.worker).to.equal(worker.address);
    expect(gig.status).to.equal(1); // InProgress

    // Submit
    await expect(miniGigs.connect(worker).submitWork(1, 'ipfs://proof'))
      .to.emit(miniGigs, 'GigSubmitted')
      .withArgs(1, worker.address, 'ipfs://proof');

    gig = await miniGigs.gigs(1);
    expect(gig.status).to.equal(2); // Submitted
    expect(gig.deliverables).to.equal('ipfs://proof');
  });

  it('Should release rewards and collect platform fees upon completion', async function () {
    const bounty = ethers.parseEther('10');
    await token.connect(poster).approve(await miniGigs.getAddress(), bounty);
    await miniGigs.connect(poster).postGig('Task', 'Desc', bounty, 7);
    await miniGigs.connect(worker).acceptGig(1);
    await miniGigs.connect(worker).submitWork(1, 'proof');

    const initialWorkerBalance = await token.balanceOf(worker.address);
    const initialContractBalance = await token.balanceOf(await miniGigs.getAddress());

    // Complete
    await miniGigs.connect(poster).completeGig(1);

    const fee = (bounty * 200n) / 10000n; // 2%
    const payout = bounty - fee;

    expect(await token.balanceOf(worker.address)).to.equal(initialWorkerBalance + payout);

    const gig = await miniGigs.gigs(1);
    expect(gig.status).to.equal(3); // Completed
  });

  it('Should prevent unauthorized users from completing a gig', async function () {
    const bounty = ethers.parseEther('10');
    await token.connect(poster).approve(await miniGigs.getAddress(), bounty);
    await miniGigs.connect(poster).postGig('Task', 'Desc', bounty, 7);
    await miniGigs.connect(worker).acceptGig(1);
    await miniGigs.connect(worker).submitWork(1, 'proof');

    // Try to complete from worker (unauthorized)
    await expect(miniGigs.connect(worker).completeGig(1)).to.be.revertedWith(
      'Only poster can release funds',
    );
  });

  it('Should allow a poster to cancel and get a refund', async function () {
    const bounty = ethers.parseEther('10');
    await token.connect(poster).approve(await miniGigs.getAddress(), bounty);
    await miniGigs.connect(poster).postGig('Task', 'Desc', bounty, 7);

    const initialPosterBalance = await token.balanceOf(poster.address);

    // Cancel
    await expect(miniGigs.connect(poster).cancelGig(1))
      .to.emit(miniGigs, 'GigCancelled')
      .withArgs(1);

    expect(await token.balanceOf(poster.address)).to.equal(initialPosterBalance + bounty);

    const gig = await miniGigs.gigs(1);
    expect(gig.status).to.equal(5); // Cancelled
  });

  it('Should allow the owner to withdraw fees', async function () {
    const bounty = ethers.parseEther('10');
    await token.connect(poster).approve(await miniGigs.getAddress(), bounty);
    await miniGigs.connect(poster).postGig('Task', 'Desc', bounty, 7);
    await miniGigs.connect(worker).acceptGig(1);
    await miniGigs.connect(worker).submitWork(1, 'proof');
    await miniGigs.connect(poster).completeGig(1);

    const fee = (bounty * 200n) / 10000n; // 2%
    const initialOwnerBalance = await token.balanceOf(owner.address);

    await miniGigs.connect(owner).withdrawFees(fee);

    expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance + fee);
  });
});
