import React, { Component } from 'react';
import iconArrow from '../../img/arrow.png';
import { drizzleConnect } from 'drizzle-react';
import { soliditySha3 } from 'web3-utils';
import drizzle from 'drizzle';
import { chooseContent } from './actions';
import { ContractData } from 'drizzle-react-components';

// var state = drizzle.store.getState();

class AssetsList extends Component {
  // constructor(props, context) {
  //
  // }

  render() {
    const { contentList = [], chooseContent, DDRMCore } = this.props;

    return contentList.map(({ id, name }) => (
      <div className="el tile" onClick={() => chooseContent(id)} key={id}>
        <div className="id">
          <span>{id}</span>
        </div>
        <div className="name">
          <span>{name}</span>
        </div>
        <div className="price">
          {/*<span>{DDRMCore.assetPrice(soliditySha3(id).substring(0, 10))}</span>*/}
          <ContractData
            contract="DDRMCore"
            method="assetPrice"
            methodArgs={[soliditySha3(id).substring(0, 10)]}
            hideIndicator
          />
        </div>
        <div className="button">
          <img src={iconArrow} />
        </div>
      </div>
    ));
  }
}

const mapDispatchToProps = dispatch => ({
  chooseContent: id => dispatch(chooseContent(id))
});

const mapStateToProps = ({ contracts: { DDRMCore }, items: { contentList } }) => ({
  contentList,
  DDRMCore
});

export default drizzleConnect(AssetsList, mapStateToProps, mapDispatchToProps);
