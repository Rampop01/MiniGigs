// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MiniGigs
 * @dev A micro-task marketplace for Celo with escrow-based payments in stablecoins.
 */
contract MiniGigs is Ownable, ReentrancyGuard {
    
    // ─── Enums & Structs ───

    enum GigStatus { Open, InProgress, Submitted, Completed, Disputed, Cancelled }

    struct Gig {
        uint256 id;
        address poster;
        address worker;
        uint256 bounty;
        string title;
        string description;
        GigStatus status;
        string deliverables; // IPFS hash or encrypted link after submission
        uint256 createdAt;
        uint256 deadline;
    }

    // ─── State Variables ───

    IERC20 public stablecoin; // Usually cUSD on Celo
    uint256 public gigCount;
    mapping(uint256 => Gig) public gigs;
    
    // Fee collected from each completed gig (e.g., 200 = 2%)
    uint256 public platformFeeBps = 200; 

    // ─── Events ───

    event GigPosted(uint256 indexed id, address indexed poster, uint256 bounty, string title);
    event GigAccepted(uint256 indexed id, address indexed worker);
    event GigSubmitted(uint256 indexed id, string deliverables);
    event GigCompleted(uint256 indexed id, address indexed worker, uint256 payout);
    event GigCancelled(uint256 indexed id);
    event GigDisputed(uint256 indexed id);

    // ─── Constructor ───

    constructor(address _stablecoin) Ownable(msg.sender) {
        stablecoin = IERC20(_stablecoin);
    }

    // ─── External Functions ───

    /**
     * @dev Posters create a gig by depositing cUSD into escrow.
     */
    function postGig(
        string memory _title,
        string memory _description,
        uint256 _bounty,
        uint256 _durationDays
    ) external nonReentrant {
        require(_bounty > 0, "Bounty must be > 0");
        require(stablecoin.transferFrom(msg.sender, address(this), _bounty), "Escrow deposit failed");

        gigCount++;
        gigs[gigCount] = Gig({
            id: gigCount,
            poster: msg.sender,
            worker: address(0),
            bounty: _bounty,
            title: _title,
            description: _description,
            status: GigStatus.Open,
            deliverables: "",
            createdAt: block.timestamp,
            deadline: block.timestamp + (_durationDays * 1 days)
        });

        emit GigPosted(gigCount, msg.sender, _bounty, _title);
    }

    /**
     * @dev Workers accept an open gig.
     */
    function acceptGig(uint256 _id) external {
        Gig storage gig = gigs[_id];
        require(gig.status == GigStatus.Open, "Gig not open");
        require(gig.poster != msg.sender, "Cannot accept own gig");

        gig.worker = msg.sender;
        gig.status = GigStatus.InProgress;

        emit GigAccepted(_id, msg.sender);
    }

    /**
     * @dev Workers submit proof of work.
     */
    function submitWork(uint256 _id, string calldata _deliverables) external {
        Gig storage gig = gigs[_id];
        require(gig.status == GigStatus.InProgress, "Gig not in progress");
        require(gig.worker == msg.sender, "Only worker can submit");

        gig.deliverables = _deliverables;
        gig.status = GigStatus.Submitted;

        emit GigSubmitted(_id, _deliverables);
    }

    /**
     * @dev Posters release funds upon satisfactory work.
     */
    function completeGig(uint256 _id) external nonReentrant {
        Gig storage gig = gigs[_id];
        require(gig.status == GigStatus.Submitted, "Work not submitted");
        require(gig.poster == msg.sender, "Only poster can release funds");

        gig.status = GigStatus.Completed;

        uint256 fee = (gig.bounty * platformFeeBps) / 10000;
        uint256 payout = gig.bounty - fee;

        require(stablecoin.transfer(gig.worker, payout), "Payout failed");
        // Fee remains in contract; could be withdrawn by owner

        emit GigCompleted(_id, gig.worker, payout);
    }

    /**
     * @dev Posters can cancel open gigs to get their refund.
     */
    function cancelGig(uint256 _id) external nonReentrant {
        Gig storage gig = gigs[_id];
        require(gig.status == GigStatus.Open, "Only open gigs can be cancelled");
        require(gig.poster == msg.sender, "Only poster can cancel");

        gig.status = GigStatus.Cancelled;
        require(stablecoin.transfer(msg.sender, gig.bounty), "Refund failed");

        emit GigCancelled(_id);
    }

    /**
     * @dev Platform owner withdraws accumulated fees.
     */
    function withdrawFees(uint256 _amount) external onlyOwner {
        require(stablecoin.transfer(owner(), _amount), "Withdrawal failed");
    }

    /**
     * @dev Update platform fee.
     */
    function setPlatformFee(uint256 _bps) external onlyOwner {
        require(_bps <= 1000, "Fee too high"); // max 10%
        platformFeeBps = _bps;
    }
}
