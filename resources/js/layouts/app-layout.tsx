import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <FlowbiteTanggapinLayout>
            {children}
        </FlowbiteTanggapinLayout>
    );
}
