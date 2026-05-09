import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("MiniGigs", function () {
  let MiniGigs, miniGigs, MockToken, token, owner, poster, worker;

  beforeEach(async function () {
    [owner, poster, worker] = await ethers.getSigners();

    MockToken = await ethers.getContractFactory("MockToken");
    token = await MockToken.deploy();

    MiniGigs = await ethers.getContractFactory("MiniGigs");
    miniGigs = await MiniGigs.deploy(await token.getAddress());

    // Give some tokens to poster
    await token.mint(poster.address, ethers.parseEther("1000"));
  });

  it("Should set the right stablecoin address", async function () {
    expect(await miniGigs.stablecoin()).to.equal(await token.getAddress());
  });
});
