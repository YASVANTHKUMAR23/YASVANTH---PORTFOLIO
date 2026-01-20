import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

function Hero() {
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ["Innovator", "Visionary", "Engineer", "Builder", "Designer"],
        []
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (titleNumber === titles.length - 1) {
                setTitleNumber(0);
            } else {
                setTitleNumber(titleNumber + 1);
            }
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    return (
        <div className="w-full bg-gradient-to-b from-[#007cf0] via-[#f0f9ff] to-white">
            <div className="container mx-auto px-4">
                <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <Button variant="secondary" size="sm" className="gap-4 rounded-full border border-blue-200 bg-white/50 backdrop-blur-sm text-blue-700 hover:bg-white/80">
                            Check out the latest projects <MoveRight className="w-4 h-4" />
                        </Button>
                    </motion.div>
                    <div className="flex gap-4 flex-col items-center">
                        <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-extralight text-slate-900">
                            <span className="opacity-70">I am a</span>
                            <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1 h-[1.25em]">
                                &nbsp;
                                {titles.map((title, index) => (
                                    <motion.span
                                        key={index}
                                        className="absolute font-black tracking-tight text-blue-600"
                                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 100,
                                            damping: 15,
                                            mass: 1
                                        }}
                                        animate={
                                            titleNumber === index
                                                ? {
                                                    y: 0,
                                                    opacity: 1,
                                                    scale: 1
                                                }
                                                : {
                                                    y: titleNumber > index ? -150 : 150,
                                                    opacity: 0,
                                                    scale: 0.8
                                                }
                                        }
                                    >
                                        {title}
                                    </motion.span>
                                ))}
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl leading-relaxed tracking-tight text-slate-600 max-w-2xl text-center mx-auto opacity-80 mt-4">
                            Bridging the gap between structural engineering and digital innovation.
                            I design resilient systems and build fluid digital experiences
                            for the next generation of smart builders.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Button size="lg" className="gap-4 rounded-full border-blue-200 text-blue-700 hover:bg-blue-50" variant="outline">
                            Jump on a call <PhoneCall className="w-4 h-4" />
                        </Button>
                        <Button size="lg" className="gap-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                            Collaborate now <MoveRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Hero };
