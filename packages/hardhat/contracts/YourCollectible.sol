//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Groth16Verifier.sol";

/**
 * A smart contract that uses a Groth16 verifier to mint ERC721 tokens.
 * @author BuidlGuidl
 */
contract YourCollectible is ERC721, Groth16Verifier {
	uint256 private _nextTokenId;
	struct ProofArgs {
		uint256[2] _pA;
		uint256[2][2] _pB;
		uint256[2] _pC;
		uint256[38] _pubSignals;
	}

	constructor() ERC721("YourCollectible", "YCB") {}

	function mintItem(address to, ProofArgs calldata proof) public {
		require(
			this.verifyProof(
				proof._pA,
				proof._pB,
				proof._pC,
				proof._pubSignals
			),
			"Invalid proof"
		);
		uint256 tokenId = _nextTokenId++;
		_safeMint(to, tokenId);
	}

	function tokenURI(
		uint256 _tokenId
	) public view override returns (string memory) {
		require(_tokenId < _nextTokenId, "tokenId does not exist");
		return "https://austingriffith.com/images/paintings/buffalo.jpg";
	}
}
