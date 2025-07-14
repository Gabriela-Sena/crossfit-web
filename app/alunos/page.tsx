'use client';
import { useEffect, useState } from 'react';
import { EnvelopeIcon, PhoneIcon, UserIcon, CalendarIcon, CheckCircleIcon, XCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../api';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';


type Aluno = {
    id: number;
    nome: string;
    email: string;
    dataNascimento: string;
    telefone?: string;
    ativo: boolean;
};

export default function AlunosPage() {
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [form, setForm] = useState({
        nome: '',
        email: '',
        dataNascimento: '',
        telefone: '',
        ativo: true,
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formErro, setFormErro] = useState<string | null>(null);
    const [formSucesso, setFormSucesso] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteErro, setDeleteErro] = useState<string | null>(null);

    function fetchAlunos() {
        setLoading(true);
        api.get('/alunos')
            .then(res => setAlunos(res.data))
            .catch(e => setErro(e.message))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchAlunos();
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value, type } = e.target;
        if (name === 'ativo') {
            setForm(f => ({ ...f, ativo: value === 'true' }));
        } else {
            setForm(f => ({ ...f, [name]: value }));
        }
    }

    function handleEdit(aluno: Aluno) {
        setEditId(aluno.id);
        setForm({
            nome: aluno.nome,
            email: aluno.email,
            dataNascimento: aluno.dataNascimento.slice(0, 10),
            telefone: aluno.telefone || '',
            ativo: aluno.ativo,
        });
        setModalOpen(true);
    }

    function handleDelete(id: number) {
        setDeleteId(id);
        setDeleteErro(null);
    }

    function confirmDelete() {
        if (!deleteId) return;
        setDeleteLoading(true);
        setDeleteErro(null);
        api.delete(`/alunos/${deleteId}`)
            .then(() => {
                setDeleteId(null);
                fetchAlunos();
            })
            .catch(e => setDeleteErro(e.message))
            .finally(() => setDeleteLoading(false));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormLoading(true);
        setFormErro(null);
        setFormSucesso(null);
        const payload = {
            ...form,
            dataNascimento: form.dataNascimento,
            telefone: form.telefone || undefined,
            ativo: form.ativo,
        };
        const req = editId
            ? api.put(`/alunos/${editId}`, payload)
            : api.post('/alunos', payload);
        req
            .then(() => {
                setForm({ nome: '', email: '', dataNascimento: '', telefone: '', ativo: true });
                setFormSucesso(editId ? 'Aluno atualizado com sucesso!' : 'Aluno cadastrado com sucesso!');
                setEditId(null);
                fetchAlunos();
                setModalOpen(false);
            })
            .catch(e => setFormErro(e.message))
            .finally(() => setFormLoading(false));
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight flex items-center justify-center gap-3">
                    <UserIcon className="w-8 h-8 text-zinc-400" /> Alunos
                </h1>
                <p className="text-zinc-400 text-sm mt-2">Gerencie os alunos cadastrados, edite ou remova facilmente.</p>
            </header>
            <div className="bg-zinc-900 rounded-2xl shadow p-6 mb-10 border border-zinc-800">
                {alunos.length === 0 ? (
                    <EmptyState
                        message="Nenhum aluno cadastrado ainda."
                        buttonLabel="Adicionar Aluno"
                        onAdd={() => setModalOpen(true)}
                    />
                ) : (
                    <>
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={() => setModalOpen(true)}
                                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold px-5 py-2 rounded-lg border border-zinc-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-zinc-600"
                            >
                                + Adicionar Aluno
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {alunos.map(aluno => (
                                <div key={aluno.id} className={`bg-zinc-950 rounded-xl shadow-sm p-4 flex flex-col gap-3 border border-zinc-800 relative group transition-all duration-150 ${editId === aluno.id ? 'ring-2 ring-zinc-400' : ''}`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-lg font-bold text-zinc-100 truncate flex items-center gap-2">
                                            <UserIcon className="w-5 h-5 text-zinc-400" />
                                            <span>{aluno.nome}</span>
                                        </h3>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleEdit(aluno)} className="p-1 rounded hover:bg-zinc-800 focus:bg-zinc-800 transition" title="Editar">
                                                <PencilIcon className="w-4 h-4 text-zinc-400" />
                                            </button>
                                            <button onClick={() => handleDelete(aluno.id)} className="p-1 rounded hover:bg-zinc-800 focus:bg-zinc-800 transition" title="Excluir">
                                                <TrashIcon className="w-4 h-4 text-zinc-400" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 text-zinc-300 text-xs">
                                        <div className="flex items-center gap-2">
                                            <EnvelopeIcon className="w-4 h-4 text-zinc-500" />
                                            <span className="font-medium">{aluno.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="w-4 h-4 text-zinc-500" />
                                            <span>{new Date(aluno.dataNascimento).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <PhoneIcon className="w-4 h-4 text-zinc-500" />
                                            <span>{aluno.telefone || '-'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        {aluno.ativo ? (
                                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <XCircleIcon className="w-4 h-4 text-red-500" />
                                        )}
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${aluno.ativo ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>{aluno.ativo ? 'Ativo' : 'Inativo'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? 'Editar Aluno' : 'Cadastrar Aluno'} maxWidth="max-w-3xl">
                    <form className="grid grid-cols-1 md:grid-cols-5 gap-5 items-end" onSubmit={handleSubmit} autoComplete="off">
                        <div className="md:col-span-2">
                            <label className="text-xs text-zinc-400 mb-1 block">Nome completo</label>
                            <input
                                name="nome"
                                value={form.nome}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-100 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-800 outline-none transition-all duration-150 shadow-sm"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <label className="text-xs text-zinc-400 mb-1 block">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-100 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-800 outline-none transition-all duration-150 shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400 mb-1 block">Data de Nascimento</label>
                            <input
                                name="dataNascimento"
                                type="date"
                                value={form.dataNascimento}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-100 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-800 outline-none transition-all duration-150 shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400 mb-1 block">Telefone</label>
                            <input
                                name="telefone"
                                value={form.telefone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-100 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-800 outline-none transition-all duration-150 shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400 mb-1 block">Status</label>
                            <select
                                name="ativo"
                                value={form.ativo ? 'true' : 'false'}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-100 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-800 outline-none transition-all duration-150 shadow-sm"
                            >
                                <option value="true">Ativo</option>
                                <option value="false">Inativo</option>
                            </select>
                        </div>
                        <button type="submit" disabled={formLoading} className="md:col-span-5 bg-zinc-800 text-zinc-200 px-6 py-2 rounded-lg font-semibold shadow-sm hover:bg-zinc-700 transition disabled:opacity-50 mt-2 flex items-center justify-center gap-2">
                            {formLoading ? (
                                <span className="animate-spin h-5 w-5 border-2 border-zinc-400 border-t-zinc-600 rounded-full inline-block"></span>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            )}
                            {formLoading ? (editId ? 'Salvando...' : 'Cadastrando...') : (editId ? 'Salvar' : 'Cadastrar')}
                        </button>
                        {formErro && <p className="text-red-500 mt-4 text-center font-semibold col-span-full">{formErro}</p>}
                        {formSucesso && <p className="text-green-500 mt-4 text-center font-semibold col-span-full">{formSucesso}</p>}
                    </form>
                </Modal>
                {/* Modal de confirmação de exclusão */}
                <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Confirmar Exclusão" maxWidth="max-w-md">
                    <div className="text-zinc-200 mb-4">Tem certeza que deseja excluir este aluno? Essa ação não pode ser desfeita.</div>
                    {deleteErro && <p className="text-red-500 mb-2">{deleteErro}</p>}
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded bg-zinc-800 text-zinc-200 hover:bg-zinc-700">Cancelar</button>
                        <button onClick={confirmDelete} disabled={deleteLoading} className="px-4 py-2 rounded bg-red-700 text-white font-bold hover:bg-red-800 disabled:opacity-50">
                            {deleteLoading ? 'Excluindo...' : 'Excluir'}
                        </button>
                    </div>
                </Modal>
            </div>

        </div>
    );
} 