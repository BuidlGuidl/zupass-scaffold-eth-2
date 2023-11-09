//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";
import "./Groth16Verifier.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract is Groth16Verifier {
	address public immutable owner;
	string public greeting = "Building Unstoppable Apps!!!";

	constructor(address _owner) {
		owner = _owner;
	}

	modifier isOwner() {
		require(msg.sender == owner, "Not the Owner");
		_;
	}

	function setGreeting(string memory _newGreeting) public payable {
		console.log(
			"Setting new greeting '%s' from %s",
			_newGreeting,
			msg.sender
		);

		greeting = _newGreeting;
	}
}
