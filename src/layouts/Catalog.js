import React, {Component} from 'react';
import { drizzleConnect } from 'drizzle-react';
import { fetchContentList, resetContentChoice, chooseContent, changeTheme } from '../items/actions';

import LightToggler from './LightToggler';
import '../css/styles.css';

class CatalogContainer extends Component {
  constructor(props) {
      super(props);
      
  }

  componentDidMount = () => {
    this.props.fetchContentList();
  }

  render = () => {
    const { contentList, resetContentChoice, chosenContentId, chooseContent } = this.props;
    const L = this.props.lightTheme;

    const dynamicStyle = {
      backgroundColor: L ? 'white' : '#333',
      color: L ? 'black' : 'eee'
    };

    const list = contentList.map( (el) => {
      
      const chooseThisContent = () => {
        chooseContent(el.id);
      }

      return (
        <div className="el tile" onClick={chooseThisContent} key={el.id} style={dynamicStyle}>
          <div className="id"><span>{el.id}</span></div>
            <div className="name"><span>{el.name}</span></div>
            <div className="price"><span>{el.price}</span></div>
            <div className="button">
              <div></div>
            </div>
        </div>
      )
    });

    const modal = chosenContentId && (
      <div className="modal">
        <div className="background" onClick={resetContentChoice}></div>
        <div className="modal-content tile" style={dynamicStyle}>
          <div className="modal-content-wrapper">
            
            <div className="id-name">
              <div className="id"><span>contentList[chosenContentId].id</span></div>
              <div className="name"><span>contentList[chosenContentId].name</span></div>
            </div>
            <div className="hash"><span></span></div>
            <div className="price"><span>contentList[chosenContentId].price</span></div>
            <div className="description"><p>contentList[chosenContentId].descr</p></div>
            <div className="button">
              <button type="button">BUY</button>
            </div>

          </div>
        </div>
      </div>
    );

    return (
      <div className="catalog">
        <div className="catalog-wrapper">
          <div className="bg"></div>
          <div className="bg"></div>
          <div className="bg"></div>
          <div className="list">
            <div className="list-wrapper tile" style={dynamicStyle}>
              <div className="el header">
                <div className="id"></div>
                <div className="name">
                  <div></div>
                </div>
                <div className="price">
                  <div></div>
                </div>
                <div className="button">
                </div>
              </div>

              {list}

            </div>
          </div>

          <LightToggler />
          
          {modal}

        </div>
      </div>
    );
  }
}


const mapDispatchToProps = dispatch => ({
  chooseContent: (id) => dispatch(chooseContent(id)),
  fetchContentList: () => dispatch(fetchContentList()),
  resetContentChoice: () => dispatch(resetContentChoice()),
  changeTheme: () => dispatch(changeTheme())
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