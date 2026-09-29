@echo off
cd /d "%~dp0"
echo Folder: %cd%
echo.

for %%L in (a b c d e f g h i j k l m n o p q r s t u v w x y z) do (
  if exist "%%L.webp" (
    if exist "%%L.webp" (
      echo LEWATI %%L : file %%L.webp sudah ada
    ) else (
      ren "%%L.webp" "%%L.webp"
      echo OK    %%L.webp  --^>  %%L.webp
    )
  ) else (
    echo TIDAK ADA : %%L.webp
  )
)

echo.
echo Selesai.
pause