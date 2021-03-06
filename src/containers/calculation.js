import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { push } from 'connected-react-router';

import { selectors } from '@openchemistry/redux'
import { calculations } from '@openchemistry/redux'

import Calculation from '../components/calculation';

import { isNil } from 'lodash-es';

class CalculationContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.onOrbital = this.onOrbital.bind(this);
  }

  componentWillMount() {
    const { dispatch, id, iOrbital} = this.props;
    dispatch(calculations.loadCalculationById(id));
    if (!isNil(iOrbital)) {
      dispatch(calculations.loadOrbital(id, iOrbital));
    }
  }

  componentDidMount() {
    if (this.state.id && !this.props.cjson) {
      this.props.dispatch(calculations.loadCalculationById(this.state.id));

    }

    if (this.state.id && this.state.orbital) {
        this.props.dispatch(calculations.loadOrbital(this.state.id, this.state.orbital));
    }
  }

  onIOrbitalChanged = (e) => {
    let iOrbital = e.detail;
    if (iOrbital !== this.props.iOrbital) {
      const {id, dispatch} = this.props;
      if (iOrbital === '-1') {
        dispatch(push(`/calculations/${id}`));
      } else {
        dispatch(push(`/calculations/${id}?mo=${iOrbital}`));
        dispatch(calculations.loadOrbital(id, iOrbital));
      }
    }
  }

  render() {
    const { id, iOrbital, cjson, showNotebooks, calculationProperties, molecule} = this.props;
    if (isNil(cjson)) {
      return null;
    }
    return (
      <div style={{width:'100%', height: '40rem'}}>
        <Calculation
          cjson={cjson}
          id={id}
          iOrbital={iOrbital}
          onIOrbitalChanged={this.onIOrbitalChanged}
          showNotebooks={showNotebooks}
          calculationProperties={calculationProperties}
          molecule={molecule}
        />
      </div>
    );
  }

  onOrbital(orbital) {
    this.setState({
      orbital,
    })
    this.props.dispatch(calculations.loadOrbital(this.state.id, orbital));
  }
}

CalculationContainer.propTypes = {
  cjson: PropTypes.object,
  id: PropTypes.string,
  iOrbital: PropTypes.any,
  inchikey: PropTypes.string,
  showNotebooks: PropTypes.bool,
  calculationProperties: PropTypes.object,
  molecule: PropTypes.object
}

CalculationContainer.defaultProps = {
  cjson: null,
  id: null,
  iOrbital: null,
  inchikey: null,
  showNotebooks: true,
  calculationProperties: null,
  molecule: null
}

function mapStateToProps(state, ownProps) {
  let id = ownProps.match.params.id;
  let iOrbital = ownProps.match.params.iOrbital;
  let cjson;
  let calculationProperties;
  let molecule;

  const params = new URLSearchParams(ownProps.location.search);

  // iOrbital can come either from the route or from a query parameter

  let mo = params.get('mo');
  if (!isNil(mo)) {
    mo = mo.toLowerCase();
    if (mo === 'homo' || mo ==='lumo') {
      iOrbital = mo;
    } else {
      let iMo = parseInt(mo);
      if (isFinite(iMo)) {
        iOrbital = iMo;
      }
    }
  }

  let props = {
    id,
    iOrbital,
    cjson,
    calculationProperties,
    molecule
  }

  let calculations = selectors.calculations.getCalculationsById(state);
  if (!isNil(id) && id in calculations) {
    props.calculationProperties = calculations[id].properties;
    props.cjson = calculations[id].cjson;
    const molecules = selectors.molecules.getMoleculesById(state);
    if (calculations[id].moleculeId in molecules) {
      props.molecule = molecules[calculations[id].moleculeId];
    }
  }

  let orbitals = selectors.calculations.getOrbitals(state, id);
  if (!isNil(props.cjson) && !isNil(iOrbital) && iOrbital in orbitals) {
    props.cjson  = {...props.cjson, cube: orbitals[iOrbital].cube};
  } else if (!isNil(props.cjson)) {
    // Remove any orbital data
    delete props.cjson.cube;
  }

  return props;
}

export default connect(mapStateToProps)(CalculationContainer)
