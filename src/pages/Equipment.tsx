import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Fuse from 'fuse.js';
import { supabase } from '../lib/supabase';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';

interface Equipment {
  id: string;
  name: string;
  model_number: string;
  buy_price: number;
  notes?: string;
}

interface EquipmentFormData {
  name: string;
  model_number: string;
  buy_price: number;
  notes?: string;
}

const SEARCH_FIELDS = [
  'name',
  'model_number',
  'notes'
];

export default function Equipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchField, setSelectedSearchField] = useState('name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  
  const { register, handleSubmit, reset, setValue } = useForm<EquipmentFormData>();

  const fuse = new Fuse(equipment, {
    keys: ['name', 'model_number'],
    threshold: 0.3,
  });

  useEffect(() => {
    fetchEquipment();
  }, []);

  async function fetchEquipment() {
    const { data, error } = await supabase.from('equipment').select('*');
    if (error) {
      toast.error('Failed to fetch equipment');
      return;
    }
    setEquipment(data);
  }

  const filteredEquipment = searchQuery
    ? equipment.filter(item => {
        const searchValue = item[selectedSearchField as keyof Equipment]?.toString().toLowerCase();
        return searchValue?.includes(searchQuery.toLowerCase());
      })
    : equipment;

  const handleAdd = () => {
    setEditingEquipment(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEdit = (item: Equipment) => {
    setEditingEquipment(item);
    Object.keys(item).forEach((key) => {
      setValue(key as keyof EquipmentFormData, item[key as keyof Equipment]);
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return;

    const { error } = await supabase.from('equipment').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete equipment');
      return;
    }
    toast.success('Equipment deleted successfully');
    fetchEquipment();
  };

  const onSubmit = async (data: EquipmentFormData) => {
    const { error } = editingEquipment
      ? await supabase.from('equipment').update(data).eq('id', editingEquipment.id)
      : await supabase.from('equipment').insert([data]);

    if (error) {
      toast.error('Failed to save equipment');
      return;
    }

    toast.success(`Equipment ${editingEquipment ? 'updated' : 'added'} successfully`);
    setIsModalOpen(false);
    fetchEquipment();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Equipment</h1>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          Add Equipment
        </button>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search equipment..."
          searchFields={SEARCH_FIELDS}
          selectedField={selectedSearchField}
          onFieldChange={setSelectedSearchField}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Model Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Buy Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filteredEquipment.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {item.model_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    ${item.buy_price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {item.notes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEquipment ? 'Edit Equipment' : 'Add Equipment'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Model Number
            </label>
            <input
              {...register('model_number')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Buy Price
            </label>
            <input
              type="number"
              step="0.01"
              {...register('buy_price', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Notes
            </label>
            <textarea
              {...register('notes')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              {editingEquipment ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}