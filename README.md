# Final Project 2 Hacktiv8 NodeJS MSIB Batch 5

## Anggota
1. Maulana Daffa Ardiansyah (INJS-KS06-12)
2. Erin Gunawan (INJS-KS06-03)

## Link Deployment
https://injs06-final-project2.up.railway.app

## Cara Install
1. run `npm install` untuk menginstall dependensi
2. copy `.env.example` ke `.env` dan isi file `.env` sesuai database aplikasi
3. run `npm run db:create` untuk inisiasi database
4. run `npm run db:migrate` untuk menjalankan migrasi database
6. run `npm run dev`untuk menjalankan aplikasi dengan nodemon
7. run `npm run start` untuk menjalankan aplikasi secara default

## Optinal commands
1. `npm run db:migrate:undo` untuk undo migration yang terakhir kali dilakukan

## List Routes
### Users
- `POST` - `/users/register` untuk registrasi akun
- `POST` - `/users/login` untuk login ke akun
- `PUT` - `/users/:userId` untuk mengupdate data pengguna
- `DELETE` - `/users/:userId` untuk menghapus akun pengguna
### Photos
- `POST` - `/photos` untuk menambah foto
- `GET` - `/photos` untuk mendapatkan semua foto
- `PUT` - `/photos/:photoId` untuk mengedit data foto
- `DELETE` - `/photos/:photoId` untuk menghapus foto
### Comments
- `POST` - `/comments` untuk menambah komen
- `GET` - `/comments` untuk mendapatkan semua komen milik user yang sedang login
- `PUT` - `/comments/:commentId` untuk mengedit data komen
- `DELETE` - `/comments/:commentId` untuk menghapus komen
### Social Medias
- `POST` - `/socialmedias` untuk menambah komen
- `GET` - `/socialmedias` untuk mendapatkan semua komen milik user yang sedang login
- `PUT` - `/socialmedias/:socialMediaId` untuk mengedit data komen
- `DELETE` - `/socialmedias/:socialMediaId` untuk menghapus komen
