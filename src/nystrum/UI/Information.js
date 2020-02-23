import React from 'react';
import Button from './Button';

class Information extends React.Component {
  render() {
    return (
      <div className="Information UI">
        <div className='flow-text'>Information</div>
        {
          this.props.data && (
            this.props.data.map((item, index) => {
              return (
                <Button key={index} color={item['color']} onClick={() => null}>
                  {`${item.label}: ${item.value}`}
                </Button>
              )
            })
          )
        }
      </div>
    );
  }
}

export default Information;