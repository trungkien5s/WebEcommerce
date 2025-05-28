import React from "react";
import "./Subscribe.css"
import leftImg from "../../../images/f-img1.png"
import rightImg from "../../../images/f-img2.jpg"

const Subscribe = () => {
    return (
        <div className="subscribe">
            <div className="sub-container">
                <div className="wrap">
                    <div className="left-img">
                        <img src={leftImg} alt="men" />
                    </div>
                    <div className="mid">
                        <div className="mid1">Subscribe To Our Newsletter</div>
                        <div className="mid2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin</div>
                        <input className="sub_input" placeholder="michael@gmail.com" ></input>
                        <div className="button">
                            <button>Subscribe Now</button>
                        </ div>
                    </div>
                    <div className="right-img">
                        <img src={rightImg} alt="girl" />
                    </div>
                </div>
            </div>

        </div>
    )
}
export default Subscribe

