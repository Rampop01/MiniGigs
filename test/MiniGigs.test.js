import { expect } from 'chai';
import pkg from 'hardhat';
const { ethers } = pkg;

describe('MiniGigs', function () {
  let miniGigs;
  let mockToken;
  let poster;
  const bounty = ethers.parseEther('10');

  beforeEach(async function () {
    const [, posterSigner] = await ethers.getSigners();
    poster = posterSigner;

    const MockToken = await ethers.getContractFactory('MockToken');
    mockToken = await MockToken.deploy();

    const MiniGigs = await ethers.getContractFactory('MiniGigs');
    miniGigs = await MiniGigs.deploy(await mockToken.getAddress());

    await mockToken.mint(poster.address, bounty * 10n);
    await mockToken.connect(poster).approve(await miniGigs.getAddress(), bounty * 10n);
  });

  it('Should allow a user to post a gig', async function () {
    await expect(miniGigs.connect(poster).postGig('Test Task', 'Test Description', bounty, 7))
      .to.emit(miniGigs, 'GigPosted')
      .withArgs(1, poster.address, bounty);

    const gig = await miniGigs.gigs(1);
    expect(gig.title).to.equal('Test Task');
    expect(gig.bounty).to.equal(bounty);
    expect(gig.status).to.equal(0); // Open
  });
});
