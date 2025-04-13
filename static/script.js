let selectedMode = null;
let isDarkMode = false;
let currentLanguage = 'ar';

const translations = {
    'ar': {
        'title': 'تحميل الفيديوهات',
        'heading': 'أهلاً وسهلاً بك بصفحة تحميل الفيديوهات',
        'description': 'حمّل فيديوهاتك المفضلة من يوتيوب، إنستغرام، تيك توك، وفيسبوك بسهولة وسرعة!',
        'placeholder.url': 'أدخل الرابط هنا',
        'paste': 'لصق',
        'auto': 'تلقائي',
        'audio': 'صوت فقط',
        'trim': 'جزء من الفيديو/الصوت',
        'trim.video': 'فيديو',
        'trim.audio': 'صوت',
        'preview': 'معاينة',
        'loading.preview': 'جاري المعاينة، يرجى التحلي بالصبر...',
        'duration': 'المدة',
        'quality.select': 'اختر الجودة:',
        'download': 'تحميل',
        'ok': 'موافق',
        'loading.download': 'جاري التحميل، يرجى التحلي بالصبر... ولا تنسى الاستغفار',
        'mute.developing': 'وظيفة كتم الصوت قيد التطوير!',
        'paste.failed': 'فشل لصق النص: ',
        'mode.select': 'يرجى اختيار وضع التحميل (تلقائي، صوت فقط، أو جزء من الفيديو/الصوت)!',
        'error': 'خطأ: ',
        'success.video': 'تم تحميل الفيديو بنجاح!',
        'success.audio': 'تم تحميل الصوت بنجاح!',
        'copyright': '© 2025 جميع الحقوق محفوظة لـ حسان ضعيف',
        'invalid.url': 'الرابط غير صالح.',
        'download.error': 'فشل التنزيل. يرجى التحقق من الرابط وحاول مرة أخرى.',
        'minutes': 'دقيقة',
        'audioOnlyText': 'صوت فقط',
        'trim.start': 'وقت البداية (دقائق:ثواني):',
        'trim.end': 'وقت النهاية (دقائق:ثواني):'
    },
    'en': {
        'title': 'Video Downloader',
        'heading': 'Welcome to the Video Download Page',
        'description': 'Download your favorite videos from YouTube, Instagram, TikTok, and Facebook easily and quickly!',
        'placeholder.url': 'Enter the link here',
        'paste': 'Paste',
        'auto': 'Auto',
        'audio': 'Audio Only',
        'trim': 'Part of Video/Audio',
        'trim.video': 'Video',
        'trim.audio': 'Audio',
        'preview': 'Preview',
        'loading.preview': 'Previewing, please be patient...',
        'duration': 'Duration',
        'quality.select': 'Select Quality:',
        'download': 'Download',
        'ok': 'OK',
        'loading.download': 'Downloading, please be patient... and remember to seek forgiveness',
        'mute.developing': 'Mute function is under development!',
        'paste.failed': 'Failed to paste text: ',
        'mode.select': 'Please select a download mode (auto, audio only, or part of video/audio)!',
        'error': 'Error: ',
        'success.video': 'Video downloaded successfully!',
        'success.audio': 'Audio downloaded successfully!',
        'copyright': '© 2025 All rights reserved to Hassan Daef',
        'invalid.url': 'Invalid URL.',
        'download.error': 'Download failed. Please check the URL and try again.',
        'minutes': 'minutes',
        'audioOnlyText': 'Audio Only',
        'trim.start': 'Start Time (MM:SS):',
        'trim.end': 'End Time (MM:SS):'
    },
    'tr': {
        'title': 'Video İndirici',
        'heading': 'Video İndirme Sayfasına Hoş Geldiniz',
        'description': 'YouTube, Instagram, TikTok ve Facebook’tan favori videolarınızı kolayca ve hızlıca indirin!',
        'placeholder.url': 'Bağlantıyı Buraya Girin',
        'paste': 'Yapıştır',
        'auto': 'Otomatik',
        'audio': 'Sadece Ses',
        'trim': 'Video/Ses Parçası',
        'trim.video': 'Video',
        'trim.audio': 'Ses',
        'preview': 'Önizleme',
        'loading.preview': 'Önizleme yapılıyor, lütfen bekleyin...',
        'duration': 'Süre',
        'quality.select': 'Kalite Seçin:',
        'download': 'İndir',
        'ok': 'Tamam',
        'loading.download': 'İndiriliyor, lütfen sabırlı olun... ve af dilemeyi unutmayın',
        'mute.developing': 'Sesi kapatma özelliği geliştirme aşamasında!',
        'paste.failed': 'Metin yapıştırma başarısız: ',
        'mode.select': 'Lütfen bir indirme modu seçin (otomatik, sadece ses, veya video/ses parçası)!',
        'error': 'Hata: ',
        'success.video': 'Video başarıyla indirildi!',
        'success.audio': 'Ses başarıyla indirildi!',
        'copyright': '© 2025 Tüm hakları Hassan Daef’e aittir',
        'invalid.url': 'Geçersiz URL.',
        'download.error': 'İndirme başarısız oldu. Lütfen URL’yi kontrol edin ve tekrar deneyin.',
        'minutes': 'dakika',
        'audioOnlyText': 'Sadece Ses',
        'trim.start': 'Başlangıç Zamanı (DD:SS):',
        'trim.end': 'Bitiş Zamanı (DD:SS):'
    }
};

