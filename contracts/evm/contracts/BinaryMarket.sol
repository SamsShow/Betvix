// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

/**
 * @title BinaryMarket
 * @notice Manages a binary prediction market with CPMM liquidity pools
 */
contract BinaryMarket is Initializable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Market states
    enum State {
        Open,
        AwaitingResolution,
        ResolvedYes,
        ResolvedNo,
        Invalid,
        Paused
    }

    // Market parameters
    string public statement;
    address public resolver;
    address public treasury;
    IERC20 public token;
    uint16 public feeBps;
    uint256 public deadline;
    string public criteriaURI;
    
    // CPMM pools
    uint256 public yesPool;
    uint256 public noPool;
    uint256 private constant PRECISION = 1e18;
    
    // Market state
    State public state;
    mapping(address => mapping(bool => uint256)) public bets; // user => isYes => amount
    
    // Events
    event Predicted(address indexed user, bool indexed isYes, uint256 amount);
    event Closed();
    event Resolved(bool indexed outcome, bool indexed isValid);
    event Claimed(address indexed user, uint256 amount);
    event Refunded(address indexed user, uint256 amount);

    /**
     * @notice Prevents actions when market is closed or resolved
     */
    modifier onlyOpen() {
        require(state == State.Open, "Market not open");
        require(block.timestamp < deadline, "Market closed");
        _;
    }

    /**
     * @notice Ensures only the resolver can call resolution functions
     */
    modifier onlyResolver() {
        require(msg.sender == resolver, "Not resolver");
        _;
    }

    /**
     * @dev Prevents initialization being called more than once
     */
    function initialize(
        string calldata _statement,
        address _resolver,
        address _token,
        address _treasury,
        uint16 _feeBps,
        uint256 _deadline,
        string calldata _criteriaURI,
        uint256 _initialYesLiquidity,
        uint256 _initialNoLiquidity
    ) external initializer {
        require(_resolver != address(0), "Invalid resolver");
        require(_token != address(0), "Invalid token");
        require(_treasury != address(0), "Invalid treasury");
        require(_deadline > block.timestamp, "Invalid deadline");
        require(_initialYesLiquidity > 0 && _initialNoLiquidity > 0, "Invalid initial liquidity");
        
        statement = _statement;
        resolver = _resolver;
        token = IERC20(_token);
        treasury = _treasury;
        feeBps = _feeBps;
        deadline = _deadline;
        criteriaURI = _criteriaURI;
        state = State.Open;
        
        // Initialize pools with initial liquidity (from factory)
        yesPool = _initialYesLiquidity;
        noPool = _initialNoLiquidity;
    }

    /**
     * @notice Place a bet on YES outcome
     * @param amount Amount to bet
     */
    function predictYes(uint256 amount) external nonReentrant onlyOpen whenNotPaused {
        require(amount > 0, "Amount must be positive");
        
        // Transfer tokens from user
        token.safeTransferFrom(msg.sender, address(this), amount);
        
        // Update pools and bets
        yesPool += amount;
        bets[msg.sender][true] += amount;
        
        emit Predicted(msg.sender, true, amount);
    }

    /**
     * @notice Place a bet on NO outcome
     * @param amount Amount to bet
     */
    function predictNo(uint256 amount) external nonReentrant onlyOpen whenNotPaused {
        require(amount > 0, "Amount must be positive");
        
        // Transfer tokens from user
        token.safeTransferFrom(msg.sender, address(this), amount);
        
        // Update pools and bets
        noPool += amount;
        bets[msg.sender][false] += amount;
        
        emit Predicted(msg.sender, false, amount);
    }

    /**
     * @notice Close market when deadline is reached
     */
    function close() external {
        require(block.timestamp >= deadline, "Deadline not reached");
        require(state == State.Open, "Not in Open state");
        
        state = State.AwaitingResolution;
        
        emit Closed();
    }

    /**
     * @notice Resolve the market with an outcome
     * @param outcome The market outcome (true = YES, false = NO)
     * @param isValid Whether the market resolution is valid
     */
    function resolve(bool outcome, bool isValid) external onlyResolver nonReentrant {
        require(state == State.AwaitingResolution, "Not awaiting resolution");
        
        if (!isValid) {
            state = State.Invalid;
        } else if (outcome) {
            state = State.ResolvedYes;
        } else {
            state = State.ResolvedNo;
        }
        
        emit Resolved(outcome, isValid);
    }

    /**
     * @notice Claim winnings after market resolution
     */
    function claim() external nonReentrant {
        require(state == State.ResolvedYes || state == State.ResolvedNo, "Market not resolved");
        
        bool winningOutcome = (state == State.ResolvedYes);
        uint256 userBet = bets[msg.sender][winningOutcome];
        
        require(userBet > 0, "No winning bet");
        
        // Reset user's bet to prevent double claiming
        bets[msg.sender][winningOutcome] = 0;
        
        // Calculate winnings
        uint256 totalPool = yesPool + noPool;
        uint256 winningPool = winningOutcome ? yesPool : noPool;
        uint256 userShare = (userBet * PRECISION) / winningPool;
        uint256 grossPayout = (totalPool * userShare) / PRECISION;
        
        // Apply fee
        uint256 fee = (grossPayout * feeBps) / 10000;
        uint256 netPayout = grossPayout - fee;
        
        // Transfer winnings to user and fee to treasury
        token.safeTransfer(msg.sender, netPayout);
        if (fee > 0) {
            token.safeTransfer(treasury, fee);
        }
        
        emit Claimed(msg.sender, netPayout);
    }

    /**
     * @notice Refund bets if market is invalid
     */
    function refund() external nonReentrant {
        require(state == State.Invalid, "Market not invalid");
        
        uint256 yesAmount = bets[msg.sender][true];
        uint256 noAmount = bets[msg.sender][false];
        uint256 totalRefund = yesAmount + noAmount;
        
        require(totalRefund > 0, "No bets to refund");
        
        // Reset user's bets
        bets[msg.sender][true] = 0;
        bets[msg.sender][false] = 0;
        
        // Transfer refund to user
        token.safeTransfer(msg.sender, totalRefund);
        
        emit Refunded(msg.sender, totalRefund);
    }

    /**
     * @notice Calculate the current odds
     * @return yesOdds Odds for YES outcome (0-1, scaled by PRECISION)
     * @return noOdds Odds for NO outcome (0-1, scaled by PRECISION)
     */
    function getOdds() external view returns (uint256 yesOdds, uint256 noOdds) {
        uint256 totalPool = yesPool + noPool;
        if (totalPool == 0) {
            return (PRECISION / 2, PRECISION / 2); // 50/50 if no liquidity
        }
        
        yesOdds = (noPool * PRECISION) / totalPool;
        noOdds = (yesPool * PRECISION) / totalPool;
    }

    /**
     * @notice Pause the market in emergency
     */
    function pause() external onlyResolver {
        _pause();
        if (state == State.Open) {
            state = State.Paused;
        }
    }

    /**
     * @notice Unpause the market
     */
    function unpause() external onlyResolver {
        _unpause();
        if (state == State.Paused) {
            state = State.Open;
        }
    }
}
