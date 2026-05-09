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

  it("Should allow a poster to post a gig", async function () {
    const bounty = ethers.parseEther("10");
    await token.connect(poster).approve(await miniGigs.getAddress(), bounty);

    await expect(miniGigs.connect(poster).postGig(
      "Test Gig",
      "Description",
      bounty,
      7
    )).to.emit(miniGigs, "GigPosted").withArgs(1, poster.address, bounty, "Test Gig");

    const gig = await miniGigs.gigs(1);
    expect(gig.title).to.equal("Test Gig");
    expect(gig.bounty).to.equal(bounty);
    expect(gig.status).to.equal(0); // Open
  });
});
