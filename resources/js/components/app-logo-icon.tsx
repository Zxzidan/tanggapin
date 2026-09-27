import { cn } from '@/lib/utils';
import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({
    className,
    alt = 'Tanggapin',
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/tanggapin-icon.png"
            alt={alt}
            className={cn('size-8 object-contain shrink-0', className)}
            draggable={false}
            loading="eager"
            {...props}
        />
    );
}
