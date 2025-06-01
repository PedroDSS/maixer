import Airtable from 'airtable';
import { AirtableUser } from '@/types/auth';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

const table = base(process.env.AIRTABLE_TABLE_NAME!);

export class AirtableService {
  static async checkUserExists(email: string): Promise<boolean> {
    try {
      const records = await table
        .select({
          filterByFormula: `{Email} = '${email}'`,
          maxRecords: 1,
        })
        .firstPage();

      return records.length > 0;
    } catch (error) {
      console.error('Error checking user existence:', error);
      throw new Error('Database query failed');
    }
  }

  static async getUserByEmail(email: string): Promise<AirtableUser | null> {
    try {
      const records = await table
        .select({
          filterByFormula: `{Email} = '${email}'`,
          maxRecords: 1,
        })
        .firstPage();

      return records.length > 0 ? records[0] as AirtableUser : null;
    } catch (error) {
      console.error('Error fetching user from Airtable:', error);
      return null;
    }
  }

  static async createUser(userData: {
    Name: string;
    Email: string;
    Password: string;
    CreatedAt: string;
  }): Promise<AirtableUser> {
    try {
      const records = await table.create([
        {
          fields: userData,
        },
      ]);

      return records[0] as AirtableUser;
    } catch (error) {
      console.error('Error creating user in Airtable:', error);
      throw new Error('User creation failed');
    }
  }
}