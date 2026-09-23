@echo off
setlocal enabledelayedexpansion

:: Loop untuk mencari semua file yang berakhiran.jpg
for %%F in ("* - wall white.jpg") do (
    set "filename=%%~nF"
    
    :: Menghilangkan teks " (1)" dari nama file
    set "newname=!filename: (1)=!.jpg"
    
    :: Menjalankan perintah rename
    ren "%%F" "!newname!"
)

echo Proses ganti nama selesai!
pause