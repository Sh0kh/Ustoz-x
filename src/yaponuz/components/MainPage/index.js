import AboutUs from "./component/AboutUs";
import CallToAction from "./component/CallToAction";
import Contact from "./component/Contact";
import FAQ from "./component/FAQ";
import Footer from "./component/Footer";
import Header from "./component/Header";
import Hero from "./component/Hero";
import Testimonials from "./component/Testimonials";


export default function MainPage() {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <AboutUs />
                <Testimonials />
                <Contact />
                <CallToAction />
                <FAQ />
                <Footer />
            </main>
        </>
    )
}