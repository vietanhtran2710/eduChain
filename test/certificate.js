const { soliditySha3 } = require("web3-utils");
let cert = artifacts.require("./Certificate.sol");
let certInstance;

contract('Certificate', function (accounts) {
    it("Contracts deployment", function() {
        return cert.deployed().then(function(instance) {
            certInstance = instance;
            assert(certInstance != undefined, "Certificate contract should be defined/deployed");
            return certInstance.issuer.call({from: accounts[0]})
        })
        .then(function(result) {
            assert.equal(accounts[0], result, "Wrong issuer address")
            return certInstance.name.call({from: accounts[0]})
        })
        .then(function(result) {
            assert.equal("Certificate", result, "Wrong token name")
            return certInstance.symbol.call({from: accounts[0]})
        })
        .then(function(result) {
            assert.equal("CERT", result, "Wrong token Symbol")
        })
    });

    it("Create single certificate by issuer", async function() {
        let timestamp = Math.floor(Date.now() / 1000)
        let hash = soliditySha3(accounts[1] + ";" + accounts[3] + ";1;" + timestamp.toString())
        certData = [{
            issuer: accounts[1],
            recipient: accounts[3],
            certHash: hash,
            CID: "1",
            issuanceTimestamp: timestamp
        }]
        await certInstance.batchMint(certData, {from: accounts[0]})
        return certInstance.totalSupply({from: accounts[0]})
        .then(function(result) {
            assert.equal(1, result, "Total number of certificates/token should be 1");
            return certInstance.hashToID(hash, {from: accounts[0]})
        })
        .then(function(result) {
            assert.equal(1, result, "TokenID of the hash should be 1");
            return certInstance.certData(result, {from: accounts[0]})
        })
        .then(function(result) {
            assert.equal(certData[0].issuer, result[0], "Wrong certificate issuer");
            assert.equal(certData[0].recipient, result[1], "Wrong certificate recipient");
            assert.equal(certData[0].certHash, result[2], "Wrong certificate hash");
            assert.equal(certData[0].CID, result[3], "Wrong certificate CID");
            assert.equal(certData[0].issuanceTimestamp, result[4], "Wrong certificate timestamp");
            return certInstance.balanceOf(accounts[3], {from: accounts[0]})
        })
        .then(function(result) {
            assert.equal(1, result, "Balance of recipient should be 1");
        })
    })

    it("Create multiple certificate by delegated signer", async function() {
        certData = [
            {
                issuer: accounts[1],
                recipient: accounts[3],
                issuanceTimestamp: Math.floor(Date.now() / 1000),
                CID: "2",
                get certHash() {
                    return soliditySha3(accounts[1] + ";" + accounts[4] + ";2;" + this.issuanceTimestamp.toString())
                }
            },
            {
                issuer: accounts[1],
                recipient: accounts[4],
                CID: "3",
                issuanceTimestamp: Math.floor(Date.now() / 1000),
                get certHash() {
                    return soliditySha3(accounts[1] + ";" + accounts[5] + ";3;" + this.issuanceTimestamp.toString())
                } 
            },
            {
                issuer: accounts[1],
                recipient: accounts[5],
                CID: "4",
                issuanceTimestamp: Math.floor(Date.now() / 1000),
                get certHash() {
                    return soliditySha3(accounts[1] + ";" + accounts[6] + ";4;" + this.issuanceTimestamp.toString())
                }
            }
        ]
        await certInstance.batchMint(certData, {from: accounts[0]})
        return certInstance.totalSupply({from: accounts[0]})
        .then(function(result) {
            assert.equal(4, result, "Total number of certificates/token should be 4");
            return certInstance.balanceOf(accounts[3], {from: accounts[0]})
        })
        .then(function(result) {
            assert.equal(2, result, "Balance of recipient should be 2");
            return certInstance.balanceOf(accounts[4], {from: accounts[0]})
        })
        .then(function(result) {
            assert.equal(1, result, "Balance of recipient should be 1");
            return certInstance.balanceOf(accounts[5], {from: accounts[0]})
        })
        .then(function(result) {
            assert.equal(1, result, "Balance of recipient should be 1");
            return certInstance.tokenOfOwnerByIndex(accounts[3], 1)
        })
        .then(function(result) {
            assert.equal(2, result, "TokenID of recipient should be 2");
            return certInstance.tokenOfOwnerByIndex(accounts[5], 0)
        })
        .then(function(result) {
            assert.equal(4, result, "TokenID of recipient should be 2");
        })
    })

    it("Revoke certificate", async function() {
        await certInstance.revokeCertificate([3, 4], "Cheating detected", {from: accounts[1]});
        return certInstance.revokedStatus(3, {from: accounts[1]})
        .then(function(result) {
            assert.equal(true, result[0], "Revoked status shoule be true");
            assert.equal("Cheating detected", result[1], "Reason should be 'Cheating detected'");
            return certInstance.revokedStatus(4, {from: accounts[0]})
        })
        .then(function(result) {
            assert.equal(true, result[0], "Revoked status shoule be true");
            assert.equal("Cheating detected", result[1], "Reason should be 'Cheating detected'");
        })
    })

    it("Account doesn't have permission to sign certificate", function() {
        return certInstance.revokeCertificate([1, 2], "Cheating detected", {from: accounts[0]})
        .then(function(result) {
            throw("Condition not implemented in smart contract, only issuer or delegated signer can revoke certificates");
        })
        .catch(function(e) {
            if (e === "Condition not implemented in smart contract, only issuer or delegated signer can revoke certificates") {
                assert(false);
            }
            else {
                assert(true);
            }
        })
    })
    
});