// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IMarketResolver.sol";

/**
 * @title ResolverOracleAdapter
 * @notice Oracle adapter to resolve market outcomes
 */
contract ResolverOracleAdapter is AccessControl, IMarketResolver {
    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant RESOLVER_ROLE = keccak256("RESOLVER_ROLE");

    // Markets and their resolution status
    mapping(address => bool) public resolvedMarkets;
    
    // Events
    event MarketResolved(address indexed market, bool outcome, bool isValid);

    /**
     * @notice Constructor sets up roles
     */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(RESOLVER_ROLE, msg.sender);
    }

    /**
     * @notice Resolve a market with manual input
     * @param market Address of the market to resolve
     * @param outcome The market outcome (true = YES, false = NO)
     * @param isValid Whether the market resolution is valid
     * @param proof Additional data for verification (can be empty for manual resolution)
     */
    function resolveMarket(
        address market,
        bool outcome,
        bool isValid,
        bytes calldata proof
    ) external onlyRole(RESOLVER_ROLE) {
        require(market != address(0), "Invalid market");
        require(!resolvedMarkets[market], "Market already resolved");
        
        // Mark as resolved to prevent re-resolution
        resolvedMarkets[market] = true;
        
        // Call the market's resolve function
        IMarketResolver(market).resolve(outcome, isValid);
        
        emit MarketResolved(market, outcome, isValid);
    }

    /**
     * @notice External resolve function (implements IMarketResolver)
     * @dev This function is not used by this contract but allows it to be
     *      used as a resolver itself in more complex oracle setups
     */
    function resolve(bool outcome, bool isValid) external override {
        revert("Direct resolution not supported");
    }
}
