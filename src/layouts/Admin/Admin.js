import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ContractData, ContractForm } from 'drizzle-react-components';
import { drizzleConnect } from 'drizzle-react';
const { soliditySha3 } = require('web3-utils');

class Admin extends Component {
  state = { assetId: '' };

  render() {
    return (
      <div className="admin">
        <br />
        <div>
          DDRM balanceOf:
          <ContractData contract="DDRMCore" method="balanceOf" methodArgs={[this.props.account]} />
        </div>
        <br />
        IERC20 balanceOf:
        <ContractData
          contract="ERC20Example"
          method="balanceOf"
          methodArgs={[this.props.account]}
        />
        <br />
        <ContractForm contract="DDRMCore" method="setAssetPrice" labels={['Asset ID', 'Price']} />
        <ContractForm contract="ERC20Example" method="mint" labels={['Address', 'Amount']} />
        String to Bytes4 converter
        <input onChange={({ target }) => this.setState({ assetId: target.value })} />
        {soliditySha3(this.state.assetId).substring(0, 10)}
      </div>
    );
  }
}

Admin.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = ({
  contracts,
  accounts: { 0: account },
  accountBalances,
  items: { purchasedContentList, lightTheme, user }
}) => ({
  purchasedContentList,
  lightTheme,
  user,
  contracts,
  account,
  balance: accountBalances[account]
});

export default drizzleConnect(Admin, mapStateToProps);
