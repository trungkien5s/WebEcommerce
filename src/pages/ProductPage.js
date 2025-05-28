import Header from "../components/ShopPage/Header/Header"
import Slider from "../components/ShopPage/Slider/Slider"
import Feature from "../components/ShopPage/Feature/Feature"
import DealsOfTheMonth from "../components/ShopPage/DealsOfTheMonth/DealsOfTheMonth"
import Subscribe from "../components/ShopPage/Subscribe/Subscribe"
import Footer from "../components/ShopPage/Footer/Footer"
import ProductDetail from "../components/ShopPage/ListProducts/ProductDetail"
import { useParams } from 'react-router-dom';
import { CartProvider } from "./../components/ShopPage/ListProducts/CartContext";
import FloatingCart from "../components/ProductPage/FloatingCart"

function ProductPageUser() {

    const { id: productId } = useParams();

    return (
        <>
            <Header />
            <CartProvider>
                <div>
                    <ProductDetail productId={productId} />
                    <FloatingCart />
                </div>
            </CartProvider>
            <Slider />
            <Feature />
            <DealsOfTheMonth />
            <Subscribe />
            <hr></hr>
            <Footer />
        </>
    )
}

export default ProductPageUser