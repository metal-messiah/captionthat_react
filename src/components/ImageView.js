/**
 * Created by Porter on 12/27/2017.
 */
import React, {Component} from 'react';

class ImageView extends Component {

    render() {
        let displayClass = this.props.display ? "imageViewer" : "hidden";
        let backgroundStyle = {backgroundImage: `url(${this.props.endpoint}${this.props.currentImage})`};
        return (
            <div className={displayClass} style={backgroundStyle}></div>
        )
    }
}

export default ImageView;