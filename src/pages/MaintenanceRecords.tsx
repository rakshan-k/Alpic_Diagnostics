import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Fuse from 'fuse.js';
import { format, addYears, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import { supabase } from '../lib/supabase';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import ServiceVisitsModal from '../components/ServiceVisitsModal';

interface MaintenanceRecord {
  id: string;
  customer_id: string;
  equipment_id: string;
  serial_no: string;
  installation_date: string;
  warranty_years: number;
  warranty_end_date: string;
  service_status: string;
  amc_start_date?: string;
  amc_end_date?: string;
  invoice_amount: number;
  responsibility: string;
  customer?: {
    hospital_name: string;
  };
  equipment?: {
    name: string;
    model_number: string;
  };
}

interface MaintenanceFormData {
  customer_id: string;
  equipment_id: string;
  serial_no: string;
  installation_date: string;
  warranty_years: number;
  service_status: string;
  amc_start_date?: string;
  amc_end_date?: string;
  invoice_amount: number;
  responsibility: string;
}

interface Customer {
  id: string;
  hospital_name: string;
}

interface Equipment {
  id: string;
  name: string;
  model_number: string;
}

interface ServiceVisit {
  id: string;
  visit_date: string;
  technician_name: string;
  description: string;
}

const SERVICE_STATUS_OPTIONS = [
  'warranty',
  'AMC',
  'CAMC',
  'calibration',
  'On call service'
];

const WARRANTY_YEARS_OPTIONS = [1, 2, 3, 4, 5, 6];

const SEARCH_FIELDS = [
  'hospital_name',
  'equipment_name',
  'serial_no',
  'service_status',
  'responsibility',
  'equipment_age'
];

export default function MaintenanceRecords() {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchField, setSelectedSearchField] = useState('hospital_name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [isVisitsModalOpen, setIsVisitsModalOpen] = useState(false);
  const [serviceVisits, setServiceVisits] = useState<ServiceVisit[]>([]);
  
  const { register, handleSubmit, reset, setValue, watch } = useForm<MaintenanceFormData>();
  
  const installationDate = watch('installation_date');
  const warrantyYears = watch('warranty_years');
  const amcStartDate = watch('amc_start_date');

  useEffect(() => {
    if (amcStartDate) {
      const endDate = format(addYears(new Date(amcStartDate), 1), 'yyyy-MM-dd');
      setValue('amc_end_date', endDate);
    }
  }, [amcStartDate, setValue]);

  const fuse = new Fuse(records, {
    keys: ['serial_no', 'service_status', 'customer.hospital_name', 'equipment.name', 'responsibility'],
    threshold: 0.3,
  });

  useEffect(() => {
    fetchRecords();
    fetchCustomers();
    fetchEquipment();
  }, []);

  async function fetchRecords() {
    const { data, error } = await supabase
      .from('maintenance_records')
      .select(`
        *,
        customer:customer_id(hospital_name),
        equipment:equipment_id(name, model_number)
      `);
    
    if (error) {
      toast.error('Failed to fetch maintenance records');
      return;
    }
    setRecords(data);
  }

  async function fetchCustomers() {
    const { data, error } = await supabase
      .from('customers')
      .select('id, hospital_name');
    
    if (error) {
      toast.error('Failed to fetch customers');
      return;
    }
    setCustomers(data);
  }

  async function fetchEquipment() {
    const { data, error } = await supabase
      .from('equipment')
      .select('id, name, model_number');
    
    if (error) {
      toast.error('Failed to fetch equipment');
      return;
    }
    setEquipment(data);
  }

  const calculateWarrantyEndDate = (installDate: string, years: number) => {
    if (!installDate || !years) return '';
    return format(addYears(new Date(installDate), years), 'yyyy-MM-dd');
  };

  const calculateEquipmentAge = (installDate: string) => {
    if (!installDate) return '';
    const start = new Date(installDate);
    const now = new Date();
    
    const years = differenceInYears(now, start);
    const months = differenceInMonths(now, start) % 12;
    const days = differenceInDays(now, addYears(start, years)) % 30;

    return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''} ${days} day${days !== 1 ? 's' : ''}`;
  };

  const filteredRecords = searchQuery
    ? records.filter(record => {
        switch (selectedSearchField) {
          case 'hospital_name':
            return record.customer?.hospital_name.toLowerCase().includes(searchQuery.toLowerCase());
          case 'equipment_name':
            return record.equipment?.name.toLowerCase().includes(searchQuery.toLowerCase());
          case 'serial_no':
            return record.serial_no.toLowerCase().includes(searchQuery.toLowerCase());
          case 'service_status':
            return record.service_status.toLowerCase().includes(searchQuery.toLowerCase());
          case 'responsibility':
            return record.responsibility.toLowerCase().includes(searchQuery.toLowerCase());
          case 'equipment_age':
            return calculateEquipmentAge(record.installation_date).toLowerCase().includes(searchQuery.toLowerCase());
          default:
            return true;
        }
      })
    : records;

  const handleAdd = () => {
    setEditingRecord(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEdit = (record: MaintenanceRecord) => {
    setEditingRecord(record);
    Object.keys(record).forEach((key) => {
      if (key !== 'customer' && key !== 'equipment') {
        setValue(key as keyof MaintenanceFormData, record[key as keyof MaintenanceRecord]);
      }
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this maintenance record?')) return;

    const { error } = await supabase.from('maintenance_records').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete maintenance record');
      return;
    }
    toast.success('Maintenance record deleted successfully');
    fetchRecords();
  };

  const handleViewVisits = async (record: MaintenanceRecord) => {
    setSelectedRecord(record);
    const { data, error } = await supabase
      .from('service_visits')
      .select('*')
      .eq('maintenance_record_id', record.id)
      .order('visit_date', { ascending: false });

    if (error) {
      toast.error('Failed to fetch service visits');
      return;
    }

    setServiceVisits(data || []);
    setIsVisitsModalOpen(true);
  };

  const onSubmit = async (data: MaintenanceFormData) => {
    const warrantyEndDate = calculateWarrantyEndDate(data.installation_date, data.warranty_years);
    
    const recordData = {
      ...data,
      warranty_end_date: warrantyEndDate,
      amc_end_date: data.amc_start_date 
        ? format(addYears(new Date(data.amc_start_date), 1), 'yyyy-MM-dd')
        : null
    };

    const { error } = editingRecord
      ? await supabase.from('maintenance_records').update(recordData).eq('id', editingRecord.id)
      : await supabase.from('maintenance_records').insert([recordData]);

    if (error) {
      toast.error('Failed to save maintenance record');
      return;
    }

    toast.success(`Maintenance record ${editingRecord ? 'updated' : 'added'} successfully`);
    setIsModalOpen(false);
    fetchRecords();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Maintenance Records</h1>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          Add Record
        </button>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search maintenance records..."
          searchFields={SEARCH_FIELDS}
          selectedField={selectedSearchField}
          onFieldChange={setSelectedSearchField}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Equipment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Model Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Serial No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Installation Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Equipment Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Warranty End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Service Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Invoice Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Responsibility
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {record.customer?.hospital_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {record.equipment?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {record.equipment?.model_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {record.serial_no}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {format(new Date(record.installation_date), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {calculateEquipmentAge(record.installation_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {format(new Date(record.warranty_end_date), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.service_status === 'warranty'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {record.service_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    ${record.invoice_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {record.responsibility}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewVisits(record)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                    >
                      View Visits
                    </button>
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
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
        title={editingRecord ? 'Edit Maintenance Record' : 'Add Maintenance Record'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Customer
            </label>
            <select
              {...register('customer_id')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.hospital_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Equipment
            </label>
            <select
              {...register('equipment_id')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select equipment</option>
              {equipment.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.model_number})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Serial Number
            </label>
            <input
              {...register('serial_no')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Installation Date
            </label>
            <input
              type="date"
              {...register('installation_date')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Warranty Years
            </label>
            <select
              {...register('warranty_years', { valueAsNumber: true })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select warranty period</option>
              {WARRANTY_YEARS_OPTIONS.map((years) => (
                <option key={years} value={years}>
                  {years} year{years !== 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Service Status
            </label>
            <select
              {...register('service_status')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select service status</option>
              {SERVICE_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              AMC Start Date
            </label>
            <input
              type="date"
              {...register('amc_start_date')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Invoice Amount
            </label>
            <input
              type="number"
              step="0.01"
              {...register('invoice_amount', { valueAsNumber: true })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Responsibility
            </label>
            <input
              {...register('responsibility')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Person responsible"
            />
          </div>

          {installationDate && warrantyYears && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Warranty will end on: {format(new Date(calculateWarrantyEndDate(installationDate, warrantyYears)), 'dd/MM/yyyy')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Equipment age: {calculateEquipmentAge(installationDate)}
              </p>
            </div>
          )}

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
              {editingRecord ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>

      {selectedRecord && (
        <ServiceVisitsModal
          isOpen={isVisitsModalOpen}
          onClose={() => setIsVisitsModalOpen(false)}
          maintenanceRecordId={selectedRecord.id}
          visits={serviceVisits}
          onVisitsUpdate={() => handleViewVisits(selectedRecord)}
        />
      )}
    </div>
  );
}