// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Treasury
 * @notice Manages protocol fees collected from prediction markets
 */
contract Treasury is AccessControl {
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");

    // Events
    event WithdrewTokens(address token, address to, uint256 amount);
    event WithdrewETH(address to, uint256 amount);

    /**
     * @notice Constructor sets up roles
     * @param admin Address with admin privileges
     */
    constructor(address admin) {
        require(admin != address(0), "Invalid admin");
        
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(WITHDRAWER_ROLE, admin);
    }

    /**
     * @notice Withdraw ERC20 tokens from the treasury
     * @param token ERC20 token to withdraw
     * @param to Recipient address
     * @param amount Amount to withdraw
     */
    function withdrawTokens(
        IERC20 token,
        address to,
        uint256 amount
    ) external onlyRole(WITHDRAWER_ROLE) {
        require(address(token) != address(0), "Invalid token");
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Invalid amount");
        
        token.safeTransfer(to, amount);
        
        emit WithdrewTokens(address(token), to, amount);
    }

    /**
     * @notice Withdraw ETH from the treasury
     * @param to Recipient address
     * @param amount Amount to withdraw
     */
    function withdrawETH(
        address payable to,
        uint256 amount
    ) external onlyRole(WITHDRAWER_ROLE) {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Invalid amount");
        require(amount <= address(this).balance, "Insufficient balance");
        
        (bool success, ) = to.call{value: amount}("");
        require(success, "ETH transfer failed");
        
        emit WithdrewETH(to, amount);
    }

    /**
     * @notice Fallback function to receive ETH
     */
    receive() external payable {}
}
