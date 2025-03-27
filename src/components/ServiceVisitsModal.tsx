import React from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
import Modal from './Modal';
import { supabase } from '../lib/supabase';

interface ServiceVisit {
  id: string;
  visit_date: string;
  technician_name: string;
  description: string;
}

interface ServiceVisitFormData {
  visit_date: string;
  technician_name: string;
  description: string;
}

interface ServiceVisitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  maintenanceRecordId: string;
  visits: ServiceVisit[];
  onVisitsUpdate: () => void;
}

export default function ServiceVisitsModal({
  isOpen,
  onClose,
  maintenanceRecordId,
  visits,
  onVisitsUpdate
}: ServiceVisitsModalProps) {
  const { register, handleSubmit, reset } = useForm<ServiceVisitFormData>();

  const onSubmit = async (data: ServiceVisitFormData) => {
    const { error } = await supabase.from('service_visits').insert([
      {
        maintenance_record_id: maintenanceRecordId,
        ...data
      }
    ]);

    if (error) {
      console.error('Failed to add service visit:', error);
      return;
    }

    reset();
    onVisitsUpdate();
  };

  const handleDelete = async (visitId: string) => {
    if (!confirm('Are you sure you want to delete this visit record?')) return;

    const { error } = await supabase
      .from('service_visits')
      .delete()
      .eq('id', visitId);

    if (error) {
      console.error('Failed to delete service visit:', error);
      return;
    }

    onVisitsUpdate();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Service Visits">
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Technician
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {visits.map((visit) => (
                <tr key={visit.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {format(new Date(visit.visit_date), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {visit.technician_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {visit.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(visit.id)}
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Visit Date
              </label>
              <input
                type="date"
                {...register('visit_date')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Technician Name
              </label>
              <input
                {...register('technician_name')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5" />
              Add Visit
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}