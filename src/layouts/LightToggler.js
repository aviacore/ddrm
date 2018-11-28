import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import { changeTheme } from './Catalog/actions';

const LightTogglerContainer = props => {
  const L = props.lightTheme;

  return (
    <div className="light-toggler-wrapper">
      <button
        type="button"
        className={`light-toggler ${L ? 'l-theme' : 'd-theme'}`}
        onClick={props.changeTheme}
      />
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  changeTheme: () => dispatch(changeTheme())
});

const mapStateToProps = state => {
  return {
    lightTheme: state.items.lightTheme
  };
};

const LightToggler = drizzleConnect(LightTogglerContainer, mapStateToProps, mapDispatchToProps);

export default LightToggler;
