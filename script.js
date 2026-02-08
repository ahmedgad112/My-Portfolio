// 1. إعدادات Tailwind لتفعيل الـ Dark Mode يدوياً
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                darkBg: '#0f172a',
                lightBg: '#f8fafc',
            }
        }
    }
}

// 2. تشغيل مكتبة الأنميشن AOS
AOS.init({
    duration: 1000,
    once: true
});

// 3. منطق زر الـ Dark Mode
const themeToggleBtn = document.getElementById('theme-toggle');
const darkIcon = document.getElementById('theme-toggle-dark-icon');
const lightIcon = document.getElementById('theme-toggle-light-icon');

// فحص الاختيار المفضل للمستخدم
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    lightIcon.classList.remove('hidden');
} else {
    document.documentElement.classList.remove('dark');
    darkIcon.classList.remove('hidden');
}

themeToggleBtn.addEventListener('click', function() {
    darkIcon.classList.toggle('hidden');
    lightIcon.classList.toggle('hidden');

    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
});

// 4. حركة الـ Blobs مع الماوس لزيادة الـ "Smart Vibe"
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX - window.innerWidth / 2) / 30;
    const y = (e.clientY - window.innerHeight / 2) / 30;
    
    const blobs = document.querySelectorAll('.blob');
    blobs.forEach((blob, index) => {
        const speed = index === 0 ? 1 : -1;
        blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});


// إضافة منطق الـ Contact Form (مع دعم Supabase وإن وُجد زائر معرّف)
const contactForm = document.getElementById('contact-form');

// ملء نموذج التواصل من بيانات الزائر إن حفظها مسبقاً (صفحة تعريف الزائر)
if (contactForm) {
    try {
        var vName = localStorage.getItem('visitorName');
        var vEmail = localStorage.getItem('visitorEmail');
        var vPhone = localStorage.getItem('visitorPhone');
        if (vName || vEmail || vPhone) {
            var nameInput = contactForm.querySelector('[name="name"]') || contactForm.elements.name;
            var emailInput = contactForm.querySelector('[name="email"]') || contactForm.elements.email;
            var phoneInput = contactForm.querySelector('[name="phone"]') || contactForm.elements.phone;
            if (nameInput && vName) nameInput.value = vName;
            if (emailInput && vEmail) emailInput.value = vEmail;
            if (phoneInput && vPhone) phoneInput.value = vPhone;
        }
    } catch (e) {}
}

// إظهار/إخفاء "تعريف الزائر" و "تسجيل الخروج" (ديسكتوب + موبايل)
(function () {
    var hasVisitor = !!(localStorage.getItem('visitorId') || localStorage.getItem('visitorName'));
    document.querySelectorAll('.nav-visitor-login').forEach(function (el) { el.style.display = hasVisitor ? 'none' : ''; });
    document.querySelectorAll('.nav-visitor-logout').forEach(function (el) { el.style.display = hasVisitor ? '' : 'none'; });

    document.querySelectorAll('.visitor-logout-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            localStorage.removeItem('visitorId');
            localStorage.removeItem('visitorName');
            localStorage.removeItem('visitorEmail');
            localStorage.removeItem('visitorPhone');
            window.location.reload();
        });
    });
})();

// قائمة الموبايل: فتح/إغلاق
(function () {
    var toggle = document.getElementById('nav-mobile-toggle');
    var menu = document.getElementById('nav-mobile-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            menu.classList.toggle('hidden');
        });
        document.querySelectorAll('.nav-mobile-link').forEach(function (link) {
            link.addEventListener('click', function () { menu.classList.add('hidden'); });
        });
        document.querySelectorAll('.visitor-logout-btn').forEach(function (btn) {
            btn.addEventListener('click', function () { menu.classList.add('hidden'); });
        });
    }
})();

// مزامنة زر الثيم في الموبايل مع الثيم الرئيسي
(function () {
    var btnMobile = document.getElementById('theme-toggle-mobile');
    var lightMobile = document.getElementById('theme-toggle-light-icon-mobile');
    var darkMobile = document.getElementById('theme-toggle-dark-icon-mobile');
    var btn = document.getElementById('theme-toggle');
    var lightIcon = document.getElementById('theme-toggle-light-icon');
    var darkIcon = document.getElementById('theme-toggle-dark-icon');
    function syncMobileIcons() {
        var isDark = document.documentElement.classList.contains('dark');
        if (lightMobile) lightMobile.classList.toggle('hidden', !isDark);
        if (darkMobile) darkMobile.classList.toggle('hidden', isDark);
    }
    if (btnMobile) {
        syncMobileIcons();
        btnMobile.addEventListener('click', function () {
            if (btn) btn.click();
            syncMobileIcons();
        });
    }
    if (btn && lightIcon && darkIcon) {
        var obs = new MutationObserver(syncMobileIcons);
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }
})();

