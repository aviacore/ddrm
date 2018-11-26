const { duration, increase, latest } = require('openzeppelin-solidity/test/helpers/time');
const { sendTransaction } = require('openzeppelin-solidity/test/helpers/sendTransaction');
const { soliditySha3, toHex } = require('web3-utils');
const { ZERO_ADDRESS } = require('openzeppelin-solidity/test/helpers/constants');
const parseBignumber = require('./helpers/parseBignumber');
const shouldFail = require('openzeppelin-solidity/test/helpers/shouldFail');
const transactionInfo = require('./helpers/transactionInfo');

const DDRMCore = artifacts.require('DDRMCore');
const ERC20Example = artifacts.require('ERC20Example');
const ERC721Receiver = artifacts.require('ERC721Receiver');

contract('DDRMCore', function(accounts) {
  const creator = accounts[0];
  const transactionData = toHex('testing');
  const assetId = soliditySha3('testing').substring(0, 10);

  const clearsApproval = function() {
    it('sets the token approval to zero address', async function() {
      if (this.tx.logs[0].event == 'Transfer') transactionInfo(this.tx, 4);
      assert.equal(parseBignumber(await this.core.getApproved(1)), ZERO_ADDRESS);
    });
  };

  const addsTokenTo = function() {
    it('increases the token recipient balance', async function() {
      assert.equal(parseBignumber(await this.core.balanceOf(this.to)), '1');
    });

    it('sets the token owner to the specified token recipient', async function() {
      assert.equal(parseBignumber(await this.core.ownerOf(1)), this.to);
    });

    it('adds the token to the specified token recipient ownedTokens array', async function() {
      assert.equal(parseBignumber(await this.core.tokenOfOwnerByIndex(this.to, 0)), '1');
    });
  };

  const removesTokenFrom = function() {
    it('decreases the token owner balance', async function() {
      assert.equal(parseBignumber(await this.core.balanceOf(this.from)), '1');
    });

    it('moves the last token to the sent token position in the specified token owner ownedTokens array', async function() {
      assert.equal(parseBignumber(await this.core.tokenOfOwnerByIndex(this.from, 0)), '2');
    });
  };

  const resets = function() {
    it('resets the token properties', async function() {
      transactionInfo(this.tx, 4);
      await shouldFail.reverting(this.core.ownerOf(1));
      await shouldFail.reverting(this.core.getApproved(1));
      await shouldFail.reverting(this.core.assetOf(1));
      await shouldFail.reverting(this.core.tokenURI(1));
      await shouldFail.reverting(this.core.endTimeOf(1));
    });
  };

  const emitsTransferEvent = function() {
    it('emits a Transfer event', async function() {
      let length, index;
      if (this.tx.logs.length == 1) {
        length = 1;
        index = 0;
      } else if (this.tx.logs.length == 2) {
        length = 2;
        index = 1;
      }
      assert.equal(this.tx.logs.length, length);
      assert.equal(this.tx.logs[index].event, 'Transfer');
      assert.equal(this.tx.logs[index].args.from, this.from);
      assert.equal(this.tx.logs[index].args.to, this.to);
      assert.equal(parseBignumber(this.tx.logs[index].args.tokenId), '1');
    });
  };

  beforeEach('create a Core contract instance', async function() {
    this.token = await ERC20Example.new({ from: creator });
    this.core = await DDRMCore.new(this.token.address, { from: creator });
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

    context('when zero address specified as an IERC20 token contract', function() {
      it('reverts', async function() {
        await shouldFail.reverting(DDRMCore.new(ZERO_ADDRESS, { from: creator }));
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
      await this.core.buyToken(accounts[0], assetId);
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
    context('when successfull', function() {
      it('gets the specified interface implementation state', async function() {
        assert.equal(await this.core.supportsInterface('0x01ffc9a7'), true);
        assert.equal(await this.core.supportsInterface(assetId), false);
      });
    });

    context('when the invalid interface ID specified (0xffffffff)', function() {
      it('returns false', async function() {
        assert.equal(await this.core.supportsInterface('0xffffffff'), false);
      });
    });
  });

  describe('totalSupply', function() {
    it('gets the total issued tokens amount', async function() {
      await this.core.buyToken(accounts[0], assetId);
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
        await this.core.buyToken(accounts[0], assetId);
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
      await this.core.buyToken(accounts[0], assetId);
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
      await this.core.buyToken(accounts[0], assetId);
      await this.core.buyToken(accounts[0], assetId);
      await this.core.approve(accounts[1], 1);
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
      await this.core.buyToken(accounts[0], assetId);
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

  describe('assetOf', function() {
    beforeEach('mint token', async function() {
      await this.core.buyToken(accounts[0], assetId);
    });

    context('when the specified token exists', function() {
      it('gets the specified token end time', async function() {
        assert.equal(parseBignumber(await this.core.assetOf(1)), assetId);
      });
    });

    context("when the specified token doesn't exist", function() {
      it('reverts', async function() {
        await shouldFail.reverting(this.core.assetOf(2));
      });
    });
  });

  describe('tokenByIndex', function() {
    beforeEach('mint token', async function() {
      await this.core.buyToken(accounts[0], assetId);
    });

    context('when successfull', function() {
      it('gets the token ID that is at the specified index in the allTokens array', async function() {
        assert.equal(parseBignumber(await this.core.tokenByIndex(0)), '1');
      });
    });

    context(
      'when the specified index is equal or greater than the total tokens supply',
      function() {
        it('reverts', async function() {
          await shouldFail.reverting(this.core.tokenByIndex(1));
          await shouldFail.reverting(this.core.tokenByIndex(2));
        });
      }
    );
  });

  describe('assetPrice', function() {
    beforeEach('set an asset price', async function() {
      await this.core.setAssetPrice(assetId, 721);
    });

    context('when successfull', function() {
      it('gets the specified asset price', async function() {
        assert.equal(parseBignumber(await this.core.assetPrice(assetId)), '721');
        assert.equal(
          parseBignumber(await this.core.assetPrice(soliditySha3('production').substring(0, 10))),
          '0'
        );
      });
    });

    context('when the invalid asset ID specified (0xffffffff)', function() {
      it('returns 0', async function() {
        assert.equal(parseBignumber(await this.core.assetPrice('0xffffffff')), '0');
      });
    });
  });

  describe('isApprovedForAll', function() {
    it('gets the specified accounts operator approval state', async function() {
      await this.core.setApprovalForAll(accounts[1], true);
      assert.equal(await this.core.isApprovedForAll(accounts[0], accounts[1]), true);
      assert.equal(await this.core.isApprovedForAll(accounts[1], accounts[0]), false);
    });
  });

  describe('tokenOfOwnerByIndex', function() {
    beforeEach('mint token', async function() {
      await this.core.buyToken(accounts[0], assetId);
    });

    context('when successfull', function() {
      it('gets the token ID that is at the specified index in the specified account ownedTokens array', async function() {
        assert.equal(parseBignumber(await this.core.tokenOfOwnerByIndex(accounts[0], 0)), '1');
      });
    });

    context('when zero address specified as a token owner', function() {
      it('reverts', async function() {
        await shouldFail.reverting(this.core.tokenOfOwnerByIndex(ZERO_ADDRESS, 0));
      });
    });

    context(
      'when the specified index is equal or greater than the account owned tokens amount',
      function() {
        it('reverts', async function() {
          await shouldFail.reverting(this.core.tokenOfOwnerByIndex(accounts[0], 1));
          await shouldFail.reverting(this.core.tokenOfOwnerByIndex(accounts[0], 2));
        });
      }
    );
  });

  describe('approve', function() {
    context('when the msg.sender is a token owner', function() {
      beforeEach('mint and approve token', async function() {
        await this.core.buyToken(accounts[0], assetId);
        this.tx = await this.core.approve(accounts[1], 1);
      });

      it('sets the specified token approved address', async function() {
        transactionInfo(this.tx, 4);
        assert.equal(parseBignumber(await this.core.getApproved(1)), accounts[1]);
      });

      it('emits an Approval event', async function() {
        assert.equal(this.tx.logs.length, 1);
        assert.equal(this.tx.logs[0].event, 'Approval');
        assert.equal(this.tx.logs[0].args.owner, accounts[0]);
        assert.equal(this.tx.logs[0].args.approved, accounts[1]);
        assert.equal(parseBignumber(this.tx.logs[0].args.tokenId), '1');
      });
    });

    context('when the msg.sender is an operator of the specified token owner', function() {
      beforeEach('mint and approve token', async function() {
        await this.core.buyToken(accounts[0], assetId);
        await this.core.setApprovalForAll(accounts[1], true);
        this.tx = await this.core.approve(accounts[1], 1, { from: accounts[1] });
      });

      it('sets the specified token approved address', async function() {
        transactionInfo(this.tx, 4);
        assert.equal(parseBignumber(await this.core.getApproved(1)), accounts[1]);
      });

      it('emits an Approval event', async function() {
        assert.equal(this.tx.logs.length, 1);
        assert.equal(this.tx.logs[0].event, 'Approval');
        assert.equal(this.tx.logs[0].args.owner, accounts[0]);
        assert.equal(this.tx.logs[0].args.approved, accounts[1]);
        assert.equal(parseBignumber(this.tx.logs[0].args.tokenId), '1');
      });
    });

    context('when the token owner address specified as a token spender', function() {
      it('reverts', async function() {
        await this.core.buyToken(accounts[0], assetId);
        await shouldFail.reverting(this.core.approve(accounts[0], 1));
      });
    });

    context("when the msg.sender isn't owner or operator of the specified token", function() {
      it('reverts', async function() {
        await this.core.buyToken(accounts[0], assetId);
        await shouldFail.reverting(this.core.approve(accounts[1], 1, { from: accounts[1] }));
      });
    });
  });

  describe('setApprovalForAll', function() {
    context('when successfull', function() {
      beforeEach('set an operator approval', async function() {
        this.tx = await this.core.setApprovalForAll(accounts[1], true);
      });

      it('sets the specified accounts operator approval', async function() {
        transactionInfo(this.tx, 4);
        assert.equal(await this.core.isApprovedForAll(accounts[0], accounts[1]), true);
      });

      it('emits an ApprovalForAll event', async function() {
        assert.equal(this.tx.logs.length, 1);
        assert.equal(this.tx.logs[0].event, 'ApprovalForAll');
        assert.equal(this.tx.logs[0].args.owner, accounts[0]);
        assert.equal(this.tx.logs[0].args.operator, accounts[1]);
        assert.equal(this.tx.logs[0].args.approved, true);
      });
    });

    context('when zero address specified as an operator', function() {
      it('reverts', async function() {
        await shouldFail.reverting(this.core.setApprovalForAll(ZERO_ADDRESS, true));
      });
    });
  });

  describe('transferFrom', function() {
    context('when the msg.sender is a specified token owner', function() {
      beforeEach('mint and transfer token', async function() {
        for (let i = 0; i < 2; i++) await this.core.buyToken(accounts[0], assetId);
        this.tx = await this.core.transferFrom(accounts[0], accounts[1], 1);
        this.from = accounts[0];
        this.to = accounts[1];
      });

      clearsApproval();
      addsTokenTo();
      removesTokenFrom();
      emitsTransferEvent();
    });

    context('when the msg.sender is a specified token approval', function() {
      beforeEach('mint and transfer token', async function() {
        for (let i = 0; i < 2; i++) await this.core.buyToken(accounts[0], assetId);
        await this.core.approve(accounts[1], 1);
        this.tx = await this.core.transferFrom(accounts[0], accounts[1], 1, { from: accounts[1] });
        this.from = accounts[0];
        this.to = accounts[1];
      });

      clearsApproval();
      addsTokenTo();
      removesTokenFrom();
      emitsTransferEvent();
    });

    context('when the msg.sender is a specified token owner operator', function() {
      beforeEach('mint and transfer token', async function() {
        for (let i = 0; i < 2; i++) await this.core.buyToken(accounts[0], assetId);
        await this.core.setApprovalForAll(accounts[1], true);
        this.tx = await this.core.transferFrom(accounts[0], accounts[1], 1, { from: accounts[1] });
        this.from = accounts[0];
        this.to = accounts[1];
      });

      clearsApproval();
      addsTokenTo();
      removesTokenFrom();
      emitsTransferEvent();
    });

    context("when the specified address isn't owner of the specified token", function() {
      it('reverts', async function() {
        await this.core.buyToken(accounts[0], assetId);
        await shouldFail.reverting(
          this.core.transferFrom(accounts[1], accounts[1], 1, {
            from: accounts[0]
          })
        );
      });
    });

    context('when zero address specified as a token recipient', function() {
      it('reverts', async function() {
        await this.core.buyToken(accounts[0], assetId);
        await shouldFail.reverting(
          this.core.transferFrom(accounts[0], ZERO_ADDRESS, 1, {
            from: accounts[0]
          })
        );
      });
    });

    context("when the specified token doesn't exist", function() {
      it('reverts', async function() {
        await shouldFail.reverting(
          this.core.transferFrom(accounts[0], accounts[1], 1, {
            from: accounts[0]
          })
        );
      });
    });

    context(
      "when the msg.sender isn't owner, approval or operator of the specified token",
      function() {
        it('reverts', async function() {
          await this.core.buyToken(accounts[0], assetId);
          await shouldFail.reverting(
            this.core.transferFrom(accounts[0], accounts[1], 1, {
              from: accounts[1]
            })
          );
        });
      }
    );
  });

  describe('safeTransferFrom', function() {
    context(
      'when the token recipient is a contract that implements the IERC721Receiver interface',
      function() {
        beforeEach('mint and transfer token', async function() {
          for (let i = 0; i < 2; i++) await this.core.buyToken(accounts[0], assetId);
          this.receiver = await ERC721Receiver.new({ from: creator });
          this.tx = await sendTransaction(
            this.core,
            'safeTransferFrom',
            'address,address,uint256',
            [accounts[0], this.receiver.address, 1]
          );
          this.from = accounts[0];
          this.to = this.receiver.address;
        });

        clearsApproval();
        addsTokenTo();
        removesTokenFrom();
        emitsTransferEvent();
      }
    );

    context('when the msg.sender is a specified token owner', function() {
      beforeEach('mint and transfer token', async function() {
        for (let i = 0; i < 2; i++) await this.core.buyToken(accounts[0], assetId);
        this.tx = await sendTransaction(this.core, 'safeTransferFrom', 'address,address,uint256', [
          accounts[0],
          accounts[1],
          1
        ]);
        this.from = accounts[0];
        this.to = accounts[1];
      });

      clearsApproval();
      addsTokenTo();
      removesTokenFrom();
      emitsTransferEvent();
    });

    context('when the msg.sender is a specified token approval', function() {
      beforeEach('mint and transfer token', async function() {
        for (let i = 0; i < 2; i++) await this.core.buyToken(accounts[0], assetId);
        await this.core.approve(accounts[1], 1);
        this.tx = await sendTransaction(
          this.core,
          'safeTransferFrom',
          'address,address,uint256',
          [accounts[0], accounts[1], 1],
          { from: accounts[1] }
        );
        this.from = accounts[0];
        this.to = accounts[1];
      });

      clearsApproval();
      addsTokenTo();
      removesTokenFrom();
      emitsTransferEvent();
    });

    context('when the msg.sender is a specified token owner operator', function() {
      beforeEach('mint and transfer token', async function() {
        for (let i = 0; i < 2; i++) await this.core.buyToken(accounts[0], assetId);
        await this.core.setApprovalForAll(accounts[1], true);
        this.tx = await sendTransaction(
          this.core,
          'safeTransferFrom',
          'address,address,uint256',
          [accounts[0], accounts[1], 1],
          { from: accounts[1] }
        );
        this.from = accounts[0];
        this.to = accounts[1];
      });

      clearsApproval();
      addsTokenTo();
      removesTokenFrom();
      emitsTransferEvent();
    });

    context("when the specified address isn't owner of the specified token", function() {
      it('reverts', async function() {
        await this.core.buyToken(accounts[0], assetId);
        await shouldFail.reverting(
          sendTransaction(this.core, 'safeTransferFrom', 'address,address,uint256', [
            accounts[1],
            accounts[1],
            1
          ])
        );
      });
    });

    context(
      "when the token recipient is a contract that doesn't implement the IERC721Receiver interface",
      function() {
        it('reverts', async function() {
          await this.core.buyToken(accounts[0], assetId);
          await shouldFail.reverting(
            sendTransaction(this.core, 'safeTransferFrom', 'address,address,uint256', [
              accounts[0],
              this.core.address,
              1
            ])
          );
        });
      }
    );

    context('when zero address specified as a token recipient', function() {
      it('reverts', async function() {
        await this.core.buyToken(accounts[0], assetId);
        await shouldFail.reverting(
          sendTransaction(this.core, 'safeTransferFrom', 'address,address,uint256', [
            accounts[0],
            ZERO_ADDRESS,
            1
          ])
        );
      });
    });

    context("when the specified token doesn't exist", function() {
      it('reverts', async function() {
        await shouldFail.reverting(
          sendTransaction(this.core, 'safeTransferFrom', 'address,address,uint256', [
            accounts[0],
            accounts[1],
            1
          ])
        );
      });
    });

    context(
      "when the msg.sender isn't owner, approval or operator of the specified token",
      function() {
        it('reverts', async function() {
          await this.core.buyToken(accounts[0], assetId);
          await shouldFail.reverting(
            sendTransaction(
              this.core,
              'safeTransferFrom',
              'address,address,uint256',
              [accounts[0], accounts[1], 1],
              { from: accounts[1] }
            )
          );
        });
      }
    );
  });

  describe('safeTransferFrom (overloaded, with additional transaction metadata)', function() {
    context(
      'when the token recipient is a contract that implements the IERC721Receiver interface',
      function() {
        beforeEach('mint and transfer token', async function() {
          for (let i = 0; i < 2; i++) await this.core.buyToken(accounts[0], assetId);
          this.receiver = await ERC721Receiver.new({ from: creator });
          this.tx = await sendTransaction(
            this.core,
            'safeTransferFrom',
            'address,address,uint256,bytes',
            [accounts[0], this.receiver.address, 1, transactionData]
          );
          this.from = accounts[0];
          this.to = this.receiver.address;
        });

        clearsApproval();
        addsTokenTo();
        removesTokenFrom();
        emitsTransferEvent();
      }
    );

    context('when the msg.sender is a specified token owner', function() {
      beforeEach('mint and transfer token', async function() {
        for (let i = 0; i < 2; i++) await this.core.buyToken(accounts[0], assetId);
        this.tx = await sendTransaction(
          this.core,
          'safeTransferFrom',
          'address,address,uint256,bytes',
          [accounts[0], accounts[1], 1, transactionData]
        );
        this.from = accounts[0];
        this.to = accounts[1];
      });

      clearsApproval();
      addsTokenTo();
      removesTokenFrom();
      emitsTransferEvent();
    });

    context('when the msg.sender is a specified token approval', function() {
      beforeEach('mint and transfer token', async function() {
        for (let i = 0; i < 2; i++) await this.core.buyToken(accounts[0], assetId);
        await this.core.approve(accounts[1], 1);
        this.tx = await sendTransaction(
          this.core,
          'safeTransferFrom',
          'address,address,uint256,bytes',
          [accounts[0], accounts[1], 1, transactionData],
          { from: accounts[1] }
        );
        this.from = accounts[0];
        this.to = accounts[1];
      });

      clearsApproval();
      addsTokenTo();
      removesTokenFrom();
      emitsTransferEvent();
    });

    context('when the msg.sender is a specified token owner operator', function() {
      beforeEach('mint and transfer token', async function() {
        for (let i = 0; i < 2; i++) await this.core.buyToken(accounts[0], assetId);
        await this.core.setApprovalForAll(accounts[1], true);
        this.tx = await sendTransaction(
          this.core,
          'safeTransferFrom',
          'address,address,uint256,bytes',
          [accounts[0], accounts[1], 1, transactionData],
          { from: accounts[1] }
        );
        this.from = accounts[0];
        this.to = accounts[1];
      });

      clearsApproval();
      addsTokenTo();
      removesTokenFrom();
      emitsTransferEvent();
    });

    context("when the specified address isn't owner of the specified token", function() {
      it('reverts', async function() {
        await this.core.buyToken(accounts[0], assetId);
        await shouldFail.reverting(
          sendTransaction(this.core, 'safeTransferFrom', 'address,address,uint256,bytes', [
            accounts[1],
            accounts[1],
            1,
            transactionData
          ])
        );
      });
    });

    context(
      "when the token recipient is a contract that doesn't implement the IERC721Receiver interface",
      function() {
        it('reverts', async function() {
          await this.core.buyToken(accounts[0], assetId);
          await shouldFail.reverting(
            sendTransaction(this.core, 'safeTransferFrom', 'address,address,uint256,bytes', [
              accounts[0],
              this.core.address,
              1,
              transactionData
            ])
          );
        });
      }
    );

    context('when zero address specified as a token recipient', function() {
      it('reverts', async function() {
        await this.core.buyToken(accounts[0], assetId);
        await shouldFail.reverting(
          sendTransaction(this.core, 'safeTransferFrom', 'address,address,uint256,bytes', [
            accounts[0],
            ZERO_ADDRESS,
            1,
            transactionData
          ])
        );
      });
    });

    context("when the specified token doesn't exist", function() {
      it('reverts', async function() {
        await shouldFail.reverting(
          sendTransaction(this.core, 'safeTransferFrom', 'address,address,uint256,bytes', [
            accounts[0],
            accounts[1],
            1,
            transactionData
          ])
        );
      });
    });

    context(
      "when the msg.sender isn't owner, approval or operator of the specified token",
      function() {
        it('reverts', async function() {
          await this.core.buyToken(accounts[0], assetId);
          await shouldFail.reverting(
            sendTransaction(
              this.core,
              'safeTransferFrom',
              'address,address,uint256,bytes',
              [accounts[0], accounts[1], 1, transactionData],
              { from: accounts[1] }
            )
          );
        });
      }
    );
  });

  describe('burn', function() {
    context('when the msg.sender is a specified token owner', function() {
      beforeEach('mint and burn token', async function() {
        for (let i = 0; i < 2; i++) await this.core.buyToken(accounts[0], assetId);
        this.tx = await this.core.burn(1);
        this.from = accounts[0];
        this.to = ZERO_ADDRESS;
      });

      resets();
      removesTokenFrom();
      emitsTransferEvent();
    });

    context('when the msg.sender is a specified token approval', function() {
      beforeEach('mint and burn token', async function() {
        for (let i = 0; i < 2; i++) await this.core.buyToken(accounts[0], assetId);
        await this.core.approve(accounts[1], 1);
        this.tx = await this.core.burn(1, { from: accounts[1] });
        this.from = accounts[0];
        this.to = ZERO_ADDRESS;
      });

      resets();
      removesTokenFrom();
      emitsTransferEvent();
    });

    context('when the msg.sender is a specified token owner operator', function() {
      beforeEach('mint and burn token', async function() {
        for (let i = 0; i < 2; i++) await this.core.buyToken(accounts[0], assetId);
        await this.core.setApprovalForAll(accounts[1], true);
        this.tx = await this.core.burn(1, { from: accounts[1] });
        this.from = accounts[0];
        this.to = ZERO_ADDRESS;
      });

      resets();
      removesTokenFrom();
      emitsTransferEvent();
    });

    context("when the specified token doesn't exist", function() {
      it('reverts', async function() {
        await shouldFail.reverting(this.core.burn(1));
      });
    });

    context(
      "when the msg.sender isn't owner, approval or operator of the specified token",
      function() {
        it('reverts', async function() {
          await this.core.buyToken(accounts[0], assetId);
          await shouldFail.reverting(this.core.burn(1, { from: accounts[1] }));
        });
      }
    );
  });

  describe('buyToken', function() {
    context('when successfull', function() {
      beforeEach('buy token', async function() {
        await this.token.mint(accounts[0], 20, { from: creator });
        await this.token.approve(this.core.address, 20);
        await this.core.setAssetPrice(assetId, 20, { from: creator });
        this.tx = await this.core.buyToken(accounts[0], assetId);
        this.from = ZERO_ADDRESS;
        this.to = accounts[0];
      });

      it('transfers the ERC20 tokens payment to the core contract', async function() {
        assert.equal(parseBignumber(await this.token.balanceOf(accounts[0])), '0');
        assert.equal(parseBignumber(await this.token.balanceOf(this.core.address)), '20');
      });

      addsTokenTo();
      emitsTransferEvent();
    });

    context('when zero address specified as a token recipient', function() {
      it('reverts', async function() {
        await shouldFail.reverting(this.core.buyToken(ZERO_ADDRESS, assetId));
      });
    });

    context(
      "when the msg.sender doesn't allow the DDRMCore contract to spend the specified asset price ERC20 tokens amount",
      function() {
        it('reverts', async function() {
          await this.token.mint(accounts[0], 20, { from: creator });
          await this.core.setAssetPrice(assetId, 20, { from: creator });
          await shouldFail.reverting(this.core.buyToken(accounts[0], assetId));
        });
      }
    );
  });

  describe('withdraw', function() {
    context('when successfull', function() {
      beforeEach('transfer tokens', async function() {
        await this.token.mint(accounts[0], 30, { from: creator });
        await this.token.transfer(this.core.address, 30);
        this.tx = await this.core.withdraw({ from: creator });
      });

      it('transfers all owned by the contract ERC20 tokens to the owner', async function() {
        assert.equal(parseBignumber(await this.token.balanceOf(this.core.address)), '0');
        assert.equal(parseBignumber(await this.token.balanceOf(creator)), '30');
      });
    });

    context("when the contract doesn't own any tokens", function() {
      it('reverts', async function() {
        await shouldFail.reverting(this.core.withdraw({ from: creator }));
      });
    });

    context("when the msg.sender isn't contract owner", function() {
      it('reverts', async function() {
        await this.token.mint(accounts[0], 30, { from: creator });
        await this.token.transfer(this.core.address, 30);
        await shouldFail.reverting(this.core.withdraw({ from: accounts[1] }));
      });
    });
  });

  describe('revokeToken', function() {
    context('when successfull', function() {
      beforeEach('mint a token', async function() {
        for (let i = 0; i < 2; i++)
          await this.core.buyToken(accounts[1], assetId, { from: accounts[1] });
        await increase(duration.days(31));
        this.tx = await this.core.revokeToken(1, { from: creator });
        this.from = accounts[1];
        this.to = creator;
      });

      clearsApproval();
      addsTokenTo();
      removesTokenFrom();
      emitsTransferEvent();
    });

    context('when the specified token is still valid', function() {
      it('reverts', async function() {
        await this.core.buyToken(accounts[1], assetId, { from: accounts[1] });
        await shouldFail.reverting(this.core.revokeToken(1, { from: creator }));
      });
    });

    context("when the msg.sender isn't contract owner", function() {
      it('reverts', async function() {
        await this.core.buyToken(accounts[1], assetId, { from: accounts[1] });
        await increase(duration.days(31));
        await shouldFail.reverting(this.core.revokeToken(1, { from: accounts[1] }));
      });
    });
  });

  describe('setAssetPrice', function() {
    context('when successfull', function() {
      it('sets the specified asset price', async function() {
        this.tx = await this.core.setAssetPrice(assetId, 721, { from: creator });
        assert.equal(parseBignumber(await this.core.assetPrice(assetId)), '721');
      });
    });

    context('when invalid asset ID specified (0xffffffff)', function() {
      it('reverts', async function() {
        await shouldFail.reverting(this.core.setAssetPrice('0xffffffff', 721, { from: creator }));
      });
    });

    context("when the msg.sender isn't contract owner", function() {
      it('reverts', async function() {
        await shouldFail.reverting(this.core.setAssetPrice(assetId, 721, { from: accounts[1] }));
      });
    });
  });
});
