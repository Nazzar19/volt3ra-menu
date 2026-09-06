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