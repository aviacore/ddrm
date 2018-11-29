import React, { Component } from 'react';
import icon4 from '../../img/icon4.png';
import { buyContent, changeTheme, fetchContentList, resetContentChoice } from './actions';
import { drizzleConnect } from 'drizzle-react';
import { soliditySha3 } from 'web3-utils';
import { ContractData } from 'drizzle-react-components';
import PropTypes from 'prop-types';

class ChosenModal extends Component {
  constructor(props, { drizzle }) {
    super(props);

    this.DDRMCore = drizzle.contracts.DDRMCore;
    this.ERC20Example = drizzle.contracts.ERC20Example;
  }

  buyToken = async () => {
    console.log(this.props.account, soliditySha3(this.props.chosenItem.id).substring(0, 10));
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
    const {
      resetContentChoice,
      chosenItem: { name, descr, id }
    } = this.props;

    return (
      <div className="modal">
        <div className="background" onClick={resetContentChoice} />
        <div className="modal-content tile">
          <div className="modal-content-wrapper">
            <div className="name">
              <span>
                <h2>{name}</h2>
              </span>
            </div>

            <div className="hash">
              <span />
            </div>
            <div className="price">
              <div className="icon">
                <img src={icon4} />
              </div>
              <div className="number">
                <ContractData
                  contract="DDRMCore"
                  method="assetPrice"
                  methodArgs={[soliditySha3(id).substring(0, 10)]}
                  hideIndicator
                />
              </div>
            </div>
            <div className="description">
              <h3>About</h3>
              <p>{descr}</p>
            </div>
            <div className="button">
              <button type="button" onClick={this.buyToken}>
                BUY
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchContentList: () => dispatch(fetchContentList()),
  resetContentChoice: () => dispatch(resetContentChoice()),
  changeTheme: () => dispatch(changeTheme()),
  buyContent: id => dispatch(buyContent(id))
});

const mapStateToProps = ({
  accounts: { 0: account },
  items: { contentList, chosenContentId, lightTheme }
}) => ({
  contentList,
  chosenContentId,
  lightTheme,
  chosenItem: contentList[chosenContentId - 1],
  account
});

ChosenModal.contextTypes = {
  drizzle: PropTypes.object
};

export default drizzleConnect(ChosenModal, mapStateToProps, mapDispatchToProps);
