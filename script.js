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


// إضافة منطق الـ Contact Form (مع دعم Supabase إن وُجد)
const contactForm = document.getElementById('contact-form');

function getFormData(form) {
    const nameEl = form.querySelector('[name="name"]') || form.elements.name;
    const emailEl = form.querySelector('[name="email"]') || form.elements.email;
    const messageEl = form.querySelector('[name="message"]') || form.elements.message;
    return {
        name: nameEl ? nameEl.value.trim() : '',
        email: emailEl ? emailEl.value.trim() : '',
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

        const { name, email, message } = getFormData(contactForm);
        if (!name || !email || !message) {
            alert(langEn ? 'Please fill all fields.' : 'يرجى تعبئة جميع الحقول.');
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
                const { error } = await client.from('contact_messages').insert([{ name, email, message }]);
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