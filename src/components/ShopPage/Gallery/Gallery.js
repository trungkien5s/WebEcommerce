import "./Gallery.css"
import g1Img from "../../../images/g1.jpg"
import g2Img from "../../../images/g2.jpg"
import g3Img from "../../../images/g3.jpg"
import g4Img from "../../../images/g4.jpg"
import g5Img from "../../../images/g5.jpg"
import g6Img from "../../../images/g6.jpg"
import g7Img from "../../../images/g7.jpg"

const Gallery = () => {
    return (
        <div className="g-container">
            <div className="g-top">Follow Us On Instagram</div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin</p>
            <div className="list-img">
                <div className="g1-img">
                    <img src={g1Img} alt="a men" />
                </div>
                <div className="g2-img">
                    <img src={g2Img} alt="a girl" />
                </div>
                <div className="g3-img">
                    <img src={g3Img} alt="a girl" />
                </div>
                <div className="g2-img">
                    <img src={g4Img} alt="a man" />
                </div>
                <div className="g5-img">
                    <img src={g5Img} alt="a girl" />
                </div>
                <div className="g6-img">
                    <img src={g6Img} alt="a man" />
                </div>
                <div className="g7-img">
                    <img src={g7Img} alt= "a girl" />
                </div>
            </div>
        </div>
    )
}
export default Gallery