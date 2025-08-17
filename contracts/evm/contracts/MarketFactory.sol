// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./BinaryMarket.sol";

/**
 * @title MarketFactory
 * @notice Creates new binary prediction markets for news events
 */
contract MarketFactory is AccessControl {
    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MARKET_CREATOR_ROLE = keccak256("MARKET_CREATOR_ROLE");

    // State variables
    address public immutable marketImplementation;
    address public treasury;
    uint16 public maxFeeBps = 300; // 3% max fee
    uint256 public marketCount;

    // Events
    event MarketCreated(
        address indexed market,
        uint256 indexed marketId,
        string statement,
        string criteriaURI,
        uint256 deadline
    );
    event TreasuryUpdated(address newTreasury);
    event MaxFeeUpdated(uint16 newMaxFeeBps);

    /**
     * @notice Constructor sets up roles and market implementation
     * @param _marketImplementation Address of BinaryMarket implementation
     * @param _treasury Address of the treasury
     */
    constructor(address _marketImplementation, address _treasury) {
        require(_marketImplementation != address(0), "Invalid implementation");
        require(_treasury != address(0), "Invalid treasury");
        
        marketImplementation = _marketImplementation;
        treasury = _treasury;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MARKET_CREATOR_ROLE, msg.sender);
    }

    /**
     * @notice Creates a new binary market
     * @param statement The market statement/question
     * @param resolver Address authorized to resolve the market
     * @param token Token used for betting (e.g., USDC)
     * @param feeBps Protocol fee in basis points
     * @param deadline Timestamp when the market closes
     * @param criteriaURI IPFS hash of the market resolution criteria
     * @param initialYesLiquidity Initial liquidity for YES pool
     * @param initialNoLiquidity Initial liquidity for NO pool
     * @return market Address of the created market
     */
    function createMarket(
        string calldata statement,
        address resolver,
        address token,
        uint16 feeBps,
        uint256 deadline,
        string calldata criteriaURI,
        uint256 initialYesLiquidity,
        uint256 initialNoLiquidity
    ) external onlyRole(MARKET_CREATOR_ROLE) returns (address market) {
        require(feeBps <= maxFeeBps, "Fee exceeds maximum");
        require(deadline > block.timestamp, "Invalid deadline");
        
        uint256 marketId = marketCount++;
        
        // Deploy minimal proxy clone
        market = Clones.clone(marketImplementation);
        
        // Initialize the market
        BinaryMarket(market).initialize(
            statement,
            resolver,
            token,
            treasury,
            feeBps,
            deadline,
            criteriaURI,
            initialYesLiquidity,
            initialNoLiquidity
        );
        
        emit MarketCreated(market, marketId, statement, criteriaURI, deadline);
    }

    /**
     * @notice Updates the treasury address
     * @param _treasury New treasury address
     */
    function setTreasury(address _treasury) external onlyRole(ADMIN_ROLE) {
        require(_treasury != address(0), "Invalid treasury");
        treasury = _treasury;
        emit TreasuryUpdated(_treasury);
    }

    /**
     * @notice Updates the maximum fee in basis points
     * @param _maxFeeBps New maximum fee (e.g., 300 = 3%)
     */
    function setMaxFee(uint16 _maxFeeBps) external onlyRole(ADMIN_ROLE) {
        require(_maxFeeBps <= 1000, "Fee too high"); // Max 10%
        maxFeeBps = _maxFeeBps;
        emit MaxFeeUpdated(_maxFeeBps);
    }
}
