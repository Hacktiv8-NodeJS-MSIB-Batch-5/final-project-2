# Final Project 2 Hacktiv8 NodeJS MSIB Batch 5

## Anggota
1. Maulana Daffa Ardiansyah (INJS-KS06-12)
2. Erin Gunawan (INJS-KS06-03)

## Cara Install
1. run `npm install` untuk menginstall dependensi
2. copy `.env.example` ke `.env` dan isi file `.env` sesuai database aplikasi
3. run `npm run db:create` untuk inisiasi database
4. run `npm run db:migrate` untuk menjalankan migrasi database
5. run `npm run db:seed` untuk meng-create user dan photos
6. run `npm run dev`untuk menjalankan aplikasi dengan nodemon
7. run `npm run start` untuk menjalankan aplikasi secara default

## Optinal commands
1. `npm run db:migrate:undo` untuk undo migration yang terakhir kali dilakukan
2. `npm run db:seed:undo` untuk undo seluruh seed database
