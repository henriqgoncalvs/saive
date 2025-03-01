import { PrismaClient } from '@prisma/client';
import { PluggyService } from './pluggy-service';

const prisma = new PrismaClient();

export const PluggyAuthService = {
  /**
   * Save a Pluggy item connection for a user
   */
  savePluggyConnection: async (userId: string, itemId: string) => {
    try {
      // Get item details from Pluggy API
      const { item } = await PluggyService.getItem(itemId);

      // Get accounts for this item
      const { accounts } = await PluggyService.getAccounts(itemId);

      // Create the item in the database
      const pluggyItem = await prisma.pluggyItem.create({
        data: {
          id: itemId,
          userId,
          institution: item.connector?.name || 'Connected Account',
          status: item.status || 'ACTIVE',
        },
      });

      // Create accounts for this item
      if (accounts && accounts.length > 0) {
        await Promise.all(
          accounts.map((account) =>
            prisma.pluggyAccount.create({
              data: {
                id: account.id,
                itemId,
                name: account.name,
                number: account.number || null,
                balance: account.balance,
                currencyCode: account.currency,
                type: account.type,
              },
            })
          )
        );
      }

      return pluggyItem;
    } catch (error) {
      console.error('Error saving Pluggy connection:', error);
      throw new Error('Failed to save Pluggy connection');
    }
  },

  /**
   * Get all Pluggy connections for a user
   */
  getUserPluggyConnections: async (userId: string) => {
    try {
      const pluggyItems = await prisma.pluggyItem.findMany({
        where: {
          userId,
          status: 'ACTIVE',
        },
        include: {
          accounts: true,
        },
      });

      return pluggyItems;
    } catch (error) {
      console.error('Error getting user Pluggy connections:', error);
      throw new Error('Failed to get user Pluggy connections');
    }
  },

  /**
   * Delete a Pluggy connection for a user
   */
  deletePluggyConnection: async (userId: string, itemId: string) => {
    try {
      // First, delete from Pluggy API
      await PluggyService.deleteItem(itemId);

      // Then, delete from our database
      await prisma.pluggyItem.delete({
        where: {
          id: itemId,
          userId,
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting Pluggy connection:', error);
      throw new Error('Failed to delete Pluggy connection');
    }
  },

  /**
   * Get all accounts from all connections for a user
   */
  getUserAccounts: async (userId: string) => {
    try {
      const accounts = await prisma.pluggyAccount.findMany({
        where: {
          item: {
            userId,
            status: 'ACTIVE',
          },
        },
        include: {
          item: {
            select: {
              institution: true,
            },
          },
        },
      });

      return accounts;
    } catch (error) {
      console.error('Error getting user accounts:', error);
      throw new Error('Failed to get user accounts');
    }
  },
};
