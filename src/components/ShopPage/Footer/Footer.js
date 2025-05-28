import "./Footer.css"

const Footer = () => {
    return (
        <div className = "footer">
            <div className="footer-container">
                <div className="footer-wrap">
                    <div className="logo">
                        Fasco
                    </div>
                    <div className="inner-list">
                        <ul>
                           <li><a href="#">Support Center</a></li> 
                           <li><a href="#">Invoicing</a></li> 
                           <li><a href="#">Contract</a></li> 
                           <li><a href="#">Careers</a></li> 
                           <li><a href="#">Blog</a></li> 
                           <li><a href="#">FAQ,s</a></li> 

                        </ul>
                    </div>
                </div>
            </div>
            <div className="copyright">
                <p>Copyright © 2022 Xpro. All Rights Reseved.</p>
            </div>
        </ div>
        
    )
}

export default Footer