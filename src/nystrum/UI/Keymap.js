import React from 'react';
import Button from './Button';

class Keymap extends React.Component {
  render() {
    return (  
      <div className="Keymap UI">
        <div className='flow-text'>Keymap</div>
        {
          
          this.props.keymap && (
            Object.entries(this.props.keymap).map(([key, value], index) => {
              return (
                <Button key={index} onClick={() => null}>
                  {key} {value.label}
                </Button>
              )
            })
          )
        }
      </div>
    );
  }
}

export default Keymap;