function translatePage(language) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        if (translations[language][key]) {
            element.textContent = translations[language][key];
            if (element.placeholder) element.placeholder = translations[language][key];
        }
    });
    document.getElementById('htmlTag').setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.body.style.direction = language === 'ar' ? 'rtl' : 'ltr';

    if (language === 'ar') {
        document.getElementById('languageButton').textContent = 'English';
    } else if (language === 'en') {
        document.getElementById('languageButton').textContent = 'Türkçe';
    } else {
        document.getElementById('languageButton').textContent = 'العربية';
    }

    adjustInputPosition(language === 'ar' ? 'rtl' : 'ltr');
    updateDurationText();
    updateAudioOnlyText();
}

function adjustInputPosition(dir) {
    const inputContainer = document.querySelector('.input-container');
    inputContainer.classList.remove('ltr-input', 'rtl-input');
    inputContainer.classList.add(dir === 'rtl' ? 'rtl-input' : 'ltr-input');
}

document.getElementById('languageButton').addEventListener('click', function() {
    if (currentLanguage === 'ar') {
        currentLanguage = 'en';
    } else if (currentLanguage === 'en') {
        currentLanguage = 'tr';
    } else {
        currentLanguage = 'ar';
    }
    translatePage(currentLanguage);
});

document.getElementById('themeToggle').addEventListener('click', function() {
    isDarkMode = !isDarkMode;
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    document.getElementById('themeToggle').textContent = isDarkMode ? '🌙' : '☀️';
});

document.querySelectorAll('.options button[data-mode]').forEach(button => {
    button.addEventListener('click', function() {
        selectedMode = this.dataset.mode;
        document.getElementById('selectedMode').value = selectedMode;

        document.querySelectorAll('.options button[data-mode]').forEach(btn => {
            btn.classList.remove('selected');
        });

        this.classList.add('selected');
        document.getElementById('previewButton').disabled = false;

        // إظهار/إخفاء حقول القص بناءً على الوضع
        const trimContainer = document.getElementById('trimContainer');
        if (selectedMode === 'trim') {
            trimContainer.style.display = 'block';
        } else {
            trimContainer.style.display = 'none';
        }
    });
});

document.getElementById('pasteButton').addEventListener('click', function() {
    navigator.clipboard.readText()
        .then(text => {
            document.getElementById('videoUrl').value = text;
        })
        .catch(err => {
            console.error('فشل لصق النص: ', err);
            alert(translations[currentLanguage]['paste.failed'] + err);
        });
});

