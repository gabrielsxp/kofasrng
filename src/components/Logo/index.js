import React from 'react';

export default function Logo({width, source}){
    return <img src={source} alt="" style={{width: `${width}px`, height: 'auto'}}/>
}