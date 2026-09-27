import React from 'react';
import { cn } from '@/lib/utils';

export interface TanggapinLogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showDescriptor?: boolean;
    showTagline?: boolean;
    variant?: 'dark' | 'light' | 'auto';
    iconOnly?: boolean;
    centered?: boolean;
}

export default function TanggapinLogo({
    className,
    size = 'md',
    showDescriptor = false,
    showTagline = false,
    variant = 'auto',
    iconOnly = false,
    centered = false,
}: TanggapinLogoProps) {
    // Sizing maps for height & width proportions
    const sizeConfig = {
        sm: {
            logoHeight: 'h-7 sm:h-8',
            iconSize: 'size-7 sm:size-8',
            descriptor: 'text-[10px]',
            tagline: 'text-[10px]',
        },
        md: {
            logoHeight: 'h-8 sm:h-9',
            iconSize: 'size-8 sm:size-9',
            descriptor: 'text-[11px]',
            tagline: 'text-[11px]',
        },
        lg: {
            logoHeight: 'h-10 sm:h-11',
            iconSize: 'size-10 sm:size-11',
            descriptor: 'text-xs',
            tagline: 'text-xs',
        },
        xl: {
            logoHeight: 'h-12 sm:h-14',
            iconSize: 'size-12 sm:size-14',
            descriptor: 'text-sm',
            tagline: 'text-sm',
        },
    }[size];

    return (
        <div
            className={cn(
                'inline-flex flex-col select-none justify-center',
                centered ? 'items-center text-center' : 'items-start text-left',
                className,
            )}
        >
            <div
                className={cn(
                    'flex items-center gap-2',
                    centered && 'justify-center',
                )}
            >
                {iconOnly ? (
                    // Icon-only emblem variant
                    <>
                        {variant !== 'light' && (
                            <img
                                src="/images/tanggapin-icon.png"
                                alt="Tanggapin"
                                className={cn(
                                    'object-contain shrink-0 drop-shadow-2xs transition-all duration-200',
                                    sizeConfig.iconSize,
                                    variant === 'auto' && 'dark:hidden',
                                )}
                                draggable={false}
                                loading="eager"
                            />
                        )}
                        {variant !== 'dark' && (
                            <img
                                src="/images/tanggapin-icon-dark.png"
                                alt="Tanggapin"
                                className={cn(
                                    'object-contain shrink-0 drop-shadow-2xs transition-all duration-200',
                                    sizeConfig.iconSize,
                                    variant === 'auto' && 'hidden dark:block',
                                )}
                                draggable={false}
                                loading="eager"
                            />
                        )}
                    </>
                ) : (
                    // Full Logo with emblem + text
                    <>
                        {variant !== 'light' && (
                            <img
                                src="/images/tanggapin-logo-cropped.png"
                                alt="Tanggapin"
                                className={cn(
                                    'w-auto object-contain shrink-0 drop-shadow-2xs transition-all duration-200',
                                    sizeConfig.logoHeight,
                                    variant === 'auto' && 'dark:hidden',
                                )}
                                draggable={false}
                                loading="eager"
                            />
                        )}
                        {variant !== 'dark' && (
                            <img
                                src="/images/tanggapin-logo-dark.png"
                                alt="Tanggapin"
                                className={cn(
                                    'w-auto object-contain shrink-0 drop-shadow-2xs transition-all duration-200',
                                    sizeConfig.logoHeight,
                                    variant === 'auto' && 'hidden dark:block',
                                )}
                                draggable={false}
                                loading="eager"
                            />
                        )}
                    </>
                )}
            </div>

            {showDescriptor && !iconOnly && (
                <span
                    className={cn(
                        'mt-1 font-medium tracking-tight',
                        variant === 'light'
                            ? 'text-slate-300'
                            : variant === 'dark'
                              ? 'text-slate-600'
                              : 'text-slate-500 dark:text-slate-400',
                        sizeConfig.descriptor,
                    )}
                >
                    Platform Sistem Informasi &amp; Tindak Lanjut Guru
                </span>
            )}

            {showTagline && (
                <span
                    className={cn(
                        'mt-0.5 font-medium tracking-tight',
                        variant === 'light'
                            ? 'text-blue-300'
                            : 'text-blue-600 dark:text-blue-400',
                        sizeConfig.tagline,
                    )}
                >
                    Kenali lebih cepat. Tanggapi lebih tepat.
                </span>
            )}
        </div>
    );
}
