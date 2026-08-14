# WebDesain

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Navigation Card Section</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Font Awesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-50 font-sans">

    <!-- Navigation Card Section -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        <!-- Section Header -->
        <div class="text-center mb-12">
            <h2 class="text-3xl font-extrabold text-blue-900 sm:text-4xl">
                Eksplorasi <span class="text-orange-500">Fitur Kami</span>
            </h2>
            <p class="mt-4 max-w-2xl text-lg text-gray-500 mx-auto">
                Pilih menu di bawah ini untuk mulai belajar, bermain, dan berinteraksi dengan AI.
            </p>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <!-- Card 1: Tutorial -->
            <a href="#tutorial" class="group bg-white rounded-2xl shadow-md border-2 border-transparent hover:border-orange-500 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 p-8 flex flex-col items-center text-center">
                <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                    <i class="fas fa-book-open"></i>
                </div>
                <h3 class="text-xl font-bold text-blue-900 mb-3 group-hover:text-orange-500 transition-colors">Tutorial</h3>
                <p class="text-gray-600 text-sm">
                    Pelajari berbagai materi menarik dengan panduan langkah demi langkah yang mudah dipahami.
                </p>
            </a>

            <!-- Card 2: Kamus -->
            <a href="#kamus" class="group bg-white rounded-2xl shadow-md border-2 border-transparent hover:border-blue-500 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 p-8 flex flex-col items-center text-center">
                <div class="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <i class="fas fa-spell-check"></i>
                </div>
                <h3 class="text-xl font-bold text-blue-900 mb-3 group-hover:text-blue-600 transition-colors">Kamus</h3>
                <p class="text-gray-600 text-sm">
                    Temukan arti kata, istilah baru, dan perbanyak kosa kata kamu dengan cepat di sini.
                </p>
            </a>

            <!-- Card 3: Quis Game -->
            <a href="#quis" class="group bg-white rounded-2xl shadow-md border-2 border-transparent hover:border-orange-500 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 p-8 flex flex-col items-center text-center">
                <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                    <i class="fas fa-gamepad"></i>
                </div>
                <h3 class="text-xl font-bold text-blue-900 mb-3 group-hover:text-orange-500 transition-colors">Quis Game</h3>
                <p class="text-gray-600 text-sm">
                    Uji pengetahuanmu dengan kuis interaktif yang seru dan menantang.
                </p>
            </a>

            <!-- Card 4: Asisten AI -->
            <a href="#asisten-ai" class="group bg-white rounded-2xl shadow-md border-2 border-transparent hover:border-blue-500 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 p-8 flex flex-col items-center text-center">
                <div class="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <i class="fas fa-robot"></i>
                </div>
                <h3 class="text-xl font-bold text-blue-900 mb-3 group-hover:text-blue-600 transition-colors">Asisten AI</h3>
                <p class="text-gray-600 text-sm">
                    Tanya apa saja ke Asisten AI pintar yang siap membantumu kapan pun kamu butuh.
                </p>
            </a>

        </div>
    </section>

</body>
</html>
```