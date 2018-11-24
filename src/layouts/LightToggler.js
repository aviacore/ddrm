import { drizzleConnect } from 'drizzle-react';
import { changeTheme } from '../items/actions';


const LightTogglerContainer = () => {
    const L = this.props.lightTheme;

    return (
        <div className="light-toggler-wrapper">
          <button type="button" className={ `light-toggler ${L ? 'l-theme' : 'd-theme' }`} onClick={this.props.changeTheme}></button>
        </div>
    );
}

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
