import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import AOS from 'aos';
import 'aos/dist/aos.css';

import './style.css';

AOS.init({
    duration: 800,
    once: true,
    offset: 80
});
// --- SCRIPT HAMBURGER MENU MOBILE YANG AMAN ---
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('open');
    });

    // Tutup kalau klik di luar area menu
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('open');
        }
    });

    // Tutup otomatis saat link di dalam menu diklik
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('open');
        });
    });
}
/* ==========================================================
   INTERSECTION OBSERVER UNTUK ANIMASI SCROLL
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // Pilih elemen apa saja yang mau dianimasikan saat di-scroll
    // Contoh: bagian menu, kartu produk, teks judul, atau section lain
    const elementsToReveal = document.querySelectorAll('.hero-content, .menu-section, .about-section, .contact-section, h2, p');

    // Berikan kelas 'reveal' secara otomatis ke elemen-elemen tersebut
    elementsToReveal.forEach(el => {
        el.classList.add('reveal');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Animasi mulai muncul saat elemen terlihat 15% di layar
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Opsional: Kalau mau animasinya cuma terjadi sekali per-refresh, uncomment baris bawah:
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        scrollObserver.observe(el);
    });
});