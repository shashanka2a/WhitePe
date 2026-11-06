// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title WhitePeInvoiceRegistry
/// @notice Lightweight on-chain invoice registry for WhitePe.
/// @dev Invoices are created by the owner (WhitePe backend) and can be marked
///      as paid by the settlement contract or the owner. Emits events for
///      off-chain indexing (Arkiv / any indexer).
contract WhitePeInvoiceRegistry {
    // ──────────────────────────────────────────────
    //  Types
    // ──────────────────────────────────────────────

    /// @notice Represents an on-chain invoice record.
    struct Invoice {
        bytes32 merchantId;
        uint256 amount;
        uint256 expiry;
        bool paid;
        address payer;
    }

    // ──────────────────────────────────────────────
    //  State
    // ──────────────────────────────────────────────

    /// @notice The WhitePe backend address that administers this contract.
    address public owner;

    /// @notice The settlement contract allowed to mark invoices as paid.
    address public settlementContract;

    /// @notice Maps an invoice ID to its Invoice record.
    mapping(bytes32 => Invoice) public invoices;

    // ──────────────────────────────────────────────
    //  Events
    // ──────────────────────────────────────────────

    /// @notice Emitted when a new invoice is created.
    /// @param invoiceId  Unique invoice identifier.
    /// @param merchantId Merchant the invoice belongs to.
    /// @param amount     Payment amount expected (in token decimals).
    /// @param expiry     Unix timestamp after which the invoice expires.
    event InvoiceCreated(
        bytes32 indexed invoiceId,
        bytes32 indexed merchantId,
        uint256 amount,
        uint256 expiry
    );

    /// @notice Emitted when an invoice is marked as paid.
    /// @param invoiceId Unique invoice identifier.
    /// @param payer     Address that paid the invoice.
    /// @param amount    Amount recorded on the invoice.
    event InvoicePaid(bytes32 indexed invoiceId, address indexed payer, uint256 amount);

    // ──────────────────────────────────────────────
    //  Errors
    // ──────────────────────────────────────────────

    error Unauthorized();
    error ZeroAddress();
    error ZeroAmount();
    error InvoiceAlreadyExists(bytes32 invoiceId);
    error InvoiceNotFound(bytes32 invoiceId);
    error InvoiceAlreadyPaid(bytes32 invoiceId);
    error InvoiceExpired(bytes32 invoiceId);

    // ──────────────────────────────────────────────
    //  Modifiers
    // ──────────────────────────────────────────────

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlySettlementOrOwner() {
        if (msg.sender != owner && msg.sender != settlementContract) revert Unauthorized();
        _;
    }

    // ──────────────────────────────────────────────
    //  Constructor
    // ──────────────────────────────────────────────

    constructor() {
        owner = msg.sender;
    }

    // ──────────────────────────────────────────────
    //  Invoice management
    // ──────────────────────────────────────────────

    /// @notice Create a new invoice.
    /// @param invoiceId  Unique invoice identifier.
    /// @param merchantId Merchant the invoice belongs to.
    /// @param amount     Expected payment amount (in token decimals).
    /// @param expiry     Unix timestamp after which the invoice expires.
    function createInvoice(
        bytes32 invoiceId,
        bytes32 merchantId,
        uint256 amount,
        uint256 expiry
    ) external onlyOwner {
        if (amount == 0) revert ZeroAmount();
        // Ensure the invoice slot is empty (merchantId == 0 and amount == 0).
        if (invoices[invoiceId].amount != 0) revert InvoiceAlreadyExists(invoiceId);

        invoices[invoiceId] = Invoice({
            merchantId: merchantId,
            amount: amount,
            expiry: expiry,
            paid: false,
            payer: address(0)
        });

        emit InvoiceCreated(invoiceId, merchantId, amount, expiry);
    }

    /// @notice Mark an invoice as paid.
    /// @dev Callable only by the settlement contract or the owner.
    /// @param invoiceId Unique invoice identifier.
    /// @param payer     Address that paid the invoice.
    function markPaid(bytes32 invoiceId, address payer) external onlySettlementOrOwner {
        Invoice storage inv = invoices[invoiceId];
        if (inv.amount == 0) revert InvoiceNotFound(invoiceId);
        if (inv.paid) revert InvoiceAlreadyPaid(invoiceId);
        if (inv.expiry != 0 && block.timestamp > inv.expiry) revert InvoiceExpired(invoiceId);

        inv.paid = true;
        inv.payer = payer;

        emit InvoicePaid(invoiceId, payer, inv.amount);
    }

    // ──────────────────────────────────────────────
    //  Configuration
    // ──────────────────────────────────────────────

    /// @notice Set the settlement contract that is allowed to mark invoices paid.
    /// @param _settlementContract Address of the WhitePeSettlement contract.
    function setSettlementContract(address _settlementContract) external onlyOwner {
        if (_settlementContract == address(0)) revert ZeroAddress();
        settlementContract = _settlementContract;
    }

    /// @notice Transfer contract ownership.
    /// @param newOwner Address of the new owner.
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        owner = newOwner;
    }

    // ──────────────────────────────────────────────
    //  View helpers
    // ──────────────────────────────────────────────

    /// @notice Check whether an invoice has been paid.
    /// @param invoiceId Unique invoice identifier.
    /// @return True if the invoice exists and is marked paid.
    function isPaid(bytes32 invoiceId) external view returns (bool) {
        return invoices[invoiceId].paid;
    }

    /// @notice Return the full invoice record.
    /// @param invoiceId Unique invoice identifier.
    /// @return merchantId The merchant ID.
    /// @return amount     The expected payment amount.
    /// @return expiry     The expiry timestamp.
    /// @return paid       Whether the invoice has been paid.
    /// @return payer      The address that paid (address(0) if unpaid).
    function getInvoice(bytes32 invoiceId)
        external
        view
        returns (bytes32 merchantId, uint256 amount, uint256 expiry, bool paid, address payer)
    {
        Invoice storage inv = invoices[invoiceId];
        return (inv.merchantId, inv.amount, inv.expiry, inv.paid, inv.payer);
    }
}