document.getElementById('previewForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const url = document.getElementById('videoUrl').value;
    if (!isValidUrl(url)) {
        showErrorPopup(translations[currentLanguage]['invalid.url']);
        return;
    }

    if (!selectedMode) {
        showErrorPopup(translations[currentLanguage]['mode.select']);
        return;
    }

    document.getElementById('loading').style.display = 'block';
    document.getElementById('preview').style.display = 'none';

    // إذا كان الوضع "trim"، نعرض زري الاختيار ولا نجلب المعاينة بعد
    const trimTypeSelection = document.getElementById('trimTypeSelection');
    const qualityContainer = document.getElementById('qualityOptions');
    qualityContainer.innerHTML = ''; // إفراغ الجودات
    document.getElementById('downloadButton').disabled = true;

    if (selectedMode === 'trim') {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('preview').style.display = 'block';
        document.getElementById('videoTitle').textContent = ''; // سيتم ملؤه لاحقًا
        document.getElementById('thumbnail').src = '';
        document.getElementById('duration').textContent = '';
        trimTypeSelection.style.display = 'block';
        return;
    }

    // للوضع "auto" أو "audio"، نجلب المعاينة مباشرة
    fetchPreview(url, selectedMode);
});

document.querySelectorAll('#trimTypeSelection button[data-trim-type]').forEach(button => {
    button.addEventListener('click', function() {
        const trimType = this.dataset.trimType;
        document.getElementById('trimType').value = trimType;

        document.querySelectorAll('#trimTypeSelection button[data-trim-type]').forEach(btn => {
            btn.classList.remove('selected');
        });
        this.classList.add('selected');

        const url = document.getElementById('videoUrl').value;
        fetchPreview(url, trimType);
    });
});

function fetchPreview(url, mode) {
    document.getElementById('loading').style.display = 'block';
    const trimTypeSelection = document.getElementById('trimTypeSelection');

    fetch('/preview', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `url=${encodeURIComponent(url)}&mode=${mode}`
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loading').style.display = 'none';
        if (data.error) {
            showErrorPopup(translations[currentLanguage]['error'] + data.error);
            return;
        }

        document.getElementById('preview').style.display = 'block';
        document.getElementById('videoTitle').textContent = data.title;
        document.getElementById('thumbnail').src = data.thumbnail;
        
        const durationInMinutes = (data.duration / 60).toFixed(2);
        document.getElementById('duration').textContent = durationInMinutes;
        updateDurationText();

        document.getElementById('downloadUrl').value = url;
        document.getElementById('downloadMode').value = selectedMode;

        const qualityContainer = document.getElementById('qualityOptions');
        qualityContainer.innerHTML = '';
        data.qualities.forEach(q => {
            const qualityDiv = document.createElement('div');
            qualityDiv.classList.add('quality-option');
            let icon = '';

            if (q[1] === 'صوت فقط') {
                icon = '<i class="fas fa-music"></i> ';
                qualityDiv.innerHTML = `${icon}<span data-i18n="audioOnlyText">${translations[currentLanguage]['audioOnlyText']}</span>`;
                qualityDiv.dataset.quality = q[0];
            } else {
                icon = '<i class="fas fa-video"></i> ';
                qualityDiv.innerHTML = `${icon}${q[1]}`;
                qualityDiv.dataset.quality = q[0];
            }

            qualityDiv.addEventListener('click', function() {
                document.querySelectorAll('.quality-option').forEach(opt => opt.classList.remove('selected'));
                qualityDiv.classList.add('selected');
                document.getElementById('selectedQuality').value = q[0];
                document.getElementById('downloadButton').disabled = false;
                document.getElementById('audioOnly').value = (mode === 'audio').toString();
            });
            qualityContainer.appendChild(qualityDiv);
        });

        if (mode === 'audio') {
            const audioOption = qualityContainer.querySelector('.quality-option');
            if (audioOption) {
                audioOption.classList.add('selected');
                document.getElementById('selectedQuality').value = audioOption.dataset.quality;
                document.getElementById('downloadButton').disabled = false;
                document.getElementById('audioOnly').value = 'true';
            }
        }

        // إخفاء زري الاختيار بعد اختيار نوع التحميل
        trimTypeSelection.style.display = 'none';
    })
    .catch(error => {
        document.getElementById('loading').style.display = 'none';
        console.error('خطأ في جلب المعاينة: ', error);
        showErrorPopup(translations[currentLanguage]['error'] + error);
    });
}

