import React, { Component } from 'react';
import { buyContent } from './actions';
import { drizzleConnect } from 'drizzle-react';
import { soliditySha3 } from 'web3-utils';
import PropTypes from 'prop-types';

class ChosenModal extends Component {
  constructor(props, { drizzle }) {
    super(props);

    this.DDRMCore = drizzle.contracts.DDRMCore;
    this.ERC20Example = drizzle.contracts.ERC20Example;
  }

  buyToken = async () => {
    try {
      const tokenId = soliditySha3(this.props.chosenItem.id).substring(0, 10);
      const assetPrice = await this.DDRMCore.methods.assetPrice(tokenId).call();

      await this.ERC20Example.methods.approve(this.DDRMCore.address, assetPrice).send();

      await this.DDRMCore.methods.buyToken(this.props.account, tokenId).send();
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <div className="modal">
        <div className="modal-wrapper">
          <div className="descr">
            <span />
          </div>
          <div className="button">
            <button type="button" onClick={this.buyToken}>
              BUY
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  buyContent: id => dispatch(buyContent(id))
});

const mapStateToProps = ({
  accounts: { 0: account },
  items: { contentList, chosenContentId }
}) => ({
  contentList,
  chosenContentId,
  chosenItem: contentList[chosenContentId - 1],
  account
});

ChosenModal.contextTypes = {
  drizzle: PropTypes.object
};

export default drizzleConnect(ChosenModal, mapStateToProps, mapDispatchToProps);
