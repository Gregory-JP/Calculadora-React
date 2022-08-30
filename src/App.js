import './App.css';
import { useReducer } from 'react';
import DigitButtons from './DigitButtons';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'ADD_DIGIT',
  CHOOSE_OPERATOR: 'CHOOSE_OPERATOR',
  CLEAR: 'CLEAR',
  DELETE_DIGIT: 'DELETE_DIGIT',
  EVALUATE: 'EVALUATE',
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOp: payload.digit,
          overwrite: false,
        };
      }

      if (payload.digit === '0' && state.currentOp === '0') {
        return state;
      }

      if (payload.digit === '.' && state.currentOp.includes('.')) {
        return state;
      }

      return {
        ...state,
        currentOp: `${state.currentOp || ""}${payload.digit}`,
      }
    
    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.CHOOSE_OPERATOR:
      if (state.currentOp == null && state.previousOp == null) {
        return state;
      }

      if (state.currentOp == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previousOp == null) {
        return {
          ...state,
          previousOp: state.currentOp,
          currentOp: null,
          operation: payload.operation,
        }
      }          

      return {
        ...state,
        currentOp: null,
        previousOp: evaluate(state),
        operation: payload.operation,

      }
    
    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currentOp == null || state.previousOp == null) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        currentOp: evaluate(state),
        previousOp: null,
        operation: null,
      }
    
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOp: null
        }
      }

      if (state.currentOp == null) {
        return state;
      }
      
      if (state.currentOp.length === 1) {
        return {
          ...state,
          currentOp: null,
        }
      }

      return {
        ...state,
        currentOp: state.currentOp.slice(0, -1),
      }
  } 
}

function evaluate({ previousOp, currentOp, operation }) {
  const prev = parseFloat(previousOp);
  const cur = parseFloat(currentOp);

  if (isNaN(prev) || isNaN(cur)) {
    return null;
  }

  let computed = '';

  switch (operation) {
    case '+':
      computed = prev + cur;
      break;
    case '-':
      computed = prev - cur;
      break;
    case '*':
      computed = prev * cur;
      break;
    case '÷':
      computed = prev / cur;
      break;
  }
  return computed.toString();
}

const INTEGER_FORMAT = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) {
    return '';
  }

  const [int, dec] = operand.toString().split('.');

  if (dec == null) {
    return INTEGER_FORMAT.format(int);
  }

  return INTEGER_FORMAT.format(int) + '.' + dec;

}

function App() {
  const [{ currentOp, previousOp, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className='pre-operand'>{formatOperand(previousOp)} {operation}</div>
        <div className='cur-operand'>{formatOperand(currentOp)}</div>
      </div>
        
        <button className='span-two' 
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
        
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        
        <OperationButton operation='÷' dispatch={dispatch} />
        
        <DigitButtons digit="1" dispatch={dispatch}></DigitButtons>
        <DigitButtons digit="2" dispatch={dispatch}></DigitButtons>
        <DigitButtons digit="3" dispatch={dispatch}></DigitButtons>
        
        <OperationButton operation='*' dispatch={dispatch} />
        
        <DigitButtons digit="4" dispatch={dispatch}></DigitButtons>
        <DigitButtons digit="5" dispatch={dispatch}></DigitButtons>
        <DigitButtons digit="6" dispatch={dispatch}></DigitButtons>
        
        <OperationButton operation='-' dispatch={dispatch} />
        
        <DigitButtons digit="7" dispatch={dispatch}></DigitButtons>
        <DigitButtons digit="8" dispatch={dispatch}></DigitButtons>
        <DigitButtons digit="9" dispatch={dispatch}></DigitButtons>
       
        <OperationButton operation='+' dispatch={dispatch} />
        <DigitButtons digit="." dispatch={dispatch}></DigitButtons>
        <DigitButtons digit="0" dispatch={dispatch}></DigitButtons>
        
        <button className='span-two'
         onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>

    </div>
  )
}

export default App;