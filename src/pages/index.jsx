import Layout from "./Layout.jsx";

import Home from "./Home";
import BookConsultation from "./BookConsultation";
import About from "./About";
import ContingencyPlacement from "./ContingencyPlacement";
import ContractServices from "./ContractServices";
import ResumeServices from "./ResumeServices";
import Pricing from "./Pricing";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import GoogleAnalytics from "@/components/GoogleAnalytics";

const PAGES = {
    Home: Home,
    BookConsultation: BookConsultation,
    About: About,
    ContingencyPlacement: ContingencyPlacement,
    ContractServices: ContractServices,
    ResumeServices: ResumeServices,
    Pricing: Pricing
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/BookConsultation" element={<BookConsultation />} />
                <Route path="/About" element={<About />} />
                <Route path="/ContingencyPlacement" element={<ContingencyPlacement />} />
                <Route path="/ContractServices" element={<ContractServices />} />
                <Route path="/ResumeServices" element={<ResumeServices />} />
                <Route path="/Pricing" element={<Pricing />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
            <PagesContent />
        </Router>
    );
}