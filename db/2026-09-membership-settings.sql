/* Membership plan settings (admin-editable price/duration), per-order duration, and the
   "membership ended" email marker. Run once against an EXISTING database (fresh installs
   use mssql-schema.sql). Safe to re-run. Equivalent to `npx prisma db push` for this change.
   Run db/2026-09-group-orders.sql first if you have not already. */

IF OBJECT_ID('dbo.MembershipSettings', 'U') IS NULL
    CREATE TABLE dbo.MembershipSettings (
        id              NVARCHAR(20) NOT NULL CONSTRAINT PK_MembershipSettings PRIMARY KEY
                        CONSTRAINT DF_MembershipSettings_id DEFAULT 'default',
        priceMinor      INT          NOT NULL,   -- total for durationMonths, per person (JOD: 1000 = 1.000)
        durationMonths  INT          NOT NULL,
        sendExpiryEmail BIT          NOT NULL CONSTRAINT DF_MembershipSettings_expiryEmail DEFAULT 1,
        updatedAt       DATETIME2    NOT NULL CONSTRAINT DF_MembershipSettings_updatedAt DEFAULT SYSUTCDATETIME()
    );

IF COL_LENGTH('dbo.Transactions', 'durationMonths') IS NULL
    ALTER TABLE dbo.Transactions ADD durationMonths INT NOT NULL
        CONSTRAINT DF_Transactions_durationMonths DEFAULT 12;

IF COL_LENGTH('dbo.Members', 'expiryEmailSentAt') IS NULL
    ALTER TABLE dbo.Members ADD expiryEmailSentAt DATETIME2 NULL;
