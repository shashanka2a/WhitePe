// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "../src/IERC20.sol";
import {WhitePeSettlement} from "../src/WhitePeSettlement.sol";
import {WhitePeInvoiceRegistry} from "../src/WhitePeInvoiceRegistry.sol";

// ──────────────────────────────────────────────────
//  Mock ERC-20 token for testing
// ──────────────────────────────────────────────────

/// @dev Bare-bones ERC-20 mock used exclusively in tests.
contract MockERC20 is IERC20 {
    string public name = "Mock USDT";
    string public symbol = "mUSDT";
    uint8 public decimals = 6;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    function mint(address to, uint256 amount) external {
        _balances[to] += amount;
    }

    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    function allowance(address _owner, address spender) external view override returns (uint256) {
        return _allowances[_owner][spender];
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        _allowances[msg.sender][spender] = amount;
        return true;
    }

    function transfer(address to, uint256 amount) external override returns (bool) {
        require(_balances[msg.sender] >= amount, "insufficient balance");
        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
        require(_balances[from] >= amount, "insufficient balance");
        require(_allowances[from][msg.sender] >= amount, "insufficient allowance");
        _allowances[from][msg.sender] -= amount;
        _balances[from] -= amount;
        _balances[to] += amount;
        return true;
    }
}

// ──────────────────────────────────────────────────
//  Forge-style test harness (no forge-std dependency)
// ──────────────────────────────────────────────────

/// @dev Minimal test base that mirrors the cheatcodes we need.
///      Foundry injects the `Vm` at 0x7109709ECfa91a80626fF3989D68f67F5b1DD12D.
interface Vm {
    function prank(address sender) external;
    function expectRevert(bytes4 selector) external;
    function startPrank(address sender) external;
    function stopPrank() external;
}

/// @title WhitePeSettlementTest
/// @notice Foundry tests for WhitePeSettlement and WhitePeInvoiceRegistry.
contract WhitePeSettlementTest {
    Vm internal constant vm = Vm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);

    MockERC20 internal token;
    WhitePeSettlement internal settlement;
    WhitePeInvoiceRegistry internal registry;

    address internal owner = address(this);
    address internal payer = address(0xBEEF);
    address internal merchantWallet = address(0xCAFE);
    address internal stranger = address(0xDEAD);

    bytes32 internal merchantId = keccak256("merchant-001");
    bytes32 internal invoiceId = keccak256("invoice-001");

    // ── Setup ────────────────────────────────────

    function setUp() public {
        token = new MockERC20();
        settlement = new WhitePeSettlement(address(token));
        registry = new WhitePeInvoiceRegistry();

        // Wire registry to settlement.
        registry.setSettlementContract(address(settlement));
    }

    // ── Merchant registration ────────────────────

    function test_registerMerchant() public {
        settlement.registerMerchant(merchantId, merchantWallet);
        assert(settlement.merchants(merchantId) == merchantWallet);
    }

    function test_registerMerchant_onlyOwner() public {
        vm.prank(stranger);
        vm.expectRevert(WhitePeSettlement.Unauthorized.selector);
        settlement.registerMerchant(merchantId, merchantWallet);
    }

    function test_registerMerchant_rejectsZeroAddress() public {
        vm.expectRevert(WhitePeSettlement.ZeroAddress.selector);
        settlement.registerMerchant(merchantId, address(0));
    }

    // ── Settlement ───────────────────────────────

    function test_settle() public {
        // Register merchant.
        settlement.registerMerchant(merchantId, merchantWallet);

        // Fund the payer and approve the settlement contract.
        uint256 amount = 100e6; // 100 USDT
        token.mint(payer, amount);
        vm.startPrank(payer);
        token.approve(address(settlement), amount);
        settlement.settle(invoiceId, merchantId, amount);
        vm.stopPrank();

        // Verify merchant received funds.
        assert(token.balanceOf(merchantWallet) == amount);
        assert(token.balanceOf(payer) == 0);

        // Verify invoice marked as settled.
        assert(settlement.settledInvoices(invoiceId) == true);
    }

    function test_settle_duplicateReverts() public {
        settlement.registerMerchant(merchantId, merchantWallet);

        uint256 amount = 50e6;
        token.mint(payer, amount * 2);
        vm.startPrank(payer);
        token.approve(address(settlement), amount * 2);
        settlement.settle(invoiceId, merchantId, amount);

        // Second settlement with the same invoiceId must revert.
        vm.expectRevert(abi.encodeWithSelector(WhitePeSettlement.InvoiceAlreadySettled.selector, invoiceId));
        settlement.settle(invoiceId, merchantId, amount);
        vm.stopPrank();
    }

    function test_settle_unregisteredMerchantReverts() public {
        uint256 amount = 10e6;
        token.mint(payer, amount);
        vm.startPrank(payer);
        token.approve(address(settlement), amount);
        vm.expectRevert(abi.encodeWithSelector(WhitePeSettlement.MerchantNotRegistered.selector, merchantId));
        settlement.settle(invoiceId, merchantId, amount);
        vm.stopPrank();
    }

    function test_settle_zeroAmountReverts() public {
        settlement.registerMerchant(merchantId, merchantWallet);
        vm.prank(payer);
        vm.expectRevert(WhitePeSettlement.ZeroAmount.selector);
        settlement.settle(invoiceId, merchantId, 0);
    }

    // ── Invoice registry ─────────────────────────

    function test_createInvoice() public {
        uint256 amount = 200e6;
        uint256 expiry = block.timestamp + 1 hours;
        registry.createInvoice(invoiceId, merchantId, amount, expiry);

        (bytes32 mId, uint256 amt, uint256 exp, bool paid, address p) = registry.getInvoice(invoiceId);
        assert(mId == merchantId);
        assert(amt == amount);
        assert(exp == expiry);
        assert(!paid);
        assert(p == address(0));
    }

    function test_createInvoice_duplicateReverts() public {
        registry.createInvoice(invoiceId, merchantId, 100e6, block.timestamp + 1 hours);
        vm.expectRevert(abi.encodeWithSelector(WhitePeInvoiceRegistry.InvoiceAlreadyExists.selector, invoiceId));
        registry.createInvoice(invoiceId, merchantId, 100e6, block.timestamp + 1 hours);
    }

    function test_markPaid() public {
        uint256 amount = 100e6;
        registry.createInvoice(invoiceId, merchantId, amount, block.timestamp + 1 hours);
        registry.markPaid(invoiceId, payer);

        assert(registry.isPaid(invoiceId));
    }

    function test_markPaid_onlySettlementOrOwner() public {
        registry.createInvoice(invoiceId, merchantId, 100e6, block.timestamp + 1 hours);

        vm.prank(stranger);
        vm.expectRevert(WhitePeInvoiceRegistry.Unauthorized.selector);
        registry.markPaid(invoiceId, payer);
    }

    // ── Ownership ────────────────────────────────

    function test_transferOwnership() public {
        address newOwner = address(0x1234);
        settlement.transferOwnership(newOwner);
        assert(settlement.owner() == newOwner);
    }
}
