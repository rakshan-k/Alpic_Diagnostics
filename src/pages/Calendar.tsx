import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enIN from 'date-fns/locale/en-IN';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import Modal from '../components/Modal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

const locales = {
  'en-IN': enIN,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
}

interface EventFormData {
  title: string;
  description?: string;
  start: string;
  end: string;
}

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  
  const { register, handleSubmit, reset, setValue } = useForm<EventFormData>();

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) {
      toast.error('Failed to fetch events');
      return;
    }
    setEvents(data.map(event => ({
      ...event,
      start: new Date(event.start_date),
      end: new Date(event.end_date),
    })));
  }

  const handleAdd = () => {
    setEditingEvent(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setValue('title', event.title);
    setValue('description', event.description || '');
    setValue('start', format(event.start, "yyyy-MM-dd'T'HH:mm"));
    setValue('end', format(event.end, "yyyy-MM-dd'T'HH:mm"));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    const { error } = await supabase.from('calendar_events').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete event');
      return;
    }
    toast.success('Event deleted successfully');
    fetchEvents();
  };

  const onSubmit = async (data: EventFormData) => {
    const eventData = {
      title: data.title,
      description: data.description,
      start_date: data.start,
      end_date: data.end,
    };

    const { error } = editingEvent
      ? await supabase.from('calendar_events').update(eventData).eq('id', editingEvent.id)
      : await supabase.from('calendar_events').insert([eventData]);

    if (error) {
      toast.error('Failed to save event');
      return;
    }

    toast.success(`Event ${editingEvent ? 'updated' : 'added'} successfully`);
    setIsModalOpen(false);
    fetchEvents();
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: '#4F46E5',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0',
        display: 'block'
      }
    };
  };

  return (
    <div className="h-[calc(100vh-12rem)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          Add Event
        </button>
      </div>

      <div className="h-full bg-white dark:bg-gray-900 rounded-lg shadow p-4">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          views={['month', 'week', 'day']}
          className="custom-calendar"
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event: CalendarEvent) => handleEdit(event)}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Edit Event' : 'Add Event'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              {...register('title')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              {...register('description')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              {...register('start')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              {...register('end')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-4">
            {editingEvent && (
              <button
                type="button"
                onClick={() => handleDelete(editingEvent.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete
              </button>
            )}
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
              {editingEvent ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}