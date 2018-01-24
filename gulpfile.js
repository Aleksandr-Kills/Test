var gulp         = require('gulp'), // Подключаем Gulp
    scss         = require('gulp-scss'), //Подключаем Scss пакет
    browserSync  = require('browser-sync'), // Подключаем Browser Sync
    concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin     = require('gulp-imagemin'),  // Подключаем библиотеку для работы с изображениями
    pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer'); // Подключаем библиотеку для автоматического добавления префиксов


gulp.task('scss', function(){ // Создаем таск "scss"
    return gulp.src('app/scss/**/*.scss') // Берем источник
        .pipe(scss()) // Преобразуем Sass в CSS посредством gulp-scss
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
    ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('css-libs',['scss'], function() {
    return gulp.src('app/css/libs.css')  // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('clean', function() {
    return del.sync('dist');   // Удаляем папку dist перед сборкой
});

gulp.task('clear', function() {
    return cache.clearAll();   // Чистим кэш
});

gulp.task('img', function() {
   return gulp.src('app/img/**/*') // Берем все изображения из app
   .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    })))
   .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('watch',['css-libs', 'scripts'], function() {  // Вотч, слежение за изменениями
    gulp.watch('app/sass/**/*.scss', ['scss']);  // Наблюдение за sass файлами
    gulp.watch('app/*.html'); // Наблюдение за другими файлами
    gulp.watch('app/js**/*.js');
});

gulp.task('build', ['clean','img', 'scss', 'scripts'], function() {
    var buildCss = gulp.src([  // Переносим CSS стили в продакшен
       'app/css/main.css',
       'app/css/libs.min.css'
    ])
       .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*html') // Переносим HTML в продакшен
        .pipe(gulp.dest('dist'));

});

// gulp.task('default', ['watch']); - можно использовать чтобы писать просто Gulp,без добавки Watch