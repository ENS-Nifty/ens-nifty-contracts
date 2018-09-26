pragma solidity ^0.4.24;
/* pragma experimental ABIEncoderV2; */

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';
import './Metadata.sol';
import '@ensdomains/ens/contracts/DeedImplementation.sol';
import '@ensdomains/ens/contracts/HashRegistrar.sol';

contract ENSNFT is ERC721Token, Ownable {
    address metadata;
    HashRegistrar registrar;
    constructor (string _name, string _symbol, HashRegistrar _registrar, Metadata _metadata) public
        ERC721Token(_name, _symbol) {
        registrar = _registrar;
        metadata = _metadata;
    }
    function getMetadata() public view returns (address) {
        return metadata;
    }
    // this function uses assembly to delegate a call because it returns a string
    // of variable length
    function tokenURI(uint _tokenId) public view returns (string _infoUrl) {
        address _impl = getMetadata();
        bytes memory data = msg.data;
        assembly {
            let result := delegatecall(gas, _impl, add(data, 0x20), mload(data), 0, 0)
            let size := returndatasize
            let ptr := mload(0x40)
            returndatacopy(ptr, 0, size)
            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
        // this is how it would be done if returning a variable length were allowed outside assembly
        // return Metadata(metadata).tokenMetadata(_tokenId);
    }
    function updateMetadata(Metadata _metadata) public onlyOwner {
        metadata = _metadata;
    }
    function mint(bytes32 _hash) public {
        address deedAddress;
        (, deedAddress, , , ) = registrar.entries(_hash);
        DeedImplementation deed = DeedImplementation(deedAddress);
        require(deed.owner() == address(this));
        require(deed.previousOwner() == msg.sender);
        uint256 tokenId = uint256(_hash); // dont do math on this
        _mint(msg.sender, tokenId);
    }
    function burn(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender);
        _burn(msg.sender, tokenId);
        registrar.transfer(bytes32(tokenId), msg.sender);
    }
}
