-- PulseHive database initialization

SELECT 'CREATE DATABASE pulsehive'
WHERE NOT EXISTS (
    SELECT FROM pg_database
    WHERE datname = 'pulsehive'
)\gexec

SELECT 'CREATE DATABASE pulsehive_auth'
WHERE NOT EXISTS (
    SELECT FROM pg_database
    WHERE datname = 'pulsehive_auth'
)\gexec

SELECT 'CREATE DATABASE pulsehive_orders'
WHERE NOT EXISTS (
    SELECT FROM pg_database
    WHERE datname = 'pulsehive_orders'
)\gexec