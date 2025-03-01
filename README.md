This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Pluggy Integration

This project includes a BFF (Backend for Frontend) API for integrating with [Pluggy](https://docs.pluggy.ai/), a financial data aggregation platform. The integration allows you to:

1. Connect to financial institutions
2. Fetch account information
3. Retrieve transaction data
4. Access investment details
5. Get credit card information

### Setup

1. Copy the `.env.local.example` file to `.env.local` and fill in your Pluggy API credentials and database connection:

```bash
cp .env.local.example .env.local
```

2. Update the `.env.local` file with your Pluggy API credentials and database connection:

```
PLUGGY_CLIENT_ID=your_client_id_here
PLUGGY_CLIENT_SECRET=your_client_secret_here
DATABASE_URL="postgresql://username:password@localhost:5432/saive?schema=public"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
```

3. Set up the PostgreSQL database and run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

4. Visit the Pluggy integration demo page at [http://localhost:3000/pluggy](http://localhost:3000/pluggy)

### Authentication

This project uses [NextAuth.js](https://next-auth.js.org/) for authentication. Users need to be authenticated to connect their bank accounts. The authentication system is integrated with Prisma and PostgreSQL.

For demo purposes, you can sign in with any email and the password "password". In a production environment, you should implement proper authentication with hashed passwords or OAuth providers.

### Database Schema

The project uses [Prisma](https://www.prisma.io/) as the ORM with a PostgreSQL database. The schema includes:

1. **NextAuth Models**: User, Account, Session, VerificationToken
2. **Pluggy Models**: PluggyItem, PluggyAccount

Each user can have multiple Pluggy connections (items), and each item can have multiple accounts.

### BFF Architecture

This project follows a Backend for Frontend (BFF) architecture for the Pluggy integration:

1. All sensitive operations (API calls to Pluggy) are handled by the backend
2. API credentials are never exposed to the client
3. User authentication is required to access Pluggy data
4. Each user's Pluggy connections are stored in the database and associated with their user account

This approach ensures:

- Better security by keeping API credentials server-side
- Improved data persistence by storing connections in the database
- User-specific data isolation

### Troubleshooting

If you encounter issues with the Pluggy integration, you can use the test page to diagnose problems:

1. Visit [http://localhost:3000/pluggy/test](http://localhost:3000/pluggy/test) to check if:
   - Your environment variables are properly configured
   - The connect-token API is working correctly
   - Your database connection is working

Common issues:

- **"Failed to get connect token"**: Make sure your Pluggy API credentials are correct in the `.env.local` file
- **"Pluggy API credentials are not configured"**: Check that your `.env.local` file exists and contains the correct variables
- **Database connection errors**: Verify your PostgreSQL connection string and ensure the database is running

### API Endpoints

The following API endpoints are available:

- `GET /api/pluggy/connect-token` - Get a connect token for the Pluggy Connect widget
- `GET /api/pluggy/items?itemId=xxx` - Get a specific item (connection)
- `POST /api/pluggy/items` - Update an item
- `POST /api/pluggy/items/create` - Create a new item
- `DELETE /api/pluggy/items/delete?itemId=xxx` - Delete an item
- `GET /api/pluggy/accounts?itemId=xxx` - Get accounts for an item
- `GET /api/pluggy/transactions?accountId=xxx` - Get transactions for an account
- `GET /api/pluggy/identity?itemId=xxx` - Get identity information for an item
- `GET /api/pluggy/connectors` - Get available connectors (financial institutions)
- `GET /api/pluggy/investments?itemId=xxx` - Get investments for an item
- `GET /api/pluggy/credit-cards?accountId=xxx` - Get credit card bills for an account

User-specific endpoints (require authentication):

- `GET /api/user/pluggy-connections` - Get all Pluggy connections for the authenticated user
- `DELETE /api/user/pluggy-connections?itemId=xxx` - Delete a Pluggy connection for the authenticated user
- `GET /api/user/accounts` - Get all accounts from all Pluggy connections for the authenticated user

## Pluggy Connect Integration

This project implements Pluggy Connect using a Backend for Frontend (BFF) approach with the official `react-pluggy-connect` component. This approach ensures:

1. API credentials are never exposed to the client
2. All sensitive operations are handled by the backend
3. User data is securely stored in the database

### Implementation Details

The integration uses the following components:

1. **PluggyConnectButton**: A wrapper component that:

   - Fetches a connect token from the BFF API
   - Renders a button that opens the Pluggy Connect widget
   - Handles success, error, and close events
   - Supports updating existing connections

2. **usePluggyConnect**: A hook that provides:

   - An interface for opening the Pluggy Connect widget
   - Consistent API for interacting with the widget

3. **BFF API Endpoints**:
   - `/api/pluggy/connect-token`: Generates a connect token using server-side credentials
   - `/api/pluggy/items`: Creates and retrieves Pluggy items (connections)
   - `/api/pluggy/items/[id]`: Manages specific items (update, delete)

### Usage Example

```tsx
import { PluggyConnectButton } from '@/components/PluggyConnectButton';

export default function MyComponent() {
  const handleSuccess = (itemId: string) => {
    console.log('Successfully connected item:', itemId);
    // Fetch accounts or perform other actions
  };

  return (
    <div>
      <h1>Connect Your Bank</h1>
      <PluggyConnectButton
        onSuccess={handleSuccess}
        onError={(error) => console.error(error)}
        onClose={() => console.log('Widget closed')}
      >
        Connect Bank Account
      </PluggyConnectButton>
    </div>
  );
}
```

### Updating Existing Connections

To update an existing connection, pass the `updateItem` prop with the item ID:

```tsx
<PluggyConnectButton updateItem="existing-item-id" onSuccess={handleSuccess}>
  Update Connection
</PluggyConnectButton>
```

### References

This implementation follows the approach used in the [Pluggy Quickstart Repository](https://github.com/pluggyai/quickstart/blob/master/frontend/nextjs/pages/index.tsx), adapted to use a BFF architecture for enhanced security.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
