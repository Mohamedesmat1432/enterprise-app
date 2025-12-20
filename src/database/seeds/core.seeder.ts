import { Logger } from '@nestjs/common';
import { PermissionsService } from '@modules/permissions/services/permissions.service';
import { RolesService } from '@modules/roles/services/roles.service';
import { UsersService } from '@modules/users/services/users.service';
import { CompaniesService } from '@modules/companies/services/companies.service';

// ============================================================================
// PERMISSIONS (Single Source of Truth)
// ============================================================================

const P = {
    // Users
    CREATE_USERS: 'create.users',
    READ_USERS: 'read.users',
    UPDATE_USERS: 'update.users',
    DELETE_USERS: 'delete.users',
    // Roles
    CREATE_ROLES: 'create.roles',
    READ_ROLES: 'read.roles',
    UPDATE_ROLES: 'update.roles',
    DELETE_ROLES: 'delete.roles',
    ASSIGN_PERMISSIONS: 'assign.permissions',
    // Companies
    CREATE_COMPANIES: 'create.companies',
    READ_COMPANIES: 'read.companies',
    UPDATE_COMPANIES: 'update.companies',
    DELETE_COMPANIES: 'delete.companies',
    // Products
    CREATE_PRODUCTS: 'create.products',
    READ_PRODUCTS: 'read.products',
    UPDATE_PRODUCTS: 'update.products',
    DELETE_PRODUCTS: 'delete.products',
    // Partners
    CREATE_PARTNERS: 'create.partners',
    READ_PARTNERS: 'read.partners',
    UPDATE_PARTNERS: 'update.partners',
    DELETE_PARTNERS: 'delete.partners',
    // Inventory
    CREATE_INVENTORY: 'create.inventory',
    READ_INVENTORY: 'read.inventory',
    UPDATE_INVENTORY: 'update.inventory',
    // UOM
    CREATE_UOM: 'create.uom',
    READ_UOM: 'read.uom',
    // Sales
    CREATE_SALES: 'create.sales',
    READ_SALES: 'read.sales',
    UPDATE_SALES: 'update.sales',
    // Purchases
    CREATE_PURCHASES: 'create.purchases',
    READ_PURCHASES: 'read.purchases',
    UPDATE_PURCHASES: 'update.purchases',
    // Accounting
    CREATE_ACCOUNTS: 'create.accounts',
    READ_ACCOUNTS: 'read.accounts',
    CREATE_JOURNALS: 'create.journals',
    READ_JOURNALS: 'read.journals',
    // Invoices
    CREATE_INVOICES: 'create.invoices', // Used in Invoices Module
    CREATE_INVOICE: 'create.invoice',   // Used in Sales/Purchases for generation
    READ_INVOICES: 'read.invoices',
    UPDATE_INVOICES: 'update.invoices',
    // Payments
    CREATE_PAYMENTS: 'create.payments',
    READ_PAYMENTS: 'read.payments',
    // Taxes
    CREATE_TAXES: 'create.taxes',
    READ_TAXES: 'read.taxes',
    // Settings
    UPDATE_SETTINGS: 'update.settings',
    READ_SETTINGS: 'read.settings',
    // Profile
    READ_PROFILE: 'read.profile',
    UPDATE_PROFILE: 'update.profile',
    // Dashboard & Reports
    READ_DASHBOARD: 'read.dashboard',
    READ_REPORTS: 'read.reports',
    READ_AUDIT_LOGS: 'read.audit_logs',
} as const;

