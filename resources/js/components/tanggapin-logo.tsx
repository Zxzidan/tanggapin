import React from 'react';
import { cn } from '@/lib/utils';

interface TanggapinLogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showDescriptor?: boolean;
    showTagline?: boolean;
    variant?: 'dark' | 'light' | 'auto';
}

export default function TanggapinLogo({
    className,
    size = 'md',
    showDescriptor = true,
    showTagline = false,
    variant = 'auto',
}: TanggapinLogoProps) {
    const sizeConfig = {
        sm: {
            icon: 'size-7',
            svg: 'size-4',
            title: 'text-sm',
            descriptor: 'text-[9px]',
            badge: 'text-[9px] px-1.5 py-0.2',
        },
        md: {
            icon: 'size-9',
            svg: 'size-5',
            title: 'text-base',
            descriptor: 'text-[10px]',
            badge: 'text-[10px] px-2 py-0.5',
        },
        lg: {
            icon: 'size-11',
            svg: 'size-6',
            title: 'text-xl',
            descriptor: 'text-xs',
            badge: 'text-xs px-2.5 py-0.5',
        },
        xl: {
            icon: 'size-14',
            svg: 'size-8',
            title: 'text-3xl',
            descriptor: 'text-sm',
            badge: 'text-xs px-3 py-1',
        },
    }[size];

    return (
        <div
            className={cn(
                'inline-flex items-center gap-2.5 select-none',
                className,
            )}
        >
            {/* Geometric Dignified Emblem: Compassion & Vigilance / Proactive Follow-up */}
            <div
                className={cn(
                    'relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 text-white shadow-sm ring-1 ring-blue-500/20',
                    sizeConfig.icon,
                )}
            >
                <svg
                    className={sizeConfig.svg}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Outer structured shield arc */}
                    <path
                        d="M12 2L4 5.5V11.5C4 16.5 7.5 21 12 22C16.5 21 20 16.5 20 11.5V5.5L12 2Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-90"
                    />
                    {/* Inner Forward / Responsive Chevron (Tanggap) */}
                    <path
                        d="M8.5 12L11 14.5L15.5 9.5"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                {/* Subtle indicator dot: Quick Recognition */}
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-blue-400 ring-2 ring-white dark:ring-neutral-900" />
            </div>

            <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                    <span
                        className={cn(
                            'font-bold tracking-tight uppercase',
                            variant === 'light'
                                ? 'text-white'
                                : variant === 'dark'
                                  ? 'text-slate-900'
                                  : 'text-slate-900 dark:text-slate-100',
                            sizeConfig.title,
                        )}
                    >
                        TANGGAPIN
                    </span>
                </div>
                {showDescriptor && (
                    <span
                        className={cn(
                            'leading-tight font-medium',
                            variant === 'light'
                                ? 'text-slate-300'
                                : variant === 'dark'
                                  ? 'text-slate-600'
                                  : 'text-slate-500 dark:text-slate-400',
                            sizeConfig.descriptor,
                        )}
                    >
                        Platform Tindak Lanjut Siswa
                    </span>
                )}
                {showTagline && (
                    <span
                        className={cn(
                            'mt-0.5 text-[11px] font-medium tracking-tight',
                            variant === 'light'
                                ? 'text-blue-300'
                                : 'text-blue-600 dark:text-blue-400',
                        )}
                    >
                        Kenali lebih cepat. Tanggapi lebih tepat.
                    </span>
                )}
            </div>
        </div>
    );
}
