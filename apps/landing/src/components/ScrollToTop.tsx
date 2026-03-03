import { useState, useEffect } from 'react';

export function ScrollToTop() {
    const [visible, setVisible] = useState(false);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label="Scroll to top"
            className={`fixed bottom-8 right-8 z-[999] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-[opacity,transform] duration-300 ease-out active:scale-90 ${
                visible
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-4 pointer-events-none'
            } ${hovered ? '-translate-y-1' : ''}`}
            style={{
                backgroundColor: hovered ? '#252880' : '#2e3192',
                color: '#ffffff',
                boxShadow: hovered
                    ? '0 12px 36px rgba(46, 49, 146, 0.55)'
                    : '0 6px 24px rgba(46, 49, 146, 0.4)',
                transition: 'background-color 0.2s ease, box-shadow 0.2s ease, opacity 0.3s ease, transform 0.3s ease',
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
            >
                <path
                    fillRule="evenodd"
                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                />
            </svg>
        </button>
    );
}
