
document.addEventListener('DOMContentLoaded', function() {

    // First visit welcome
    if (!localStorage.getItem('visited')) {
        setTimeout(() => {
            alert('🦁 hello Yorku! 🦁 welcome to Campus Event Finder! 🎉 star your favourite events and find them in your profile. happy searching!');
        }, 500);
        localStorage.setItem('visited', 'true');
    }
    
    // ===== GET URL PARAMETERS =====
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            query: params.get('query'),
            filter: params.get('filter'),
            type: params.get('type')
        };
    }

    const urlParams = getUrlParams();
    
    // ===== UPDATE SEARCH RESULTS PAGE =====
    function updateSearchResults() {
        if (window.location.pathname.includes('search.html')) {
            const resultsCountEl = document.querySelector('.results-count');
            const searchBar = document.querySelector('.search-bar');
            
            if (urlParams.query && resultsCountEl) {
                resultsCountEl.innerHTML = `<span class="count-number">12</span> results found for "${urlParams.query}"`;
                if (searchBar) {
                    searchBar.value = urlParams.query;
                }
            }
            
            if (urlParams.filter) {
                const filterChips = document.querySelectorAll('.filter-chip');
                filterChips.forEach(chip => {
                    chip.classList.remove('active');
                    if (chip.textContent.toLowerCase() === urlParams.filter) {
                        chip.classList.add('active');
                    }
                });
            }
        }
    }
    
    updateSearchResults();
    
    // ===== FILTER CHIPS =====
    const filterChips = document.querySelectorAll('.filter-chip:not(.filters-btn)');
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            filterChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            if (!window.location.pathname.includes('search.html')) {
                const filterValue = this.textContent.toLowerCase();
                window.location.href = `search.html?filter=${filterValue}`;
            } else {
                console.log('Filter:', this.textContent);
            }
        });
    });

    // ===== EVENT TYPE BUTTONS =====
    const eventTypeBtns = document.querySelectorAll('.event-type-btn');
    eventTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            eventTypeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (!window.location.pathname.includes('search.html')) {
                let typeValue = '';
                const btnText = this.textContent.toLowerCase();
                
                if (btnText === 'more filters') typeValue = 'more';
                else if (btnText === 'ongoing events') typeValue = 'ongoing';
                else if (btnText === 'upcoming events') typeValue = 'upcoming';
                else if (btnText === 'event history') typeValue = 'history';
                
                window.location.href = `search.html?type=${typeValue}`;
            } else {
                console.log('Event type:', this.textContent);
            }
        });
    });
    
    // ===== STAR BUTTONS (favourite) =====
    const starBtns = document.querySelectorAll('.star-btn');
    starBtns.forEach(btn => {
        // Load saved favourite state
        const eventCard = btn.closest('.event-card');
        const eventTitle = eventCard?.querySelector('.event-title')?.textContent;
        if (eventTitle && localStorage.getItem(`fav_${eventTitle}`) === 'true') {
            btn.textContent = '★';
        }
        
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const eventCard = this.closest('.event-card');
            const eventTitle = eventCard?.querySelector('.event-title')?.textContent;
            
            if (this.textContent === '☆') {
                this.textContent = '★';
                console.log('Event favorited:', eventTitle);
                if (eventTitle) localStorage.setItem(`fav_${eventTitle}`, 'true');
            } else {
                this.textContent = '☆';
                console.log('Event unfavorited:', eventTitle);
                if (eventTitle) localStorage.setItem(`fav_${eventTitle}`, 'false');
            }
        });
    });
    
    // ===== SEARCH FORM SUBMIT =====
    const searchForms = document.querySelectorAll('form');
    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('.search-bar');
            const searchQuery = searchInput?.value.trim();
            
            if (searchQuery) {
                window.location.href = `search.html?query=${encodeURIComponent(searchQuery)}`;
            }
        });
    });
    
    // ===== BACK BUTTON =====
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    // ===== PROFILE ICON =====
    const profileIcon = document.querySelector('.profile-icon');
    if (profileIcon) {
        profileIcon.addEventListener('click', function() {
            window.location.href = 'profile.html';
        });
    }
    
    // ===== FILTER ICON =====
    const filterIcon = document.querySelector('.filter-icon');
    if (filterIcon) {
        filterIcon.addEventListener('click', function() {
            window.location.href = 'filter.html';
        });
    }
    
    // ===== EVENT CARD CLICK =====
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('star-btn')) return;
            
            const eventTitle = this.querySelector('.event-title')?.textContent;
            if (eventTitle) {
                window.location.href = `event.html?title=${encodeURIComponent(eventTitle)}`;
            }
        });
    });
    
    // ===== OLD STUFF  =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            console.log('Filter clicked:', this.textContent);
        });
    });

    const pills = document.querySelectorAll('.pill');
    pills.forEach(pill => {
        pill.addEventListener('click', function() {
            pills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            console.log('Category changed:', this.textContent);
        });
    });

    const saveBtns = document.querySelectorAll('.save-btn');
    saveBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.style.opacity === '1') {
                this.style.opacity = '0.5';
                console.log('Event unsaved');
            } else {
                this.style.opacity = '1';
                console.log('Event saved');
            }
        });
    });

        // ===== RECENT SEARCHES PAGE =====
        function loadRecentSearches() {
            const recentList = document.getElementById('recentList');
            if (!recentList) return;
        
        // Get recent searches from localStorage
        let searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        
        if (searches.length === 0) {
            // Default demo searches
            searches = [
                { name: 'open mic night', location: 'Vari Hall' },
                { name: 'study buddies', location: 'Founders College' },
                { name: 'pick up basketball', location: 'Tait McKenzie Centre' },
                { name: 'career fair', location: 'Vari Hall' }
            ];
            localStorage.setItem('recentSearches', JSON.stringify(searches));
        }
        
        recentList.innerHTML = '';
        
        searches.forEach((search, index) => {
            const recentItem = document.createElement('div');
            recentItem.className = 'recent-item';
            recentItem.innerHTML = `
                <div class="recent-info">
                    <div class="recent-name">${escapeHtml(search.name)}</div>
                    <div class="recent-location">📍 ${escapeHtml(search.location)}</div>
                </div>
                <button class="remove-search" data-index="${index}">✖</button>
            `;
            
            // Click on the search item (not the X button)
            recentItem.addEventListener('click', function(e) {
                if (e.target.classList.contains('remove-search')) return;
                window.location.href = `search.html?query=${encodeURIComponent(search.name)}`;
            });
            
            recentList.appendChild(recentItem);
        });
        
        // Add remove functionality to X buttons
        document.querySelectorAll('.remove-search').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const index = parseInt(this.getAttribute('data-index'));
                let searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
                searches.splice(index, 1);
                localStorage.setItem('recentSearches', JSON.stringify(searches));
                loadRecentSearches(); // Refresh list
            });
        });
    }
    
        // Helper function to escape HTML
        function escapeHtml(str) {
            return str.replace(/[&<>]/g, function(m) {
                if (m === '&') return '&amp;';
                if (m === '<') return '&lt;';
                if (m === '>') return '&gt;';
                return m;
        });
    }
    
        // Clear all button
        const clearAllBtn = document.getElementById('clearAllBtn');
        if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            localStorage.setItem('recentSearches', '[]');
            loadRecentSearches();
        });
    }
    
        // Load recent searches if on recent.html
        if (window.location.pathname.includes('recent.html')) {
        loadRecentSearches();
    }
    
        // Also save search when user searches on any page
        function saveRecentSearch(query) {
        if (!query || query.trim() === '') return;
        
        let searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        
        // Remove if already exists
        searches = searches.filter(s => s.name.toLowerCase() !== query.toLowerCase());
        
        // Add to beginning
        searches.unshift({ name: query, location: 'York University' });
        
        // Keep only last 10
        searches = searches.slice(0, 10);
        
        localStorage.setItem('recentSearches', JSON.stringify(searches));
    }
    
        // Hook into search form submit
        const allSearchForms = document.querySelectorAll('form');
        allSearchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const searchInput = this.querySelector('.search-bar');
            const searchQuery = searchInput?.value.trim();
            if (searchQuery) {
                saveRecentSearch(searchQuery);
            }
        });
    });

        // ===== FILTER PAGE =====
        if (window.location.pathname.includes('filter.html')) {
        
        // Date chip selection
        const dateChips = document.querySelectorAll('.date-chip');
        dateChips.forEach(chip => {
            chip.addEventListener('click', function() {
                dateChips.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Time chip selection
        const timeChips = document.querySelectorAll('.time-chip');
        timeChips.forEach(chip => {
            chip.addEventListener('click', function() {
                timeChips.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Clear category checkboxes
        const clearCategoryBtn = document.getElementById('clearCategoryBtn');
        if (clearCategoryBtn) {
            clearCategoryBtn.addEventListener('click', function() {
                const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
                checkboxes.forEach(cb => cb.checked = false);
            });
        }
        
        // Apply filters button
        const applyBtn = document.getElementById('applyFiltersBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', function() {
                // Collect selected categories
                const selectedCategories = [];
                const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
                checkboxes.forEach(cb => {
                    if (cb.checked) {
                        selectedCategories.push(cb.value);
                    }
                });
                
                // Get selected date
                let selectedDate = '';
                const activeDate = document.querySelector('.date-chip.active');
                if (activeDate) {
                    selectedDate = activeDate.getAttribute('data-date');
                }
                
                // Get selected time
                let selectedTime = 'any';
                const activeTime = document.querySelector('.time-chip.active');
                if (activeTime) {
                    selectedTime = activeTime.getAttribute('data-time');
                }
                
                // Build URL parameters
                const params = new URLSearchParams();
                if (selectedCategories.length > 0) {
                    params.append('categories', selectedCategories.join(','));
                }
                if (selectedDate && selectedDate !== 'pick-date') {
                    params.append('date', selectedDate);
                }
                if (selectedTime && selectedTime !== 'any') {
                    params.append('time', selectedTime);
                }
                
                // Go back to search results with filters
                window.location.href = `search.html?${params.toString()}`;
            });
        }
    }
    
        // ===== EVENT DETAILS PAGE =====
        if (window.location.pathname.includes('event.html')) {
        // Showing Open Mic Night data for demo
        document.getElementById('eventDetailName').textContent = 'Open Mic Night';
        document.getElementById('eventDetailBlurb').textContent = 'Come showcase your talent or just enjoy the show! Open mic night welcomes musicians, poets, comedians, and anyone who wants to share. Free coffee and snacks provided.';
        document.getElementById('eventDetailDate').textContent = 'Tuesday, March 25 • 7:00 PM – 10:00 PM';
        document.getElementById('eventDetailLocation').textContent = 'The Underground, Student Centre, York University';
        document.getElementById('eventDetailCategory').textContent = 'Social';
        
        const hostNameSpan = document.querySelector('.host-name');
        const hostHandleSpan = document.querySelector('.host-handle');
        if (hostNameSpan) hostNameSpan.textContent = 'Hosted by Campus Activities Council';
        if (hostHandleSpan) hostHandleSpan.textContent = '@cacYork • 12 events';
        
        // Save event button functionality
        const saveEventBtn = document.getElementById('saveEventBtn');
        if (saveEventBtn) {
            const isSaved = localStorage.getItem('fav_Open Mic Night') === 'true';
            if (isSaved) {
                saveEventBtn.innerHTML = '★ saved';
                saveEventBtn.style.backgroundColor = '#1A3B5D';
            } else {
                saveEventBtn.innerHTML = '☆ save event';
                saveEventBtn.style.backgroundColor = '#F8012D';
            }
            
            saveEventBtn.addEventListener('click', function() {
                const currentState = localStorage.getItem('fav_Open Mic Night') === 'true';
                if (currentState) {
                    localStorage.setItem('fav_Open Mic Night', 'false');
                    this.innerHTML = '☆ save event';
                    this.style.backgroundColor = '#F8012D';
                    this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    alert('❌ removed from saved');
                } else {
                    localStorage.setItem('fav_Open Mic Night', 'true');
                    this.innerHTML = '★ saved';
                    this.style.backgroundColor = '#1A3B5D';
                    this.style.boxShadow = 'none'

                    alert('✨ event saved! taking you to your profile...');
                    setTimeout(() => {
                        window.location.href = 'profile.html'
                    }, 800);
                    
                }
            });
        }
    }

        // ===== PROFILE PAGE =====
        if (window.location.pathname.includes('profile.html')) {
        
        // Get saved events from localStorage
        function getSavedEvents() {
            const saved = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('fav_') && localStorage.getItem(key) === 'true') {
                    const eventName = key.replace('fav_', '');
                    saved.push(eventName);
                }
            }
            return saved;
        }
        
        // Sample events data
        const allEvents = {
            'Open Mic Night': { 
                location: 'Vari Hall', 
                date: 'Mar 25 • 7pm', 
                image: 'https://images.pexels.com/photos/952422/pexels-photo-952422.jpeg'
            },
            'Study Buddies': { 
                location: 'Founders Residence', 
                date: 'Mar 26 • 2pm', 
                image: 'https://images.pexels.com/photos/7972949/pexels-photo-7972949.jpeg'
            },
            'Pick Up Basketball': { 
                location: 'Tait McKenzie Centre', 
                date: 'Mar 28 • 7pm', 
                image: 'https://images.pexels.com/photos/21656190/pexels-photo-21656190.jpeg'
            },
            'Career Fair': { 
                location: 'Seneca @ York', 
                date: 'Apr 2 • 11am', 
                image: 'https://careers.yorku.ca/sites/career/files/2025-05/710eede8-c709-4045-a939-4ad95c49827a.jpeg'
            },
            'Robotics Meet Up': { 
                location: 'Lassonde Building', 
                date: 'Apr 5-6', 
                image: 'https://www.excal.on.ca/wp-content/uploads/2021/03/Featured-Image.jpg'
            },
            'Free Open Market': {
                location: 'Victor Phillip Dahdeleh',
                date: 'Apr 10',
                image: 'https://news.uoguelph.ca/wp-content/uploads/2022/03/MayaVivian1-1000x636.jpg'
            }
        };
        
        // Render Saved Events
        function renderSavedEvents() {
            const savedEvents = getSavedEvents();
            const container = document.getElementById('savedEventsList');
            const countSpan = document.getElementById('savedCount');
            const noMessage = document.getElementById('noSavedMessage');
            
            countSpan.textContent = savedEvents.length;
            
            if (savedEvents.length === 0) {
                container.innerHTML = '';
                noMessage.style.display = 'block';
                return;
            }
            
            noMessage.style.display = 'none';
            container.innerHTML = '';
            
            savedEvents.forEach(eventName => {
                const event = allEvents[eventName] || { location: 'York University', date: 'TBD', image: 'images/placeholder.jpg' };
                const card = document.createElement('div');
                card.className = 'profile-event-card';
                card.innerHTML = `
                    <div class="profile-event-info">
                        <img src="${event.image}" alt="${eventName}" class="profile-event-img">
                        <div class="profile-event-details">
                            <h4>${eventName}</h4>
                            <p>📍 ${event.location} • 📅 ${event.date}</p>
                        </div>
                    </div>
                    <button class="delete-event-btn" data-event="${eventName}">🗑️</button>
                `;
                container.appendChild(card);
            });
            
            // Add delete functionality
            document.querySelectorAll('.delete-event-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const eventName = this.getAttribute('data-event');
                    localStorage.setItem(`fav_${eventName}`, 'false');
                    renderSavedEvents();
                    // Also update stars on other pages when they load
                });
            });
        }
        
            // Render My Events (demo data)
            function renderMyEvents() {
            const container = document.getElementById('myEventsList');
            const countSpan = document.getElementById('myEventsCount');
            const noMessage = document.getElementById('noMyEventsMessage');
            
            // Demo events the user has created
            const myEvents = [
                { name: 'CS Club Hackathon', location: 'Lassonde', date: 'Apr 15 • 10am', image: 'images/hackathon.jpg' },
                { name: 'Study Jam', location: 'Scott Library', date: 'Apr 20 • 1pm', image: 'images/studysession.jpg' }
            ];
            
            countSpan.textContent = myEvents.length;
            
            if (myEvents.length === 0) {
                container.innerHTML = '';
                noMessage.style.display = 'block';
                return;
            }
            
            noMessage.style.display = 'none';
            container.innerHTML = '';
            
            myEvents.forEach(event => {
                const card = document.createElement('div');
                card.className = 'profile-event-card';
                card.innerHTML = `
                    <div class="profile-event-info">
                        <img src="${event.image}" alt="${event.name}" class="profile-event-img">
                        <div class="profile-event-details">
                            <h4>${event.name}</h4>
                            <p>📍 ${event.location} • 📅 ${event.date}</p>
                        </div>
                    </div>
                    <button class="delete-event-btn" data-event="${event.name}">✏️</button>
                `;
                container.appendChild(card);
            });
        }
        
        // Toggle Views
        const savedToggle = document.getElementById('savedEventsToggle');
        const myToggle = document.getElementById('myEventsToggle');
        const savedView = document.getElementById('savedEventsView');
        const myView = document.getElementById('myEventsView');
        
        savedToggle.addEventListener('click', () => {
            savedToggle.classList.add('active');
            myToggle.classList.remove('active');
            savedView.classList.add('active');
            myView.classList.remove('active');
            renderSavedEvents();
        });
        
        myToggle.addEventListener('click', () => {
            myToggle.classList.add('active');
            savedToggle.classList.remove('active');
            myView.classList.add('active');
            savedView.classList.remove('active');
            renderMyEvents();
        });
        
        // Find More Events button
        const findMoreBtn = document.getElementById('findMoreBtn');
        if (findMoreBtn) {
            findMoreBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
        
        // Create Event button
        const createEventBtn = document.getElementById('createEventBtn');
        const createFromEmptyBtn = document.getElementById('createFromEmptyBtn');
        
        function handleCreateEvent() {
            alert('Create new event feature would open a form here!\n\nFor demo purposes, this shows the functionality is ready.');
        }
        
        if (createEventBtn) createEventBtn.addEventListener('click', handleCreateEvent);
        if (createFromEmptyBtn) createFromEmptyBtn.addEventListener('click', handleCreateEvent);
        
        // Initial render
        renderSavedEvents();
    }



});