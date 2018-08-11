pragma solidity ^0.4.23;

import 'zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';

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
    function register(bytes32 node) public {
        address currentOwner = ens.owner(node);
        require(currentOwner != address(this));
        recentOwners[node] = currentOwner;
    }
    function mint(bytes32 node) public {
        require(ens.owner(node) == address(this));
        address lastOwner = recentOwners[node];
        uint256 tokenId = uint256(node); // big endian little endian problem?
        _mint(lastOwner, tokenId);
        delete(recentOwners[node]); // here or in burn?
    }
    function burn(bytes32 node) {
        uint256 tokenId = uint256(node);
        require(ownerOf(tokenId) == msg.sender);
        _burn(msg.sender, tokenId);
        ens.setOwner(node, msg.sender);
    }
}
