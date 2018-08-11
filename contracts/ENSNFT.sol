pragma solidity ^0.4.23;

import 'zeppelin-solidity/contracts/tokens/721/ERC721Token.sol'

contract Resolver {
    function addr(bytes32 node) constant returns(address);
}
contract ENS {
    function owner(bytes32 node) constant returns (address);
    function resolver(bytes32 node) constant returns (Resolver);
    function ttl(bytes32 node) constant returns (uint64);
    function setOwner(bytes32 node, address owner);
    function setSubnodeOwner(bytes32 node, bytes32 label, address owner);
    function setResolver(bytes32 node, address resolver);
    function setTTL(bytes32 node, uint64 ttl);
}
contract ENSNFT is ERC721Token {
    ENS ens;
    mapping(bytes32 => address) recentOwners;
    constructor (string _name, string _symbol, address _ens) public
        ERC721Token(_name, _symbol) {
        ens = ENS(_ens);
    }
    function register(bytes32 rootHash) public {
        address recentOwner = ens.owner(rootHash);
        require(recentOwner != address(this));
        recentOwner[rootHash] = recentOwner;
    }
    function mint(bytes32 rootHash) public {
        require(ens.owner(rootHash) == address(this));
        address lastOwner = recentOwners[rootHash];
        uint256 tokenId = uint256(rootHash);
        _mint(lastOwner, tokenId);
        delete(recentOwner[rootHash]); // here or in burn?
    }
    function burn(bytes32 rootHash) {
        uint256 tokenId = uint256(rootHash);
        require(ownerOf(tokenId) == msg.sender);
        _burn(tokenId);
        ens.setOwner(rootHash, msg.sender);
    }
}
