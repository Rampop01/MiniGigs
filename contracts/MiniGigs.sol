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

    enum GigStatus { Open, InProgress, Submitted, Completed, Disputed, Cancelled, Expired }

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
    event GigAccepted(uint256 indexed id, address indexed worker, address indexed poster);
    event GigSubmitted(uint256 indexed id, address indexed worker, string deliverables);
    event GigCompleted(uint256 indexed id, address indexed worker, address indexed poster, uint256 payout);
    event GigCancelled(uint256 indexed id);
    event GigDisputed(uint256 indexed id, address indexed disputer);
    event GigExpired(uint256 indexed id);
    event DisputeResolved(uint256 indexed id, address indexed winner, uint256 payout);

    // ─── Constructor ───

    constructor(address _stablecoin) Ownable(msg.sender) {
        stablecoin = IERC20(_stablecoin);
    }

    // ─── External Functions ───

    /**
     * @notice Post a new micro-gig to the marketplace
     * @param _title Brief title of the task
     * @param _description Detailed task requirements and metadata
     * @param _bounty Amount of cUSD to escrow for the worker
     * @param _durationDays Number of days before the gig expires
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
     * @notice Accept an open gig to begin working
     * @param _id The ID of the gig to accept
     */
    function acceptGig(uint256 _id) external {
        Gig storage gig = gigs[_id];
        require(gig.status == GigStatus.Open, "Gig not open");
        require(gig.poster != msg.sender, "Cannot accept own gig");

        gig.worker = msg.sender;
        gig.status = GigStatus.InProgress;

        emit GigAccepted(_id, msg.sender, gig.poster);
    }

    /**
     * @notice Submit proof of work for a gig
     * @param _id The ID of the gig
     * @param _deliverables IPFS hash or link to proof of work
     */
    function submitWork(uint256 _id, string calldata _deliverables) external {
        Gig storage gig = gigs[_id];
        require(gig.status == GigStatus.InProgress, "Gig not in progress");
        require(gig.worker == msg.sender, "Only worker can submit");

        gig.deliverables = _deliverables;
        gig.status = GigStatus.Submitted;

        emit GigSubmitted(_id, msg.sender, _deliverables);
    }

    /**
     * @notice Complete a gig and release escrowed funds to the worker
     * @param _id The ID of the gig
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

        emit GigCompleted(_id, gig.worker, msg.sender, payout);
    }

    /**
     * @notice Complete multiple gigs in a single transaction to save gas
     * @param _ids Array of gig IDs to complete
     */
    function batchCompleteGigs(uint256[] calldata _ids) external nonReentrant {
        for (uint256 i = 0; i < _ids.length; i++) {
            uint256 id = _ids[i];
            Gig storage gig = gigs[id];
            
            // Skip invalid ones rather than revert to ensure partial success if needed,
            // or strictly revert if any fail. For efficiency, we'll revert.
            require(gig.status == GigStatus.Submitted, "Work not submitted");
            require(gig.poster == msg.sender, "Only poster can release funds");

            gig.status = GigStatus.Completed;

            uint256 fee = (gig.bounty * platformFeeBps) / 10000;
            uint256 payout = gig.bounty - fee;

            require(stablecoin.transfer(gig.worker, payout), "Payout failed");

            emit GigCompleted(id, gig.worker, msg.sender, payout);
        }
    }

    /**
     * @notice Cancel an open gig and refund the poster
     * @param _id The ID of the gig
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
     * @notice Raise a dispute for a gig (Poster or Worker)
     * @param _id The ID of the gig
     */
    function disputeGig(uint256 _id) external {
        Gig storage gig = gigs[_id];
        require(gig.status == GigStatus.Submitted || gig.status == GigStatus.InProgress, "Invalid status for dispute");
        require(msg.sender == gig.poster || msg.sender == gig.worker, "Not authorized to dispute");

        gig.status = GigStatus.Disputed;

        emit GigDisputed(_id, msg.sender);
    }

    /**
     * @notice Resolve a dispute (Owner/Admin only)
     * @param _id The ID of the gig
     * @param _payoutToPoster Percentage of bounty to return to poster (0-100)
     */
    function resolveDispute(uint256 _id, uint256 _payoutToPoster) external onlyOwner nonReentrant {
        Gig storage gig = gigs[_id];
        require(gig.status == GigStatus.Disputed, "Gig not disputed");
        require(_payoutToPoster <= 100, "Invalid percentage");

        uint256 posterShare = (gig.bounty * _payoutToPoster) / 100;
        uint256 workerShare = gig.bounty - posterShare;

        if (posterShare > 0) {
            require(stablecoin.transfer(gig.poster, posterShare), "Poster refund failed");
        }
        
        if (workerShare > 0) {
            uint256 fee = (workerShare * platformFeeBps) / 10000;
            uint256 finalWorkerPayout = workerShare - fee;
            require(stablecoin.transfer(gig.worker, finalWorkerPayout), "Worker payout failed");
        }

        gig.status = GigStatus.Completed; // Mark as done

        emit DisputeResolved(_id, _payoutToPoster == 100 ? gig.poster : gig.worker, gig.bounty);
    }

    /**
     * @notice Expire an unaccepted gig after its deadline
     * @param _id The ID of the gig
     */
    function expireGig(uint256 _id) external nonReentrant {
        Gig storage gig = gigs[_id];
        require(gig.status == GigStatus.Open, "Only open gigs can expire");
        require(block.timestamp > gig.deadline, "Deadline not reached");

        gig.status = GigStatus.Expired;
        require(stablecoin.transfer(gig.poster, gig.bounty), "Refund failed");

        emit GigExpired(_id);
    }

    /**
     * @notice Withdraw accumulated platform fees (Owner only)
     * @param _amount Amount of cUSD to withdraw
     */
    function withdrawFees(uint256 _amount) external onlyOwner {
        require(stablecoin.transfer(owner(), _amount), "Withdrawal failed");
    }

    /**
     * @notice Update platform fee basis points (Owner only)
     * @param _bps Basis points (e.g. 200 = 2%)
     */
    function setPlatformFee(uint256 _bps) external onlyOwner {
        require(_bps <= 1000, "Fee too high"); // max 10%
        platformFeeBps = _bps;
    }
}
