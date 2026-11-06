// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title IERC20 — Minimal ERC-20 interface used by WhitePe contracts.
interface IERC20 {
    /// @notice Returns the token balance of `account`.
    function balanceOf(address account) external view returns (uint256);

    /// @notice Returns the remaining allowance that `spender` can spend on behalf of `owner`.
    function allowance(address owner, address spender) external view returns (uint256);

    /// @notice Sets `amount` as the allowance of `spender` over the caller's tokens.
    /// @return True if the operation succeeded.
    function approve(address spender, uint256 amount) external returns (bool);

    /// @notice Moves `amount` tokens from the caller to `to`.
    /// @return True if the operation succeeded.
    function transfer(address to, uint256 amount) external returns (bool);

    /// @notice Moves `amount` tokens from `from` to `to` using the caller's allowance.
    /// @return True if the operation succeeded.
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}
