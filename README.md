https://github.com/LouinLee/TaskManagement

## Koneksi ke Database
- Buat new connection di MongoDB, kemudian connect
- Buat 2 database dengan nama `tasks` dan `users` dalam collection `todo`

## Cara Menjalankan Proyek
- Clone repository
- Install semua dependency yang dibutuhkan
- Untuk memulai program, run `nodeman app.js`pada terminal

## Fitur yang Telah Diimplementasikan

### **Autentikasi Pengguna**
- **Registrasi** pengguna baru dengan hashing password menggunakan `bcryptjs`.
- **Login** dengan validasi username dan password.
- **Menyimpan sesi pengguna** menggunakan JWT (`jsonwebtoken`) dengan cookie.
- **Logout** untuk menghapus sesi pengguna.

### **Manajemen Tugas**
- **Menambahkan tugas** baru dengan title, category, status, dan deadline.
- **Mengedit dan menghapus tugas** dengan modal dan tanpa perlu refresh halaman (AJAX).
- **Filter tugas berdasarkan kategori dan status** 

### **Real-Time Update & Notification**
- Ketika tugas baru ditambahkan, diperbarui, atau dihapus, perubahan langsung terlihat tanpa reload dan notifikasi muncul

---

