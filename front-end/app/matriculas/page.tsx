'use client';
import { useEffect, useState } from 'react';
import api from '../api';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

type Matricula = {
    id: number;
    aluno: { nome: string };
    treino: { titulo: string };
    dataMatricula: string;
};

type Aluno = { id: number; nome: string };
type Treino = { id: number; titulo: string };

export default function MatriculasPage() {
    const [matriculas, setMatriculas] = useState<Matricula[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [treinos, setTreinos] = useState<Treino[]>([]);
    const [form, setForm] = useState({
        alunoId: '',
        treinoId: '',
        dataMatricula: new Date().toISOString().slice(0, 10),
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formErro, setFormErro] = useState<string | null>(null);
    const [formSucesso, setFormSucesso] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteErro, setDeleteErro] = useState<string | null>(null);

    function fetchMatriculas() {
        setLoading(true);
        api.get('/matriculas-treino')
            .then(res => setMatriculas(res.data))
            .catch(e => setErro(e.message))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchMatriculas();
        api.get('/alunos')
            .then(res => setAlunos(res.data));
        api.get('/treinos')
            .then(res => setTreinos(res.data));
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    }

    function handleEdit(m: Matricula) {
        setEditId(m.id);
        setForm({
            alunoId: m.aluno?.id?.toString() || '',
            treinoId: m.treino?.id?.toString() || '',
            dataMatricula: m.dataMatricula.slice(0, 10),
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
        api.delete(`/matriculas-treino/${deleteId}`)
            .then(() => {
                setDeleteId(null);
                fetchMatriculas();
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
            alunoId: Number(form.alunoId),
            treinoId: Number(form.treinoId),
            dataMatricula: form.dataMatricula,
        };
        const req = editId
            ? api.put(`/matriculas-treino/${editId}`, payload)
            : api.post('/matriculas-treino', payload);
        req
            .then(() => {
                setForm({ alunoId: '', treinoId: '', dataMatricula: new Date().toISOString().slice(0, 10) });
                setFormSucesso(editId ? 'Matrícula atualizada com sucesso!' : 'Matrícula cadastrada com sucesso!');
                setEditId(null);
                fetchMatriculas();
                setModalOpen(false);
            })
            .catch(e => setFormErro(e.message))
            .finally(() => setFormLoading(false));
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight flex items-center justify-center gap-3">
                    Matrículas
                </h1>
                <p className="text-zinc-400 text-sm mt-2">Gerencie as matrículas dos alunos nos treinos.</p>
            </header>
            <div className="bg-zinc-900 rounded-2xl shadow p-6 mb-10 border border-zinc-800">
                {matriculas.length === 0 ? (
                    <EmptyState
                        message="Nenhuma matrícula cadastrada ainda."
                        buttonLabel="Adicionar Matrícula"
                        onAdd={() => setModalOpen(true)}
                    />
                ) : (
                    <>
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={() => setModalOpen(true)}
                                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold px-5 py-2 rounded-lg border border-zinc-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-zinc-600"
                            >
                                + Adicionar Matrícula
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {matriculas.map(matricula => (
                                <div key={matricula.id} className={`bg-zinc-950 rounded-xl shadow-sm p-4 flex flex-col gap-3 border border-zinc-800 relative group transition-all duration-150 ${editId === matricula.id ? 'ring-2 ring-zinc-400' : ''}`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-lg font-bold text-zinc-100 truncate flex items-center gap-2">
                                            <span className="inline-block bg-zinc-800 rounded-full px-2 py-1 text-xs font-bold text-zinc-400">Aluno</span>
                                            <span>{matricula.aluno?.nome || '-'}</span>
                                        </h3>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleEdit(matricula)} className="p-1 rounded hover:bg-zinc-800 focus:bg-zinc-800 transition" title="Editar">
                                                <PencilIcon className="w-4 h-4 text-zinc-400" />
                                            </button>
                                            <button onClick={() => handleDelete(matricula.id)} className="p-1 rounded hover:bg-zinc-800 focus:bg-zinc-800 transition" title="Excluir">
                                                <TrashIcon className="w-4 h-4 text-zinc-400" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 text-zinc-300 text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Treino:</span>
                                            <span>{matricula.treino?.titulo || '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>Data de Matrícula:</span>
                                            <span>{new Date(matricula.dataMatricula).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? 'Editar Matrícula' : 'Cadastrar Matrícula'} maxWidth="max-w-3xl">
                    <form className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end" onSubmit={handleSubmit} autoComplete="off">
                        <div>
                            <label className="text-xs text-zinc-400 mb-1 block">Aluno</label>
                            <select name="alunoId" value={form.alunoId} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-100 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-800 outline-none transition-all duration-150">
                                <option value="">Selecione</option>
                                {alunos.map(a => (
                                    <option key={a.id} value={a.id}>{a.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400 mb-1 block">Treino</label>
                            <select name="treinoId" value={form.treinoId} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-100 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-800 outline-none transition-all duration-150">
                                <option value="">Selecione</option>
                                {treinos.map(t => (
                                    <option key={t.id} value={t.id}>{t.titulo}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400 mb-1 block">Data de Matrícula</label>
                            <input name="dataMatricula" type="date" value={form.dataMatricula} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-100 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-800 outline-none transition-all duration-150" />
                        </div>
                        <button type="submit" disabled={formLoading} className="md:col-span-4 bg-zinc-800 text-zinc-200 px-6 py-2 rounded-lg font-semibold shadow-sm hover:bg-zinc-700 transition disabled:opacity-50 mt-2 flex items-center justify-center gap-2">
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
                    <div className="text-zinc-200 mb-4">Tem certeza que deseja excluir esta matrícula? Essa ação não pode ser desfeita.</div>
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