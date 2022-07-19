import React from 'react';

/**
 * Renders a loading message
 *
 * NOTE: this is an unstyled placeholder.  would recommend creating
 * your own loader component and passing it as the `loader`
 * prop to `<Dashboard />`
 */
const Loader = () => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span>Loading</span>
    </div>
  );
};

export default Loader;
