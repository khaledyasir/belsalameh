/* Group orders: one payment can now issue several memberships (payer + family/friends).
   Run once against an EXISTING database (fresh installs use mssql-schema.sql).
   Safe to re-run. Equivalent to `npx prisma db push` for this change. */

IF COL_LENGTH('dbo.Transactions', 'consentAdultConfirmed') IS NULL
    ALTER TABLE dbo.Transactions ADD consentAdultConfirmed BIT NOT NULL
        CONSTRAINT DF_Transactions_consentAdult DEFAULT 0;

IF COL_LENGTH('dbo.Transactions', 'party') IS NULL
    ALTER TABLE dbo.Transactions ADD party NVARCHAR(MAX) NULL;

/* A payment used to map to exactly one member (unique index or, when the DB was created by
   Prisma, a UNIQUE constraint). Drop whichever exists; a plain index replaces it below. */
DECLARE @ix sysname, @isConstraint BIT;
SELECT TOP 1 @ix = i.name, @isConstraint = i.is_unique_constraint FROM sys.indexes i
JOIN sys.index_columns ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id
JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
WHERE i.object_id = OBJECT_ID('dbo.Members') AND i.is_unique = 1 AND i.is_primary_key = 0
  AND c.name = 'transactionId';
IF @ix IS NOT NULL AND @isConstraint = 1 EXEC('ALTER TABLE dbo.Members DROP CONSTRAINT ' + @ix);
ELSE IF @ix IS NOT NULL EXEC('DROP INDEX ' + @ix + ' ON dbo.Members');

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Members_transactionId' AND object_id = OBJECT_ID('dbo.Members'))
    CREATE INDEX IX_Members_transactionId ON dbo.Members(transactionId);
