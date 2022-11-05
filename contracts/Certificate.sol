// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ERC721NonTransferableEnumerable.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract Certificate is Context, ERC721NTEnumarable {
    address public issuer;

    uint256 private _certPtr;
    uint256 private _batchSize = 100;

    struct CertificateData {
        address issuer;
        address recipient;
        bytes32 certHash;
        string CID;
        uint256 issuanceTimestamp;
    }

    mapping(uint256 => CertificateData) private _certData;

    mapping(bytes32 => uint256) private _hashToID;

    struct RevokedStatus {
        bool isRevoked;
        string reason;
    }

    mapping(uint256 => RevokedStatus) private _revokedStatus;

    constructor(
        string memory _name,
        string memory _symbol    
    ) ERC721Nontransferable(_name, _symbol) {
        issuer = msg.sender;
    }

    modifier onlyIssuer() {
        require(_msgSender() == issuer, "ONLY_ISSUER_ALLLOWED");
        _;
    }

    function batchSize() public view returns (uint256) {
        return _batchSize;
    }

    function certData(uint256 _tokenID) public view virtual returns (CertificateData memory) {
        require(!_isRevoked(_tokenID), "CERTIFICATE_REVOKED");
        return _certData[_tokenID];
    }

    function hashToID(bytes32 _certHash) public view returns (uint256) {
        return _hashToID[_certHash];
    }

    function revokedStatus(uint256 _revokedTokenID) public view virtual returns (RevokedStatus memory) {
        return _revokedStatus[_revokedTokenID];
    }

    function changeIssuer(address _newIssuer) public onlyIssuer {
        require(_newIssuer != address(0), "ASSIGN_0_ADDRESS");
        issuer = _newIssuer;
    }

    function revokeCertificate(uint256[] memory _tokenID, string memory _reason) public virtual {
        require(_tokenID.length <= batchSize(), "EXCEED_BATCH_SIZE");
        for (uint i = 0; i < _tokenID.length; i++) {
            require(super._exists(_tokenID[i]), "TOKEN_NOT_EXISTED");
            require(!_isRevoked(_tokenID[i]), "CERTIFICATE_REVOKED");
            require(msg.sender == _certData[_tokenID[i]].issuer, "REVOKER_NOT_ISSUER");

            _revokedStatus[_tokenID[i]] = RevokedStatus({
                isRevoked: true, 
                reason: _reason
            });

            _burn(_tokenID[i]);
        }
    }

    function batchMint(CertificateData[] memory _certificate) public virtual onlyIssuer() {
        require(_certificate.length <= batchSize(), "EXCEED_BATCH_SIZE");

        for (uint256 i = 0; i < _certificate.length; i++) {
            require(!_existHash(_certificate[i].certHash), "CERT_HASH_EXISTED");

            uint256 tokenID = _increaseCertPtr();
            _mint(_certificate[i], tokenID);
        }
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(super._exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory URI = super._baseURI();
        string memory CID = _certData[_tokenId].CID;
        return bytes(URI).length > 0 ? string(abi.encodePacked(URI, CID)) : "";
    }

    function _mint(CertificateData memory _cert, uint256 _tokenID) internal virtual {
        super._mint(_cert.recipient, _tokenID);

        _certData[_tokenID] = _cert;
        _hashToID[_cert.certHash] = _tokenID;
    }

    function _burn(uint256 _tokenID) internal virtual {
        super._burn(_certData[_tokenID].recipient, _tokenID);
    }

    function _isRevoked(uint256 _tokenID) internal view returns (bool) {
        return _revokedStatus[_tokenID].isRevoked;
    }

    function _issuerOf(uint256 _tokenID) internal view returns (address) {
        return _certData[_tokenID].issuer;
    }

    function _existHash(bytes32 _certHash) internal view returns (bool) {
        return (_hashToID[_certHash] != 0);
    }

    function _increaseCertPtr() internal returns (uint256) {
        _certPtr += 1;
        return _certPtr;
    }
}