function convertTimeToSeconds(timeStr) {
    if (!timeStr || timeStr === '') return '';
    const [minutes, seconds] = timeStr.split(':').map(Number);
    if (isNaN(minutes) || isNaN(seconds) || minutes < 0 || seconds < 0 || seconds >= 60) {
        throw new Error('يرجى إدخال الوقت بصيغة صحيحة (MM:SS)');
    }
    return (minutes * 60 + seconds).toString();
}

document.getElementById('downloadForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const url = document.getElementById('downloadUrl').value;
    const quality = document.getElementById('selectedQuality').value;
    const audioOnly = document.getElementById('audioOnly').value;
    const mode = document.getElementById('downloadMode').value;
    
    let startTime = '0';
    let endTime = '';
    
    if (mode === 'trim') {
        try {
            startTime = convertTimeToSeconds(document.getElementById('startTime').value);
            endTime = convertTimeToSeconds(document.getElementById('endTime').value);
        } catch (error) {
            showErrorPopup(error.message);
            return;
        }
    }

    document.getElementById('loadingMessage').style.display = 'block';
    document.getElementById('preview').style.display = 'none';

    fetch('/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `url=${encodeURIComponent(url)}&quality=${quality}&audio_only=${audioOnly}&mode=${mode}&start_time=${startTime}&end_time=${endTime}`
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loadingMessage').style.display = 'none';
        if (data.error) {
            showErrorPopup(translations[currentLanguage]['error'] + data.error);
            document.getElementById('preview').style.display = 'block';
            return;
        }

        let successMessage = (document.getElementById('audioOnly').value === 'true') 
            ? translations[currentLanguage]['success.audio'] 
            : translations[currentLanguage]['success.video'];

        document.getElementById('successMessage').innerHTML = successMessage;
        showSuccessPopup(document.getElementById('successMessage').innerHTML);
    })
    .catch(error => {
        document.getElementById('loadingMessage').style.display = 'none';
        console.error('خطأ في التحميل: ', error);
        showErrorPopup(translations[currentLanguage]['download.error'] + error);
        document.getElementById('preview').style.display = 'block';
    });
});

function showSuccessPopup(message) {
    document.getElementById('successMessage').innerHTML = message;
    document.getElementById('successPopup').classList.add('show');
    document.getElementById('overlay').classList.add('show');
}

function showErrorPopup(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorPopup').classList.add('show');
    document.getElementById('overlay').classList.add('show');
}

function closePopup() {
    document.getElementById('successPopup').classList.remove('show');
    document.getElementById('overlay').classList.remove('show');
}

function closeErrorPopup() {
    document.getElementById('errorPopup').classList.remove('show');
    document.getElementById('overlay').classList.remove('show');
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

function updateDurationText() {
    const durationElement = document.getElementById('duration');
    const minutesElement = document.getElementById('minutes');
    if (durationElement && minutesElement) {
        minutesElement.textContent = translations[currentLanguage]['minutes'];
    }
}

function updateAudioOnlyText() {
    const audioOnlyElements = document.querySelectorAll('[data-i18n="audioOnlyText"]');
    audioOnlyElements.forEach(element => {
        element.textContent = translations[currentLanguage]['audioOnlyText'];
    });
}

translatePage(currentLanguage);