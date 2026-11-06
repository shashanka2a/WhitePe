// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "./IERC20.sol";

/// @title WhitePeSettlement
/// @notice Minimal payment settlement contract for WhitePe.
/// @dev Accepts USDT (ERC-20) payments, forwards them to registered merchant
///      wallets, and emits rich events for off-chain indexing (Arkiv / any indexer).
///      Prevents duplicate settlement of the same invoice.
contract WhitePeSettlement {
    // ──────────────────────────────────────────────
    //  State
    // ──────────────────────────────────────────────

    /// @notice The WhitePe backend address that administers this contract.
    address public owner;

    /// @notice The ERC-20 token used for settlement (e.g. USDT on Whitechain).
    IERC20 public immutable paymentToken;

    /// @notice Maps a merchant ID to its receiving wallet address.
    mapping(bytes32 => address) public merchants;

    /// @notice Tracks whether an invoice has already been settled.
    mapping(bytes32 => bool) public settledInvoices;

    // ──────────────────────────────────────────────
    //  Events
    // ──────────────────────────────────────────────

    /// @notice Emitted when a payment is successfully settled.
    /// @param invoiceId  Unique invoice identifier.
    /// @param merchantId Merchant identifier the payment belongs to.
    /// @param merchant   Wallet address that received the funds.
    /// @param payer      Address that funded the payment.
    /// @param amount     Token amount transferred (in token decimals).
    /// @param timestamp  Block timestamp of the settlement.
    event PaymentSettled(
        bytes32 indexed invoiceId,
        bytes32 indexed merchantId,
        address indexed merchant,
        address payer,
        uint256 amount,
        uint256 timestamp
    );

    /// @notice Emitted when a merchant wallet is registered or updated.
    /// @param merchantId Merchant identifier.
    /// @param wallet     Wallet address mapped to the merchant.
    event MerchantRegistered(bytes32 indexed merchantId, address wallet);

    // ──────────────────────────────────────────────
    //  Errors
    // ──────────────────────────────────────────────

    error Unauthorized();
    error InvoiceAlreadySettled(bytes32 invoiceId);
    error MerchantNotRegistered(bytes32 merchantId);
    error ZeroAddress();
    error ZeroAmount();
    error TransferFailed();

    // ──────────────────────────────────────────────
    //  Modifiers
    // ──────────────────────────────────────────────

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    // ──────────────────────────────────────────────
    //  Constructor
    // ──────────────────────────────────────────────

    /// @param _paymentToken Address of the ERC-20 token used for settlement.
    constructor(address _paymentToken) {
        if (_paymentToken == address(0)) revert ZeroAddress();
        owner = msg.sender;
        paymentToken = IERC20(_paymentToken);
    }

    // ──────────────────────────────────────────────
    //  Merchant management
    // ──────────────────────────────────────────────

    /// @notice Register or update a merchant's receiving wallet.
    /// @param merchantId Unique merchant identifier.
    /// @param wallet     Wallet address that will receive settlements.
    function registerMerchant(bytes32 merchantId, address wallet) external onlyOwner {
        if (wallet == address(0)) revert ZeroAddress();
        merchants[merchantId] = wallet;
        emit MerchantRegistered(merchantId, wallet);
    }

    // ──────────────────────────────────────────────
    //  Settlement
    // ──────────────────────────────────────────────

    /// @notice Settle an invoice by pulling `amount` of the payment token from
    ///         `msg.sender` and forwarding it to the merchant's wallet.
    /// @dev The caller must have approved this contract for at least `amount`.
    /// @param invoiceId  Unique invoice identifier (prevents double-settlement).
    /// @param merchantId Merchant identifier whose wallet receives the funds.
    /// @param amount     Token amount to transfer (in token decimals).
    function settle(bytes32 invoiceId, bytes32 merchantId, uint256 amount) external {
        if (amount == 0) revert ZeroAmount();
        if (settledInvoices[invoiceId]) revert InvoiceAlreadySettled(invoiceId);

        address merchantWallet = merchants[merchantId];
        if (merchantWallet == address(0)) revert MerchantNotRegistered(merchantId);

        // Mark settled before external call (checks-effects-interactions).
        settledInvoices[invoiceId] = true;

        // Pull tokens from the payer and forward to the merchant.
        bool success = paymentToken.transferFrom(msg.sender, merchantWallet, amount);
        if (!success) revert TransferFailed();

        emit PaymentSettled(invoiceId, merchantId, merchantWallet, msg.sender, amount, block.timestamp);
    }

    // ──────────────────────────────────────────────
    //  Owner management
    // ──────────────────────────────────────────────

    /// @notice Transfer contract ownership.
    /// @param newOwner Address of the new owner.
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        owner = newOwner;
    }
}
