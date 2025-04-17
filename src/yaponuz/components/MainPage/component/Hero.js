import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";

export default function Hero() {
    return (
        <section className="pt-[230px]">
            <SoftBox maxWidth="1230px" margin="0 auto">
                <SoftBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="20px" textAlign="center">
                    <h1 className="text-[35px] sm:text-[60px] md:text-[70px] lg:text-[80px] leading-[1] text-[#1C1E2B] font-bold">
                        Where classrooms become communities
                    </h1>
                    <p className="text-[16px] sm:text-[18px] mb-[10px]">
                        One of the best systems
                    </p>
                    <SoftBox>
                        <SoftButton
                            sx={{
                                backgroundColor: '#1C1E2B',
                                color: 'white !important',
                                '&:hover': {
                                    backgroundColor: 'white',
                                    color: '#1C1E2B !important',
                                },
                            }}
                        >
                            <svg className="text-[20px]" xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 48 48"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M24.008 33.9V6M36 22L24 34L12 22m24 20H12"></path></svg>
                        </SoftButton>
                    </SoftBox>
                </SoftBox>
            </SoftBox>
        </section>
    );
}
