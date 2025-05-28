import './Banner.css'
import l_i from "../../../images/l_i.png"
import r_i from "../../../images/r-i.png"
import t_i from "../../../images/t_i.png"
import u_i from "../../../images/u_i.jpg"

const Banner = () => {
    return (
        <div className='home-banner'>
            <div className="home-banner-wrap">
                <div className="left-image">
                    <img src={l_i} alt="men" className="l-i"/>
                </div>
                
                <div className="mid">
                    <div className="top-mid">
                        <img src= {t_i} alt="girls" className="t_i"/>
                    </div>
                    
                    <div className='inner-text-banner'>
                        <h1>ULTIMATE</h1>
                        <h2>SALE</h2>
                        <p>NEW COLLECTION</p>
                        <button>SHOP NOW</button>
                    </div>

                    <div className="bottom-mid">
                    <img src= {u_i} alt="girls" className="u_i"/>
                    </div>
                </div>

                <div className="right-image">
                    <img src = {r_i} atl = "men" className="r-i"/>
                </div>
            </div>
        </div>
    )
}

export default Banner;