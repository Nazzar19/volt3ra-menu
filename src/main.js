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
    // Berikan kelas reveal ke elemen-elemen yang diinginkan
    const elementsToReveal = document.querySelectorAll('.hero-content, .section-heading, .menu-item, .contact-card');

    elementsToReveal.forEach((el, index) => {
        el.classList.add('reveal');
        
        // Berikan delay bertahap agar munculnya berurutan dengan anggun
        el.style.transitionDelay = `${(index % 3) * 0.15}s`;
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px', // Elemen baru akan trigger sedikit lebih ke atas dari bawah layar
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Tambahkan sedikit timeout kecil saat halaman baru direfresh agar mata sempat menangkap proses animasinya
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, 100);
                
                observer.unobserve(entry.target); // Supaya animasi hanya berjalan sekali saat pertama kali tersorot
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        scrollObserver.observe(el);
    });
});