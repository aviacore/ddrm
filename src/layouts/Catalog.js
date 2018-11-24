import React, {Component} from 'react';
import { drizzleConnect } from 'drizzle-react';
import { fetchContentList } from '../items/actions';

import '../css/styles.css';

class CatalogContainer extends Component {
  constructor(props) {
      super(props);
      
  }


  /**
   * <div className="bg"></div>
          <div className="bg"></div>
          <div className="bg"></div>
          <div className="list">
   * 
   * 
   */
  render = () => {

    const list = this.props.contentList.map( (el) => {
      return (
        <div className="el tile">
          <div className="id"><span>{el.id}</span></div>
            <div className="name"><span>{el.name}</span></div>
            <div className="price"><span>{el.price}</span></div>
            <div className="button">
              <div></div>
            </div>
        </div>
      )
    });

    return (
      <div className="catalog">
        <div className="catalog-wrapper">
          
          <div className="list">
            <div className="list-wrapper tile">
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
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    contentList: state.items.contentList
  };
};

const Catalog = drizzleConnect(CatalogContainer, mapStateToProps);

export default Catalog;