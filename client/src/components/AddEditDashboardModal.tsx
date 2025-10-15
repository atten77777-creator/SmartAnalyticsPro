import React, { useState, useEffect } from 'react';
import Modal from './Modal';

export type DashboardFormData = {
  name: string;
  description: string;
  refreshRule: string;
};

type AddEditDashboardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dashboard: DashboardFormData) => void;
  initialData?: DashboardFormData | null;
};

const refreshRules = ['manual', '1m', '5m', '15m', '30m', '1h', '6h', '12h', '24h'];

const AddEditDashboardModal: React.FC<AddEditDashboardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<DashboardFormData>({
    name: '',
    description: '',
    refreshRule: '5m',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', description: '', refreshRule: '5m' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Dashboard name is required.');
      return;
    }
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Dashboard' : 'Add Dashboard'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-neon-cyan focus:border-neon-cyan sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-neon-cyan focus:border-neon-cyan sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="refreshRule" className="block text-sm font-medium text-gray-300">Refresh Rule</label>
          <select
            id="refreshRule"
            name="refreshRule"
            value={formData.refreshRule}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-neon-cyan focus:border-neon-cyan sm:text-sm"
          >
            {refreshRules.map(rule => (
              <option key={rule} value={rule}>{rule === 'manual' ? 'Manual Only' : Every }</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-neon-cyan text-gray-900 font-semibold rounded-md hover:bg-cyan-300 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Confirm'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditDashboardModal;
