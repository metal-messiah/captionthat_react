/**
 * Created by Porter on 12/27/2017.
 */
import React, {Component} from 'react';

const ImageView = (props) => {
    let displayClass = props.display ? "imageViewer" : "hidden";
    let backgroundStyle = {backgroundImage: `url(${props.endpoint}${props.currentImage})`};
    return (
        <div className={displayClass} style={backgroundStyle}></div>
    )
}

export default ImageView;