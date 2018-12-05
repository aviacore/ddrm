import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { soliditySha3 } from 'web3-utils';
import drizzle from 'drizzle';
import ChosenModal from './ChosenModal';
import { chooseContent, resetContentChoice } from './actions';
import { ContractData } from 'drizzle-react-components';

// var state = drizzle.store.getState();

class AssetsList extends Component {
  // constructor(props, context) {
  //
  // }

  render() {
    const {
      contentList,
      chooseContent,
      DDRMCore,
      chosenContentId,
      resetContentChoice
    } = this.props;

    const handleClick = id => {
      if (chosenContentId === id) resetContentChoice();
      else chooseContent(id);
    };

    return contentList.map(({ id, name }) => (
      <div className="el tile" key={id}>
        <div
          className="el-wrapper"
          onClick={() => {
            handleClick(id);
          }}>
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
          <div
            className="button"
            style={{ transform: `${chosenContentId === id ? 'rotateZ(180deg)' : ''}` }}>
            <svg viewBox="0 0 22 12" version="1.1">
              <title>Arrow-down</title>
              <desc>Created with Sketch.</desc>
              <defs />
              <g id="Главная" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g
                  id="Desktop-HD-Copy-3"
                  transform="translate(-1059.000000, -314.000000)"
                  fill="#5E77FF"
                  fill-rule="nonzero">
                  <g id="Arrow-down" transform="translate(1059.000000, 314.000000)">
                    <path
                      d="M10.9999509,8.40663749 L2.70557059,0.446029287 C2.08658874,-0.14865768 1.08308073,-0.14865768 0.464177456,0.446029287 C-0.154725819,1.04064126 -0.154725819,2.00483736 0.464177456,2.59959932 L9.79966197,11.5593521 C10.1294635,11.876251 10.5681643,12.0188574 10.9999509,11.9980083 C11.4318161,12.0188574 11.8704776,11.876251 12.2003184,11.5593521 L21.5357636,2.59959932 C22.1547455,2.00487486 22.1547455,1.04075375 21.5357636,0.446029287 C20.9167818,-0.148695178 19.913313,-0.14865768 19.2944883,0.446029287 L10.9999509,8.40663749 Z"
                      id="Shape"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>
        <div className="modal-placeholder">{chosenContentId === id && <ChosenModal />}</div>
      </div>
    ));
  }
}

const mapDispatchToProps = dispatch => ({
  chooseContent: id => dispatch(chooseContent(id)),
  resetContentChoice: () => dispatch(resetContentChoice())
});

const mapStateToProps = ({
  contracts: { DDRMCore },
  items: { contentList, chosenContentId }
}) => ({
  chosenContentId,
  contentList,
  DDRMCore
});

export default drizzleConnect(AssetsList, mapStateToProps, mapDispatchToProps);
