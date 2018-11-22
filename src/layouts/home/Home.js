import React, { Component } from 'react';
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components';
import logo from '../../logo.png';
import Table from './Table';

class Home extends Component {
  ComponentDidMount() {
    this.props.getData()
  }

  render() {
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1 header">
            <img src={logo} alt="drizzle-logo" />
            <h1>Drizzle Examples</h1>
            <p>Examples of how to get started with Drizzle in various situations.</p>

            <br />
            <br />
          </div>

          <div className="pure-u-1-1">
            <h2>Active Account</h2>
            <AccountData accountIndex="0" units="ether" precision="3" />

            <br />
            <br />
          </div>

          <div className="pure-u-1-1">
            <h2>Core</h2>
            <p>
              Here we have a form with custom, friendly labels. Also note the token symbol will not
              display a loading indicator. We've suppressed it with the <code>hideIndicator</code>{' '}
              prop because we know this variable is constant.
            </p>
            <p>
              <strong>Total Supply</strong>:{' '}
              <ContractData
                contract="Core"
                method="totalSupply"
                methodArgs={[{ from: this.props.accounts[0] }]}
              />{' '}
              <ContractData contract="Core" method="symbol" hideIndicator />
            </p>
            <p>
              <strong>My Balance</strong>:{' '}
              <ContractData
                contract="Core"
                method="balanceOf"
                methodArgs={[this.props.accounts[0]]}
              />
            </p>
            <h3>Send Tokens</h3>
            <ContractForm
              contract="Core"
              method="transfer"
              labels={['To Address', 'Amount to Send']}
            />

            <br />
            <br />
          </div>

          <br />
          <br />
        </div>
        <Table data={this.props.data} />

      </main>
    );
  }
}

export default Home;