function getFormData(form) {
    const nameEl = form.querySelector('[name="name"]') || form.elements.name;
    const emailEl = form.querySelector('[name="email"]') || form.elements.email;
    const phoneEl = form.querySelector('[name="phone"]') || form.elements.phone;
    const messageEl = form.querySelector('[name="message"]') || form.elements.message;
    return {
        name: nameEl ? nameEl.value.trim() : '',
        email: emailEl ? emailEl.value.trim() : '',
        phone: phoneEl ? phoneEl.value.trim() : '',
        message: messageEl ? messageEl.value.trim() : ''
    };
}

function showFormFeedback(btn, originalText, success, langEn) {
    btn.innerText = originalText;
    btn.disabled = false;
    alert(success ? (langEn ? 'Thank you! Your message was sent.' : 'شكراً لتواصلك! تم استلام رسالتك بنجاح.') : (langEn ? 'Something went wrong. Try again.' : 'حدث خطأ. حاول مرة أخرى.'));
    if (success) contactForm.reset();
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        const langEn = document.documentElement.lang === 'en';
        btn.innerText = langEn ? 'Sending...' : 'جاري الإرسال...';
        btn.disabled = true;

        const { name, email, phone, message } = getFormData(contactForm);
        if (!name || !email || !message) {
            alert(langEn ? 'Please fill Name, Email and Message.' : 'يرجى تعبئة الاسم، البريد والرسالة.');
            btn.innerText = originalText;
            btn.disabled = false;
            return;
        }

        const supabaseUrl = window.SUPABASE_URL;
        const supabaseKey = window.SUPABASE_ANON_KEY;
        const hasSupabase = supabaseUrl && supabaseKey && !supabaseUrl.includes('YOUR_') && !supabaseKey.includes('YOUR_');

        if (hasSupabase && window.supabase) {
            try {
                const { createClient } = window.supabase;
                const client = createClient(supabaseUrl, supabaseKey);
                const visitorId = localStorage.getItem('visitorId') || null;
                const payload = { name, email, phone: phone || null, message };
                if (visitorId) payload.visitor_id = visitorId;
                const { error } = await client.from('contact_messages').insert([payload]);
                showFormFeedback(btn, originalText, !error, langEn);
                return;
            } catch (err) {
                console.warn('Supabase insert failed', err);
            }
        }

        setTimeout(() => showFormFeedback(btn, originalText, true, langEn), 2000);
    });
}

// تنعيم الـ Scroll عند الضغط على اللينكات
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 5. تحميل أعمال البورتفوليو (My Works) من Supabase
(function () {
    const grid = document.getElementById('works-grid');
    if (!grid) return;
    const supabaseUrl = window.SUPABASE_URL;
    const supabaseKey = window.SUPABASE_ANON_KEY;
    const hasSupabase = supabaseUrl && supabaseKey && !supabaseUrl.includes('YOUR_') && !supabaseKey.includes('YOUR_');
    if (!hasSupabase || !window.supabase) return;
    const { createClient } = window.supabase;
    const client = createClient(supabaseUrl, supabaseKey);
    client.from('works').select('id, title, description, image_url, project_link').order('created_at', { ascending: false })
        .then(function (_ref) {
            var data = _ref.data, error = _ref.error;
            if (error || !data || data.length === 0) return;
            var langEn = document.documentElement.lang === 'en';
            var viewLabel = langEn ? 'View Project' : 'عرض المشروع';
            function esc(s) {
                var d = document.createElement('div');
                d.textContent = s || '';
                return d.innerHTML;
            }
            grid.innerHTML = data.map(function (w, i) {
                var overlayInner = w.project_link
                    ? '<a href="' + esc(w.project_link) + '" target="_blank" rel="noopener" class="flex items-center justify-center w-full h-full"><span class="bg-white text-black px-6 py-2 rounded-full font-bold shadow-xl">' + viewLabel + '</span></a>'
                    : '<span class="bg-white text-black px-6 py-2 rounded-full font-bold shadow-xl">' + viewLabel + '</span>';
                return '<div class="project-card group cursor-pointer" data-aos="zoom-in" data-aos-delay="' + (i * 100) + '">' +
                    '<div class="relative overflow-hidden rounded-3xl bg-gray-200 dark:bg-white/5 aspect-video mb-6">' +
                    '<img src="' + esc(w.image_url) + '" alt="' + esc(w.title) + '" class="object-cover w-full h-full group-hover:scale-110 transition duration-700">' +
                    '<div class="absolute inset-0 bg-cyan-600/20 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">' + overlayInner + '</div>' +
                    '</div>' +
                    '<h3 class="text-2xl font-bold group-hover:text-cyan-500 transition">' + esc(w.title) + '</h3>' +
                    '<p class="opacity-60 mt-2">' + esc(w.description) + '</p></div>';
            }).join('');
            if (window.AOS && typeof window.AOS.refresh === 'function') window.AOS.refresh();
        });
})();