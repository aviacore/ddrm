import React, { Component } from 'react';
import icon4 from '../../img/icon4.png';
import { buyContent, changeTheme, fetchContentList, resetContentChoice } from './actions';
import { drizzleConnect } from 'drizzle-react';
import { soliditySha3 } from 'web3-utils';
import { ContractData } from 'drizzle-react-components';

class ChosenModal extends Component {
  constructor() {
    super();
  }

  render() {
    const { contentList, resetContentChoice, chosenContentId, buyContent } = this.props;

    const { name, descr, id } = contentList[chosenContentId - 1];

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
              <button type="button" onClick={buyContent}>
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

const mapStateToProps = ({ items: { contentList, chosenContentId, lightTheme } }) => ({
  contentList,
  chosenContentId,
  lightTheme
});

export default drizzleConnect(ChosenModal, mapStateToProps, mapDispatchToProps);
