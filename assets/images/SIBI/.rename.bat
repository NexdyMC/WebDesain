@echo off
setlocal enabledelayedexpansion

:: Loop untuk mencari semua file .jpg di dalam folder saat ini
for %%F in (*.jpg) do (
    
    :: Memisahkan nama file berdasarkan spasi untuk mengambil huruf depannya saja
    for /f "tokens=1 delims= " %%A in ("%%~nF") do (
        
        :: Menjalankan perintah rename
        ren "%%F" "%%A - wall white.jpg"
    )
)

echo Proses ganti nama di folder SIBI selesai!
pause