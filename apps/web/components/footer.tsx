import Link from 'next/link';

const legalLinks = [
    { href: '/terms-and-conditions', label: 'Terms & Conditions' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/refund-cancellation-returns', label: 'Refund & Returns' },
];

export function Footer() {
    return (
        <footer className="w-full border-t border-(--color-border) bg-(--color-surface)/80 px-4 py-7">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
                {legalLinks.map(({ href, label }, index) => (
                    <div key={href} className="flex items-center gap-3">
                        <Link
                            href={href}
                            className="text-[9px] font-bold uppercase tracking-widest text-(--color-text-muted) transition-colors hover:text-(--color-gold-dark)"
                        >
                            {label}
                        </Link>

                        {index < legalLinks.length - 1 && (
                            <span
                                className="text-(--color-border)"
                                aria-hidden="true"
                            >
                                ·
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <p className="mt-3 text-center text-[8px] font-medium tracking-[0.08em] text-(--color-text-muted)">
                &copy; {new Date().getFullYear()} Glowa Vee Boutique. All rights reserved.
            </p>
        </footer>
    );
}
