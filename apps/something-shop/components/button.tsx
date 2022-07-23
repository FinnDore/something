/* eslint-disable react/display-name */
import { forwardRef } from 'react';

const SomethingButton = (props, ref) => {
    return (
        <button ref={ref} {...props} className="bg-pink-600 px-2 py-1">
            {props.children}
        </button>
    );
};

export default forwardRef(SomethingButton);
