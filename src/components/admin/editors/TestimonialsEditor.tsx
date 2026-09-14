import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { TestimonialItem } from '../../../types/portfolio';
import { Plus, Trash2, Edit2, Check, Star } from 'lucide-react';
import { soundManager } from '../../../utils/audio';
import { ImageUploadField } from '../ui/ImageUploadField';

export const TestimonialsEditor: React.FC = () => {
  const { data, addTestimonial, updateTestimonial, deleteTestimonial } = usePortfolio();
  const { testimonials } = data;

  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<Omit<TestimonialItem, 'id'>>({
    name: '',
    role: '',
    company: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    content: '',
    rating: 5,
  });

  const handleStartCreate = () => {
    soundManager.playClick();
    setFormData({
      name: '',
      role: 'Engineering Lead',
      company: 'Tech Corp',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      content: '',
      rating: 5,
    });
    setIsCreating(true);
    setEditingItem(null);
  };

  const handleStartEdit = (t: TestimonialItem) => {
    soundManager.playClick();
    setEditingItem(t);
    setFormData({
      name: t.name,
      role: t.role,
      company: t.company,
      avatar: t.avatar,
      content: t.content,
      rating: t.rating,
    });
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) {
      addTestimonial(formData);
      setIsCreating(false);
    } else if (editingItem) {
      updateTestimonial(editingItem.id, formData);
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold font-display text-white">
            Client Testimonials & Praise
          </h3>
          <p className="text-xs text-slate-400">
            Showcase endorsements from peers, founders, and managers.
          </p>
        </div>
        {!isCreating && !editingItem && (
          <button
            onClick={handleStartCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Review
          </button>
        )}
      </div>

      {(isCreating || editingItem) && (
        <form onSubmit={handleSave} className="p-5 rounded-2xl bg-white/5 border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h4 className="text-sm font-bold text-white font-display">
              {isCreating ? 'Add Client Endorsement' : `Edit: ${editingItem?.name}`}
            </h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingItem(null);
                }}
                className="px-3 py-1 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Save
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">NAME</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">ROLE / TITLE</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">ORGANIZATION</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <ImageUploadField
              label="CLIENT / PEER AVATAR IMAGE"
              value={formData.avatar}
              onChange={(val) => setFormData({ ...formData, avatar: val })}
              placeholder="https://... or paste Google Drive link"
              description="Upload avatar from local drive or paste a web image link."
              aspectRatio="square"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">RATING (STARS: 1 - 5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">ENDORSEMENT TEXT</label>
            <textarea
              rows={3}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
        </form>
      )}

      {/* Testimonials List */}
      <div className="space-y-3">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all"
          >
            <div className="flex items-center gap-3">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover bg-slate-800 shrink-0"
              />
              <div>
                <h4 className="text-sm font-bold text-white font-display">
                  {t.name} <span className="text-xs text-slate-400 font-normal">({t.company})</span>
                </h4>
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  {Array(t.rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStartEdit(t)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Edit Testimonial"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Delete review from "${t.name}"?`)) {
                    deleteTestimonial(t.id);
                  }
                }}
                className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete Testimonial"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
