import "./Logo.css"
import chanel from "../../../images/chanel.png"
import lv from "../../../images/lv.png"
import prada from "../../../images/prada.png"
import ck from "../../../images/ck.png"
import denim from "../../../images/denim.png"

const Logo = () => {
    return (
        <div className= "logo-container">
            <div className="logo-wrap"> 
                <div className="chanel">
                    <img src= {chanel} className="i"/>
                </div>
                <div className="chanel">
                    <img src= {lv} className="i" />
                </div>
                <div className="chanel">
                    <img src={prada} className="i"/>
                </div>
                <div className="ck">
                    <img src={ck} className="i"/>
                </div>
                <div className="chanel">
                    <img src={denim} className="i" />
                </div>
            </div>
        </div>
    )
}

export default Logo