import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Users, Trash2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import type { Role } from '@/types/auth';

interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    created_at: string;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function AdminUsersIndex({ users }: Props) {
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    const changeRole = (userId: number, role: Role) => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/admin/users/${userId}/role`;

        const methodInput = document.createElement('input');
        methodInput.type = 'hidden';
        methodInput.name = '_method';
        methodInput.value = 'PATCH';
        form.appendChild(methodInput);

        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = '_token';
        tokenInput.value = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
        form.appendChild(tokenInput);

        const roleInput = document.createElement('input');
        roleInput.type = 'hidden';
        roleInput.name = 'role';
        roleInput.value = role;
        form.appendChild(roleInput);

        document.body.appendChild(form);
        form.submit();
    };

    const deleteUser = (userId: number) => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/admin/users/${userId}`;

        const methodInput = document.createElement('input');
        methodInput.type = 'hidden';
        methodInput.name = '_method';
        methodInput.value = 'DELETE';
        form.appendChild(methodInput);

        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = '_token';
        tokenInput.value = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
        form.appendChild(tokenInput);

        document.body.appendChild(form);
        form.submit();
        setDeleteConfirmId(null);
    };

    return (
        <AppLayout>
            <Head title="Manajemen Pengguna" />

            <div className="w-full max-w-6xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Manajemen Pengguna</h1>
                        <p className="text-slate-600 mt-1">Kelola role dan hapus pengguna</p>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-5 gap-4 p-4 bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
                        <div>Nama</div>
                        <div>Email</div>
                        <div>Role</div>
                        <div>Terdaftar</div>
                        <div className="text-center">Aksi</div>
                    </div>

                    <div className="divide-y divide-slate-200">
                        {users.data.length > 0 ? (
                            users.data.map((user) => (
                                <div key={user.id} className="grid grid-cols-5 gap-4 p-4 items-center hover:bg-slate-50">
                                    <div className="text-slate-800 font-medium">{user.name}</div>
                                    <div className="text-slate-600">{user.email}</div>
                                    <div>
                                        <select
                                            defaultValue={user.role}
                                            onChange={(e) => changeRole(user.id, e.target.value as Role)}
                                            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
                                        >
                                            <option value="patient">Pasien</option>
                                            <option value="doctor">Dokter</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="text-slate-600 text-sm">
                                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                                    </div>
                                    <div className="flex justify-center">
                                        {deleteConfirmId === user.id ? (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="bg-red-100 hover:bg-red-200 text-red-700"
                                                    onClick={() => deleteUser(user.id)}
                                                >
                                                    Konfirmasi
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setDeleteConfirmId(null)}
                                                >
                                                    Batal
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="bg-red-100 hover:bg-red-200 text-red-700"
                                                onClick={() => setDeleteConfirmId(user.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-500">
                                <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                <p>Belum ada data pengguna</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex justify-center mt-6 gap-2">
                        {Array.from({ length: users.last_page }, (_, i) => i + 1).map((page) => (
                            <Link
                                key={page}
                                href={`/admin/users?page=${page}`}
                                className={`px-4 py-2 rounded-lg ${
                                    page === users.current_page
                                        ? 'bg-slate-700 text-white'
                                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                                }`}
                            >
                                {page}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <footer className="mt-8 text-center text-slate-500 text-sm">
                    2026 Sistem Klasifikasi Angina Pektoris | All rights reserved
                </footer>
            </div>
        </AppLayout>
    );
}
