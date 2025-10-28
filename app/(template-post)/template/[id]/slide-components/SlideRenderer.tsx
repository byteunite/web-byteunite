import { SlideComponentProps } from "./types";
import CoverSlide from "./CoverSlide";
import MisteriSlide from "./MisteriSlide";
import SolusiSlide from "./SolusiSlide";
import ClosingSlide from "./ClosingSlide";
import WarningAnswerSlide from "./WarningAnswerSlide";
import IntroSlide from "./IntroSlide";
import FeaturesSlide from "./FeaturesSlide";
import BenefitsSlide from "./BenefitsSlide";
import UseCaseSlide from "./UseCaseSlide";
import CTASlide from "./CTASlide";

/**
 * SlideRenderer - Component yang merender slide berdasarkan tipe
 * Menggantikan conditional rendering yang panjang dengan pendekatan yang lebih modular
 *
 * @param props - Props yang akan diteruskan ke slide component yang sesuai
 * @returns React element dari slide component yang sesuai dengan tipe_slide
 */
export default function SlideRenderer(props: SlideComponentProps) {
    const { post } = props;

    // Render slide berdasarkan tipe_slide
    switch (post.tipe_slide) {
        case "COVER":
            return <CoverSlide {...props} />;

        case "MISTERI":
            return <MisteriSlide {...props} />;

        case "SOLUSI":
        case "FINAL":
            return <SolusiSlide {...props} />;

        case "CLOSING":
            return <ClosingSlide {...props} />;

        case "WARNING_ANSWER":
            return <WarningAnswerSlide {...props} />;

        case "INTRO":
            return <IntroSlide {...props} />;

        case "FEATURES":
            return <FeaturesSlide {...props} />;

        case "BENEFITS":
            return <BenefitsSlide {...props} />;

        case "USE_CASE":
            return <UseCaseSlide {...props} />;

        case "CTA":
            return <CTASlide {...props} />;

        default:
            // Fallback jika tipe slide tidak dikenali
            console.warn(`Unknown slide type: ${post.tipe_slide}`);
            return null;
    }
}
