const { duration, latest } = require('openzeppelin-solidity/test/helpers/time');
const { sendTransaction } = require('openzeppelin-solidity/test/helpers/sendTransaction');
const { soliditySha3, toHex } = require('web3-utils');
const { ZERO_ADDRESS } = require('openzeppelin-solidity/test/helpers/constants');
const parseBignumber = require('./helpers/parseBignumber');
const shouldFail = require('openzeppelin-solidity/test/helpers/shouldFail');
const transactionInfo = require('./helpers/transactionInfo');

const Core = artifacts.require('Core');
const ERC20Token = artifacts.require('ERC20Token');

contract('Core', function(accounts) {
  const creator = accounts[0];
  const transactionData = toHex('testing');
  const assetId = soliditySha3('testing').substring(0, 10);

  beforeEach('create a Core contract instance', async function() {
    this.token = await ERC20Token.new({ from: creator });
    this.core = await Core.new(this.token.address, { from: creator });
  });

  describe('deploy', function() {
    context('when successfull', function() {
      it('sets the token name', async function() {
        assert.equal(parseBignumber(await this.core.name()), 'DDRM');
      });

      it('sets the token short code', async function() {
        assert.equal(parseBignumber(await this.core.symbol()), 'DDRM');
      });

      it('sets the token ERC20 contract instance', async function() {
        assert.equal(parseBignumber(await this.core.token()), this.token.address);
      });

      it('registers the ERC165 interface implementation', async function() {
        assert.equal(await this.core.supportsInterface('0x01ffc9a7'), true);
      });

      it('registers the ERC721 interface implementation', async function() {
        assert.equal(await this.core.supportsInterface('0x80ac58cd'), true);
      });

      it('registers the ERC721Enumerable interface implementation', async function() {
        assert.equal(await this.core.supportsInterface('0x780e9d63'), true);
      });

      it('registers the ERC721Metadata interface implementation', async function() {
        assert.equal(await this.core.supportsInterface('0x5b5e139f'), true);
      });

      it("doesn't issue initial tokens supply", async function() {
        assert.equal(parseBignumber(await this.core.totalSupply()), '0');
      });
    });

    context('when zero address specified as a IERC20 token contract', function() {
      it('reverts', async function() {
        await shouldFail.reverting(Core.new(ZERO_ADDRESS, { from: creator }));
      });
    });
  });

  describe('name', function() {
    it('gets the token name', async function() {
      assert.equal(parseBignumber(await this.core.name()), 'DDRM');
    });
  });

  describe('symbol', function() {
    it('gets the token shord code', async function() {
      assert.equal(parseBignumber(await this.core.symbol()), 'DDRM');
    });
  });

  describe('tokenURI', function() {
    beforeEach('mint a token', async function() {
      await this.core.buyToken(accounts[0], assetId, { from: accounts[0] });
    });

    context('when the specified token exists', function() {
      it('gets the specified token URI', async function() {
        assert.equal(parseBignumber(await this.core.tokenURI(1)), '');
      });
    });

    context("when the specified token doesn't exist", function() {
      it('reverts', async function() {
        await shouldFail.reverting(this.core.tokenURI(2));
      });
    });
  });

  describe('supportsInterface', function() {
    it('gets the specified interface implementation state', async function() {
      assert.equal(await this.core.supportsInterface('0x01ffc9a7'), true);
      assert.equal(await this.core.supportsInterface('0xffffffff'), false);
    });
  });

  describe('totalSupply', function() {
    it('gets the total issued tokens amount', async function() {
      await this.core.buyToken(accounts[0], assetId, { from: accounts[0] });
      assert.equal(parseBignumber(await this.core.totalSupply()), '1');
    });
  });

  describe('token', function() {
    it('gets the IERC20 token contract instance', async function() {
      assert.equal(parseBignumber(await this.core.token()), this.token.address);
    });
  });

  describe('balanceOf', function() {
    context('when successfull', function() {
      it('gets the specified account owned tokens amount', async function() {
        await this.core.buyToken(accounts[0], assetId, { from: accounts[0] });
        assert.equal(parseBignumber(await this.core.balanceOf(accounts[0])), '1');
        assert.equal(parseBignumber(await this.core.balanceOf(accounts[1])), '0');
      });
    });

    context('when zero address specified as a tokens owner', function() {
      it('reverts', async function() {
        await shouldFail.reverting(this.core.balanceOf(ZERO_ADDRESS));
      });
    });
  });

  describe('ownerOf', function() {
    beforeEach('mint token', async function() {
      await this.core.buyToken(accounts[0], assetId, { from: accounts[0] });
    });

    context('when the specified token exists', function() {
      it('gets the specified token owner address', async function() {
        assert.equal(parseBignumber(await this.core.ownerOf(1)), accounts[0]);
      });
    });

    context("when the specified token doesn't exist", function() {
      it('reverts', async function() {
        await shouldFail.reverting(this.core.ownerOf(2));
      });
    });
  });

  describe('getApproved', function() {
    beforeEach('mint and approve tokens', async function() {
      await this.core.buyToken(accounts[0], assetId, { from: accounts[0] });
      await this.core.buyToken(accounts[0], assetId, { from: accounts[0] });
      await this.core.approve(accounts[1], 1, { from: accounts[0] });
    });

    context('when the specified token exists', function() {
      it('gets the specified token approved address', async function() {
        assert.equal(parseBignumber(await this.core.getApproved(1)), accounts[1]);
        assert.equal(parseBignumber(await this.core.getApproved(2)), ZERO_ADDRESS);
      });
    });

    context("when the specified token doesn't exist", function() {
      it('reverts', async function() {
        await shouldFail.reverting(this.core.getApproved(3));
      });
    });
  });

  describe('endTimeOf', function() {
    beforeEach('mint token', async function() {
      await this.core.buyToken(accounts[0], assetId, { from: accounts[0] });
      this.time = await latest();
    });

    context('when the specified token exists', function() {
      it('gets the specified token end time', async function() {
        assert.equal(parseBignumber(await this.core.endTimeOf(1)), this.time + duration.days(30));
      });
    });

    context("when the specified token doesn't exist", function() {
      it('reverts', async function() {
        await shouldFail.reverting(this.core.endTimeOf(2));
      });
    });
  });
});
