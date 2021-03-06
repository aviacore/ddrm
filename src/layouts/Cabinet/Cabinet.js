import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { drizzleConnect } from 'drizzle-react';
import { ContractData } from 'drizzle-react-components';
import { soliditySha3 } from 'web3-utils';
import { times } from 'lodash';

import { changeTheme, fetchContentList } from '../Catalog/actions';
import PurchasedList from './PurchasedList';

import iconBalance from '../../img/icon4.png';
import icon3 from '../../img/icon3.png';
import iconClock from '../../img/clock.png';

class Cabinet extends Component {
  constructor(props, { drizzle }) {
    super(props);

    this.web3 = drizzle.web3;
    this.DDRMCore = drizzle.contracts.DDRMCore;
  }

  state = { contractTokens: [] };

  async componentDidMount() {
    this.props.fetchContentList();

    const { account } = this.props;
    const balance = await this.DDRMCore.methods.balanceOf(account).call();

    const requests = times(balance, async index => {
      const tokenId = await this.DDRMCore.methods.tokenOfOwnerByIndex(account, index).call();
      const [time, hash] = await Promise.all(this.getTokenInfo(tokenId));

      return { time, hash };
    });

    const contractTokens = await Promise.all(requests);

    this.setState({ contractTokens });
  }

  getTokenInfo = tokenId => [
    this.DDRMCore.methods.endTimeOf(tokenId).call(),
    this.DDRMCore.methods.assetOf(tokenId).call()
  ];

  render() {
    const {
      account,
      user: { avatarUrl },
      contentList
    } = this.props;

    const purchasedContentList = this.state.contractTokens.reduce((res, cur) => {
      const interception = contentList.find(
        token => soliditySha3(token.id).substring(0, 10) === cur.hash
      );

      return interception ? [...res, { ...interception, time: cur.time }] : res;
    }, []);

    return (
      <div className="cabinet">
        <div className="cabinet-wrapper">
          <div className="page">
            <div className="page-wrapper">
              <div className="sidebar">
                <div className="sidebar-wrapper tile">
                  <div className="avatar">
                    <div style={{ backgroundImage: avatarUrl }} />
                  </div>
                  <div className="address">
                    <span>{account}</span>
                  </div>
                  <div className="separator" />
                  <div className="balance">
                    <img src={iconBalance} className="icon" />
                    <div className="number">
                      <ContractData
                        contract="ERC20Example"
                        method="balanceOf"
                        methodArgs={[account]}
                      />
                      <span className="token-name"> NKMS</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="list tile">
                <div className="list-wrapper">
                  <PurchasedList items={purchasedContentList} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchContentList: () => dispatch(fetchContentList()),
  changeTheme: () => dispatch(changeTheme())
});

const mapStateToProps = ({
  contracts,
  accounts: { 0: account },
  accountBalances,
  items: { lightTheme, user, contentList }
}) => ({
  lightTheme,
  user,
  contracts,
  account,
  balance: accountBalances[account],
  contentList
});

Cabinet.contextTypes = {
  drizzle: PropTypes.object
};

export default drizzleConnect(Cabinet, mapStateToProps, mapDispatchToProps);
