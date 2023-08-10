import React from 'react'

export default function Button (props) {
    const {children,format,active, ...rest} = props
    return(
        <button  className={active?'btnActive':''} title={format}  {...rest}>
            {children}
            
        </button>
    )
}


