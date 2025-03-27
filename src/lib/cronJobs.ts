import cron from 'node-cron';
import { supabase } from './supabase';
import { sendAMCReminder } from './emailService';
import { addDays, format } from 'date-fns';

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
  const today = new Date();
  const checkDates = [30, 15, 5];

  for (const days of checkDates) {
    const targetDate = format(addDays(today, days), 'yyyy-MM-dd');

    const { data: records, error } = await supabase
      .from('maintenance_records')
      .select(`
        *,
        customer:customer_id(hospital_name, email),
        equipment:equipment_id(name)
      `)
      .eq('amc_end_date', targetDate);

    if (error) {
      console.error('Failed to fetch records:', error);
      continue;
    }

    for (const record of records) {
      try {
        await sendAMCReminder(
          record.customer.email,
          record.customer.hospital_name,
          record.equipment.name,
          days,
          record.amc_end_date
        );
      } catch (error) {
        console.error(`Failed to send reminder for record ${record.id}:`, error);
      }
    }
  }
});