import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import {
  fetchContentList,
  resetContentChoice,
  chooseContent,
  changeTheme,
  buyContent
} from '../items/actions';

import LightToggler from './LightToggler';
import '../css/styles.css';

import icon3 from '../img/icon3.png';
import icon4 from '../img/icon4.png';
import iconArrow from '../img/arrow.png';

class CatalogContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.props.fetchContentList();
  };

  render = () => {
    const { 
      contentList, 
      resetContentChoice, 
      chosenContentId, 
      chooseContent,
      buyContent
    } = this.props;
    const L = this.props.lightTheme;

    const list = contentList.map(el => {
      const chooseThisContent = () => {
        chooseContent(el.id);
      };

      return (
        <div className="el tile" onClick={chooseThisContent} key={el.id}>
          <div className="id">
            <span>{el.id}</span>
          </div>
          <div className="name">
            <span>{el.name}</span>
          </div>
          <div className="price">
            <span>{el.price}</span>
          </div>
          <div className="button">
            <img src={iconArrow} />
          </div>
        </div>
      );
    });

    const modal = chosenContentId && (
      <div className="modal">
        <div className="background" onClick={resetContentChoice} />
        <div className="modal-content tile">
          <div className="modal-content-wrapper">
            <div className="name">
              <span><h2>{contentList[chosenContentId-1].name}</h2></span>
            </div>
            
            <div className="hash">
              <span></span>
            </div>
            <div className="price">
              <div className="icon">
                <img src={icon4} />
              </div>
              <div className="number">
                <span>{contentList[chosenContentId-1].price}</span>
              </div>
            </div>
            <div className="description">
              <h3>About</h3>
              <p>{contentList[chosenContentId-1].descr}</p>
            </div>
            <div className="button">
              <button type="button" onClick={buyContent}>BUY</button>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className={`${L? 'catalog' : 'catalog d-theme'}`}>
        <div className="catalog-wrapper">
          <div className="bg" />
          <div className="bg" />
          <div className="bg" />
          <div className="list">
            <div className="list-wrapper tile">

              <div className="el header">
                <div className="id" />
                <div className="name">
                  <img src={icon3} />
                  
                </div>
                <div className="price">
                  <img src={icon4} />
                  
                </div>
                <div className="button" />
              </div>

              {list}
            </div>
          </div>

          <LightToggler />

          {modal}
        </div>
      </div>
    );
  };
}

const mapDispatchToProps = dispatch => ({
  chooseContent: id => dispatch(chooseContent(id)),
  fetchContentList: () => dispatch(fetchContentList()),
  resetContentChoice: () => dispatch(resetContentChoice()),
  changeTheme: () => dispatch(changeTheme()),
  buyContent: id => dispatch(buyContent(id))
});

const mapStateToProps = state => {
  return {
    contentList: state.items.contentList,
    chosenContentId: state.items.chosenContentId,
    lightTheme: state.items.lightTheme
  };
};

const Catalog = drizzleConnect(CatalogContainer, mapStateToProps, mapDispatchToProps);

export default Catalog;
