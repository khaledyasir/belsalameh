/* Membership plan settings (admin-editable price/duration) and per-order duration. Run once against an EXISTING database (fresh installs
   use mssql-schema.sql). Safe to re-run. Equivalent to `npx prisma db push` for this change.
   Run db/2026-09-group-orders.sql first if you have not already. */

IF OBJECT_ID('dbo.MembershipSettings', 'U') IS NULL
    CREATE TABLE dbo.MembershipSettings (
        id              NVARCHAR(20) NOT NULL CONSTRAINT PK_MembershipSettings PRIMARY KEY
                        CONSTRAINT DF_MembershipSettings_id DEFAULT 'default',
        priceMinor      INT          NOT NULL,   -- total for durationMonths, per person (JOD: 1000 = 1.000)
        durationMonths  INT          NOT NULL,
        updatedAt       DATETIME2    NOT NULL CONSTRAINT DF_MembershipSettings_updatedAt DEFAULT SYSUTCDATETIME()
    );

IF COL_LENGTH('dbo.Transactions', 'durationMonths') IS NULL
    ALTER TABLE dbo.Transactions ADD durationMonths INT NOT NULL
        CONSTRAINT DF_Transactions_durationMonths DEFAULT 12;