// Permission descriptions
const permissionDescriptions: Record<string, string> = {
    [P.CREATE_USERS]: 'Can create new users',
    [P.READ_USERS]: 'Can read user details',
    [P.UPDATE_USERS]: 'Can update user details',
    [P.DELETE_USERS]: 'Can delete users',
    [P.CREATE_ROLES]: 'Can create new roles',
    [P.READ_ROLES]: 'Can read role details',
    [P.UPDATE_ROLES]: 'Can update role details',
    [P.DELETE_ROLES]: 'Can delete roles',
    [P.ASSIGN_PERMISSIONS]: 'Can assign permissions to roles',
    [P.CREATE_COMPANIES]: 'Can create companies',
    [P.READ_COMPANIES]: 'Can read companies',
    [P.UPDATE_COMPANIES]: 'Can update companies',
    [P.DELETE_COMPANIES]: 'Can delete companies',
    [P.CREATE_PRODUCTS]: 'Can create products',
    [P.READ_PRODUCTS]: 'Can read products',
    [P.UPDATE_PRODUCTS]: 'Can update products',
    [P.DELETE_PRODUCTS]: 'Can delete products',
    [P.CREATE_PARTNERS]: 'Can create partners',
    [P.READ_PARTNERS]: 'Can read partners',
    [P.UPDATE_PARTNERS]: 'Can update partners',
    [P.DELETE_PARTNERS]: 'Can delete partners',
    [P.CREATE_INVENTORY]: 'Can manage inventory',
    [P.READ_INVENTORY]: 'Can read inventory',
    [P.UPDATE_INVENTORY]: 'Can update inventory (validate moves)',
    [P.CREATE_UOM]: 'Can create units of measure',
    [P.READ_UOM]: 'Can read units of measure',
    [P.CREATE_SALES]: 'Can create sales orders',
    [P.READ_SALES]: 'Can read sales orders',
    [P.UPDATE_SALES]: 'Can update sales orders (confirm)',
    [P.CREATE_PURCHASES]: 'Can create purchase orders',
    [P.READ_PURCHASES]: 'Can read purchase orders',
    [P.UPDATE_PURCHASES]: 'Can update purchase orders (confirm)',
    [P.CREATE_ACCOUNTS]: 'Can create accounts',
    [P.READ_ACCOUNTS]: 'Can read accounts',
    [P.CREATE_JOURNALS]: 'Can create journals',
    [P.READ_JOURNALS]: 'Can read journals',
    [P.CREATE_INVOICES]: 'Can create invoices',
    [P.CREATE_INVOICE]: 'Can generate invoice from order',
    [P.READ_INVOICES]: 'Can read invoices',
    [P.UPDATE_INVOICES]: 'Can update invoices',
    [P.CREATE_PAYMENTS]: 'Can create payments',
    [P.READ_PAYMENTS]: 'Can read payments',
    [P.CREATE_TAXES]: 'Can create taxes',
    [P.READ_TAXES]: 'Can read taxes',
    [P.UPDATE_SETTINGS]: 'Can update settings',
    [P.READ_SETTINGS]: 'Can read settings',
    [P.READ_PROFILE]: 'Can read own profile',
    [P.UPDATE_PROFILE]: 'Can update own profile',
    [P.READ_DASHBOARD]: 'Can read dashboard statistics',
    [P.READ_REPORTS]: 'Can read financial reports',
    [P.READ_AUDIT_LOGS]: 'Can read audit logs',
};

// Generate permissions array from constants
const permissions = Object.values(P).map((slug) => ({
    slug,
    description: permissionDescriptions[slug],
}));

// ============================================================================
// COMPANY
// ============================================================================

const company = {
    name: 'Enterprise App Corp',
    legalName: 'Enterprise App Solutions LTD',
    vatNumber: 'VAT123456',
    email: 'info@enterprise.com',
    phone: '+123456789',
    currencyCode: 'USD',
    country: 'USA',
    isActive: true,
    fiscalYearLastDay: 31,
    fiscalYearLastMonth: 12,
};

// ============================================================================
// ROLES (Reference P constants - no string duplication)
// ============================================================================

const ROLE_ADMIN = 'Admin';
const ROLE_USER = 'User';

const roles = [
    {
        name: ROLE_ADMIN,
        description: 'Full administrative access',
        permissions: Object.values(P),
    },
    {
        name: ROLE_USER,
        description: 'Standard operational access',
        permissions: [
            P.READ_PRODUCTS,
            P.READ_PARTNERS,
            P.READ_INVENTORY,
            P.CREATE_SALES, P.READ_SALES,
            P.READ_DASHBOARD,
        ],
    },
];

