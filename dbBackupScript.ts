import { exec } from 'child_process'
// import cron from ''

// Backup Postgres Database
export const backupPostgresDB = () => {
    const dbBackupCommand = `pg_dump -h localhost -p 5432 -U myuser -d mydatabase -F c -f /path/to/backup_file.dump`

    exec(dbBackupCommand, (err, stdOut, stdErr) => {
        if (err) {
            console.error(`Error occured while backing up DB - err Message : ${err.message} \n - Error Name - ${err.name}`)
        } else {
            console.info(`Database backed up Successfully!`)
        }
    })
}

