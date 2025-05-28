import Header from "../components/HomePage/Header/Header"
import Footer from "../components/ShopPage/Footer/Footer"
import Subscribe from "../components/ShopPage/Subscribe/Subscribe"
import Gallery from "../components/ShopPage/Gallery/Gallery"
import Feature from "../components/ShopPage/Feature/Feature"
import Slider from "../components/ShopPage/Slider/Slider"
import DealsOfTheMonth from "../components/ShopPage/DealsOfTheMonth/DealsOfTheMonth"
import ListProduct from "../components/ShopPage/ListProducts/index"
import FloatingCart from "../components/ProductPage/FloatingCart"
import { CartProvider } from "../components/ShopPage/ListProducts/CartContext";

function ShopPage() {
    return (
        <>
            <Header />
            <ListProduct />
            <CartProvider>
                <FloatingCart />
            </CartProvider>

            <DealsOfTheMonth />
            <Slider />
            <Feature />
            <Gallery />
            <Subscribe />
            <hr></hr>
            <Footer />
        </>
    )
}

export default ShopPage