// ============================================================================
// USERS (Reference role constants)
// ============================================================================

const users = [
    {
        name: 'Super Admin',
        email: 'admin@example.com',
        age: 30,
        password: 'Admin@123!',
        roles: [ROLE_ADMIN],
    },
    {
        name: 'Test User',
        email: 'user@example.com',
        age: 25,
        password: 'User@123!',
        roles: [ROLE_USER],
    },
];

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function seedPermissions(service: PermissionsService, logger: Logger) {
    logger.log('📋 Seeding Permissions...');

    for (const data of permissions) {
        try {
            await service.create(data);
            logger.log(`  ✅ Created: ${data.slug}`);
        } catch (error: any) {
            if (error.status === 409) {
                logger.log(`  ⏭️  Exists: ${data.slug}`);
            } else {
                throw error;
            }
        }
    }
}

async function seedCompanies(service: CompaniesService, logger: Logger) {
    logger.log('🏢 Seeding Companies...');

    try {
        const created = await service.create(company as any);
        logger.log(`  ✅ Created: ${company.name}`);
        return created;
    } catch (error: any) {
        const existing = await service.findAll();
        const match = existing.find((c: any) => c.name === company.name);
        if (match) {
            logger.log(`  ⏭️  Exists: ${company.name}`);
            return match;
        }
        throw error;
    }
}

async function seedRoles(service: RolesService, companyId: string, logger: Logger) {
    logger.log('👤 Seeding Roles...');

    for (const data of roles) {
        try {
            await service.create(data as any, companyId);
            logger.log(`  ✅ Created: ${data.name}`);
        } catch (error: any) {
            logger.log(`  ⏭️  Exists: ${data.name}`);
        }
    }
}

async function seedUsers(service: UsersService, companyId: string, logger: Logger) {
    logger.log('👥 Seeding Users...');

    const createdUsers: any[] = [];

    for (const data of users) {
        const userData = { ...data, activeCompanyId: companyId };
        try {
            const user = await service.create(userData as any, companyId);
            logger.log(`  ✅ Created: ${data.email}`);
            createdUsers.push(user);
        } catch (error: any) {
            if (error.status === 409) {
                logger.log(`  ⏭️  Exists: ${data.email}`);
                const res = await service.findAll({});
                const existing = res.data?.find((u: any) => u.email === data.email);
                if (existing) createdUsers.push(existing);
            } else {
                throw error;
            }
        }
    }

    return createdUsers;
}

// ============================================================================
// MAIN SEEDER
// ============================================================================

export interface CoreSeederResult {
    company: any;
    users: any[];
    companyId: string;
    adminUser: any;
}

export async function seedCore(
    permissionsService: PermissionsService,
    companiesService: CompaniesService,
    rolesService: RolesService,
    usersService: UsersService,
    logger: Logger,
): Promise<CoreSeederResult> {
    logger.log('');
    logger.log('🔐 Starting Core Seeder...');
    logger.log('');

    await seedPermissions(permissionsService, logger);
    const createdCompany = await seedCompanies(companiesService, logger);
    const companyId = createdCompany.id;
    await seedRoles(rolesService, companyId, logger);
    const createdUsers = await seedUsers(usersService, companyId, logger);

    logger.log('');
    logger.log('✅ Core Seeder Complete!');
    logger.log('');

    return {
        company: createdCompany,
        users: createdUsers,
        companyId,
        adminUser: createdUsers[0],
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    seedPermissions,
    seedCompanies,
    seedRoles,
    seedUsers,
    permissions,
    company,
    roles,
    users,
    P,
    ROLE_ADMIN,
    ROLE_USER,
};

// Backwards compatibility
export const permissionsData = permissions;
export const companiesData = [company];
export const rolesData = roles;
export const getUsersData = (companyId: string) =>
    users.map((u) => ({ ...u, activeCompanyId: companyId }));
export const getDefaultUsers = getUsersData;
