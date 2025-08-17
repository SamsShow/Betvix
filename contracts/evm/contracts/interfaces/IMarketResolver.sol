// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IMarketResolver
 * @notice Interface for market outcome resolution
 */
interface IMarketResolver {
    /**
     * @notice Resolve a market with an outcome
     * @param outcome The market outcome (true = YES, false = NO)
     * @param isValid Whether the market is valid or not
     */
    function resolve(bool outcome, bool isValid) external;
}
