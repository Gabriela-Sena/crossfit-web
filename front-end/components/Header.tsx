"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserIcon, ClipboardDocumentListIcon, PencilSquareIcon, CheckBadgeIcon, HomeIcon } from '@heroicons/react/24/outline';

const navItems = [
    { href: '/', icon: <HomeIcon className="w-6 h-6" />, label: 'Dashboard' },
    { href: '/alunos', icon: <UserIcon className="w-6 h-6" />, label: 'Alunos' },
    { href: '/treinos', icon: <ClipboardDocumentListIcon className="w-6 h-6" />, label: 'Treinos' },
    { href: '/matriculas', icon: <PencilSquareIcon className="w-6 h-6" />, label: 'Matrículas' },
    { href: '/frequencias', icon: <CheckBadgeIcon className="w-6 h-6" />, label: 'Frequências' },
];

export default function Header() {
    const pathname = usePathname();
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-zinc-950/70 backdrop-blur-sm flex justify-center">
            <nav className="flex items-center gap-8 py-2 px-6 mt-2 rounded-full shadow-none">
                <div className="text-xl font-black tracking-tight text-zinc-100 select-none mr-6">CrossFit</div>
                {navItems.map(item => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group flex flex-col items-center justify-center px-3 py-1 ${isActive ? 'text-blue-400' : 'text-zinc-400'} hover:text-blue-400 transition-colors duration-200`}
                            title={item.label}
                        >
                            {item.icon}
                            <span className="sr-only">{item.label}</span>
                            <span className={`mt-1 w-1 h-1 rounded-full bg-blue-400 transition ${isActive ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`} />
                        </Link>
                    );
                })}
            </nav>
        </header>
    );
} 