// BLT University JavaScript

document.addEventListener('DOMContentLoaded', function () {

    // Course Filtering
    const categoryFilter = document.getElementById('category-filter');
    const levelFilter = document.getElementById('level-filter');
    const searchFilter = document.getElementById('search-filter');
    const coursesGrid = document.getElementById('courses-grid');
    const noResults = document.getElementById('no-results');

    if (categoryFilter && levelFilter && searchFilter && coursesGrid) {
        function filterCourses() {
            const categoryValue = categoryFilter.value.toLowerCase();
            const levelValue = levelFilter.value.toLowerCase();
            const searchValue = searchFilter.value.trim().toLowerCase();

            const courses = coursesGrid.getElementsByClassName('course-card');
            let visibleCount = 0;

            Array.from(courses).forEach(course => {
                const courseCategory = course.getAttribute('data-category');
                const courseLevel = course.getAttribute('data-level');
                const courseSearch = course.getAttribute('data-search') ?? '';

                const categoryMatch = !categoryValue || courseCategory === categoryValue;
                const levelMatch = !levelValue || courseLevel === levelValue;
                const searchMatch = !searchValue || courseSearch.includes(searchValue);

                if (categoryMatch && levelMatch && searchMatch) {
                    course.classList.remove('hidden');
                    visibleCount++;
                } else {
                    course.classList.add('hidden');
                }
            });

            if (noResults) {
                if (visibleCount === 0) {
                    noResults.classList.remove('hidden');
                    coursesGrid.classList.add('hidden');
                } else {
                    noResults.classList.add('hidden');
                    coursesGrid.classList.remove('hidden');
                }
            }
        }

        categoryFilter.addEventListener('change', filterCourses);
        levelFilter.addEventListener('change', filterCourses);
        searchFilter.addEventListener('input', filterCourses);

        // Initial filter
        filterCourses();
    }

    // Parse URL parameters for enrollment
    const urlParams = new URLSearchParams(window.location.search);
    const courseParam = urlParams.get('course');
    const titleParam = urlParams.get('title');

    if (courseParam && window.location.pathname.includes('/enroll/')) {
        console.log('Enrolling in course:', courseParam, titleParam);

        // Update the enrollment button to prefill the title if available
        if (titleParam) {
            const enrollButton = document.querySelector('[data-enrollment-button]');
            if (enrollButton) {
                const currentHref = enrollButton.getAttribute('href');
                const separator = currentHref.includes('?') ? '&' : '?';
                const prefilledTitle = `[ENROLLMENT] ${titleParam} - `;
                enrollButton.setAttribute('href', currentHref + separator + `title=${encodeURIComponent(prefilledTitle)}`);
            }
        }
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    let mobileMenuTimer = null;

    if (mobileMenuButton && mobileMenu && menuIcon && closeIcon) {
        const openMenu = () => {
            if (mobileMenuTimer) {
                clearTimeout(mobileMenuTimer);
                mobileMenuTimer = null;
            }
            mobileMenu.classList.remove('hidden');
            // Trigger reflow for transition
            mobileMenu.offsetHeight;
            mobileMenu.classList.remove('max-h-0', 'opacity-0');
            mobileMenu.classList.add('max-h-[500px]', 'opacity-100');
            menuIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'true');
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('max-h-[500px]', 'opacity-100');
            mobileMenu.classList.add('max-h-0', 'opacity-0');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');

            if (mobileMenuTimer) clearTimeout(mobileMenuTimer);
            mobileMenuTimer = setTimeout(() => {
                mobileMenu.classList.add('hidden');
                mobileMenuTimer = null;
            }, 300); // Wait for transition to finish
        };

        mobileMenuButton.addEventListener('click', () => {
            if (mobileMenuButton.getAttribute('aria-expanded') === 'true') {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu on resize if screen becomes desktop-sized
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                if (mobileMenuTimer) {
                    clearTimeout(mobileMenuTimer);
                    mobileMenuTimer = null;
                }

                mobileMenu.classList.add('hidden');
                mobileMenu.classList.add('max-h-0', 'opacity-0');
                mobileMenu.classList.remove('max-h-[500px]', 'opacity-100');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Add active class to current navigation item
    const currentPath = window.location.pathname;
    document.querySelectorAll('.site-navigation a, #mobile-menu a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});
