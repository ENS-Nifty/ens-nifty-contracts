pragma solidity ^0.4.18;
import '@ensdomains/ens/contracts/HashRegistrarSimplified.sol';

contract TestRegistrar is Registrar {
    function TestRegistrar(ENS _ens, bytes32 _rootNode, uint256 startDate) public
        Registrar(_ens, _rootNode, startDate){}
        uint32 constant totalAuctionLength = 0;
        uint32 constant revealPeriod = 48 hours;
        uint32 public constant launchLength = 0;
        uint constant minPrice = 0;
}
