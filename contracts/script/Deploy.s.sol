// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {WhitePeSettlement} from "../src/WhitePeSettlement.sol";
import {WhitePeInvoiceRegistry} from "../src/WhitePeInvoiceRegistry.sol";

/// @dev Minimal interface for Foundry's Script base.
///      We avoid importing forge-std to keep the project dependency-free.
abstract contract Script {
    address internal constant VM_ADDRESS = 0x7109709ECfa91a80626fF3989D68f67F5b1DD12D;

    function vm_startBroadcast() internal {
        (bool ok,) = VM_ADDRESS.call(abi.encodeWithSignature("startBroadcast()"));
        require(ok, "startBroadcast failed");
    }

    function vm_stopBroadcast() internal {
        (bool ok,) = VM_ADDRESS.call(abi.encodeWithSignature("stopBroadcast()"));
        require(ok, "stopBroadcast failed");
    }

    function vm_envAddress(string memory key) internal returns (address) {
        (bool ok, bytes memory data) = VM_ADDRESS.call(abi.encodeWithSignature("envAddress(string)", key));
        require(ok, "envAddress failed");
        return abi.decode(data, (address));
    }

    function console_log(string memory msg1) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string)", msg1));
    }

    function console_log(string memory msg1, address val) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address)", msg1, val));
    }

    function _sendLogPayload(bytes memory payload) private pure {
        address CONSOLE_ADDRESS = 0x000000000000000000636F6e736F6c652e6c6f67;
        /// @solidity memory-safe-assembly
        assembly {
            pop(staticcall(gas(), CONSOLE_ADDRESS, add(payload, 32), mload(payload), 0, 0))
        }
    }
}

/// @title Deploy
/// @notice Foundry deployment script for WhitePe contracts on Whitechain.
/// @dev Usage:
///   USDT_ADDRESS=0x... forge script script/Deploy.s.sol \
///       --rpc-url whitechain_sepolia --broadcast --private-key $PK
contract Deploy is Script {
    function run() external {
        // Read the USDT token address from the environment.
        address usdtAddress = vm_envAddress("USDT_ADDRESS");

        vm_startBroadcast();

        // 1. Deploy settlement contract.
        WhitePeSettlement settlement = new WhitePeSettlement(usdtAddress);
        console_log("WhitePeSettlement deployed at:", address(settlement));

        // 2. Deploy invoice registry.
        WhitePeInvoiceRegistry registry = new WhitePeInvoiceRegistry();
        console_log("WhitePeInvoiceRegistry deployed at:", address(registry));

        // 3. Wire: allow settlement contract to mark invoices as paid.
        registry.setSettlementContract(address(settlement));
        console_log("Settlement contract wired to registry");

        vm_stopBroadcast();

        console_log("--- Deployment complete ---");
    }
}
